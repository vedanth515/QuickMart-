// AppContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";
import { useCookies } from 'react-cookie';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

    const [cookies, setCookie] = useCookies(['token']);
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState({});
    const [isUserLoaded, setIsUserLoaded] = useState(false);
    const [orders, setOrders] = useState([]);

    // Fetch user
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/is-auth', {
                headers: { Authorization: `Bearer ${cookies.token}` }
            });
            if (data.success) {
                setUser(data.user);
                setCartItems(data.user.cartItems);
            } else {
                setUser(null);
                setCartItems({});
            }
        } catch (error) {
            console.log('fetchUser error:', error.message);
            setUser(null);
            setCartItems({});
        } finally {
            setIsUserLoaded(true);
        }
    };

    // Fetch seller (optional — you can comment this)
    const fetchSeller = async () => {
        try {
            const { data } = await axios.get('/api/seller/is-auth', {
                headers: { Authorization: `Bearer ${cookies.token}` }
            });
            if (data.success) {
                setIsSeller(true);
            } else {
                setIsSeller(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    // Fetch all products
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/product/list');
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Cart logic
    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success("Added to Cart");
    };

    const updateCartItems = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("Cart Updated");
    };

    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }
        setCartItems(cartData);
        toast.success("Removed from Cart");
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const item in cartItems) {
            totalCount += cartItems[item];
        }
        return totalCount;
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0 && itemInfo) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    };

    // Fetch Orders
    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/api/order/user', {
                headers: { Authorization: `Bearer ${cookies.token}` }
            });
            if (data.success) {
                setOrders(data.orders);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Update backend cart when cartItems change
    useEffect(() => {
        const updateCart = async () => {
            try {
                const { data } = await axios.post('/api/cart/update',
                    { cartItems },
                    { headers: { Authorization: `Bearer ${cookies.token}` } }
                );
                if (!data.success) {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        };

        if (user && isUserLoaded) {
            updateCart();
        }
    }, [cartItems, isUserLoaded, user, cookies.token]);

    // Initial load: user + products
    useEffect(() => {
        fetchUser();
        // fetchSeller(); // Optional: comment this if not using seller
        fetchProducts();
    }, [cookies.token]);

    // When user is loaded — fetch orders
    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const value = {
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,
        products,
        currency,
        addToCart,
        updateCartItems,
        removeFromCart,
        cartItems,
        searchQuery,
        setSearchQuery,
        getCartAmount,
        getCartCount,
        axios,
        fetchProducts,
        setCartItems,
        orders,
        fetchOrders
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
