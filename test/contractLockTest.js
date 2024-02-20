const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

// console.log(time);
// console.log(loadFixture);

const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
// console.log(anyValue);

const { expect } = require("chai");
const { ethers } = require("hardhat");

// console.log(expect);

describe("Contract", () => {
  async function runEveryTime() {
    const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;

    const lockAmount = ONE_GWEI;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECONDS;

    // console.log(ONE_YEAR_IN_SECONDS, ONE_GWEI);
    // console.log(unlockTime);

    /* Get Accounts */
    // const [owner, otherAccount] = await ethers.getSigners();
    const [owner, otherAccount, acc1, acc2, acc3] = await ethers.getSigners();

    // console.log(acc1);
    // console.log(acc2);
    // console.log(owner);
    // console.log(otherAccounts);

    const LockContract = await ethers.getContractFactory("LockContract");
    const lockContract = await LockContract.deploy(unlockTime, {
      value: lockAmount,
    });

    // console.log(lockAmount);
    return { lockContract, unlockTime, lockAmount, owner, otherAccount };
  }

  describe("Deployment", () => {
    // CHECKING UNLOCKING TIME
    it("Should check unlock time", async () => {
      const { lockContract, unlockTime } = await loadFixture(runEveryTime);

      // console.log(lockContract);
      // console.log(unlockTime);

      expect(await lockContract.unlockTime()).to.equal(unlockTime);

      const value = expect(await lockContract.unlockTime()).to.equal(
        unlockTime
      );

      // console.log(value);
      console.log(value.__flags.object);
    });

    // CHECKING OWNER
    it("Should set the right owner", async () => {
      const { lockContract, owner } = await loadFixture(runEveryTime);

      expect(await lockContract.owner()).to.equal(owner.address);
      console.log(owner.address);
    });

    // CHECKING THE BALANCE
    it("Should receive and store the funds to lockContract", async () => {
      const { lockContract, lockAmount } = await loadFixture(runEveryTime);

      // console.log(lockContract);
      // console.log(owner);

      //* TO GET THE BALANCE OF THE CONTRACT
      //* In previous depreciated code
      // const contractBalance = await ethers.provider.getBalance(lockContract);

      //* In the current mode of code
      const contractBalance = await ethers.provider.getBalance(lockContract);
      console.log(contractBalance);
    });

    // CONDITION CHECK
    it("Should fail if the unlock is not in the future", async () => {
      const latestTime = await time.latest();
      // console.log(latestTime);
      // console.log(latestTime / 60 / 60 / 60 / 24);

      const lockContract = await ethers.getContractFactory("LockContract");
      // console.log(lockContract);

      await expect(
        lockContract.deploy(latestTime, { value: 1 })
      ).to.be.revertedWith("Unlock time should be in the future");
    });

    // ("Note that: To prevent AssertionError, input in the revertedWith should be the same.");
  });

  describe("Withdrawal", () => {
    describe("Validation", () => {
      // TIME CHECK FOT WITHDRAW
      it("Should revert with the right if called too soon", async () => {
        const { lockContract } = await loadFixture(runEveryTime);

        await expect(lockContract.withdraw()).to.be.revertedWith(
          "You can't withdraw yet"
        );
      });

      it("Should revert with message for right owner", async () => {
        const { lockContract, unlockTime, otherAccount } = await loadFixture(
          runEveryTime
        );

        // const newTime = await time.increaseTo(unlockTime);
        // console.log(newTime);

        await time.increaseTo(unlockTime);

        await expect(
          lockContract.connect(otherAccount).withdraw()
        ).to.be.revertedWith("You aren't the owner");
      });

      it("Should not fail if the unlockTime is arrived and the owner calls it", async () => {
        const { lockContract, unlockTime } = await loadFixture(runEveryTime);

        await time.increaseTo(unlockTime);
        await expect(lockContract.withdraw()).not.to.be.reverted;
      });
    });

    // CHECKING FOR EVENTS
    describe("EVENTS", () => {
      // SUBMIT EVENT
      it("Should emit the event on withdrawal", async () => {
        const { lockContract, unlockTime, lockAmount } = await loadFixture(
          runEveryTime
        );

        await time.increaseTo(unlockTime);

        await expect(lockContract.withdraw())
          .to.emit(lockContract, "Withdrawal")
          .withArgs(lockAmount, anyValue);
      });
    });

    // TRANSFER
    describe("Transfer", () => {
      it("Should transfer the fund to the owner", async () => {
        const { lockContract, lockAmount, unlockTime, owner } =
          await loadFixture(runEveryTime);

        await time.increaseTo(unlockTime);

        await expect(lockContract.withdraw()).to.changeEtherBalances(
          [owner, lockContract],
          [lockAmount, -lockAmount]
        );
      });
    });
  });

  runEveryTime();
});

