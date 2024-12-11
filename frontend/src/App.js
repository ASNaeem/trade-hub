import "./App.css";
import { React } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//#region Importing Components
import HomePage from "./pages/Home";
import Footer from "./components/Footer";
import Registration from "./pages/Registration"; // Import Registration form
import Login from "./pages/Login";
import BrowsePage from "./pages/BrowsePage";
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
        </Routes>
        <Footer /> {/* Footer with important information */}
      </div>
    </Router>
  );
};

export default App;
