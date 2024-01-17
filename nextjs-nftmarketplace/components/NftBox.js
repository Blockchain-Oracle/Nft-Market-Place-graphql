import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import nftMarketPlaceabi from "../constants/abi.json";
import Image from "next/image";
import basicNft from "../constants/Basicabi.json";
import { Card, useNotification } from "web3uikit";
import { ethers } from "ethers";
import UpdateListingModal from "./UpdateListingModal";
import contractAddress from "../constants/contractAddress.json";

const truncateStr = (fullStr, strLen) => {
  if (fullStr.length < strLen) {
    return fullStr;
  }

  const seperator = "...";
  const seperatorLength = seperator.length;
  const charsToShow = strLen - seperatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return (
    fullStr.substring(0, frontChars) +
    seperator +
    fullStr.substring(fullStr.length - backChars)
  );
};
export default function NftBox({ price, nftAddress, tokenId, seller }) {
  const [imageUri, setImageUri] = useState("");
  const [tokenNmae, setTOkenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { chainId: chainIdhex, isWeb3Enabled, account } = useMoralis();
  const chainId = parseInt(chainIdhex);
  const markeplaceAddress = contractAddress
    ? contractAddress[chainId]["nftmarketplace"]
    : null;

  const dispatch = useNotification();
  const handleBuyItemSucess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "item  bought",
      title: "item bought         update -please refresh",
      position: "topR",
    });
  };
  const { runContractFunction: getTokenUri } = useWeb3Contract({
    abi: basicNft,
    contractAddress: nftAddress,
    functionName: "getTokenURL",
    params: {},
  });

  const { runContractFunction: buyItem } = useWeb3Contract({
    abi: nftMarketPlaceabi,
    contractAddress: markeplaceAddress.toString(),
    params: { nftAddress: nftAddress, tokenId: tokenId },
    functionName: "BuyItem",
    msgValue: price,
  });

  async function UpdateUi() {
    const tokenURI = await getTokenUri({
      onError: (error) => console.log(error),
    });
    console.log(`if token uri: ${tokenURI}`);
    if (tokenURI) {
      const requestUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const tokenURIResponse = await (await fetch(requestUrl)).json();

      const imageUrL = tokenURIResponse.image;
      const imageUriUrl = imageUrL.replace("ipfs://", "https://ipfs.io/ipfs");
      setImageUri(imageUriUrl);
      setTOkenName(tokenURIResponse.name);
      setTokenDescription(tokenURIResponse.description);
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      UpdateUi();
    }
  }, [isWeb3Enabled]);

  const handleCardClick = () => {
    isOwnedByUser
      ? setShowModal(true)
      : buyItem({
          onError: (error) => console.log(error),
          onSuccess: handleBuyItemSucess,
        });
  };

  const isOwnedByUser = seller === account || seller == undefined;
  const formatSellerAddress = isOwnedByUser
    ? "you"
    : truncateStr(seller || "", 15);
  return (
    <div>
      <div>
        {imageUri ? (
          <div>
            {showModal && (
              <UpdateListingModal
                isVisible={showModal}
                tokenId={tokenId}
                NftAddress={nftAddress}
              />
            )}

            <Card
              title={tokenNmae}
              description={tokenDescription}
              onClick={handleCardClick}
            >
              <div className="p-2">
                <div className="flex flex-col items-end gap-2">
                  <div>#{tokenId}</div>
                  <div className="italic text-sm">
                    Owned by {formatSellerAddress}
                  </div>
                  <div className="font-bold">
                    {ethers.utils.formatUnits(price, "ether")} Eth
                  </div>
                  <Image
                    alt={tokenNmae}
                    loader={() => imageUri}
                    src={imageUri}
                    height="200"
                    width="200"
                  />
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div>loading...</div>
        )}
      </div>
    </div>
  );
}
