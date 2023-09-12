import { Box, Typography } from "@mui/material";
import Link from "@mui/material/Link";

export default function Copyright(props) {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        justfyContent: "center",
        mt: 5,
        gap: 2,
      }}
    >
      <Typography variant="body2" color="primary" align="center" {...props}>
        {"Copyright © "}
        <Link color="primary" href="https://filipeleonelbatista.vercel.app/">
          Desenvolvedor de aplicativos
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        Ver. 1.0.0
      </Typography>
    </Box>
  );
}
