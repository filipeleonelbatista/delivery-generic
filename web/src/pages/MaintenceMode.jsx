import { Box, Paper, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Footer from "../componentes/Footer";
import Header from "../componentes/Header";
import SEO from "../componentes/SEO";

function MaintenceMode() {
  return (
    <>
      <SEO title={"Em manutenção"} />
      <Container maxWidth="lg">
        <Header hideOption={true} />
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
                    Em manutenção...
                  </Typography>
                  <Typography variant="body1" color="inherit" paragraph>
                    Em breve voltaremos ao funcionamento normal.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </main>
      </Container>
      <Footer title="Food Delivery" />
    </>
  );
}

export default MaintenceMode;
