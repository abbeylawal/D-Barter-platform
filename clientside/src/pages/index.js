import Header from '../components/Header';

import Style from "../styles/Index.module.css";
import {
  MainSection,
  NFTSlider,
  Title,
  Category,
  Filter,

} from '../components/componentsIndex';

const Home = () => {
  return (
    <div>
        <div className={Style.homePage}>
            <MainSection/>
            {/* <NFTSlider /> */}
            <Title
              heading="Browse by Category"
              paragraph="Explore the NFT in the most featured categories."
            />
            <Category />
            <Title
              heading="Featured NFTs"
              paragraph="Explore the NFT in the most featured categories."
            />
            <Filter />
        </div>
    </div>
  );
};

export default Home;
