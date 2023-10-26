import { ethers } from "ethers";
// import busdContractJson from "../contracts/busd.contract.json" assert { type: "json" };
import busdContractJson from "../../../utils/Contract/busd.contract.json" assert { type: "json" };
const provider = new ethers.JsonRpcProvider(
  "https://go.getblock.io/e0fc7ad620344738acd76f605fdd6fec"
);
import BigNumber from "bignumber.js";
const contractAddress = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee";
const contractABI = busdContractJson;
const PRIVATE_KEY = "4220fe53b28604bb5b56614f8ea19bd1142e6cd47d0aa431439bece910b4d774"
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, contractABI, signer);

export const withdraw = async (address, wei) => {
  try {
    const valueInWei = new BigNumber(wei.toString()); // 1e19 in Wei
    const valueHex = "0x" + valueInWei.toString(16);
    const tx = await contract.transfer(address, valueHex);
    await tx.wait();
    console.log("Transaction Hash:", tx.hash);
    console.log("Transfer successful.");
    return tx.hash
  } catch (error) {
    console.log(error);
    throw error;
  }
};
