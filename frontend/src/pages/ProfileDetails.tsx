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
import axios from "axios";
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
  const auth = useContext(AuthContext);
  if (!auth) return null;

  const { token, setProfileComplete } = auth;

  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [isNewUser, setIsNewUser] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarType, setSnackbarType] =
    useState<"success" | "error">("success");

  // -------------------------
  // FETCH PROFILE
  // -------------------------
  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/profile/me",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProfile({
        ...res.data.profile,
        phone: String(res.data.profile.phone ?? ""),
        pincode: String(res.data.profile.pincode ?? "")
      });

      setIsNewUser(false);
      setEditMode(false);
      setProfileComplete(true); // ✅ profile exists → remove red dot

    } catch (error) {
      // New user → no profile exists
      setProfile(emptyProfile);
      setIsNewUser(true);
      setEditMode(true);
      setProfileComplete(false); // 🔴 show red dot
    }
  };

  // -------------------------
  // CREATE PROFILE
  // -------------------------
  const handleCreateProfile = async () => {
    try {
      const payload = {
        ...profile,
        phone: Number(profile.phone),
        pincode: Number(profile.pincode)
      };

      await axios.post(
        "http://localhost:5000/api/profile/save",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSnackbarMsg("Profile created successfully ✅");
      setSnackbarType("success");
      setSnackbarOpen(true);

      setIsNewUser(false);
      setEditMode(false);
      setProfileComplete(true); // ✅ REMOVE red dot immediately

    } catch (error) {
      setSnackbarMsg("Profile creation failed ❌");
      setSnackbarType("error");
      setSnackbarOpen(true);
    }
  };

  // -------------------------
  // UPDATE PROFILE
  // -------------------------
  const handleUpdateProfile = async () => {
    try {
      const payload = {
        ...profile,
        phone: Number(profile.phone),
        pincode: Number(profile.pincode)
      };

      await axios.put(
        "http://localhost:5000/api/profile/update",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSnackbarMsg("Profile updated successfully ✅");
      setSnackbarType("success");
      setSnackbarOpen(true);

      setEditMode(false);
      setProfileComplete(true); // still complete

    } catch (error) {
      setSnackbarMsg("Update failed ❌");
      setSnackbarType("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Navbar />

      <Container maxWidth="sm">
        <Box mt={4}>
          <Card elevation={5}>
            <CardContent>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
              >
                <Avatar
                  src={profile.photo}
                  sx={{ width: 100, height: 100 }}
                />

                <Typography variant="h5" fontWeight="bold">
                  Profile Details
                </Typography>

                {/* ---------- FORM ---------- */}
                {editMode && (
                  <Box
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    mt={2}
                  >
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

                {/* ---------- VIEW MODE ---------- */}
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

      {/* SNACKBAR */}
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
