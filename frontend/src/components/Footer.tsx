import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        background: "#f1f4f9",
        py: 3,
        mt: 6
      }}
    >
      <Typography
        align="center"
        color="text.secondary"
        fontSize={14}
      >
        © {new Date().getFullYear()} Goniza — Smart Chat Platform. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
