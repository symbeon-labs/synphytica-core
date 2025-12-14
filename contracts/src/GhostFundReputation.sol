// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import "./GhostFundDonation.sol";
import "./GhostFundPatronSeal.sol";

contract GhostFundReputation {
    
    GhostFundDonation public donationContract;
    GhostFundPatronSeal public sealContract;

    struct Reputation {
        uint256 totalDonated;
        uint256 sealCount;
        uint256 lastDonationTimestamp;
    }

    mapping(address => Reputation) public reputations;

    constructor(address _donationContract, address _sealContract) {
        donationContract = GhostFundDonation(_donationContract);
        sealContract = GhostFundPatronSeal(_sealContract);
    }

    function updateReputation(address _donor, uint256 _donationAmount, bool _hasSeal) external {
        reputations[_donor].totalDonated += _donationAmount;
        if (_hasSeal) {
            reputations[_donor].sealCount++;
        }
        reputations[_donor].lastDonationTimestamp = block.timestamp;
    }

    function getReputation(address _donor) external view returns (
        uint256 totalDonated,
        uint256 sealCount,
        uint256 score
    ) {
        Reputation memory rep = reputations[_donor];
        uint256 realSealCount = sealContract.balanceOf(_donor);
        uint256 calculatedScore = rep.totalDonated + (realSealCount * 1 ether);
        return (rep.totalDonated, realSealCount, calculatedScore);
    }
}
