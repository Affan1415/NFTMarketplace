import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { BsCircleFill } from "react-icons/bs";
import Style from "./Category.module.css";

const Category = () => {
  const [topNFTs, setTopNFTs] = useState([]);

  useEffect(() => {
    const fetchTopNFTs = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/api/v1/nfts/top-5-nfts");
        const { data } = response.data;
        setTopNFTs(data.nfts.slice(0, 5));
      } catch (error) {
        console.error("Error fetching top NFTs:", error);
      }
    };

    fetchTopNFTs();
  }, []);

  return (
    <div className={Style.box_category}>
      <div className={Style.category}>
        {topNFTs.map((nft, index) => (
          <div className={Style.category_box} key={index}>
            <Image
              src={`/img/${nft.images[0]}`} // Assuming images are stored in the img folder
              className={Style.category_box_img}
              alt={nft.name}
              width={350}
              height={150}
              objectFit="cover"
            />
            <div className={Style.category_box_title}>
              <span>
                <BsCircleFill />
              </span>
              <div className={Style.category_box_title_info}>
                <h4>{nft.name}</h4>
                <small>{nft.price} NFTS</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
