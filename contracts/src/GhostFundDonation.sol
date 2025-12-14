// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./GhostFundPatronSeal.sol";

contract GhostFundDonation is Ownable, ReentrancyGuard {

    GhostFundPatronSeal public sealContract;
    uint256 public sealFeeFixed;
    uint256 public sealFeePercent;
    bool public useFixedFee;

    mapping(uint256 => address payable) public projects;
    uint256 public projectCount;

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

    function calculateSealFee(uint256 _donationAmount) public view returns (uint256) {
        if (useFixedFee) {
            return sealFeeFixed;
        } else {
            return (_donationAmount * sealFeePercent) / 10000;
        }
    }
    
    function donate(uint256 _projectId, bool _wantsSeal) external payable nonReentrant {
        require(_projectId > 0 && _projectId <= projectCount, "Project does not exist");
        require(msg.value > 0, "Donation must be > 0");
        
        address payable projectWallet = projects[_projectId];
        require(projectWallet != address(0), "Project wallet not configured");
        
        uint256 donationAmount = msg.value;
        uint256 sealFee = 0;
        uint256 sealTokenId = 0;
        
        if (_wantsSeal) {
            if (useFixedFee) {
                 sealFee = sealFeeFixed; 
            } else {
                 donationAmount = (msg.value * 10000) / (10000 + sealFeePercent);
                 sealFee = msg.value - donationAmount;
            }
            require(msg.value >= sealFee, "Msg.value insufficient for fee");
        }
        
        projectWallet.transfer(donationAmount);
        
        if (_wantsSeal && sealFee > 0) {
            sealTokenId = sealContract.mintSeal(
                msg.sender,
                _projectId,
                donationAmount,
                sealFee
            );
        }

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
