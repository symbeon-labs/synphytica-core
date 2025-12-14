import { ethers } from "hardhat";

async function main() {
    console.log("👻 Starting GhostFund Protocol Deploy...");

    // 1. Deploy Patron Seal (NFT)
    const PatronSeal = await ethers.getContractFactory("GhostFundPatronSeal");
    const seal = await PatronSeal.deploy(
        "SynPhytica Patron", // Name
        "SYNP-GHOST",        // Symbol
        "https://api.synphytica.com/metadata/", // Base URI (Trinity API)
        true                 // Transferable? Yes
    );
    await seal.waitForDeployment();
    console.log(`✅ PatronSeal deployed at: ${await seal.getAddress()}`);

    // 2. Deploy Donation Core
    const Donation = await ethers.getContractFactory("GhostFundDonation");
    const donation = await Donation.deploy(
        await seal.getAddress(),
        ethers.parseEther("0.0"), // Fixed Fee (0 for now)
        500,                      // Percent Fee (5%)
        false                     // Use Fixed? No, use percent
    );
    await donation.waitForDeployment();
    console.log(`✅ GhostFundDonation deployed at: ${await donation.getAddress()}`);

    // 3. Setup Permissions
    console.log("🔐 Configuring permissions...");
    // O contrato de doação precisa ter permissão para mintar no contrato de selo
    await seal.setDonationContract(await donation.getAddress());
    console.log("✨ Donation contract authorized to mint seals.");

    // 4. Deploy Reputation (Optional but recommended)
    const Reputation = await ethers.getContractFactory("GhostFundReputation");
    const reputation = await Reputation.deploy(
        await donation.getAddress(),
        await seal.getAddress()
    );
    await reputation.waitForDeployment();
    console.log(`✅ Reputation Oracle deployed at: ${await reputation.getAddress()}`);

    console.log("🎉 DEPLOYMENT COMPLETE!");
    console.log("----------------------------------------------------");
    console.log(`Donation Contract: ${await donation.getAddress()}`);
    console.log(`Seal (NFT):        ${await seal.getAddress()}`);
    console.log(`Reputation:        ${await reputation.getAddress()}`);
    console.log("----------------------------------------------------");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
