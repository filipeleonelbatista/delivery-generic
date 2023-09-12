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
import { useCategories } from "../hooks/useCategories";
import logo from "../assets/icon.png";
import { DataGrid, ptBR } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useEffect } from "react";

export default function Categories() {
  const {
    categoriesList,
    setSelectedCategory,
    handleDeleteCategory,
    updateCategoriesList,
  } = useCategories();

  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const executeAsync = async () => {
      await updateCategoriesList();
    };
    executeAsync();
  }, [updateCategoriesList]);

  return (
    <DrawerComponent
      title="Categorias"
      header={
        <Stack direction="row">
          <Button
            variant="contained"
            onClick={() => navigate("/categorias/adicionar")}
          >
            Adicionar Categoria
          </Button>
        </Stack>
      }
    >
      {categoriesList.length === 0 ? (
        <NoData
          primaryColor={theme.palette.primary.main}
          description={
            <Stack direction="column" spacing={4} maxWidth={300}>
              <Typography variant="body2" textAlign="center">
                Sem categorias cadastradas no momento. Adicione categorias para
                agrupar os produtos
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/categorias/adicionar")}
              >
                Adicionar Categoria
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
                sortModel: [{ field: "order", sort: "asc" }],
              },
            }}
            rows={categoriesList}
            columns={[
              { field: "order", width: 10, headerName: "Ordem" },
              {
                field: "avatar",
                headerName: "Avatar",
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
                          params.row.avatar === "" ? logo : params.row.avatar
                        }
                        height="50"
                        alt={params.row.name}
                      />
                    </Box>
                  );
                },
              },
              { field: "name", headerName: "Categoria", flex: 1 },
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
                    setSelectedCategory(params.row);
                    navigate("/categorias/editar");
                  };

                  const handleDelete = (event) => {
                    event.stopPropagation();
                    handleDeleteCategory(params.row.id);
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
