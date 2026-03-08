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
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import GroupIcon from "@mui/icons-material/Group";


import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  if (!auth) return null;

  const { token, setToken, profileComplete, user } = auth;

  const handleLogout = () => {
    setToken(null);
    navigate("/");
  };

  const getInitials = (name?: string) => {
    if (!name) return "";

    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    return (
      words[0][0].toUpperCase() +
      words[1][0].toUpperCase()
    );
  };

  const stringToColor = (string: string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 50%)`;
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

          {/* 👥 CONNECTIONS */}
          <IconButton
            color="inherit"
            onClick={() => navigate("/connections")}
          >
            <GroupIcon />
          </IconButton>

          {/* 🔔 NOTIFICATION ICON */}
          <IconButton
            color="inherit"
            onClick={() => navigate("/notifications")}
          >
            <Badge badgeContent={0} color="error">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

          {/* PROFILE */}
          <IconButton onClick={() => navigate("/profile-details")}>
            <Badge
              color="error"
              variant="dot"
              invisible={profileComplete}
            >
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  bgcolor: user?.name
                    ? stringToColor(user.name)
                    : "#1976d2",
                  fontWeight: 600
                }}
              >
                {getInitials(user?.name)}
              </Avatar>
            </Badge>
          </IconButton>

          {/* LOGOUT */}
          <IconButton onClick={handleLogout} color="inherit">
            <LogoutIcon />
          </IconButton>

        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;