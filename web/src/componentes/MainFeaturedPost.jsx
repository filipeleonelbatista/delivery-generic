import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { useBanners } from "../hooks/useBanners";

function MainFeaturedPost() {
  const { bannersList } = useBanners();

  const posts = useMemo(() => {
    const response = bannersList.filter((item) => item.active);
    return response;
  }, [bannersList]);

  return (
    <swiper-container
      controller-control="main-featured-swiper"
      slides-per-view="1"
      speed={500}
      loop={true}
      autoPlay={true}
      delay={5000}
      pauseOnMouseEnter={true}
      navigation={true}
      pagination={true}
    >
      {posts.map((post) => (
        <swiper-slide key={post.id}>
          <Paper
            sx={{
              width: "100%",
              height: 253,
              position: "relative",
              backgroundColor: "grey.800",
              color: "#fff",
              mb: 4,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundImage: `url(${post.image})`,
            }}
          >
            {/* Increase the priority of the hero background image */}
            {
              <img
                style={{ display: "none" }}
                src={post.image}
                alt={post.title}
                width="100%"
                height={253}
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
                    p: { xs: 4, md: 6 },
                    pr: { md: 0 },
                  }}
                >
                  <Typography
                    component="h2"
                    variant="h4"
                    color="inherit"
                    gutterBottom
                  >
                    {post.title}
                  </Typography>
                  <Typography variant="h6" color="inherit" paragraph>
                    {post.subtitle}
                  </Typography>
                  <Button
                    component="a"
                    variant="contained"
                    href={post.reference}
                  >
                    Saiba mais
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </swiper-slide>
      ))}
    </swiper-container>
  );
}
export default MainFeaturedPost;
