import "./App.css";
import { React } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//#region Importing Components
import HomePage from "./pages/Home.js";
("./pages/Home");
import Footer from "./components/Footer";
import Registration from "./pages/Registration.js"; // Import Registration form
import Login from "./pages/Login";
//#endregion

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<HomePage />} />
          {/* Registration Route */}
          <Route path="/register" element={<Registration />} />{" "}
          {/* The login form */}
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer /> {/* Footer with important information */}
      </div>
    </Router>
  );
};

export default App;
