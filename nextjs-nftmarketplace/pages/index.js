import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import GET_ACTIVE_ITEMS from "../constants/subGraphquires";
import { useQuery } from "@apollo/client";
import NftBox from "../components/NftBox";
import { useMoralis } from "react-moralis";

export default function Home() {
  const { chainId: chainIdhex, isWeb3Enabled, account } = useMoralis();

  const {
    loading: fetchingNft,
    error,
    data: listedNfts,
  } = useQuery(GET_ACTIVE_ITEMS);

  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
      <div className="flex flex-wrap">
        {isWeb3Enabled && listedNfts ? (
          fetchingNft ? (
            <div>loading...</div>
          ) : (
            listedNfts.activeItems.map((nft) => {
              console.log(nft);
              const {
                seller,
                nftAddress,
                tokenId,
                price,
                buyer,
                sellerWithdraw,
              } = nft;

              return (
                <div key={`${nftAddress}${tokenId}`}>
                  <NftBox
                    key={`${nftAddress}${tokenId}`}
                    price={price}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    seller={seller}
                  />
                </div>
              );
            })
          )
        ) : (
          <div>Web3 Currently not enabled</div>
        )}
      </div>
    </div>
  );
}
