import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent
} from "@mui/material";

import PublicNavbar from "../components/PublicNavbar";
import Footer from "../components/Footer";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";


//

const LandingPage = () => {

  const navigate = useNavigate();
  const socket = io("http://localhost:5000");
socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  console.log("hello");
});

  return (
    <Box sx={{ background: "#ffffff", minHeight: "100vh" }}>

      
      <PublicNavbar />

      
      <Container maxWidth="md">

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          mt={8}
        >

          <ChatBubbleOutlineIcon
            sx={{
              fontSize: 70,
              color: "#1976d2"
            }}
          />

          <Typography
            variant="h3"
            fontWeight="bold"
            mt={2}
          >
            GONIZA
          </Typography>

          <Typography
            variant="body1"
            mt={2}
            color="text.secondary"
            maxWidth="600px"
          >
            Goniza is a smart real-time chat platform designed for fast,
            secure communication and seamless collaboration between users.
          </Typography>

          <Box mt={4} display="flex" gap={2}>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/signup")}
            >
              Start Using Goniza
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>

          </Box>

        </Box>

      </Container>

      
      <Container maxWidth="lg">

        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}
          gap={3}
          mt={7}
        >

          {[
            {
              title: "Real-Time Messaging",
              desc: "Instant communication with responsive chat experience."
            },
            {
              title: "Secure Authentication",
              desc: "JWT based authentication with protected APIs."
            },
            {
              title: "User Profile Management",
              desc: "Personalized profiles with editable user information."
            }
          ].map((item, index) => (

            <Card
              key={index}
              sx={{
                borderRadius: 3,
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
              }}
            >
              <CardContent>

                <Typography variant="h6" fontWeight="bold">
                  {item.title}
                </Typography>

                <Typography
                  variant="body2"
                  mt={1}
                  color="text.secondary"
                >
                  {item.desc}
                </Typography>

              </CardContent>
            </Card>

          ))}

        </Box>

      </Container>

      
      <Footer />

    </Box>
  );
};

export default LandingPage;
