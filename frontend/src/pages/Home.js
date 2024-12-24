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
    originalPrice: "$1299",
    discountedPrice: "$999",
    discount: "23% OFF",
    timeLeft: "2 days left",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "Designer Watch Collection",
    originalPrice: "$599",
    discountedPrice: "$399",
    discount: "33% OFF",
    timeLeft: "1 day left",
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    title: "4K Smart TV",
    originalPrice: "$899",
    discountedPrice: "$699",
    discount: "22% OFF",
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
  //#endregion
  return (
    <main>
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
      <div className="relative h-[600px] bg-gradient-to-r from-[#123456] to-[#83adc2]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556742111-a301076d9d18?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Shopping background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center pt-9">
            <h1 className="text-4xl tracking-tight font-extrabold text-[#F9F9F9] sm:text-5xl md:text-6xl">
              <span className="pt-8">Trade Hub</span>
              <span className="block text-[#E0FFFF]">
                Buy and Sell with Confidence
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Your trusted marketplace for buying and selling pre-loved items.
              Join thousands of happy traders in your city.
            </p>
            <div className="mt-10 max-w-xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search style={{ color: "rgb(156 163 175)" }} />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-4 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83adc2] bg-white bg-opacity-90 placeholder-gray-500"
                  placeholder="Search for items..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Catagories */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Browse Categories
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.name}
                  className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  onClick={() => {
                    window.location.href = `/browse?category=${category.name}`;
                  }}
                >
                  <Icon className="h-8 w-8 text-[#2C2C2C] mb-2" />
                  <span className="text-sm font-medium text-gray-900">
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Tranding Items */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Trending Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200"
                onClick={() => {
                  window.location.href = `/item?item=${item.title}`;
                }}
              >
                <div className="relative h-48">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-xl font-bold text-indigo-600 mt-1">
                    {item.price}
                  </p>
                  <div className="flex items-center mt-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500 ml-1">
                      {item.location}
                    </span>
                    <div className="flex items-center ml-auto">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-500 ml-1">
                        {item.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Top Deals */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Top Deals in Your City
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl duration-200"
                onClick={() => {
                  window.location.href = `/item?item=${deal.title}`;
                }}
              >
                <div className="relative">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                    {deal.discount}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {deal.title}
                  </h3>
                  <div className="flex items-center mt-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500 line-through ml-1">
                      {deal.originalPrice}
                    </span>
                    <span className="text-lg font-bold text-indigo-600 ml-2">
                      {deal.discountedPrice}
                    </span>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {deal.timeLeft}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
