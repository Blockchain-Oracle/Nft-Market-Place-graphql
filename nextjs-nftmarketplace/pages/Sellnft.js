import { Form, useNotification } from "web3uikit";
import { ethers } from "ethers";
import abi from "../constants/Basicabi.json";
import nftMarketAbi from "../constants/abi.json";
import contractAddress from "../constants/contractAddress.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
export default function Sellnft() {
  const { chainId: chainIdHex } = useMoralis();
  const chainId = chainIdHex ? parseInt(chainIdHex).toString() : "11155111";
  const markeplaceAddress = contractAddress
    ? contractAddress[chainId]["nftmarketplace"]
    : null;

  const dispatch = useNotification();
  const { runContractFunction } = useWeb3Contract();

  async function approveAndList(data) {
    console.log("approving");
    const nftAddress = data.data[0].inputResult;
    const tokenId = data.data[1].inputResult;
    const price =
      data.data[2].inputResult <= 0
        ? "0"
        : ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString();
    console.log(nftAddress, tokenId, price);
    const approveOptions = {
      abi: abi,
      contractAddress: nftAddress,
      functionName: "approve",
      params: {
        to: markeplaceAddress.toString(),
        tokenId: tokenId,
      },
    };
    console.log(approveOptions);
    await runContractFunction({
      params: approveOptions,
      onSuccess: (tx) => HandleApproveSucess(tx, nftAddress, tokenId, price),
      onError: (error) => console.log(error),
    });
  }

  async function HandleApproveSucess(tx, nftAddress, tokenId, price) {
    console.log("lising item pls wait");
    await tx.wait(1);
    const listItem = {
      abi: nftMarketAbi,
      functionName: "listItem",
      contractAddress: markeplaceAddress.toString(),
      params: {
        nftAddress: nftAddress,
        tokenId: tokenId,
        price: price,
      },
    };

    await runContractFunction({
      params: listItem,
      onSuccess: handleListSucess,
      onError: (error) => console.log(error),
    });

    async function handleListSucess(tx) {
      await tx.wait(1);
      dispatch({
        type: "success",
        message: "Nft Lising pls refresh",
        title: "nft Listing",
        position: "topR",
      });
    }
  }
  return (
    <div>
      <Form
        onSubmit={approveAndList}
        data={[
          {
            name: "Nft Adress",
            type: "text",
            inputWidth: "50%",
            value: "",
            key: "nftAddress",
          },
          {
            name: "tokenId",
            type: "number",
            value: "",
            key: "tokenId",
          },
          {
            name: "price in Eth",
            type: "number",
            value: "0",
            key: "price",
          },
        ]}
        title="sell  your NFT"
        id="main form"
      />
    </div>
  );
}
