import "./App.css";
import { React } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//#region Importing Components
import HomePage from "./pages/Home";
import Footer from "./components/Footer";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import BrowsePage from "./pages/BrowsePage";
import UserProfile from "./pages/UserProfilePage";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import MessagesTab from "./components/profile/tabs/MessagesTab";
import { NextUIProvider } from "@nextui-org/react";
//#endregion

const App = () => {
  return (
    <Router>
      <NextUIProvider theme="light">
        <div className="light App">
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<HomePage />} />
            {/* Registration Route */}

            {/* <Route path="/register" element={<Registration />} />{" "} */}

            {/* The Browse Route*/}
            <Route path="/browse" element={<BrowsePage />} />
            {/* The login form */}

            {/* <Route path="/login" element={<Login />} /> */}

            {/* Usesr profile page */}
            <Route path="/user" element={<UserProfile />} />

            {/* Messages */}
            <Route path="/messages" element={<MessagesTab />} />

            {/* The Item Details Page */}
            <Route path="/item" element={<ItemDetailsPage />} />
          </Routes>
          <Footer /> {/* Footer with important information */}
        </div>
      </NextUIProvider>
    </Router>
  );
};

export default App;
