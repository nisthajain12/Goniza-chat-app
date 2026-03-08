import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext, useEffect } from "react";

import StartPage from "./pages/StartPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ProfileDetails from "./pages/ProfileDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Notifications from "./pages/Notifications";
import { AuthContext } from "./context/AuthContext";
import { api } from "./services/authService";
import Connections from "./pages/Connections";

function App() {

  const { token, setProfileComplete } = useContext(AuthContext);

  useEffect(() => {

    const fetchProfile = async () => {

      if (!token) return;

      try {
        // fetching profile on app load
        const response = await api.get("/profile/me");
        setProfileComplete(response.data.profileComplete);
      } catch {
        setProfileComplete(false);
      }
    };

    fetchProfile();

  }, [token, setProfileComplete]);

  return (
    <Router>
      <Routes>

        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile-details"
          element={
            <ProtectedRoute>
              <ProfileDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/connections" element={<Connections />} />

      </Routes>
    </Router>
  );
}

export default App;