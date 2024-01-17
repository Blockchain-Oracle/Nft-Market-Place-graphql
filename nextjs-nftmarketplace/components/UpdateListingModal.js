import { useState } from "react";
import { Modal, Input, useNotification } from "web3uikit";
import abi from "../constants/abi.json";
import contractAddresss from "../constants/contractAddress.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";
export default function UpdateListingModal({ isVisible, tokenId, NftAddress }) {
  const [priceToUpdateLisingWith, setPriceToUpdateListingWith] = useState(0);

  const { chainId: chainIdHex } = useMoralis();
  const chainId = chainIdHex ? parseInt(chainIdHex).toString() : "11155111";
  const markeplaceAddress = contractAddresss
    ? contractAddresss[chainId].nftmarketplace[0]
    : null;
  const dispatch = useNotification();
  const handleUpdateListingSucess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "listing updated",
      title: "listing update -please refresh",
      position: "topR",
    });
  };
  // 0xbC6f453590b723a03228dc2993dffc0d533e843d
  const { runContractFunction: updateListing } = useWeb3Contract({
    abi: abi,
    contractAddress: markeplaceAddress.toString(),
    functionName: "updateListing",
    params: {
      nftAddress: NftAddress,
      tokenId: tokenId,
      newPrice:
        priceToUpdateLisingWith <= 0
          ? "0"
          : ethers.utils.parseEther(priceToUpdateLisingWith.toString()) || "0",
    },
  });

  return (
    <Modal
      isVisible={isVisible}
      onOk={async () => {
        if (priceToUpdateLisingWith >= 0) {
          await updateListing({
            onError: (error) => console.log(error),
            onSuccess: handleUpdateListingSucess,
          });
        }
      }}
    >
      <Input
        label="Update price currency in L1 currency Eth"
        name="New listing price"
        type="number"
        placeholder="Eth"
        validation={{ numberMin: 0 }}
        onChange={(event) => {
          setPriceToUpdateListingWith(event.target.value);
        }}
      />
    </Modal>
  );
}
