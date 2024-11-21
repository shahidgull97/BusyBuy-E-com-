import ProductListing from "./Components/Home";
import "./App.css";
import Navbar from "./Components/Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserDetails } from "./Context/userContext";
import SignUpPage from "./Components/SignUp";
import SignInPage from "./Components/SingIn";
import { CartItems } from "./Components/Cart";
import { ProductDetails } from "./Context/ProductContext";
import OrderSummary from "./Components/Orders";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function App() {
  // App routes
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      children: [
        {
          index: true, // This marks the default route
          element: <ProductListing />,
        },
        { path: "/signup", element: <SignUpPage /> },
        { path: "/signin", element: <SignInPage /> },
        { path: "/cart", element: <CartItems /> },
        { path: "/myorders", element: <OrderSummary /> },
      ],
    },
  ]);

  return (
    <>
      <UserDetails>
        <ProductDetails>
          <RouterProvider router={routes} />
          <ToastContainer
            position="top-right" // Default position for notifications
            autoClose={3000} // Automatically close after 3 seconds
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable
            theme="light"
          />
        </ProductDetails>
      </UserDetails>
    </>
  );
}

export default App;
