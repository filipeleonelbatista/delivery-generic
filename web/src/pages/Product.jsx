import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import {
  Button,
  CardMedia,
  Divider,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import queryString from "query-string";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../componentes/Footer";
import Header from "../componentes/Header";
import RelatedProducts from "../componentes/RelatedProducts";
import { useCategories } from "../hooks/useCategories";
import { useConfig } from "../hooks/useConfig";
import { useProducts } from "../hooks/useProducts";
import { maskCurrency } from "../utils/formatCurrency";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useShoppingCart } from "../hooks/useShoppingCart";

function Product() {
  const { config } = useConfig();
  const { productsList } = useProducts();
  const { addProductsToCart } = useShoppingCart();
  const { categoriesList } = useCategories();
  const navigate = useNavigate();
  const location = useLocation();

  const product = useMemo(() => {
    const queryParams = queryString.parse(location.search);
    if (queryParams.id) {
      const response = productsList.filter(
        (item) => item.id === queryParams.id
      );

      if (response.length === 0) {
        navigate("/404");
      } else {
        return response[0];
      }
    } else {
      navigate.push("/404-produto-nao-encontrado");
    }
  }, [productsList, location, navigate]);

  const category = useMemo(() => {
    return categoriesList.filter((item) => item.id === product.categoryId)[0];
  }, [product, categoriesList]);

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      quantity: Yup.number().required("O campo Nome é obrigatório"),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      quantity: 1,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (formValues) => {
    addProductsToCart(product, formValues.quantity);
  };

  return (
    <>
      <Container maxWidth="lg">
        <Header />
        <main>
          <Grid container sx={{ my: 3, p: 0 }}>
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                height: "50%",
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: "100%",
                  height: 500,
                  display: { sm: "block" },
                  borderRadius: 4,
                }}
                image={product?.featuredImage}
                alt={"imagem do produto"}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={7}
              sx={{
                paddingX: { xs: 0, md: 4 },
                paddingTop: { xs: 4, md: 0 },
              }}
            >
              <Stack
                direction="column"
                height="100%"
                justifyContent="space-between"
              >
                <Stack direction="column" spacing={4}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Link
                      color="inherit"
                      variant="caption"
                      href="/listarProdutos"
                    >
                      {config.listOptionMenuName ?? "Menu"}
                    </Link>
                    <Typography>/</Typography>
                    <Link
                      color="inherit"
                      variant="caption"
                      href={`/listarProdutos?category=${category?.id}`}
                    >
                      {category?.name}
                    </Link>
                  </Stack>
                  <Stack direction="column" spacing={1}>
                    <Typography component="h2" variant="h5">
                      {product?.name}
                    </Typography>

                    {product?.previousValue ? (
                      <Stack
                        direction="column"
                        spacing={0.5}
                        alignItems="flex-start"
                      >
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="flex-start"
                        >
                          <Typography variant="body2">
                            De <s>{maskCurrency(product?.previousValue)}</s> Por
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="flex-start"
                        >
                          <Typography component="h3" variant="h6">
                            R$
                          </Typography>
                          <Typography component="h3" variant="h4">
                            {maskCurrency(product?.currentValue)}
                          </Typography>
                        </Stack>
                      </Stack>
                    ) : (
                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="flex-start"
                      >
                        <Typography component="h3" variant="h6">
                          R$
                        </Typography>
                        <Typography component="h3" variant="h4">
                          {maskCurrency(product?.currentValue)}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                  <Stack direction="row" alignItems="flex-start" spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: (theme) =>
                            theme.palette.primary.main,
                          color: "white",
                          "&:hover": {
                            background: (theme) => theme.palette.primary.dark,
                          },
                        }}
                        onClick={() => {
                          formik.setFieldValue(
                            "quantity",
                            formik.values.quantity === 1
                              ? 1
                              : formik.values.quantity - 1
                          );
                        }}
                        variant="contained"
                      >
                        <RemoveIcon fontSize="inherit" />
                      </IconButton>
                      <TextField
                        size="small"
                        id="quantity"
                        disabled
                        variant="outlined"
                        value={formik.values.quantity}
                        InputProps={{
                          sx: {
                            borderRadius: 0,
                            width: 40,
                          },
                          inputProps: {
                            style: {
                              textAlign: "center",
                            },
                          },
                        }}
                      />

                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: (theme) =>
                            theme.palette.primary.main,
                          color: "white",
                          "&:hover": {
                            background: (theme) => theme.palette.primary.dark,
                          },
                        }}
                        onClick={() => {
                          formik.setFieldValue(
                            "quantity",
                            formik.values.quantity + 1
                          );
                        }}
                        variant="contained"
                      >
                        <AddIcon fontSize="inherit" />
                      </IconButton>
                    </Stack>

                    <Button
                      onClick={formik.handleSubmit}
                      variant="contained"
                      startIcon={<ShoppingBagIcon />}
                    >
                      Comprar
                    </Button>
                  </Stack>

                  <Typography component="p" variant="body2">
                    {product?.description}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          <Grid container spacing={5} sx={{ mt: 3 }}>
            <Grid
              item
              xs={12}
              md={12}
              sx={{
                "& .markdown": {
                  py: 3,
                },
              }}
            >
              <Typography variant="h6" gutterBottom>
                Produtos em relacionados
              </Typography>
              <Divider />
              <RelatedProducts categoryId={product?.categoryId} />
            </Grid>
          </Grid>
        </main>
      </Container>
      <Footer title="My Delivery App" />
    </>
  );
}

export default Product;
