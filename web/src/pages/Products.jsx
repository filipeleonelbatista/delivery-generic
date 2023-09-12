import {
  Box,
  Button,
  CardMedia,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DrawerComponent from "../componentes/DrawerComponent";
import NoData from "../componentes/NoData";
import { useProducts } from "../hooks/useProducts";
import logo from "../assets/icon.png";
import { DataGrid, ptBR } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useCategories } from "../hooks/useCategories";
import { useEffect } from "react";

export default function Products() {
  const {
    productsList,
    setSelectedProduct,
    handleDeleteProduct,
    updateProductsList,
  } = useProducts();
  const { categoriesList } = useCategories();

  const navigate = useNavigate();
  const theme = useTheme();

  const handleLocateCategory = (id) => {
    return categoriesList.filter((item) => item.id === id)[0]?.name ?? "";
  };

  useEffect(() => {
    const executeAsync = async () => {
      await updateProductsList();
    };
    executeAsync();
  }, [updateProductsList]);

  return (
    <DrawerComponent
      title="Produtos"
      header={
        <Stack direction="row">
          <Button
            variant="contained"
            onClick={() => navigate("/produtos/adicionar")}
          >
            Adicionar Produto
          </Button>
        </Stack>
      }
    >
      {productsList.length === 0 ? (
        <NoData
          primaryColor={theme.palette.primary.main}
          description={
            <Stack direction="column" spacing={4} maxWidth={300}>
              <Typography variant="body2" textAlign="center">
                Sem produtos cadastrados no momento. Adicione produtos oferecer
                aos seus clientes
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/produtos/adicionar")}
              >
                Adicionar Produto
              </Button>
            </Stack>
          }
          style={{
            width: 250,
            height: 250,
          }}
        />
      ) : (
        <Box sx={{ height: 650, width: "100%", mt: 2 }}>
          <DataGrid
            initialState={{
              sorting: {
                sortModel: [{ field: "name", sort: "asc" }],
              },
            }}
            rows={productsList}
            columns={[
              {
                field: "featuredImage",
                headerName: "Imagem Principal",
                width: 70,
                renderCell: (params) => {
                  return (
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CardMedia
                        sx={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 2,
                          cursor: "pointer",
                        }}
                        component="img"
                        src={
                          params.row.featuredImage === ""
                            ? logo
                            : params.row.featuredImage
                        }
                        height="50"
                        alt={params.row.name}
                      />
                    </Box>
                  );
                },
              },
              { field: "name", headerName: "Produto", flex: 1 },
              {
                field: "categoryId",
                headerName: "Categoria",
                flex: 1,
                renderCell: (params) => (
                  <Typography>
                    {handleLocateCategory(params.row.categoryId)}
                  </Typography>
                ),
              },
              {
                field: "previousValue",
                headerName: "Valor anterior",
                flex: 1,
                renderCell: (params) => (
                  <Typography>
                    {params.row.previousValue.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                      useGrouping: true,
                    })}
                  </Typography>
                ),
              },
              {
                field: "currentValue",
                headerName: "Valor atual",
                flex: 1,
                renderCell: (params) => (
                  <Typography>
                    {params.row.currentValue.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                      useGrouping: true,
                    })}
                  </Typography>
                ),
              },
              {
                field: "hasDiscount",
                width: 30,
                headerName: "Desconto",
                renderCell: (params) =>
                  params.row.hasDiscount ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <HighlightOffIcon color="error" />
                  ),
              },
              {
                field: "isFeatured",
                width: 30,
                headerName: "Destaque",
                renderCell: (params) =>
                  params.row.isFeatured ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <HighlightOffIcon color="error" />
                  ),
              },
              {
                field: "active",
                width: 30,
                headerName: "status",
                renderCell: (params) =>
                  params.row.active ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <HighlightOffIcon color="error" />
                  ),
              },
              {
                field: "action",
                headerName: "Ações",
                sortable: false,
                renderCell: (params) => {
                  const handleEdit = (event) => {
                    event.stopPropagation();
                    setSelectedProduct(params.row);
                    navigate("/produtos/editar");
                  };

                  const handleDelete = (event) => {
                    event.stopPropagation();
                    handleDeleteProduct(params.row.id);
                  };
                  return (
                    <>
                      <IconButton
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                      >
                        <DeleteIcon />
                      </IconButton>

                      <IconButton
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={handleEdit}
                      >
                        <EditIcon />
                      </IconButton>
                    </>
                  );
                },
              },
            ]}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection={false}
            disableSelectionOnClick
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          />
        </Box>
      )}
    </DrawerComponent>
  );
}
