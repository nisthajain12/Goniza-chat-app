import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  TextField,
  Avatar,
  Snackbar,
  Alert
} from "@mui/material";

import { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { api } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

type UserProfile = {
  name: string;
  phone: string;
  photo: string;
  address: string;
  pincode: string;
};

const emptyProfile: UserProfile = {
  name: "",
  phone: "",
  photo: "",
  address: "",
  pincode: ""
};

const ProfileDetails = () => {

  const { token, setProfileComplete } = useContext(AuthContext);

  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [isNewUser, setIsNewUser] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarType, setSnackbarType] =
    useState<"success" | "error">("success");

  const fetchProfile = async () => {
    try {

      const res = await api.get("/profile/me");

      if (!res.data.profile) {
        setProfile(emptyProfile);
        setIsNewUser(true);
        setEditMode(true);
        setProfileComplete(false);
        return;
      }

      setProfile({
        ...res.data.profile,
        phone: String(res.data.profile.phone ?? ""),
        pincode: String(res.data.profile.pincode ?? "")
      });

      setIsNewUser(false);
      setEditMode(false);
      setProfileComplete(true);

    } catch {
      setProfile(emptyProfile);
      setIsNewUser(true);
      setEditMode(true);
      setProfileComplete(false);
    }
  };
  // fetching profile on load
  useEffect(() => {
    if (!token) return;

    fetchProfile();
  }, [token, fetchProfile]);



  // creating profile
  const handleCreateProfile = async () => {
    try {

      await api.post("/profile/save", profile);

      setSnackbarMsg("Profile created successfully");
      setSnackbarType("success");
      setSnackbarOpen(true);

      setIsNewUser(false);
      setEditMode(false);
      setProfileComplete(true);

    } catch {
      setSnackbarMsg("Profile creation failed");
      setSnackbarType("error");
      setSnackbarOpen(true);
    }
  };

  // updating profile
  const handleUpdateProfile = async () => {
    try {

      await api.put("/profile/update", profile);

      setSnackbarMsg("Profile updated successfully");
      setSnackbarType("success");
      setSnackbarOpen(true);

      setEditMode(false);
      setProfileComplete(true);

    } catch {
      setSnackbarMsg("Update failed");
      setSnackbarType("error");
      setSnackbarOpen(true);
    }
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
    <>
      <Navbar />

      <Container maxWidth="sm">
        <Box mt={4}>
          <Card elevation={5}>
            <CardContent>

              <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                <Avatar
                  src={profile.photo || undefined}
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: 32,
                    fontWeight: 600,
                    bgcolor:
                      profile.photo
                        ? undefined
                        : profile.name
                          ? stringToColor(profile.name)
                          : "#1976d2"
                  }}
                >
                  {!profile.photo && getInitials(profile.name)}
                </Avatar>

                <Typography variant="h5" fontWeight="bold">
                  Profile Details
                </Typography>

                {editMode && (
                  <Box width="100%" display="flex" flexDirection="column" gap={2} mt={2}>

                    <TextField
                      label="Name"
                      required
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />

                    <TextField
                      label="Phone"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                    />

                    <TextField
                      label="Photo URL"
                      value={profile.photo}
                      onChange={(e) =>
                        setProfile({ ...profile, photo: e.target.value })
                      }
                    />

                    <TextField
                      label="Address"
                      value={profile.address}
                      onChange={(e) =>
                        setProfile({ ...profile, address: e.target.value })
                      }
                    />

                    <TextField
                      label="Pincode"
                      value={profile.pincode}
                      onChange={(e) =>
                        setProfile({ ...profile, pincode: e.target.value })
                      }
                    />

                    <Button
                      variant="contained"
                      disabled={profile.name.trim().length < 3}
                      onClick={
                        isNewUser
                          ? handleCreateProfile
                          : handleUpdateProfile
                      }
                    >
                      Save Profile
                    </Button>

                  </Box>
                )}

                {!editMode && !isNewUser && (
                  <Box width="100%" mt={2}>
                    <Typography><b>Name:</b> {profile.name}</Typography>
                    <Typography><b>Phone:</b> {profile.phone}</Typography>
                    <Typography><b>Address:</b> {profile.address}</Typography>
                    <Typography><b>Pincode:</b> {profile.pincode}</Typography>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => setEditMode(true)}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                )}

              </Box>

            </CardContent>
          </Card>
        </Box>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbarType}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProfileDetails;