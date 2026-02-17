import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
  Badge
} from "@mui/material";

import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  if (!auth) return null;

  const { token, setToken, profileComplete } = auth;

  const handleLogout = () => {
    setToken(null);
    navigate("/");
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* LEFT */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/home")}
        >
          <ChatBubbleOutlineIcon fontSize="large" />
          <Typography variant="h6" fontWeight="bold">
            Goniza
          </Typography>
        </Box>

        {/* RIGHT */}
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => navigate("/profile-details")}>
            <Badge
              color="error"
              variant="dot"
              invisible={profileComplete}
            >
              <Avatar sx={{ width: 38, height: 38 }} />
            </Badge>
          </IconButton>

          <IconButton onClick={handleLogout} color="inherit">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
