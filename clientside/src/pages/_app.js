import "../styles/global.css";

import { NavBar } from "../components/componentsIndex";
import { Footer } from "../components/componentsIndex";
import { BackToTopButton } from "../components/componentsIndex";
import { NFTMarketplaceProvider } from "../../SmartContract/Context/NFTMarketplaceContext";

const MyApp = ({ Component, pageProps }) => (
    <div>
        <NFTMarketplaceProvider>
            <NavBar/>
            <Component {...pageProps} />
            <BackToTopButton />
            <Footer />
        </NFTMarketplaceProvider>
    </div>

);

export default MyApp;