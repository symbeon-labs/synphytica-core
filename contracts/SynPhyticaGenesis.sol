// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title SynPhyticaGenesis
 * @dev Contrato NFT oficial do ecossistema SynPhytica.
 * Gerencia a reputação e os níveis de acesso dos patronos do projeto.
 * 
 * Tiers:
 * 0: Genesis Founder (Legacy/Legendary)
 * 1: Observer (Entry Level)
 * 2: Catalyst (Mid Level)
 * 3: Architect (High Level)
 */
contract SynPhyticaGenesis is ERC721Enumerable, Ownable {
    
    enum Tier { GENESIS, OBSERVER, CATALYST, ARCHITECT }
    
    struct PatronData {
        Tier tier;
        uint256 donationAmount; // em Wei
        uint256 timestamp;
        bool hasAccessToSeve;
    }

    // Mapeamento TokenID -> Dados do Patrono
    mapping(uint256 => PatronData) public patronData;
    
    // Contadores
    uint256 private _nextTokenId;
    uint256 public constant MAX_GENESIS_SUPPLY = 100;
    uint256 public genesisMintedCount = 0;

    // Configurações de Valor (em Wei) - Exemplo: ETH
    // Observer: qualquer valor > 0
    // Catalyst: >= 0.1 ETH
    // Architect: >= 1.0 ETH
    uint256 public constant CATALYST_THRESHOLD = 0.1 ether;
    uint256 public constant ARCHITECT_THRESHOLD = 1.0 ether;

    address public ghostFundContract;
    string private _baseTokenURI;

    event PatronMinted(uint256 indexed tokenId, address indexed donor, Tier tier, uint256 amount);
    event AccessGranted(uint256 indexed tokenId, bool seveAccess);

    constructor(
        string memory _baseURI,
        address _ghostFundContract
    ) ERC721("SynPhytica Genesis", "SYNP") Ownable(msg.sender) {
        _baseTokenURI = _baseURI;
        ghostFundContract = _ghostFundContract;
        _nextTokenId = 1;
    }

    modifier onlyGhostFundOrOwner() {
        require(msg.sender == ghostFundContract || msg.sender == owner(), "Caller is not GhostFund or Owner");
        _;
    }

    // --- MINTING LOGIC ---

    /**
     * @dev Chamado pelo contrato GhostFund quando uma doação é feita.
     * Determina automaticamente o Tier baseado no valor doado.
     */
    function mintPatronBadge(address _donor, uint256 _amount) external onlyGhostFundOrOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        Tier assignedTier;
        bool seveAccess = false;

        // Determina Tier baseado no valor
        if (_amount >= ARCHITECT_THRESHOLD) {
            assignedTier = Tier.ARCHITECT;
            seveAccess = true; // Architect tem acesso garantido
        } else if (_amount >= CATALYST_THRESHOLD) {
            assignedTier = Tier.CATALYST;
        } else {
            assignedTier = Tier.OBSERVER;
        }

        _safeMint(_donor, tokenId);

        patronData[tokenId] = PatronData({
            tier: assignedTier,
            donationAmount: _amount,
            timestamp: block.timestamp,
            hasAccessToSeve: seveAccess
        });

        emit PatronMinted(tokenId, _donor, assignedTier, _amount);
        return tokenId;
    }

    /**
     * @dev Função exclusiva para emitir o Tier 0 (Genesis Founder).
     * Usa o asset legado "genesis_patron_badge".
     */
    function mintGenesisFounder(address _founder) external onlyOwner returns (uint256) {
        require(genesisMintedCount < MAX_GENESIS_SUPPLY, "Max Genesis supply reached");
        
        uint256 tokenId = _nextTokenId++;
        
        _safeMint(_founder, tokenId);

        patronData[tokenId] = PatronData({
            tier: Tier.GENESIS,
            donationAmount: 0, // Founders podem ter entrado antes da monetização
            timestamp: block.timestamp,
            hasAccessToSeve: true
        });

        genesisMintedCount++;
        emit PatronMinted(tokenId, _founder, Tier.GENESIS, 0);
        return tokenId;
    }

    // --- VIEW FUNCTIONS ---

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "URI query for nonexistent token");
        
        PatronData memory data = patronData[tokenId];
        
        // Retorna URI específica baseada no Tier
        string memory tierPath;
        if (data.tier == Tier.GENESIS) tierPath = "/genesis";
        else if (data.tier == Tier.ARCHITECT) tierPath = "/architect";
        else if (data.tier == Tier.CATALYST) tierPath = "/catalyst";
        else tierPath = "/observer";

        // Ex: https://api.synphytica.com/metadata/genesis/1
        return string(abi.encodePacked(_baseTokenURI, tierPath, "/", Strings.toString(tokenId)));
    }

    function getAccessLevel(uint256 tokenId) external view returns (string memory tierName, bool hasSeveAccess) {
        require(_ownerOf(tokenId) != address(0), "Query for nonexistent token");
        PatronData memory data = patronData[tokenId];
        
        if (data.tier == Tier.GENESIS) return ("GENESIS", true);
        if (data.tier == Tier.ARCHITECT) return ("ARCHITECT", true);
        if (data.tier == Tier.CATALYST) return ("CATALYST", false);
        return ("OBSERVER", false);
    }
    
    function setGhostFundContract(address _newAddress) external onlyOwner {
        ghostFundContract = _newAddress;
    }
}
