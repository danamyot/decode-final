import { Provider } from "react-redux";
import React from "react";
import withRedux from "next-redux-wrapper";
import store from "../redux/store";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function MyApp({ Component, pageProps, store }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />;
    </Provider>
  );
}

MyApp.getInitialProps = async function({ Component, ctx }) {
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};
  return { pageProps: pageProps };
};

const makeStore = () => store;

export default withRedux(makeStore)(MyApp);
