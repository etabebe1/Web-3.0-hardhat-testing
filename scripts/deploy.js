// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECONDS;

  // console.log(currentTimestampInSeconds);
  // console.log(ONE_YEAR_IN_SECONDS);
  // console.log(unlockTime);

  // previously utils was used but now depreciated
  // const lockedAmount = hre.ethers.utils.parseEther("1");
  const lockedAmount = hre.ethers.parseEther("1");

  // console.log(lockedAmount);

  const LockContract = await hre.ethers.getContractFactory("LockContract");
  const lockContract = await LockContract.deploy(unlockTime, { value: lockedAmount });

  // we don't need the following code as well
  // await lockContract.deployed();

  // here lockContract.target -- refers to address of the deployer
  // console.log(lockContract.address); --> previously but depreciated
  // console.log(lockContract.target);
  console.log(`Contract contain 1 ETH & address: ${lockContract.target}`);
  // console.log(lockContract);
  console.log(LockContract);

  // const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
  //   value: lockedAmount,
  // });

  // await lock.waitForDeployment();

  // console.log(
  //   `Lock with ${ethers.formatEther(
  //     lockedAmount
  //   )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
  // );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
