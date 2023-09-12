import { Box, Link, Stack, Typography } from "@mui/material";
import { useResize } from "../hooks/useResize";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function LandingFooter() {
  const size = useResize();
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.primary.light,
        width: "100vw",
        display: "flex",
        flexDirection: size[0] < 720 ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        px: 6,
        py: 8,
        gap: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: "300px",
          py: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: size[0] < 720 ? "center" : "flex-start",
          gap: 1,
          color: "#FFF",
        }}
      >
        <Stack direction={"row"} spacing={2} alignItems="center">
          <WhatsAppIcon />
          <Typography variation="body2">
            Meu <b>Whats</b> Delivery
          </Typography>
        </Stack>
        <Typography sx={{ mt: 2 }} variant="body1">
          &copy; {new Date(Date.now()).getFullYear()} - Meu <b>Whats</b>{" "}
          Delivery
        </Typography>
        <Typography variant="body1">Todos os direitos reservados</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
        }}
      >
        <Link
          rel="noreferrer noopener"
          href="https://instagram.com/cadastra.pet"
        >
          <WhatsAppIcon size="large" sx={{ color: "white" }} />
        </Link>
      </Box>
    </Box>
  );
}
