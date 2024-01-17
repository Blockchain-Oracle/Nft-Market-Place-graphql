import { useQuery, gql } from "@apollo/client";

const GET_ACTIVE_ITEMS = gql`
  {
    activeItems(first: 5) {
      id
      seller
      nftAddress
      tokenId
      price
      buyer
      sellerWithdraw
      amount
    }
  }
`;

export default GET_ACTIVE_ITEMS;
