import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../Config/firebasedb";
import { toast } from "react-toastify";

// Create the context
const productContext = createContext();

// Create the context provider component
const ProductDetails = ({ children }) => {
  const [price, setPrice] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState({});
  const [total, setTotal] = useState(0);

  // function to add items to the cart or increase item count if already added
  async function addToCart(Item) {
    const Id = Item.data.id;
    const newItem = cartItems.find((cart) => cart.data.id === Id);
    // if item exists in cart just increse count else add to the cart
    if (newItem) {
      try {
        const itemRef = doc(db, "Cart", newItem.id); // Reference to the document
        await updateDoc(itemRef, {
          Qnt: Number(newItem.Qnt) + 1, // Update Qnt with the incremented value
        }); // Update the specified fields
        console.log(`Cart item with ID ${Item.id} updated`);
        toast.success("Increased Product Quantity");
      } catch (error) {
        console.error("Error updating cart item:", error);
        toast.error(error.message);
      }
    } else {
      try {
        const addToItem = async () => {
          // Add a new document with a generated id.
          const userId = auth.currentUser.uid; // Get the logged-in user's ID
          const item = await addDoc(collection(db, "Cart"), {
            userId, // Include the user's ID
            data: Item.data, // Cart item details
            Qnt: Number(1),
            createdAt: new Date(), // Optional: Timestamp for sorting
          });
          toast.success("Item added to cart");
        };
        addToItem();
        // fetchCartItems();
      } catch (error) {
        toast.error(error.message);
      }
    }
  }

  // function to add orders to the Orders collection
  const addOrder = async () => {
    try {
      const userId = auth.currentUser.uid; // Get the logged-in user's ID
      await addDoc(collection(db, "Orders"), {
        userId,
        orderDate: getCurrentDateTime(),
        items: cartItems,
        totalAmount: price,
        createdAt: serverTimestamp(),
      });
      toast.success("Order added successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  //  Price calculation of total amount in cart
  useEffect(() => {
    function calculatePrice() {
      const newPrice = cartItems.reduce(
        (acc, val) => acc + val.data.price * val.Qnt,
        0
      );
      console.log(newPrice);
      setPrice(newPrice);
    }
    calculatePrice();
  }, [cartItems]);

  // fetching cart items from the database
  const fetchCartItems = async () => {
    try {
      const userId = auth.currentUser.uid; // Get the logged-in user's ID
      const cartQuery = query(
        collection(db, "Cart"),
        where("userId", "==", userId) // Filter by userId
      );

      const unsubscribe = onSnapshot(cartQuery, (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Document ID
          ...doc.data(),
        }));
        setCartItems(items);
      });
      return cartItems;
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to get the current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // function to fetch orders from orders collection
  const fetchOrders = async () => {
    try {
      const userId = auth.currentUser.uid; // Get the logged-in user's ID
      const q = query(collection(db, "Orders"), where("userId", "==", userId));

      const querySnapshot = await getDocs(q);
      //   const orders = {};
      const newOrders = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const orderDate = data.orderDate;

        if (!newOrders[orderDate]) {
          newOrders[orderDate] = [];
        }
        newOrders[orderDate].push({
          items: data.items, // Array of items
          totalAmount: data.totalAmount, // Total amount
        });
      });

      //   return orders; // { "2024-11-17": [...], "2024-11-19": [...] }
      setOrders(newOrders);
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  };

  // function to Remove cart Item
  const removeCartItem = async (Item) => {
    const cartItemId = Item.id;
    const Id = Item.data.id;
    const newItem = cartItems.find((cart) => cart.data.id === Id);
    if (newItem && newItem.Qnt > 1) {
      try {
        const itemRef = doc(db, "Cart", newItem.id); // Reference to the document
        await updateDoc(itemRef, {
          Qnt: Number(newItem.Qnt) - 1, // Update Qnt with the incremented value
        }); // Update the specified fields
        toast.success("Item Removed from the cart");
      } catch (error) {
        console.error("Error updating cart item:", error);
      }
    } else {
      try {
        const itemRef = doc(db, "Cart", cartItemId); // Reference to the document
        await deleteDoc(itemRef);
        toast.success("Item Removed from the cart");
      } catch (error) {
        console.error("Error removing cart item:", error);
      }
    }
  };

  //   function to Clear Cart items when purchased
  const clearUserCart = async () => {
    try {
      const userId = auth.currentUser.uid;
      // Reference to the "Cart" collection
      const cartRef = collection(db, "Cart");

      // Query to find all items for the specific user
      const q = query(cartRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      // Delete each document
      const batchPromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(batchPromises);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <productContext.Provider
      value={{
        addToCart,
        cartItems,
        setCartItems,
        fetchCartItems,
        removeCartItem,
        price,
        clearUserCart,
        addOrder,
        fetchOrders,
        orders,
      }}
    >
      {children}
    </productContext.Provider>
  );
};

// Custom hook to use the context
const useProduct = () => {
  const context = useContext(productContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductDetails Provider");
  }
  return context;
};

export { useProduct, ProductDetails };
