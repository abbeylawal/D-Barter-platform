import "../styles/global.css";

import { NavBar } from "../components/componentsIndex";
import { Footer } from "../components/componentsIndex";

const MyApp = ({ Component, pageProps }) => (
    <div>
        <NavBar/>
        <Component {...pageProps} />
        <Footer/>
    </div>

);

export default MyApp;