// const {
//   time,
//   loadFixture,
// } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
// const { expect } = require("chai");

// describe("Lock", function () {
//   // We define a fixture to reuse the same setup in every test.
//   // We use loadFixture to run this setup once, snapshot that state,
//   // and reset Hardhat Network to that snapshot in every test.
//   async function deployOneYearLockFixture() {
//     const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//     const ONE_GWEI = 1_000_000_000;

//     const lockedAmount = ONE_GWEI;
//     const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

//     // Contracts are deployed using the first signer/account by default
//     const [owner, otherAccount] = await ethers.getSigners();

//     const Lock = await ethers.getContractFactory("Lock");
//     const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

//     return { lock, unlockTime, lockedAmount, owner, otherAccount };
//   }

//   describe("Deployment", function () {
//     it("Should set the right unlockTime", async function () {
//       const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

//       expect(await lock.unlockTime()).to.equal(unlockTime);
//     });

//     it("Should set the right owner", async function () {
//       const { lock, owner } = await loadFixture(deployOneYearLockFixture);

//       expect(await lock.owner()).to.equal(owner.address);
//     });

//     it("Should receive and store the funds to lock", async function () {
//       const { lock, lockedAmount } = await loadFixture(
//         deployOneYearLockFixture
//       );

//       expect(await ethers.provider.getBalance(lock.target)).to.equal(
//         lockedAmount
//       );
//     });

//     it("Should fail if the unlockTime is not in the future", async function () {
//       // We don't use the fixture here because we want a different deployment
//       const latestTime = await time.latest();
//       const Lock = await ethers.getContractFactory("Lock");
//       await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
//         "Unlock time should be in the future"
//       );
//     });
//   });

//   describe("Withdrawals", function () {
//     describe("Validations", function () {
//       it("Should revert with the right error if called too soon", async function () {
//         const { lock } = await loadFixture(deployOneYearLockFixture);

//         await expect(lock.withdraw()).to.be.revertedWith(
//           "You can't withdraw yet"
//         );
//       });

//       it("Should revert with the right error if called from another account", async function () {
//         const { lock, unlockTime, otherAccount } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         // We can increase the time in Hardhat Network
//         await time.increaseTo(unlockTime);

//         // We use lock.connect() to send a transaction from another account
//         await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
//           "You aren't the owner"
//         );
//       });

//       it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
//         const { lock, unlockTime } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         // Transactions are sent using the first signer by default
//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw()).not.to.be.reverted;
//       });
//     });

//     describe("Events", function () {
//       it("Should emit an event on withdrawals", async function () {
//         const { lock, unlockTime, lockedAmount } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw())
//           .to.emit(lock, "Withdrawal")
//           .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
//       });
//     });

//     describe("Transfers", function () {
//       it("Should transfer the funds to the owner", async function () {
//         const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw()).to.changeEtherBalances(
//           [owner, lock],
//           [lockedAmount, -lockedAmount]
//         );
//       });
//     });
//   });
// });
