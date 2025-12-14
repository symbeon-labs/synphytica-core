import { expect } from "chai";
import { ethers } from "hardhat";
import { GhostFundDonation, GhostFundPatronSeal, GhostFundReputation } from "../typechain-types";

describe("GhostFund Protocol System Test", function () {
    let donation: GhostFundDonation;
    let seal: GhostFundPatronSeal;
    let reputation: GhostFundReputation;
    let owner: any;
    let donor: any;
    let projectWallet: any;

    // Configurações
    const PROJECT_ID = 1;
    const DONATION_AMOUNT = ethers.parseEther("1.0"); // 1 ETH
    // Taxa de 5% (500 basis points)
    const FEE_PERCENT = 500n;

    before(async function () {
        [owner, donor, projectWallet] = await ethers.getSigners();

        // 1. Deploy Seal
        const SealFactory = await ethers.getContractFactory("GhostFundPatronSeal");
        seal = await SealFactory.deploy("GhostFund Seal", "GFS", "https://api.ghost.fund/", true) as unknown as GhostFundPatronSeal;
        await seal.waitForDeployment();

        // 2. Deploy Donation
        const DonationFactory = await ethers.getContractFactory("GhostFundDonation");
        donation = await DonationFactory.deploy(
            await seal.getAddress(),
            0, // Fixed Fee 0
            FEE_PERCENT, // 5%
            false // Use Percent
        ) as unknown as GhostFundDonation;
        await donation.waitForDeployment();

        // 3. Setup Permissions
        await seal.setDonationContract(await donation.getAddress());

        // 4. Register Project
        await donation.addProject(projectWallet.address);

        // 5. Deploy Reputation
        const ReputationFactory = await ethers.getContractFactory("GhostFundReputation");
        reputation = await ReputationFactory.deploy(await donation.getAddress(), await seal.getAddress()) as unknown as GhostFundReputation;
        await reputation.waitForDeployment();
    });

    it("Should calculate fee correctly (Reverse Calculation)", async function () {
        // Se usuário quer doar 1 ETH LIQUIDO para o projeto
        // E a taxa é 5%
        // O Total enviado deve ser T = D * (1 + 5%) = 1.05 ETH

        // Testando a função view
        // A função view calculateSealFee recebe o valor da doação LIQUIDA (D)
        const fee = await donation.calculateSealFee(DONATION_AMOUNT);
        const expectedFee = (DONATION_AMOUNT * FEE_PERCENT) / 10000n;

        expect(fee).to.equal(expectedFee);
    });

    it("Should process donation WITHOUT seal (100% to project)", async function () {
        const initialBalance = await ethers.provider.getBalance(projectWallet.address);

        await donation.connect(donor).donate(PROJECT_ID, false, { value: DONATION_AMOUNT });

        const finalBalance = await ethers.provider.getBalance(projectWallet.address);

        // Projeto deve ter recebido EXATAMENTE 1.0 ETH
        expect(finalBalance - initialBalance).to.equal(DONATION_AMOUNT);
    });

    it("Should process donation WITH seal (Split payment)", async function () {
        const initialProjectBalance = await ethers.provider.getBalance(projectWallet.address);

        // Calcular Total necessário para que 1 ETH chegue limpo
        // T = D + Fee
        // Fee = D * 5% = 0.05
        // T = 1.05
        const fee = (DONATION_AMOUNT * FEE_PERCENT) / 10000n;
        const totalToSend = DONATION_AMOUNT + fee;

        // Executar doação
        await donation.connect(donor).donate(PROJECT_ID, true, { value: totalToSend });

        // Verificações

        // A. Projeto recebeu 1.0 ETH limpo? (Invariante)
        const finalProjectBalance = await ethers.provider.getBalance(projectWallet.address);
        expect(finalProjectBalance - initialProjectBalance).to.equal(DONATION_AMOUNT);

        // B. Doador recebeu NFT?
        expect(await seal.balanceOf(donor.address)).to.equal(1);

        // C. Contrato reteve a taxa?
        const contractBalance = await ethers.provider.getBalance(await donation.getAddress());
        expect(contractBalance).to.equal(fee);
    });

    it("Should reflect reputation Score", async function () {
        // Doador fez 2 doações (1 sem selo, 1 com selo)
        // Total Doado: 2.0 ETH
        // Selos: 1

        // Vamos chamar o updateReputation manualmente para simular o indexer
        // (Note: no contrato real isso seria via evento, mas aqui chamamos direto para teste)
        // Atualizar doação 1
        await reputation.updateReputation(donor.address, DONATION_AMOUNT, false);
        // Atualizar doação 2
        await reputation.updateReputation(donor.address, DONATION_AMOUNT, true);

        const [totalDonated, sealCount, score] = await reputation.getReputation(donor.address);

        expect(totalDonated).to.equal(DONATION_AMOUNT * 2n);
        expect(sealCount).to.equal(1n); // Lida do contrato NFT

        // Score = TotalDonated + (Seals * 1 ETH)
        // Score = 2.0 + 1.0 = 3.0 ETH
        const expectedScore = (DONATION_AMOUNT * 2n) + ethers.parseEther("1.0");
        expect(score).to.equal(expectedScore);
    });
});
