import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDetails } from "../Context/userContext";
import { useProduct } from "../Context/ProductContext";

const Navbar = () => {
  const { isLoggedIN, signOutUser } = useDetails();
  const { fetchCartItems, fetchOrders } = useProduct();
  const navigate = useNavigate();
  // Navigating to orders page
  function navOrders() {
    fetchOrders();
    navigate("/myorders");
  }
  return (
    <>
      <nav className="flex items-center justify-between px-3 py-3 shadow-md h-20">
        {/* Left: Logo */}

        <div className="flex text-purple-600 text-xl font-bold ml-10">
          <img src="./images/shopping.png" className=" w-10 h-10" />
          <span className="ml-6">Busy Buy</span>
        </div>

        {/* Middle: Navigation Links */}
        <div className="flex gap-12 mr-12 ">
          <div className="flex items-center gap-4">
            <Link
              to={"/"}
              className="flex items-center gap-2 text-purple-600 font-medium text-lg"
            >
              <img src="./images/house.png" className="text-red-500 w-7 h-7" />
              <span className="hover:text-blue-800 font-bold">Home</span>
            </Link>
          </div>
          {/* navigation items only visible when you are logged in */}
          {isLoggedIN ? (
            <>
              <div className="flex items-center gap-4">
                <div
                  onClick={navOrders}
                  className="flex items-center gap-2 text-purple-600 font-medium text-lg hover:underline"
                >
                  <img src="./images/received.png" className=" w-7 h-7" />
                  <span className="hover:text-blue-800 font-bold">
                    My Orders
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to={"/cart"}
                  className="flex items-center gap-2 text-purple-600 font-medium text-lg hover:underline"
                  onClick={fetchCartItems}
                >
                  <img src="./images/trolley.png" className=" w-7 h-7" />
                  <span className="hover:text-blue-800 font-bold">Cart</span>
                </Link>
              </div>
            </>
          ) : (
            ""
          )}
          {/* Right: Sign In */}
          <div>
            {isLoggedIN ? (
              <Link
                to={"/"}
                className="flex items-center gap-2 text-purple-600 font-medium text-lg hover:underline"
                onClick={signOutUser}
              >
                <img
                  src="./images/logout.png"
                  className="text-gray-600 w-7 h-7"
                  onClick={signOutUser}
                />
                <span className="hover:text-blue-800 font-bold">SignOut</span>
              </Link>
            ) : (
              <Link
                to={"/signin"}
                className="flex items-center gap-2 text-purple-600 font-medium text-lg hover:underline"
              >
                <img
                  src="./images/login.png"
                  className="text-gray-600 w-7 h-7"
                />
                <span className="hover:text-blue-800 font-bold">SignIn</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
