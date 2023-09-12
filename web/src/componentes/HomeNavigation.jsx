import LoginIcon from "@mui/icons-material/Login";
import MenuIcon from "@mui/icons-material/Menu";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Button,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useResize } from "../hooks/useResize";

export default function HomeNavigation() {
  const navigate = useNavigate();
  const size = useResize();

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        py: 2.8,
        px: 4,
        backgroundColor: (theme) => theme.palette.primary.light,
        zIndex: 100,
      }}
    >
      <Link to="/landing" style={{ textDecoration: "none", color: "white" }}>
        <Stack direction={"row"} spacing={2} alignItems="center">
          <WhatsAppIcon />
          <Typography variation="body2">
            Meu <b>Whats</b> Delivery
          </Typography>
        </Stack>
      </Link>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {size[0] < 720 ? (
          <>
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ width: 48, height: 48 }}
              aria-controls={openMenu ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? "true" : undefined}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={openMenu}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={() => navigate("/entrar")}>
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                Entrar
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{
                borderRadius: 8,
                backgroundColor: "white",
                color: (theme) => theme.palette.primary.main,
                "&:hover": {
                  background: (theme) => theme.palette.grey[400],
                },
              }}
              onClick={() => navigate("/landing")}
            >
              Solicitar demonstração
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
