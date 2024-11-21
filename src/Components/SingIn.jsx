import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { auth } from "../Config/firebasedb";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDetails } from "../Context/userContext";
import { toast } from "react-toastify";

const SignInPage = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useDetails();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // This is a sign function in firestore with inbuild authentication
  const signIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      setIsLoggedIn(true);
      navigate("/");

      toast.success("SignIn Successfull");
    } catch (error) {
      toast.error(error.message);
      console.error("Error signing in:", error.message);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen/2 flex flex-col items-center justify-center bg-white p-6">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-4xl font-semibold text-center text-slate-800 mb-8">
          Sign In
        </h1>

        <form onSubmit={signIn} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 
                       focus:border-transparent transition-all duration-200
                       bg-slate-50"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 
                       focus:border-transparent transition-all duration-200
                       bg-slate-50"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 text-white mt-6 py-3 px-4 rounded-lg
                     hover:bg-purple-600 focus:outline-none focus:ring-2 
                     focus:ring-purple-500 focus:ring-offset-2 transition-colors
                     duration-200 font-medium"
          >
            Sign In
          </button>
        </form>
        <Link to={"/signup"}>
          <h3 className="font-bold text-blue-800 mt-6">or SignUp Instead</h3>
        </Link>
      </div>
    </div>
  );
};

export default SignInPage;
