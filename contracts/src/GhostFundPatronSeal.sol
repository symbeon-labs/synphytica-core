// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title GhostFundPatronSeal
 * @dev NFT que representa a prova de patronagem (Proof-of-Donation).
 * Gerenciado exclusivamente pelo contrato GhostFundDonation.
 */
contract GhostFundPatronSeal is ERC721Enumerable, Ownable {
    
    struct SealMetadata {
        address donor;
        uint256 projectId;
        uint256 donationAmount;
        uint256 sealFee;
        uint256 timestamp;
    }

    mapping(uint256 => SealMetadata) public sealMetadata;
    uint256 private _nextTokenId;

    address public donationContract;
    string private _baseTokenURI;
    bool public transferable;

    event SealMinted(
        uint256 indexed tokenId,
        address indexed donor,
        uint256 indexed projectId,
        uint256 donationAmount
    );

    constructor(
        string memory _name,
        string memory _symbol,
        string memory baseURI,
        bool _transferable
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        _baseTokenURI = baseURI;
        transferable = _transferable;
        _nextTokenId = 1;
    }

    function setDonationContract(address _donationContract) external onlyOwner {
        donationContract = _donationContract;
    }

    function mintSeal(
        address _donor,
        uint256 _projectId,
        uint256 _donationAmount,
        uint256 _sealFee
    ) external returns (uint256) {
        require(msg.sender == donationContract, "Access Denied: Only Donation Contract");
        
        uint256 tokenId = _nextTokenId++;
        
        _safeMint(_donor, tokenId);
        
        sealMetadata[tokenId] = SealMetadata({
            donor: _donor,
            projectId: _projectId,
            donationAmount: _donationAmount,
            sealFee: _sealFee,
            timestamp: block.timestamp
        });
        
        emit SealMinted(tokenId, _donor, _projectId, _donationAmount);
        
        return tokenId;
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0) && !transferable) {
            revert("GhostFund: Seal is Soulbound (Non-transferable)");
        }
        return super._update(to, tokenId, auth);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");
        SealMetadata memory meta = sealMetadata[tokenId];
        return string(abi.encodePacked(
            _baseTokenURI,
            Strings.toString(tokenId),
            "?donor=", Strings.toHexString(uint160(meta.donor)),
            "&project=", Strings.toString(meta.projectId),
            "&amount=", Strings.toString(meta.donationAmount),
            "&timestamp=", Strings.toString(meta.timestamp)
        ));
    }

    function setTransferable(bool _transferable) external onlyOwner {
        transferable = _transferable;
    }
}
