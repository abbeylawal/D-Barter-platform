import Header from '../components/Header';

import Style from "../styles/Index.module.css";
import {
  MainSection,
  NFTSlider,
  Title,
  Category,
  Filter,
  BackToTopButton,
  Collection,
  NFTCard

} from '../components/componentsIndex';

const Home = () => {
  return (
    <div>
        <div className={Style.homePage}>

            <MainSection/>
            {/* <Title
              heading="New Collection"
              paragraph="Explore the NFT in the most featured categories."
            /> */}
            <Collection />
            <Title
              heading="Featured NFTs"
              paragraph="Explore the NFT in the most featured categories."
            />
            <Filter />
            <NFTCard />
            {/* <NFTSlider /> */}
            <Title
              heading="Browse by Category"
              paragraph="Explore the NFT in the most featured categories."
            />
            <Category />
        </div>
        <BackToTopButton />
    </div>
  );
};

export default Home;
