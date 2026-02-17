import Navbar from "../components/Navbar";

import {
  Box,
  Card,
  Typography,
  List,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  IconButton,
  Divider,
  Paper,
  ListItemButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItem,
  ListItemSecondaryAction,
  Menu,
  MenuItem

} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

import socket from "../services/socket";
import { createConnection, getInvitationApi } from "../services/connection";



const Home = () => {
  const { token } = useContext(AuthContext);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [myProfile, setMyProfile] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [showWarning, setShowWarning] = useState(false);

  // 🔥 SOCKET MESSAGE STATES
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  //this is for list of invitation list 
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [invitations, setInvitations] = useState<any[]>([]);



  const getId = (id: any) => id?.toString();


  // -------------------------
  // CHECK PROFILE
  // -------------------------
  useEffect(() => {
    const checkProfile = async () => {
      if (!token) return;
      try {
        const res = await axios.get(
          "http://localhost:5000/api/profile/me",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setMyProfile(res.data.profile);

        if (res.data.profileComplete === false) {
          setShowWarning(true);
        } else {
          setShowWarning(false);
        }

      } catch (error) {
        setShowWarning(true);
        setMyProfile(null);
      }
    };

    if (token) {
      checkProfile();
    }
  }, [token]);

  // -------------------------
  // 🔥 SOCKET CONNECT & JOIN
  // -------------------------
  useEffect(() => {
    if (!myProfile?.userId) return;

    socket.connect();
    socket.emit("join", myProfile.userId);

    return () => {
      socket.disconnect();
    };
  }, [myProfile]);

  // -------------------------
  // 🔥 RECEIVE MESSAGES
  // -------------------------
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          senderId: data.senderId,
          text: data.message
        }
      ]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  //connection create
  const sendRequest = async (id: string) => {
    console.log(id, "this is id")
    const payload = {
      receiverId: id,
      status: "pending",
      message: "hello, hi"
    }
    if (!token) return;


    try {
      const res = await createConnection(payload, token)

    } catch (error) {
      console.log(error)
    }
  }

  //invitation list 
  const invitationList = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    if(!token) return;
    try {
      const res = await getInvitationApi(token)
      setInvitations(res.data.invitations || []);


    } catch (error) {
      console.log(error)
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //CREATE ROOM
  

  // -------------------------
  // SEARCH USERS
  // -------------------------
  useEffect(() => {
    const fetchUsers = async () => {
      if (!search.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5000/api/profile/search?query=${search}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setSearchResults(res.data);
      } catch (error) {
        setSearchResults([]);
      }
    };

    fetchUsers();
  }, [search, token]);

  // -------------------------
  // 🔥 SEND MESSAGE
  // -------------------------
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    if (!selectedUser?.userId) {
      console.error("Receiver userId missing");
      return;
    }
    if (!myProfile?.userId) {
      console.error("Sender userId missing");
      return;
    }


    socket.emit("sendMessage", {
      senderId: getId(myProfile.userId),
      receiverId: getId(selectedUser.userId),
      message: newMessage
    });

    setMessages((prev) => [
      ...prev,
      {
        senderId: getId(myProfile.userId),
        text: newMessage
      }
    ]);

    setNewMessage("");
  };

  return (
    <>
      <Navbar />

      {/* MAIN CONTAINER */}
      <Box
        display="flex"
        minHeight="calc(100vh - 64px)"
        overflow="hidden"
      >

        {/* SIDEBAR */}
        <Box width={300} >
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <TextField
              placeholder="Search users..."
              size="small"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={
                invitationList
              }
              sx={{
                mb: 1,
                backgroundColor: "#1976d2",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "#115293"
                }
              }}
            >
              Invitations
            </Button>
            <Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleClose}
>
  {invitations.length === 0 ? (
    <MenuItem>No Invitations</MenuItem>
  ) : (
    invitations.map((invite) => (
      <MenuItem key={invite._id} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        
        <Box display="flex" alignItems="center" width="100%">
          <ListItemAvatar>
            <Avatar src={invite.senderId?.photo}>
              {invite.senderId?.name?.charAt(0)}
            </Avatar>
          </ListItemAvatar>

          <ListItemText primary={invite.senderId?.name || "Unknown User"} />
        </Box>

        <Box display="flex" gap={1} mt={1}>
          <Button
            size="small"
            variant="contained"
            color="success"
            // onClick={createRoom}
          >
            Accept
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="error"
          >
            Reject
          </Button>
        </Box>

      </MenuItem>
    ))
  )}
</Menu>


            <Divider />

            <Box flex={1} overflow="auto">
              <List>
                {searchResults.length > 0 ? (
                  searchResults.map((user) => {
                    console.log(user)
                    return (
                      <ListItemButton
                        key={user._id}
                        onClick={() => {
                          setSelectedUser(user);
                          setMessages([]);
                          sendRequest(user.userId);
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar src={user.photo}>
                            {user.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={user.name} />
                      </ListItemButton>
                    )

                  })
                ) : (
                  <Typography
                    variant="body2"
                    align="center"
                    mt={2}
                    color="text.secondary"
                  >
                    Search users to start chat
                  </Typography>
                )}
              </List>
            </Box>
          </Card>
        </Box>

        {/* CHAT AREA */}
        <Box flex={1} >
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {/* HEADER */}
            <Box p={2}>
              <Typography variant="h6" fontWeight="bold">
                {selectedUser
                  ? getId(selectedUser.userId) === getId(myProfile?.userId)
                    ? `${selectedUser.name} (me)`
                    : selectedUser.name
                  : "Select a user"}
              </Typography>

              <Divider />
            </Box>

            {/* MESSAGES */}
            <Box
              flex={1}
              px={2}
              overflow="auto"
              display="flex"
              flexDirection="column"

            >
              {selectedUser ? (
                messages.length > 0 ? (
                  messages.map((msg, idx) => (
                    <Paper
                      key={idx}
                      sx={{
                        p: 1.5,
                        maxWidth: "60%",
                        alignSelf:
                          msg.senderId === myProfile?.userId
                            ? "flex-end"
                            : "flex-start"
                      }}
                    >
                      {msg.text}
                    </Paper>
                  ))
                ) : (
                  <Paper sx={{ p: 2, color: "#666" }}>
                    Start chatting with {selectedUser.name}
                  </Paper>
                )
              ) : (
                <Paper sx={{ p: 2, color: "#666" }}>
                  Your chats will be displayed here
                </Paper>
              )}
            </Box>

            {/* INPUT BAR — ALWAYS VISIBLE */}
            <Box
              p={1}
              display="flex"
              alignItems="center"
              gap={1}
              borderTop="1px solid #e0e0e0"
              flexShrink={0}
            >
              <IconButton>
                <AttachFileIcon />
              </IconButton>

              <TextField
                fullWidth
                placeholder="Type a message..."
                size="small"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />

              <IconButton>
                <EmojiEmotionsIcon />
              </IconButton>

              <IconButton color="primary" onClick={handleSendMessage}>
                <SendIcon />
              </IconButton>
            </Box>
          </Card>
        </Box>
      </Box>
      


      {/* WARNING */}
      <Snackbar
        open={showWarning}
        autoHideDuration={5000}
        onClose={() => setShowWarning(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="warning">
          Please complete your profile details
        </Alert>
      </Snackbar>
    </>
  );
};

export default Home;

