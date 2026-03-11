import Navbar from "../components/Navbar";
import { socket } from "../socket";

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
  ListItemButton,
  Button,
  Checkbox
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../services/authService";
import {
  createConnection,
  getInvitationApi,
  getAcceptedConnectionsApi
} from "../services/connection";

const Home = () => {
  const { token, user } = useContext(AuthContext);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [invitations, setInvitations] = useState<any[]>([]);
  const [showInvitations, setShowInvitations] = useState(false);

  const [acceptedConnections, setAcceptedConnections] = useState<any[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [showParticipantSelection, setShowParticipantSelection] =
    useState(false);

  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState<any[]>([]);
  const [showRooms, setShowRooms] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] =
    useState<"success" | "error">("success");


  const [connectionStatus, setConnectionStatus] = useState<
    "none" | "sent" | "exists"
  >("none");

  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  console.log("AuthContext user:", user);

  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await api.get(
          `/profile/search?query=${search}`
        );
        setSearchResults(res.data);
      } catch {
        setSearchResults([]);
      }
    };

    fetchUsers();
  }, [search]);

  useEffect(() => {
    if (!token) return;

    const fetchInvitations = async () => {
      try {
        const res = await getInvitationApi();
        setInvitations(res.invitations || []);
      } catch {
        setInvitations([]);
      }
    };
    const fetchRooms = async () => {
      try {
        const res = await api.get("/room/myRooms");
        setRooms(res.data.rooms || []);
      } catch {
        setRooms([]);
      }
    };

    fetchRooms();

    fetchInvitations();
  }, [token]);

  useEffect(() => {

    socket.off("receive_message");

    socket.on("receive_message", (message) => {

      const formattedMessage = {
        ...message,
        senderId: message.senderId?.toString(),
        senderName: message.senderName || user?.name
      };

      setMessages((prev) => [...prev, formattedMessage]);

    });

  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //  RESET CONNECTION STATUS WHEN USER CHANGES
  useEffect(() => {
    if (selectedUser) {
      setConnectionStatus("none");
    }
  }, [selectedUser]);

  const fetchAcceptedConnections = async () => {
    try {
      const res = await getAcceptedConnectionsApi();
      setAcceptedConnections(res.connections || []);
      setShowParticipantSelection(true);
    } catch {
      setAcceptedConnections([]);
    }
  };

  //inital function
  const getInitials = (name: string) => {
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

  const handleToggleParticipant = (userId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateRoom = async () => {
    if (!roomName || selectedParticipants.length === 0) return;

    try {
      await api.post("/room/createRoom", {
        participants: selectedParticipants,
        roomName
      });

      setSnackbarMessage("Group created successfully");
      setSnackbarType("success");
      setSnackbarOpen(true);

      setShowParticipantSelection(false);
      setSelectedParticipants([]);
      setRoomName("");
    } catch {
      setSnackbarMessage("Failed to create group");
      setSnackbarType("error");
      setSnackbarOpen(true);
    }
  };

  const handleRespond = async (
    connectionId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      await api.patch(
        `/connection/respondToInvitation/${connectionId}`,
        { status }
      );

      setInvitations((prev) =>
        prev.filter((inv) => inv._id !== connectionId)
      );

      setSnackbarMessage(
        status === "accepted"
          ? "Connection accepted"
          : "Connection rejected"
      );
      setSnackbarType("success");
      setSnackbarOpen(true);
    } catch {
      setSnackbarMessage("Failed to respond");
      setSnackbarType("error");
      setSnackbarOpen(true);
    }
  };

  const handleSendConnection = async () => {
    if (!selectedUser) return;

    try {
      await createConnection({
        receiverId: selectedUser.user,
        message: "Let's connect!"
      });

      setConnectionStatus("sent");

      setSnackbarMessage("Connection request sent");
      setSnackbarType("success");
      setSnackbarOpen(true);

    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Something went wrong";

      if (message === "Connection already exists") {
        setConnectionStatus("exists");
      }

      setSnackbarMessage(message);
      setSnackbarType("error");
      setSnackbarOpen(true);
    }
  };
  const handleRoomClick = (room: any) => {
    setSelectedRoom(room);
    setSelectedUser(null);

    fetchMessages(room._id);
    socket.emit("join_room", room._id);
  };
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedRoom) return;

    try {
      await api.post("/message/send", {
        roomId: selectedRoom._id,
        body: messageInput
      });



      setMessageInput("");
    } catch {
      setSnackbarMessage("Failed to send message");
      setSnackbarType("error");
      setSnackbarOpen(true);
    }
  };
  const fetchMessages = async (roomId: string) => {
    try {
      const res = await api.get(`/message/room/${roomId}`);
      setMessages(res.data.messages || []);
    } catch {
      setMessages([]);
    }
  };

  const loggedUserId = user?.user?.toString();

  return (
    <>
      <Navbar />

      <Box
        display="flex"
        sx={{
          height: "calc(100vh - 64px)"
        }}
      >
        {/* Sidebar */}
        <Box width={300}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              px: 1,
              pt: 1
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              {!showParticipantSelection && (
                <>
                  <TextField
                    placeholder="Search users..."
                    size="small"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <IconButton onClick={fetchAcceptedConnections}>
                    <AddIcon />
                  </IconButton>
                </>
              )}

              {showParticipantSelection && (
                <Typography fontWeight="bold">
                  Select Participants
                </Typography>
              )}
            </Box>

            <Divider />

            {/* Search Results */}
            {searchResults.length > 0 && (
              <Box>
                <Typography variant="body2" sx={{ px: 1, mt: 1, fontWeight: "bold" }}>
                  Search Results
                </Typography>

                <List>
                  {searchResults.map((user) => (
                    <ListItemButton
                      key={user.user}
                      onClick={() => setSelectedUser(user)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#1976d2", fontWeight: 600 }}>
                          {getInitials(user.name)}
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText primary={user.name} />
                    </ListItemButton>
                  ))}
                </List>

                <Divider />
              </Box>
            )}

            {/* PARTICIPANT SELECTION MODE */}
            {showParticipantSelection ? (
              <>
                <Box flex={1} overflow="auto">
                  {acceptedConnections.length === 0 ? (
                    <Typography
                      variant="body2"
                      sx={{ textAlign: "center", mt: 2 }}
                    >
                      No accepted connections
                    </Typography>
                  ) : (
                    <List>
                      {acceptedConnections.map((user) => (
                        <ListItemButton
                          key={user.userId}
                          onClick={() =>
                            handleToggleParticipant(user.userId)
                          }
                        >
                          <ListItemAvatar>
                            <Avatar>
                              {user.name?.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>

                          <ListItemText primary={user.name} />

                          <Checkbox
                            checked={selectedParticipants.includes(
                              user.userId
                            )}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  )}
                </Box>

                <Divider />

                <Box p={1}>
                  <TextField
                    placeholder="Enter room name"
                    size="small"
                    fullWidth
                    value={roomName}
                    onChange={(e) =>
                      setRoomName(e.target.value)
                    }
                    sx={{ mb: 1 }}
                  />

                  <Box display="flex" gap={1}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => {
                        setShowParticipantSelection(false);
                        setSelectedParticipants([]);
                      }}
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="contained"
                      fullWidth
                      disabled={
                        selectedParticipants.length === 0 ||
                        !roomName
                      }
                      onClick={handleCreateRoom}
                    >
                      Create
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
              <>
                <Box mt={1}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{
                      cursor: "pointer",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "#f5f5f5"
                      }
                    }}
                    onClick={() =>
                      setShowInvitations(!showInvitations)
                    }
                  >
                    <Typography fontWeight="bold">
                      Invitations
                    </Typography>
                    <Typography>
                      {showInvitations ? "▲" : "▼"}
                    </Typography>
                  </Box>

                  {showInvitations &&
                    (invitations.length === 0 ? (
                      <Typography
                        variant="body2"
                        sx={{
                          textAlign: "center",
                          mt: 1,
                          color: "gray"
                        }}
                      >
                        No pending invitations
                      </Typography>
                    ) : (
                      invitations.map((invite) => (
                        <Box
                          key={invite._id}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          p={1}
                        >
                          <Typography variant="body2">
                            {invite.senderName}
                          </Typography>

                          <Box display="flex" gap={1}>
                            <Button
                              size="small"
                              color="success"
                              variant="contained"
                              onClick={() =>
                                handleRespond(
                                  invite._id,
                                  "accepted"
                                )
                              }
                            >
                              Accept
                            </Button>

                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              onClick={() =>
                                handleRespond(
                                  invite._id,
                                  "rejected"
                                )
                              }
                            >
                              Reject
                            </Button>
                          </Box>
                        </Box>
                      ))
                    ))}
                </Box>
                <Box mt={1}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{
                      cursor: "pointer",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "#f5f5f5"
                      }
                    }}
                    onClick={() => setShowRooms(!showRooms)}
                  >
                    <Typography fontWeight="bold">
                      Chats
                    </Typography>
                    <Typography>
                      {showRooms ? "▲" : "▼"}
                    </Typography>
                  </Box>

                  {showRooms &&
                    (rooms.length === 0 ? (
                      <Typography
                        variant="body2"
                        sx={{ textAlign: "center", mt: 1, color: "gray" }}
                      >
                        No chats yet
                      </Typography>
                    ) : (
                      <List>
                        {rooms.map((room) => (
                          <ListItemButton
                            key={room._id}
                            selected={selectedRoom?._id === room._id}
                            onClick={() => handleRoomClick(room)}
                            sx={{
                              borderRadius: 2,
                              mx: 1,
                              my: 0.5,
                              transition: "0.2s",
                              "&.Mui-selected": {
                                backgroundColor: "#e3f2fd"
                              }
                            }}
                          >
                            <ListItemText
                              primary={room.displayName}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    ))}
                </Box>
              </>
            )}
          </Card>
        </Box>

        {/* Chat Section */}
        <Box flex={1}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {/* HEADER */}
            <Box
              p={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom="1px solid #eee"
            >
              <Box display="flex" alignItems="center" gap={2}>
                {(selectedUser || selectedRoom) && (
                  <Box position="relative">
                    <Avatar sx={{ bgcolor: "#1976d2", fontWeight: 600 }}>
                      {selectedUser
                        ? getInitials(selectedUser.name)
                        : selectedRoom
                          ? getInitials(selectedRoom.displayName)
                          : ""}
                    </Avatar>

                    {/* Online dot */}
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "green",
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        border: "2px solid white"
                      }}
                    />
                  </Box>
                )}

                <Box>
                  <Typography fontWeight="bold">
                    {selectedUser
                      ? selectedUser.name
                      : selectedRoom
                        ? selectedRoom.displayName
                        : "Select a user"}
                  </Typography>

                  {(selectedUser || selectedRoom) && (
                    <Typography variant="caption" color="gray">
                      Online
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Personal Chat (search user) */}
              {selectedUser && connectionStatus === "none" && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSendConnection}
                >
                  Connect
                </Button>
              )}

              {selectedUser && connectionStatus === "sent" && (
                <Button variant="outlined" size="small" disabled>
                  Request Sent
                </Button>
              )}

              {selectedUser && connectionStatus === "exists" && (
                <Button variant="outlined" size="small" disabled>
                  Connection Exists
                </Button>
              )}

              {/* Personal Room → Block */}
              {selectedRoom && selectedRoom.roomType === "personal" && (
                <IconButton>
                  <BlockIcon />
                </IconButton>
              )}

              {/* Group Room → Edit + Add */}
              {selectedRoom && selectedRoom.roomType === "group" && (
                <Box>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                  <IconButton>
                    <GroupAddIcon />
                  </IconButton>
                </Box>
              )}
            </Box>

            {/* MESSAGE AREA (SCROLLABLE ONLY HERE) */}
            <Box
              flex={1}
              overflow="auto"
              p={2}
              sx={{
                backgroundColor: "#f5f7fb",
                display: "flex",
                flexDirection: "column",
                gap: 1
              }}
            >
              {messages.map((msg) => {

                console.log("Message sender:", msg.senderId);
                console.log("Logged user:", loggedUserId);

                const isSender =
                  String(msg.senderId) === String(loggedUserId);

                return (
                  <Box
                    key={msg._id}
                    sx={{
                      display: "flex",
                      justifyContent: isSender ? "flex-end" : "flex-start",
                      mb: 1
                    }}
                  >

                    <Box
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        maxWidth: "65%",
                        wordBreak: "break-word",
                        backgroundColor: isSender ? "#1976d2" : "#f1f3f5",
                        color: isSender ? "white" : "#222"
                      }}
                    >

                      {!isSender && (
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 600 }}
                        >
                          {msg.senderName}
                        </Typography>
                      )}

                      <Typography variant="body2">
                        {msg.body}
                      </Typography>

                    </Box>

                  </Box>
                );
              })}
              <div ref={messagesEndRef} />

            </Box>

            {/* MESSAGE INPUT BAR */}
            {(selectedUser || selectedRoom) && (
              <Box
                p={2}
                display="flex"
                alignItems="center"
                gap={1}
                borderTop="1px solid #eee"
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <IconButton>
                  <AttachFileIcon />
                </IconButton>
                <IconButton color="primary" onClick={handleSendMessage}>
                  <SendIcon />
                </IconButton>
              </Box>
            )}
          </Card>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <Alert
          severity={snackbarType}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Home;