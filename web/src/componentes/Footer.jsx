import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import MapIcon from "@mui/icons-material/Map";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { CardMedia, IconButton, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Copyright from "./Copyright";
import GPImage from "../assets/gp_badge.png";
import ASImage from "../assets/as_badge.png";
import { useMemo } from "react";
import FooterBg from "../assets/footer_bg.png";
import { useConfig } from "../hooks/useConfig";

function Footer(props) {
  const { config } = useConfig();

  function getDiaSemanaPorExtenso(diaSemana) {
    switch (diaSemana) {
      case "segunda":
        return "Segunda-feira";
      case "terca":
        return "Terça-feira";
      case "quarta":
        return "Quarta-feira";
      case "quinta":
        return "Quinta-feira";
      case "sexta":
        return "Sexta-feira";
      case "sabado":
        return "Sábado";
      case "domingo":
        return "Domingo";
      default:
        return "";
    }
  }

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

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "grey.900",
        py: 6,
        mt: 4,
        minHeight: 480,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: "100%",
          minHeight: 480,
          top: 0,
          display: { sm: "block" },
          position: "absolute",
          zIndex: 5,
        }}
        image={FooterBg}
        alt={"FooterBG"}
      />
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 10 }}>
        <Typography variant="h6" align="center" gutterBottom color="white">
          {config?.name ?? props.title}
        </Typography>

        <Stack
          sx={{ width: "100%", my: 2 }}
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
        >
          {social.map((network, index) => (
            <Link
              variant="body1"
              target="_blank"
              href={network.link}
              key={index}
              sx={{
                "& > svg": {
                  width: 40,
                  height: 40,
                },
              }}
            >
              <network.logo />
            </Link>
          ))}
        </Stack>

        <Box
          sx={{
            my: 2,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: { xs: "center", md: "space-between" },
            alignItems: { xs: "center", md: "flex-start" },
            gap: 4,
          }}
        >
          <Stack sx={{ width: "35%" }} direction="column" alignItems={"center"}>
            <Typography
              gutterBottom
              textAlign="center"
              color="white"
              variant={"body2"}
            >
              {`${config.street}, ${config.number}, ${config.neigborhood}`}
            </Typography>
            <Typography
              gutterBottom
              textAlign="center"
              color="white"
              variant={"body2"}
            >
              {`${config.city}-${config.state}`}
            </Typography>
            <Typography
              gutterBottom
              textAlign="center"
              color="white"
              variant={"body2"}
            >{`CEP: ${config.zipcode}`}</Typography>
            <Stack sx={{ my: 2 }} spacing={1} direction="column">
              <IconButton
                onClick={() => {
                  window.open(config?.mapLink, "_blank");
                }}
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.main,
                  color: "white",
                  "&:hover": {
                    background: (theme) => theme.palette.primary.dark,
                  },
                }}
                size="large"
              >
                <MapIcon fontSize="inherit" />
              </IconButton>
              <Typography gutterBottom color="white" variant={"body2"}>
                Ver Rota
              </Typography>
            </Stack>
          </Stack>
          <Stack sx={{ width: "35%" }} direction="column" alignItems={"center"}>
            <Typography color="white" variant="body1" sx={{ mb: 2 }}>
              <b>Contato</b>
            </Typography>
            {config?.whatsapp && (
              <Link
                target="_blank"
                sx={{ textDecoration: "none", color: "white" }}
                href={`https://wa.me/+55${config.whatsapp.replace(/\D/g, "")}`}
              >
                <Stack direction="row" spacing={1} sx={{ my: 0.5 }}>
                  <WhatsAppIcon />
                  <Typography>{config?.whatsapp}</Typography>
                </Stack>
              </Link>
            )}
            {config?.telefone && (
              <Link
                target="_blank"
                sx={{ textDecoration: "none", color: "white" }}
                href={`tel:${config.telefone.replace(/\D/g, "")}`}
              >
                <Stack direction="row" spacing={1} sx={{ my: 0.5 }}>
                  <PhoneIcon />
                  <Typography>{config?.telefone}</Typography>
                </Stack>
              </Link>
            )}
          </Stack>
          <Stack sx={{ width: "35%" }} direction="column" alignItems={"center"}>
            <Typography
              color="white"
              textAlign="center"
              variant="body1"
              sx={{ mb: 2 }}
            >
              <b>Horários de atendimento</b>
            </Typography>
            {config?.openingHours?.length > 0 &&
              config?.openingHours.map((item, index) => (
                <Stack
                  key={index}
                  direction="row"
                  sx={{ alignItems: "center" }}
                >
                  <Typography color="white" variant="caption" width={100}>
                    <b>{getDiaSemanaPorExtenso(item.diaSemana)}</b>
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {item.horarios.map((horario, indexHorario) => (
                      <Typography
                        color="white"
                        variant="caption"
                        key={indexHorario}
                      >
                        {horario}
                      </Typography>
                    ))}
                  </Stack>
                </Stack>
              ))}
          </Stack>
        </Box>

        {(config?.androidLink || config?.appleLink) && (
          <>
            <Typography
              color="white"
              textAlign="center"
              variant="body1"
              sx={{ mb: 2 }}
            >
              <b>Baixe nosso aplicativo</b>
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "center", md: "center" },
                justifyContent: { xs: "center", md: "center" },
                gap: { xs: 0, md: 2 },
              }}
            >
              {config?.androidLink && (
                <a
                  rel="noreferer noopener"
                  target="_blank"
                  href={config?.androidLink}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: 140,
                      minHeight: 10,
                    }}
                    src={GPImage}
                  />
                </a>
              )}
              {config?.appleLink && (
                <a
                  rel="noreferer noopener"
                  target="_blank"
                  href={config?.appleLink}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: 150,
                      minHeight: 10,
                    }}
                    src={ASImage}
                  />
                </a>
              )}
            </Box>
          </>
        )}

        <Copyright color="white" />
      </Container>
    </Box>
  );
}
export default Footer;
