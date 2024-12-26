import "./App.css";
import { React } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";

//#region Importing Components
import HomePage from "./pages/Home";
import Footer from "./components/Footer";
import BrowsePage from "./pages/BrowsePage";
import UserProfile from "./pages/UserProfilePage";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import CreateListingPage from "./pages/CreateListingPage";
import MessagesTab from "./components/profile/tabs/MessagesTab";
import InboxPage from "./pages/InboxPage";
import ContactUsPage from "./pages/ContactUsPage";
import TermsPage from "./pages/TermsOfServicesPage";
import AdminPage from "./pages/AdminPage";
//#endregion

const App = () => {
  return (
    <Router>
      <NextUIProvider theme="light">
        <div className="light App">
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<HomePage />} />
            {/* The Browse Route*/}
            <Route path="/browse" element={<BrowsePage />} />
            {/* Admin Page */}
            <Route path="/admin" element={<AdminPage />} />
            {/* Usesr profile page */}
            <Route path="/user" element={<UserProfile />} />
            {/* Messages */}
            <Route path="/messages" element={<MessagesTab />} />
            {/* The Item Details Page */}
            <Route path="/item" element={<ItemDetailsPage />} />
            {/* The Item Details Page */}
            <Route path="/create_item" element={<CreateListingPage />} />
            {/* {The imbox page} */}
            <Route path="/inbox" element={<InboxPage />} />
            {/* Contact Us Page */}
            <Route path="/contact" element={<ContactUsPage />} />
            {/* Terms of Services Page */}
            <Route path="/terms" element={<TermsPage />} />
          </Routes>
          <Footer /> {/* Footer with important information */}
        </div>
      </NextUIProvider>
    </Router>
  );
};

export default App;
