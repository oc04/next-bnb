import App, { AppContext, AppProps } from "next/app";
import GlobalStyle from "../styles/GlobalStyle";
import Header from "../components/Header";
import { wrapper } from "../store";
import { cookieStringToObject } from "../lib/utils";
import axios from "../lib/api";
import { meAPI } from "../lib/api/auth";
import { userActions } from "../store/user";


const app = ({ Component, pageProps}: AppProps) => {
    return (
        <>
            <GlobalStyle />
            <Header />
            <Component {...pageProps} />
            <div id="root-modal" />
            <div id="footer-modal" />
        </>
    );
};

app.getInitialProps = async (context: AppContext) => {
    const appInitialProps = await App.getInitialProps(context);
    const cookieObject = cookieStringToObject(context.ctx.req?.headers.cookie);
    
    const { store } = context.ctx;
    const { isLogged } = store.getState().user;
    try{
        if (!isLogged && cookieObject.access_token) {
            axios.defaults.headers.cookie = cookieObject.access_token;
            
           //const { data } = await meAPI();
           const { data } = await axios.get("/api/auth/me");

            store.dispatch(userActions.setLoggedUser(data));
        }
    }catch (e) {
        console.log(e);
    }
    
    return { ...appInitialProps };
};

export default wrapper.withRedux(app);