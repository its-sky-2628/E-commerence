import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";



import Home
  from "./pages/Home";

import CollectionPage
  from "./pages/Collection";

import ProductDetails
  from "./pages/ProductDetails";

import AboutPage
  from "./pages/About";

import ContactPage
  from "./pages/Contact";

import NotFound
  from "./pages/NotFound";

import ScrollToTop
  from "./components/ScrollToTop/ScrollToTop";


function App() {

  return (

    <BrowserRouter>

      <ScrollToTop />


      <Routes>

        <Route
          path="/"
          element={<Home />}
        />


        <Route
          path="/collection"
          element={
            <CollectionPage />
          }
        />


        <Route
          path="/product/:id"
          element={
            <ProductDetails />
          }
        />


        <Route
          path="/about"
          element={
            <AboutPage />
          }
        />


        <Route
          path="/contact"
          element={
            <ContactPage />
          }
        />


        <Route
          path="*"
          element={
            <NotFound />
          }
        />

      </Routes>

    </BrowserRouter>

  );
}


export default App;