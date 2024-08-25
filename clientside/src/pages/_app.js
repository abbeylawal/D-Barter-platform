import "../styles/global.css";
import { useRouter } from "next/router";
import { NavBar } from "../components/componentsIndex";
import { Footer } from "../components/componentsIndex";
import { BackToTopButton } from "../components/componentsIndex";
import { NFTMarketplaceProvider } from "../../SmartContract/Context/NFTMarketplaceContext";
import { useContext } from "react";


const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const showFooter = router.pathname !== "/auth";

  return (
    <div>
      <NFTMarketplaceProvider>
        <NavBar />
        <Component {...pageProps} />
        <BackToTopButton />
        {showFooter && <Footer />}
      </NFTMarketplaceProvider>
    </div>
  );
};

export default MyApp;
