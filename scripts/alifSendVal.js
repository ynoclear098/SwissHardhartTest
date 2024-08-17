const hre = require("hardhat");
const { sendSignedShieldedQuery } = require("./utils");

const PK = "";
const deployedContractAddress = "0x31A45401d1322553b44f657dfE0FCA917400F8EB";

async function main() {
  const PERC20 = await hre.ethers.getContractFactory("PERC20Sample");
  const perc20 = PERC20.attach(deployedContractAddress);

  const provider = new hre.ethers.providers.JsonRpcProvider(hre.network.config.url);
  const wallet = new hre.ethers.Wallet(PK, provider);

  const tx = await wallet.sendTransaction({
    to: perc20.address,
    value: 100
  });
  await tx.wait();
  console.log(tx);

  let encodedFunctionData = perc20.interface.encodeFunctionData("balanceOf", [wallet.address]);
  let req = await sendSignedShieldedQuery(wallet, perc20.address, encodedFunctionData);

  let balance = perc20.interface.decodeFunctionResult("balanceOf", req)[0];
  console.log('Balance: ', balance.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

