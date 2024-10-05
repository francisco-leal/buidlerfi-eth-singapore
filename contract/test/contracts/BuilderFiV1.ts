import chai from "chai";
import { ethers, waffle } from "hardhat";
import { solidity } from "ethereum-waffle";

import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import type { BuilderFiV1 } from "../../typechain-types";
import { Artifacts } from "../shared";

chai.use(solidity);

const { expect } = chai;
const { parseUnits } = ethers.utils;
const { deployContract } = ethers;

describe("BuilderFi", () => {
  let creator: SignerWithAddress;
  let shareOwner: SignerWithAddress;
  let shareBuyer: SignerWithAddress;

  let builderFi: BuilderFiV1;

  beforeEach(async () => {
    [creator, shareOwner, shareBuyer] = await ethers.getSigners();
  });

  it("can be deployed", async () => {
    const action = deployContract("BuilderFiV1", [creator.address]);

    await expect(action).not.to.be.reverted;
  });

  const builder = async () => {
    return deployContract("BuilderFiV1", [creator.address]) as Promise<BuilderFiV1>;
  };

  describe("testing functions", () => {
    beforeEach(async () => {
      builderFi = await builder();

      await builderFi.setFeeDestination("0x33041027dd8F4dC82B6e825FB37ADf8f15d44053");
      await builderFi.setHodlerFeePercent(ethers.utils.parseUnits("0.05")); // 5%
      await builderFi.setProtocolFeePercent(ethers.utils.parseUnits("0.05")); // 5%
      await builderFi.setSubjectFeePercent(ethers.utils.parseUnits("0.05")); // 5%

      await builderFi.connect(creator).enableTrading();
    });

    it("allows the user to buy their first share", async () => {
      const action = builderFi.connect(shareOwner).buyShares(shareOwner.address);

      await expect(action).not.to.be.reverted;
    });

    it("does not allow the user to buy their first share", async () => {
      const action = builderFi.connect(shareBuyer).buyShares(shareOwner.address);

      await expect(action).to.be.reverted;
    });

    it("changes the price after the first buy happens", async () => {
      await builderFi.connect(shareOwner).buyShares(shareOwner.address);

      expect(await builderFi.getBuyPrice(shareOwner.address)).to.eq(parseUnits("0.0000625"));
    });

    it("changes the supply of builder cards after the first buy happens", async () => {
      await builderFi.connect(shareOwner).buyShares(shareOwner.address);

      expect(await builderFi.builderCardsSupply(shareOwner.address)).to.eq(1);
    });

    it("changes the balance of builder cards after the first buy happens", async () => {
      await builderFi.connect(shareOwner).buyShares(shareOwner.address);

      expect(await builderFi.builderCardsBalance(shareOwner.address, shareOwner.address)).to.eq(1);
    });
  });
});
