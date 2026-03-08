import Navbar from "../components/Navbar";

import {
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Paper,
  Divider,
  IconButton
} from "@mui/material";

import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import { useEffect, useState } from "react";
import {
  getInvitationApi,
  getAcceptedConnectionsApi
} from "../services/connection";

const Connections = () => {

  const [tab, setTab] = useState(0);

  const [connections, setConnections] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [rejected, setRejected] = useState<any[]>([]);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const accepted = await getAcceptedConnectionsApi();
      const invites = await getInvitationApi();

      setConnections(accepted.connections || []);
      setInvitations(invites.invitations || []);
    } catch {
      console.log("Failed to fetch connections");
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "";

    const words = name.trim().split(" ");

    if (words.length === 1) return words[0][0].toUpperCase();

    return words[0][0].toUpperCase() + words[1][0].toUpperCase();
  };

  const renderList = (data: any[]) => {

    if (data.length === 0) {
      return (
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            mt: 4,
            color: "gray"
          }}
        >
          No users found
        </Typography>
      );
    }

    return (
      <List>
        {data.map((user) => (
          <ListItemButton
            key={user.userId || user._id}
            sx={{
              borderRadius: 2,
              mb: 1,
              px: 2,
              py: 1.5,
              "&:hover": {
                backgroundColor: "#f6f8fb"
              }
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: "#2f6fed",
                  fontWeight: 600
                }}
              >
                {getInitials(user.name || user.senderName)}
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={
                <Typography fontWeight={500}>
                  {user.name || user.senderName}
                </Typography>
              }
            />

            {/* ACTION ICONS */}

            <IconButton size="small">
              <ChatBubbleOutlineIcon fontSize="small" />
            </IconButton>

            <IconButton size="small">
              <PersonOutlineIcon fontSize="small" />
            </IconButton>

          </ListItemButton>
        ))}
      </List>
    );
  };

  return (
    <>
      <Navbar />

      <Box
        maxWidth={1100}
        mx="auto"
        mt={3}
        px={2}
      >

        {/* PAGE TITLE */}
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={3}
        >
          Connections
        </Typography>

        {/* DASHBOARD ROW */}
        <Box
          display="flex"
          gap={3}
          flexWrap="wrap"
        >

          {/* ACTIVITY CARD */}
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              width: 260,
              height: "fit-content"
            }}
          >
            <Typography
              fontWeight="bold"
              mb={2}
            >
              Connection Activity
            </Typography>

            <Box
              display="flex"
              justifyContent="space-between"
              mb={2}
            >
              <Box>
                <Typography
                  variant="body2"
                  color="gray"
                >
                  Total
                </Typography>

                <Typography
                  fontWeight="bold"
                  fontSize={20}
                >
                  {connections.length}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="gray"
                >
                  Pending
                </Typography>

                <Typography
                  fontWeight="bold"
                  fontSize={20}
                >
                  {invitations.length}
                </Typography>
              </Box>
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  variant="body2"
                  color="gray"
                >
                  Rejected
                </Typography>

                <Typography
                  fontWeight="bold"
                  fontSize={20}
                >
                  {rejected.length}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="gray"
                >
                  Last Week
                </Typography>

                <Typography
                  fontWeight="bold"
                  color="green"
                >
                  +1
                </Typography>
              </Box>
            </Box>

          </Paper>

          {/* CONNECTIONS CARD */}

          <Paper
            elevation={2}
            sx={{
              flex: 1,
              borderRadius: 3,
              p: 2
            }}
          >

            <Typography
              fontWeight="bold"
              mb={1}
            >
              Connections
            </Typography>

            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
            >
              <Tab label={`Connections (${connections.length})`} />
              <Tab label={`Invitations (${invitations.length})`} />
              <Tab label={`Rejected (${rejected.length})`} />
            </Tabs>

            <Divider sx={{ mb: 2 }} />

            {tab === 0 && renderList(connections)}
            {tab === 1 && renderList(invitations)}
            {tab === 2 && renderList(rejected)}

          </Paper>

        </Box>

      </Box>
    </>
  );
};

export default Connections;