import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import { useConfig } from "../hooks/useConfig";
import { useCategories } from "../hooks/useCategories";
import { useMemo } from "react";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MuiLink from "@mui/material/Link";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";

function Sidebar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { config } = useConfig();
  const { categoriesList } = useCategories();

  const archives = useMemo(() => {
    const response = categoriesList.filter((item) => item.active);
    return response;
  }, [categoriesList]);

  const social = useMemo(() => {
    const socialArray = [];

    if (config.instagram) {
      socialArray.push({
        name: "Instagram",
        logo: InstagramIcon,
        link: config.instagram,
      });
    }

    if (config.facebook) {
      socialArray.push({
        name: "Facebook",
        logo: FacebookIcon,
        link: config.facebook,
      });
    }

    if (config.whatsapp) {
      socialArray.push({
        name: "WhatsApp",
        logo: WhatsAppIcon,
        link: "https://wa.me/+55" + config.whatsapp.replace(/[^0-9]/g, ""),
      });
    }

    return socialArray;
  }, [config]);

  const [link, setLink] = React.useState("");

  const handleChange = (event) => {
    setLink(event.target.value);
    navigate(event.target.value);
  };

  return (
    <>
      <Grid
        item
        xs={12}
        md={4}
        sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column" }}
      >
        <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.200", my: 1 }}>
          <Typography variant="h6" gutterBottom>
            {config.name}
          </Typography>
          <Typography>{config.about}</Typography>
        </Paper>

        <Stack direction="column" spacing={1} sx={{my: 1}}>
          <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 4 }}>
            Categorias
          </Typography>
          {archives.map((archive) => (
            <Link
              key={archive.id}
              style={{
                textDecoration: "none",
                p: 0,
                m: 0,
                height: "fit-content",
                color: theme.palette.primary.main,
              }}
              to={`/listarProdutos?category=${archive.id}`}
            >
              <Typography display="block" variant="body1">
                {archive.name}
              </Typography>
            </Link>
          ))}
        </Stack>
        <Stack direction="column" spacing={1} sx={{my: 1}}>
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Redes sociais
          </Typography>
          {social.map((network, index) => (
            <MuiLink
              display="block"
              variant="body1"
              href={network.link}
              target="_blank"
              key={index}
              sx={{ p: 0, m: 0, height: "fit-content" }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <network.logo />
                <span>{network.name}</span>
              </Stack>
            </MuiLink>
          ))}
        </Stack>
      </Grid>
      <Grid item xs={12} md={4} sx={{ display: { xs: "grid", md: "none" } }}>
        <FormControl fullWidth>
          <InputLabel id="categories-label">Categorias</InputLabel>
          <Select
            labelId="categories-label"
            id="categories-select"
            value={link}
            label="Categorias"
            onChange={handleChange}
          >
            {archives.map((archive) => (
              <MenuItem
                display="block"
                variant="body1"
                value={`/listarProdutos?category=${archive.id}`}
                key={archive.id}
              >
                {archive.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </>
  );
}

export default Sidebar;
