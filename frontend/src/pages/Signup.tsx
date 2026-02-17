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
import { useState } from "react";
import { registerUser } from "../services/authService";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

import bgImage from "../assets/login-bg.png";
import bgTmageLeft from "../assets/login-bg-f.png";

const Signup = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] =
    useState<"success" | "error">("error");

  const [loading, setLoading] = useState(false);

  // -------------------
  // SIGNUP HANDLER
  // -------------------

  const handleSignup = async () => {
    try {

      if (!email || !password) {
        setSnackbarMessage("All fields are required");
        setSnackbarType("error");
        setSnackbarOpen(true);
        return;
      }

      setLoading(true);

      await registerUser(email, password);

      setSnackbarMessage("Registration successful ✅ Redirecting to login page...");
      setSnackbarType("success");
      setSnackbarOpen(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err: any) {

      const msg = err.response?.data?.message || "Signup failed";

      setSnackbarMessage(msg);
      setSnackbarType("error");
      setSnackbarOpen(true);

    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      bgcolor="#60e1fa"
    >

      {/* LEFT BRAND PANEL */}
      <Box
        flex={1}
        display={{ xs: "none", md: "flex" }}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundImage: `url(${bgTmageLeft})`,
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

      {/* RIGHT SIGNUP FORM */}
      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundImage: `url(${bgTmageLeft})`,
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
            Register
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
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

          {/* LOGIN LINK */}
          <Box mt={2} textAlign="center">

            <Typography variant="body2">
              Already have an account?{" "}
              <Link
                component="button"
                underline="hover"
                onClick={() => navigate("/login")}
                sx={{ fontWeight: "bold" }}
              >
                Login here
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

export default Signup;
