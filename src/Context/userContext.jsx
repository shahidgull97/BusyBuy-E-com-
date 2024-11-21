import { createContext, useContext, useState } from "react";
import { auth } from "../Config/firebasedb";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";

// Create the context
const userContext = createContext();

// Create the context provider component
const UserDetails = ({ children }) => {
  const [isLoggedIN, setIsLoggedIn] = useState(false); // Example state

  // logout function
  const signOutUser = async () => {
    try {
      await signOut(auth);
      toast.success("User Signout Successfull");
      setIsLoggedIn(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <userContext.Provider value={{ isLoggedIN, setIsLoggedIn, signOutUser }}>
      {children}
    </userContext.Provider>
  );
};

// Custom hook to use the context
const useDetails = () => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useDetails must be used within a UserDetails Provider");
  }
  return context;
};

export { useDetails, UserDetails };
