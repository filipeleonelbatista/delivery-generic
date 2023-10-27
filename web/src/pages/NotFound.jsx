import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import FeaturedProducts from "../componentes/FeaturedProducts";
import Footer from "../componentes/Footer";
import Header from "../componentes/Header";
import MainFeaturedPost from "../componentes/MainFeaturedPost";

function NotFound() {
  const sections = [];

  return (
    <>
      <Container maxWidth="lg">
        <Header title="Food Delivery" sections={sections} />
        <main>
          <Paper
            sx={{
              position: "relative",
              backgroundColor: "grey.800",
              color: "#fff",
              height: "70vh",
              mb: 4,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundImage: `url(https://source.unsplash.com/random?food)`,
            }}
          >
            {/* Increase the priority of the hero background image */}
            {
              <img
                style={{ height: "70vh", display: "none" }}
                src={"https://source.unsplash.com/random?food"}
                alt={"Background Image"}
              />
            }
            <Box
              sx={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                backgroundColor: "rgba(0,0,0,.3)",
              }}
            />
            <Grid container>
              <Grid item md={6}>
                <Box
                  sx={{
                    position: "relative",
                    p: { xs: 3, md: 6 },
                    pr: { md: 0 },
                  }}
                >
                  <Typography
                    component="h1"
                    variant="h3"
                    color="inherit"
                    gutterBottom
                  >
                    Não encontramos o que procura - Erro 404
                  </Typography>
                  <Typography variant="body1" color="inherit" paragraph>
                    O recurso que procura não pode ser encontrado.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          <Stack direction="column" spacing={2}>
            <Typography variant="h6" gutterBottom>
              Produtos em destaque
            </Typography>
            <Divider />

            <FeaturedProducts />
          </Stack>
        </main>
      </Container>
      <Footer title="My Delivery App" />
    </>
  );
}

export default NotFound;
