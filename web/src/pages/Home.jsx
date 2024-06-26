import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import FeaturedPost from "../componentes/FeaturedPost";
import FeaturedProducts from "../componentes/FeaturedProducts";
import Footer from "../componentes/Footer";
import Header from "../componentes/Header";
import MainFeaturedPost from "../componentes/MainFeaturedPost";
import NoData from "../componentes/NoData";
import SEO from "../componentes/SEO";
import Sidebar from "../componentes/Sidebar";
import { useConfig } from "../hooks/useConfig";
import { useProducts } from "../hooks/useProducts";

function Home() {
  const theme = useTheme();
  const { productsList } = useProducts();
  const { config } = useConfig();

  const [selectedOrdenation, setSelectedOrdenation] = useState("=");

  const posts = useMemo(() => {
    let response = productsList.filter(
      (item) => item.active && item.isFeatured
    );

    if (response.length === 0) {
      response = productsList.filter((item) => item.active);
    }

    function compararProdutos(a, b) {
      if (a.currentValue < b.currentValue) {
        return -1;
      } else if (a.currentValue > b.currentValue) {
        return 1;
      } else {
        return 0;
      }
    }

    if (selectedOrdenation === ">") {
      response.sort(compararProdutos).reverse();
    } else if (selectedOrdenation === "<") {
      response.sort(compararProdutos);
    } else if (selectedOrdenation === "=") {
      response.sort((a, b) => {
        const dataA = dayjs(a.createdAt);
        const dataB = dayjs(b.createdAt);

        if (dataA.isBefore(dataB)) {
          return -1;
        } else if (dataA.isAfter(dataB)) {
          return 1;
        } else {
          return 0;
        }
      });
    }

    return response;
  }, [productsList, selectedOrdenation]);

  const itemsPerPage = config.itemsPerPage;

  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const pageItems = posts.slice(startIndex, endIndex);

  const totalPages = Math.ceil(posts.length / itemsPerPage);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <SEO title="Inicio" />
      <Container maxWidth="lg">
        <Header />
        <main>
          <MainFeaturedPost />
          <FeaturedProducts />
          <Grid container spacing={5} sx={{ mt: 3 }}>
            <Sidebar />
            <Grid
              item
              xs={12}
              md={8}
              sx={{
                "& .markdown": {
                  py: 3,
                },
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
                sx={{ py: 1 }}
              >
                <Typography variant="h6" gutterBottom>
                  Em destaque
                </Typography>
                <FormControl sx={{ width: 200 }}>
                  <InputLabel id="ordenation-label">Ordenar</InputLabel>
                  <Select
                    size="small"
                    labelId="ordenation-label"
                    id="ordenation-select"
                    value={selectedOrdenation}
                    label="Ordenar"
                    onChange={(event) =>
                      setSelectedOrdenation(event.target.value)
                    }
                  >
                    <MenuItem display="block" variant="body1" value="=">
                      Ordem padrão
                    </MenuItem>
                    <MenuItem display="block" variant="body1" value=">">
                      Maior para o menor
                    </MenuItem>
                    <MenuItem display="block" variant="body1" value="<">
                      Menor para o maior
                    </MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <Divider />
              {posts.length === 0 && (
                <NoData
                  primaryColor={theme.palette.primary.main}
                  description={
                    <Stack direction="column" spacing={4} maxWidth={300}>
                      <Typography variant="body2" textAlign="center">
                        Sem produtos em destaque no momento.
                      </Typography>
                    </Stack>
                  }
                  style={{
                    width: 250,
                    height: 250,
                    margin: "24px 0",
                  }}
                />
              )}
              {pageItems.map((post) => (
                <FeaturedPost post={post} key={post.id} />
              ))}

              {posts.length > 0 && (
                <Stack direction="row" justifyContent="center">
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Stack>
              )}
            </Grid>
          </Grid>
        </main>
      </Container>
      <Footer title="My Delivery App" />
    </>
  );
}

export default Home;
