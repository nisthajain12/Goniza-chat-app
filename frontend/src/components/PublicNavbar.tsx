import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const PublicNavbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        background: "white",
        color: "#0d1b2a"
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>

        {/* Logo */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <ChatBubbleOutlineIcon sx={{ color: "#1976d2" }} />
          <Typography fontWeight="bold">
            GONIZA
          </Typography>
        </Box>

        {/* Buttons */}
        <Box display="flex" gap={2}>

          <Button
            sx={{ color: "#0d1b2a" }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </Button>

        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default PublicNavbar;
