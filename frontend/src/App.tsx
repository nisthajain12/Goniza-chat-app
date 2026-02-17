import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import StartPage from "./pages/StartPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ProfileDetails from "./pages/ProfileDetails";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile-details" element={<ProfileDetails />} />

      </Routes>
    </Router>
  );
}

export default App;
