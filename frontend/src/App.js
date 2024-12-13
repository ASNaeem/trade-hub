import "./App.css";
import { React } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//#region Importing Components
import HomePage from "./pages/Home";
import Footer from "./components/Footer";
import Registration from "./pages/Registration"; // Import Registration form
import Login from "./pages/Login";
import BrowsePage from "./pages/BrowsePage";
import UserProfile from "./pages/UserProfile";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import MessagesTab from "./components/profile/tabs/MessagesTab";
//#endregion

const App = () => {
  return (
    <Router>
      <div className="App">
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
    </Router>
  );
};

export default App;
