import { Box, Button, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { cutStringToMaxValue } from "../utils/string";

function FeaturedPost(props) {
  const { addProductsToCart } = useShoppingCart();
  const { post } = props;

  return (
    <Box key={post.id} sx={{ padding: 1, my: 0.5 }}>
      <Card sx={{ display: "flex" }}>
        <CardContent sx={{ flex: 1 }}>
          <Typography component="h2" variant="body1">
            <Link
              to={`/produto?id=${post.id}`}
              style={{ textDecoration: "none" }}
            >
              <Typography
                sx={{
                  textDecoration: "none",
                  color: "grey.900",
                  fontWeight: 600,
                }}
              >
                {post.name}
              </Typography>
            </Link>
          </Typography>

          {post.previousValue ? (
            <Stack direction="row" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                <sup>
                  {"De "}
                  <s>
                    {post.previousValue.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                      useGrouping: true,
                    })}
                  </s>
                  {" por"}
                </sup>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {post.currentValue.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                })}
              </Typography>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {post.currentValue.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              })}
            </Typography>
          )}
          <Typography variant="body2" paragraph>
            {cutStringToMaxValue(post.description)}
          </Typography>
          <Button size="small" onClick={() => addProductsToCart(post, 1)}>
            Comprar
          </Button>
        </CardContent>
        <Link to={`/produto?id=${post.id}`} style={{ textDecoration: "none" }}>
          <CardMedia
            component="img"
            sx={{
              width: { xs: 120, sm: 163 },
              height: { xs: 163, sm: 163 },
              display: { sm: "block" },
            }}
            image={post.featuredImage}
            alt={post.name}
          />
        </Link>
      </Card>
    </Box>
  );
}

export default FeaturedPost;
