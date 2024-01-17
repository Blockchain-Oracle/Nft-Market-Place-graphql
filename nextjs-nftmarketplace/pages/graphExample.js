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

function GraphExample() {
  // Use uppercase "GraphExample" for components
  const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Active Items</h2>
      {console.log(data)}
    </div>
  );
}

export default GraphExample;
