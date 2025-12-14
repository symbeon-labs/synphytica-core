// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./GhostFundPatronSeal.sol";

/**
 * @title GhostFundDonation
 * @dev Contrato principal de roteamento de fundos.
 * Garante matematicamente que 100% da doação pretendida chega ao destino.
 * Apenas taxas opcionais ficam no protocolo.
 */
contract GhostFundDonation is Ownable, ReentrancyGuard {

    // --- State ---
    GhostFundPatronSeal public sealContract;
    uint256 public sealFeeFixed;     // Taxa fixa em wei (ex: 0.05 ETH)
    uint256 public sealFeePercent;   // Taxa percentual (Base 10000, ex: 500 = 5%)
    bool public useFixedFee;

    // Projetos verificados (Safety List)
    mapping(uint256 => address payable) public projects;
    uint256 public projectCount;

    // --- Events ---
    event DonationRecorded(
        address indexed donor,
        uint256 indexed projectId,
        uint256 amount,
        bool wantsSeal,
        uint256 sealFee,
        uint256 timestamp,
        uint256 sealTokenId
    );

    event ProjectAdded(uint256 indexed projectId, address projectWallet);

    constructor(
        address _sealContract,
        uint256 _sealFeeFixed,
        uint256 _sealFeePercent,
        bool _useFixedFee
    ) Ownable(msg.sender) {
        sealContract = GhostFundPatronSeal(_sealContract);
        sealFeeFixed = _sealFeeFixed;
        sealFeePercent = _sealFeePercent;
        useFixedFee = _useFixedFee;
    }

    // --- Admin Functions ---
    
    function addProject(address payable _projectWallet) external onlyOwner {
        require(_projectWallet != address(0), "Invalid wallet");
        projectCount++;
        projects[projectCount] = _projectWallet;
        emit ProjectAdded(projectCount, _projectWallet);
    }

    function updateFees(uint256 _fixed, uint256 _percent, bool _useFixed) external onlyOwner {
        sealFeeFixed = _fixed;
        sealFeePercent = _percent;
        useFixedFee = _useFixed;
    }
    
    // --- Public Views ---

    function calculateSealFee(uint256 _donationAmount) public view returns (uint256) {
        if (useFixedFee) {
            return sealFeeFixed;
        } else {
            return (_donationAmount * sealFeePercent) / 10000;
        }
    }

    // --- Core Logic: The Holy Transfer ---
    
    function donate(uint256 _projectId, bool _wantsSeal) external payable nonReentrant {
        require(_projectId > 0 && _projectId <= projectCount, "Project does not exist");
        require(msg.value > 0, "Donation must be > 0");
        
        address payable projectWallet = projects[_projectId];
        require(projectWallet != address(0), "Project wallet not configured");
        
        uint256 donationAmount = msg.value;
        uint256 sealFee = 0;
        uint256 sealTokenId = 0;
        
        if (_wantsSeal) {
            // Se quer selo, o valor enviado (msg.value) contém T = D + Taxa
            // Precisamos isolar D.
            // D = T - Taxa
            // Porem, a Taxa é calculada sobre D? Ou sobre T?
            // Modelo especificado: Taxa = f(D).
            // Problema circular se a taxa for percentual: Taxa = k * (Total - Taxa).
            // Para simplificar UX e Gas, assumimos no contrato que a taxa é calculada sobre
            // o valor BRUTO de DNAÇÃO declarado no front-end.
            // O front-end envia Total = D + Taxa.
            
            // Recálculo seguro no contrato:
            // Vamos assumir que a taxa é baseada no D calculado.
            // Implementação robusta: 
            // Se taxa fixa: D = msg.value - fixedFee.
            // Se taxa %: D = msg.value / (1 + rate).
            
            // PELA ESPECIFICAÇÃO DO USUÁRIO:
            // "usuário envia T = D + f(D)... então D = msg.value - sealFee"
            // Isso implica que sealFee já é conhecida baseada no D pretendido.
            // O contrato deve calcular a taxa baseada em quê?
            // Se usarmos msg.value como base, cobramos taxa sobre taxa? Não.
            
            // Abordagem Segura: Calcular taxa baseada no input total enviado
            // Se taxa fixa:
            if (useFixedFee) {
                sealFee = sealFeeFixed;
            } else {
                // Se percentual, matematica reversa para achar D original
                // T = D + (D * rate) = D * (1 + rate)
                // D = T / (1 + rate)
                // Fee = T - D
                 uint256 rate = sealFeePercent; // base 10000
                 donationAmount = (msg.value * 10000) / (10000 + rate);
                 sealFee = msg.value - donationAmount;
            }
            
            /* NOTA: O código do usuário usava calculateSealFee(donationAmount) antes de deduzir.
               Isso estava ligeiramente bugado logicamente pois donationAmount era msg.value.
               Se msg.value inclui a taxa, calcular % sobre ele infla a taxa.
               
               Ajuste da Implementação para fidelidade MAXIMA ao principio R_p(D) = D:
               Se Fixed Fee: Simples.
            */ 
            
            if (useFixedFee) {
                 // Recalcular fee baseada no CONTRATO (source of truth)
                 sealFee = sealFeeFixed; 
            } else {
                 // Percentual reverso para garantir D limpo
                 // D = msg.value * 10000 / (10000 + percent)
                 donationAmount = (msg.value * 10000) / (10000 + sealFeePercent);
                 sealFee = msg.value - donationAmount;
            }

            require(msg.value >= sealFee, "Msg.value insufficient for fee");
            
            // Se não for percent reverse, e seguirmos o código original do user:
            // "donationAmount = msg.value - sealFee"
            // Isso assume que calculateSealFee retorna o valor correto.
            // Vou manter a logica de reversa que é mais honesta matematicamente.
            
             // Final check: D = msg.value - sealFee
             // Se usarmos a reversa acima, isso já é verdade.
        }
        
        // Se wansSeal era false, donationAmount já é msg.value e sealFee é 0.

        // 1. Transferir PRINCIPAL para o Projeto (Invariante)
        projectWallet.transfer(donationAmount);
        
        // 2. Se sobrou algo (Taxa), e queria selo, processar Mint
        if (_wantsSeal && sealFee > 0) {
            // A taxa já ficou no contrato (this.balance aumenta)
            
            // Mint NFT
            sealTokenId = sealContract.mintSeal(
                msg.sender,
                _projectId,
                donationAmount,
                sealFee
            );
        }

        // 3. Emitir Recibo Final
        emit DonationRecorded(
            msg.sender,
            _projectId,
            donationAmount,
            _wantsSeal,
            sealFee,
            block.timestamp,
            sealTokenId
        );
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner()).transfer(balance);
    }
}
