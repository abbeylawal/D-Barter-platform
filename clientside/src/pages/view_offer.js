// import React, { useContext, useEffect, useState } from 'react'
// import {useRouter} from "next/router";
// import Style from "../styles/product-details.module.css";
// import { Button, Category } from "../components/componentsIndex";
// import ProductDetailsPage from "./ProductDetailsPage/ProductDetailsPage";


// // SMART CONTRACT
// import { NFTMarketplaceContext } from "../../SmartContract/Context/NFTMarketplaceContext";

// const view_offer = () => {
//   const { currentAccount } = useContext(NFTMarketplaceContext);
  
//   const [nft, setNft] = useState({
//     image: "",
//     tokenId: "",
//     name: "",
//     contractOwner: "",
//     itemOwner: "",
//   });
  
//   const router = useRouter();
//   useEffect(() => {
//     if (!router.isReady) return;
//     setNft(router.query);
//   }, [router.isReady]);
//   return (
//     <div className={Style.product_details}>
//       <ProductDetailsPage nft={nft} />
//       <Category />
//     </div>
//   );
// };

// export default view_offer;


import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Style from "../styles/product-details.module.css";
import { Button, Category } from "../components/componentsIndex";
import ProductDetailsPage from "./ProductDetailsPage/ProductDetailsPage";

// SMART CONTRACT
import { NFTMarketplaceContext } from "../../SmartContract/Context/NFTMarketplaceContext";

const ViewOffer = () => {
  const { fetchNFTByListingId, fetchNFTByOfferId } = useContext(
    NFTMarketplaceContext
  );

  const [listingNFT, setListingNFT] = useState(null);
  const [offerNFT, setOfferNFT] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    // Parse query parameters
    const { listingId, offerId } = router.query;
    const parsedListingId = parseInt(listingId, 10);
    const parsedOfferId = parseInt(offerId, 10);

    if (isNaN(parsedListingId) || isNaN(parsedOfferId)) {
      setError("Invalid listingId or offerId");
      return;
    }

    // Fetch NFTs based on listingId and offerId
    const fetchNFTs = async () => {
      try {
        const fetchedListingNFT = await fetchNFTByListingId(parsedListingId);
        const fetchedOfferNFT = await fetchNFTByOfferId(parsedOfferId);

        setListingNFT(fetchedListingNFT);
        setOfferNFT(fetchedOfferNFT);
      } catch (err) {
        console.error("Error fetching NFTs:", err);
        setError("Error fetching NFTs. Please try again.");
      }
    };

    fetchNFTs();
  }, [router.isReady, router.query, fetchNFTByListingId, fetchNFTByOfferId]);

  if (error) {
    return <div className={Style.error}>{error}</div>;
  }

  return (
    <div className={Style.product_details}>
      {listingNFT && offerNFT ? (
        <div className={Style.nft_offer_container}>
          <div className={Style.nft_side}>
            <h3>Listed NFT</h3>
            <img
              src={listingNFT.image}
              alt={listingNFT.name}
              className={Style.nft_image}
            />
            <p>{listingNFT.name}</p>
          </div>

          <div className={Style.arrow_container}>
            <span className={Style.arrow}>→</span>
          </div>

          <div className={Style.nft_side}>
            <h3>Offered NFT</h3>
            <img
              src={offerNFT.image}
              alt={offerNFT.name}
              className={Style.nft_image}
            />
            <p>{offerNFT.name}</p>
          </div>
        </div>
      ) : (
        <p>Loading NFTs...</p>
      )}

      <Category />
    </div>
  );
};

export default ViewOffer;
