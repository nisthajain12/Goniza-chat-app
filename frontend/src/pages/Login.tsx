import {
  Button,
  TextField,
  Typography,
  Box,
  Snackbar,
  Alert,
  Card,
  Link
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";


import bgImage from "../assets/login-bg.png"; // <-- YOUR IMAGE
import bgTmageLeft from "../assets/login-bg-f.png"
import { lightBlue } from "@mui/material/colors";

const Login = () => {

  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] =
    useState<"success" | "error">("error");

  const [showRegisterBtn, setShowRegisterBtn] = useState(false);

  // -------------------
  // LOGIN HANDLER
  // -------------------

  const handleLogin = async () => {
    try {

      if (!email || !password) {
        setSnackbarMessage("All fields are required");
        setSnackbarType("error");
        setSnackbarOpen(true);
        return;
      }

      const data = await loginUser(email, password);

      // Save JWT token
      setToken(data.token);
      console.log(data.token,"this is token");

      setSnackbarMessage("Login Successful ✅");
      setSnackbarType("success");
      setSnackbarOpen(true);

      setTimeout(() => {
        navigate("/home");
      }, 1000);

    } catch (err: any) {

      const msg = err.response?.data?.message || "Login failed";

      setSnackbarMessage(msg);
      setSnackbarType("error");
      setSnackbarOpen(true);

      if (msg === "User not found") {
        setShowRegisterBtn(true);
      } else {
        setShowRegisterBtn(false);
      }
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      bgcolor="#60e1fa"
    >

      {/* LEFT BRAND SIDE */}
      
      <Box
        flex={1}
        display={{ xs: "none", md: "flex" }}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        
        bgcolor="white"
        sx={{
          backgroundImage: ` url(${bgTmageLeft})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >

        <ChatBubbleOutlineIcon
          sx={{ fontSize: 80, color: "#1976d2" }}
        />

        <Typography
          variant="h3"
          fontWeight="bold"
          mt={2}
        >
          GONIZA
        </Typography>

        <Typography
          color="text.secondary"
          mt={1}
        >
          Smart Real-Time Chat Platform
        </Typography>

      </Box>

      {/* RIGHT LOGIN FORM */}
      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundImage: ` url(${bgTmageLeft})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >

        <Card
          sx={{
            width: 380,
            p: 4,
            borderRadius: 3,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
          }}
        >

          <Typography
            variant="h5"
            fontWeight="bold"
            mb={2}
          >
            Login
          </Typography>

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleLogin}
          >
            Login
          </Button>

          {/* REGISTER LINK */}
          <Box mt={2} textAlign="center">

            <Typography variant="body2">
              Don't have an account?{" "}
              <Link
                component="button"
                underline="hover"
                onClick={() => navigate("/signup")}
                sx={{ fontWeight: "bold" }}
              >
                Register here
              </Link>
            </Typography>

          </Box>

        </Card>

      </Box>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbarType}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default Login;
