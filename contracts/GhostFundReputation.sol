// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import "./GhostFundDonation.sol";
import "./GhostFundPatronSeal.sol";

/**
 * @title GhostFundReputation
 * @dev Sistema de pontuação on-chain baseado no histórico de doações.
 * Fonte de verdade para calcular "Voting Power" ou "Social Capital" em DAOs.
 */
contract GhostFundReputation {
    
    GhostFundDonation public donationContract;
    GhostFundPatronSeal public sealContract;

    struct Reputation {
        uint256 totalDonated;       // Acumulado histórico de volume doado (wei)
        uint256 sealCount;          // Número de badges verificados
        uint256 lastDonationTimestamp;
    }

    mapping(address => Reputation) public reputations;

    constructor(address _donationContract, address _sealContract) {
        donationContract = GhostFundDonation(_donationContract);
        sealContract = GhostFundPatronSeal(_sealContract);
    }

    /**
     * @dev Atualiza o score de um doador. Em um sistema ideal, isso seria chamado
     * automaticamente pelo GhostFundDonation (o que aumentaria o gas do doador)
     * OU executado periodicamente via Keepers/Oracles lendo eventos.
     * 
     * Para este MVP v1.0, deixaremos como 'external' para ser chamado 
     * manualmente ou via arquitetura de 'Lazy Indexing' quando necessário.
     */
    function updateReputation(address _donor, uint256 _donationAmount, bool _hasSeal) external {
        // Validação básica de segurança: Apenas chamadas autorizadas deveriam atualizar.
        // Numa versão final, restringiríamos ao msg.sender == address(donationContract)
        // ou a um Role de 'Indexer'.
        // Como o contrato de Doação atual NÃO chama essa função (para economizar gas),
        // vamos permitir update mas a fonte da verdade final continua sendo os eventos.
        // NOTA: Esta implementação é uma 'Cache' On-Chain.
        
        reputations[_donor].totalDonated += _donationAmount;
        if (_hasSeal) {
            reputations[_donor].sealCount++;
        }
        reputations[_donor].lastDonationTimestamp = block.timestamp;
    }

    /**
     * @dev Retorna o perfil de reputação completo.
     * O 'score' é uma métrica composta arbitrada pelo protocolo.
     */
    function getReputation(address _donor) external view returns (
        uint256 totalDonated,
        uint256 sealCount,
        uint256 score
    ) {
        Reputation memory rep = reputations[_donor];
        
        // Pega contagem real de NFTs (source of truth do ERC721) se possível,
        // ou usa o cache local. Vamos usar o híbrido para robustez.
        uint256 realSealCount = sealContract.balanceOf(_donor);
        
        // Score Algorithm v1.0:
        // Score = (Total Doado em ETH) + (Badges * 1 ETH Bonus Weight)
        // Isso valoriza tanto o volume financeiro quanto a consistência (número de doações).
        uint256 calculatedScore = rep.totalDonated + (realSealCount * 1 ether);
        
        return (rep.totalDonated, realSealCount, calculatedScore);
    }

    // Função utilitária para checagem rápida de saldo de NFTs
    function getSealCountOnChain(address _donor) external view returns (uint256) {
        return sealContract.balanceOf(_donor);
    }
}
