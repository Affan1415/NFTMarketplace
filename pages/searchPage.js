import React,{ useEffect,useState,useContext } from "react";

//INTRNAL IMPORT
import Style from "../styles/searchPage.module.css";
import { Slider, Brand } from "../components/componentsindex";
import { SearchBar } from "../SearchPage/searchBarIndex";
import { Filter } from "../components/componentsindex";

import { NFTCardTwo, Banner } from "../collectionPage/collectionIndex";
import images from "../img";
//import smart contract
import{NFTMarketplaceContext} from "../Context/NFTMarketplaceContext"
const searchPage = () => {
  const {fetchNFT}=useContext(NFTMarketplaceContext);
  const [nfts, setNfts]=useState([]);
  const [nftsCopy,setNftsCopy]=useState([]);


  useEffect(()=>{
    fetchNFT().then((item)=>{
      setNfts(item.reverse());
      setNftsCopy(item)
      console.log(nfts)
    })
  })

  const collectionArray = [
    images.nft_image_1,
    images.nft_image_2,
    images.nft_image_3,
    images.nft_image_1,
    images.nft_image_2,
    images.nft_image_3,
    images.nft_image_1,
    images.nft_image_2,
  ];
  return (
    <div className={Style.searchPage}>
      <Banner bannerImage={images.creatorbackground2} />
      <SearchBar />
      <Filter />
      <NFTCardTwo NFTData={nfts} />
      <Slider />
      <Brand />
    </div>
  );
};

export default searchPage;
