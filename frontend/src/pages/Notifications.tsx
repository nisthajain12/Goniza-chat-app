import Navbar from "../components/Navbar";

import {
  Box,
  Card,
  Typography,
  List,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemButton,
  IconButton,
  Divider,
  CircularProgress
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { useEffect, useState } from "react";
import { api } from "../services/authService";

const Notifications = () => {

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");

      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.log("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "";

    const words = name.trim().split(" ");

    if (words.length === 1) return words[0][0].toUpperCase();

    return (
      words[0][0].toUpperCase() +
      words[1][0].toUpperCase()
    );
  };

  const getMessage = (notif: any) => {
    switch (notif.action) {
      case "request_sent":
        return "sent you a connection request";
      case "request_accepted":
        return "accepted your request";
      case "request_rejected":
        return "rejected your request";
      default:
        return "did something";
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);

    const diff = Math.floor(
      (now.getTime() - created.getTime()) / 1000
    );

    if (diff < 60) return `${diff} sec ago`;

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;

    const days = Math.floor(hours / 24);
    return `${days} day ago`;
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) =>
      prev.filter((n) => n._id !== id)
    );
  };

  return (
    <>
      <Navbar />

      <Box
        display="flex"
        justifyContent="center"
        mt={3}
      >
        <Card
          sx={{
            width: 650,
            maxWidth: "92%",
            borderRadius: 3,
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            p={2}
          >
            <NotificationsIcon color="primary" />

            <Typography
              variant="h6"
              fontWeight="bold"
            >
              Notifications
            </Typography>
          </Box>

          <Divider />

          {/* Loading */}
          {loading && (
            <Box
              display="flex"
              justifyContent="center"
              p={4}
            >
              <CircularProgress />
            </Box>
          )}

          {/* Empty state */}
          {!loading && notifications.length === 0 && (
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                py: 4,
                color: "gray"
              }}
            >
              No notifications yet
            </Typography>
          )}

          {/* Notification list */}
          {!loading && notifications.length > 0 && (
            <List>
              {notifications.map((notif) => (
                <ListItemButton
                  key={notif._id}
                  sx={{
                    py: 1.5,
                    px: 2,
                    transition: "0.2s",
                    "&:hover": {
                      backgroundColor: "#f5f7fb"
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: "#1976d2",
                        fontWeight: 600
                      }}
                    >
                      {getInitials(notif.name)}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography fontWeight={500}>
                        {notif.name}{" "}
                        {getMessage(notif)}
                      </Typography>
                    }
                    secondary={getTimeAgo(
                      notif.createdAt
                    )}
                  />

                  <IconButton
                    onClick={() =>
                      handleDelete(notif._id)
                    }
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemButton>
              ))}
            </List>
          )}
        </Card>
      </Box>
    </>
  );
};

export default Notifications;