import { React, useEffect, useState } from "react";
import "../styles/Home.css";
import Header from "../components/Header";
import LoginPage from "./Authorization";
import { Search } from "tabler-icons-react";
import {
  Smartphone,
  Car,
  Home,
  Tv,
  Shirt,
  Laptop,
  Dumbbell,
  Book,
  Star,
  MapPin,
  Tag,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const categories = [
  { name: "Electronics", icon: Smartphone },
  { name: "Vehicles", icon: Car },
  { name: "Property", icon: Home },
  { name: "Appliances", icon: Tv },
  { name: "Fashion", icon: Shirt },
  { name: "Computers", icon: Laptop },
  { name: "Sports", icon: Dumbbell },
  { name: "Books", icon: Book },
];

//#region Demo data for testing
const items = [
  {
    id: 1,
    title: "iPhone 13 Pro - Like New",
    price: "$799",
    location: "Downtown",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "Vintage Leather Sofa",
    price: "$450",
    location: "West End",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    title: "Mountain Bike - Premium",
    price: "$350",
    location: "East Side",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    title: "Gaming Console Bundle",
    price: "$280",
    location: "North Area",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=400&q=80",
  },
];
const deals = [
  {
    id: 1,
    title: "MacBook Pro M1",

    discountedPrice: "$999",

    timeLeft: "2 days left",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "Designer Watch Collection",
    discountedPrice: "$399",
    discount: "33% OFF",

    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    title: "4K Smart TV",
    discountedPrice: "$699",
    timeLeft: "3 days left",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80",
  },
];
//#endregion

const HomePage = ({ trending_items, top_deals }) => {
  //#region Functions
  useEffect(() => {
    localStorage.getItem("loggedin") != null
      ? setLoggedIn(true)
      : setLoggedIn(false);

    document
      .getElementsByClassName("login_modal")[0]
      .addEventListener("click", (e) => {
        if (e.target.classList.contains("login_modal")) {
          setisModalOpen(false);
        }
      });
  }, []);
  //#endregion

  //#region Variables
  const [LoggedIn, setLoggedIn] = useState(false);
  const [login_from, setLoginFrom] = useState("login");
  const [isModalOpen, setisModalOpen] = useState(false);
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [categoriesRef, categoriesInView] = useInView({ triggerOnce: true });
  const [trendingRef, trendingInView] = useInView({ triggerOnce: true });
  const [dealsRef, dealsInView] = useInView({ triggerOnce: true });
  //#endregion
  return (
    <main className="bg-gray-50">
      <Header
        user_state={LoggedIn}
        login_clicked={(v) => {
          setLoginFrom(v);
          setisModalOpen(!isModalOpen);
        }}
      />
      {/* Login and registration modal */}
      <div className={`login_modal  ${isModalOpen ? "!flex" : ""}`}>
        <div className={`animate-[comeup_0.1s_ease-in]`}>
          {isModalOpen ? (
            <LoginPage
              from={login_from}
              login_success={() => setLoggedIn(true)}
            />
          ) : (
            ""
          )}
        </div>
      </div>
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="relative h-[600px] bg-gradient-to-r from-[#2C5364] to-[#203A43]"
      >
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center pt-9">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl"
            >
              <span className="block">Trade Hub</span>
              <span className="block text-teal-400">
                Buy and Sell with Confidence
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-6 max-w-xl mx-auto text-xl text-gray-200"
            >
              <h1>
                Your trusted marketplace for buying and selling pre-loved items.
                Join thousands of happy traders in your city.
              </h1>
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-10 max-w-xl mx-auto"
            >
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Search className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-4 border border-transparent rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white shadow-lg
                           transition-all duration-300 ease-in-out"
                  placeholder="Search for items..."
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      {/* Catagories */}
      <motion.div
        ref={categoriesRef}
        initial={{ opacity: 0, y: 20 }}
        animate={categoriesInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Browse Categories
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:grid-cols-8">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={categoriesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex flex-col items-center p-6 rounded-xl hover:bg-gray-50
                           transition-all duration-300 hover:shadow-lg"
                  onClick={() => {
                    window.location.href = `/browse?category=${category.name}`;
                  }}
                >
                  <Icon className="h-10 w-10 text-teal-600 mb-3" />
                  <span className="text-sm font-medium text-gray-900">
                    {category.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
      {/* Tranding Items */}
      <motion.div
        ref={trendingRef}
        initial={{ opacity: 0 }}
        animate={trendingInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="py-16 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Trending Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={trendingInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="cursor-pointer bg-white rounded-xl shadow-sm overflow-hidden
                         hover:shadow-xl transition-all duration-300"
                onClick={() => {
                  window.location.href = `/item?item=${item.title}`;
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xl font-bold text-teal-600">
                    {item.price}
                  </p>
                  <div className="flex items-center mt-3 text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{item.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      {/* Top Deals */}
      <motion.div
        ref={dealsRef}
        initial={{ opacity: 0 }}
        animate={dealsInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Top Deals in Your City
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {deals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={dealsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="cursor-pointer bg-white rounded-xl shadow-sm overflow-hidden
                         hover:shadow-xl transition-all duration-300"
                onClick={() => {
                  window.location.href = `/item?item=${deal.title}`;
                }}
              >
                <div className="relative">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-48 object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {deal.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-teal-600">
                      {deal.discountedPrice}
                    </span>
                  </div>
                  <div className="flex items-center mt-3 text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{deal.timeLeft}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default HomePage;
