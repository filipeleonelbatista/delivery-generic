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
import { useBanners } from "../hooks/useBanners";
import logo from "../assets/icon.png";
import { DataGrid, ptBR } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useEffect } from "react";

export default function PromotionalBanners() {
  const {
    bannersList,
    setSelectedBanner,
    handleDeleteBanner,
    updateBannersList,
  } = useBanners();

  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const executeAsync = async () => {
      await updateBannersList();
    };
    executeAsync();
  }, [updateBannersList]);

  return (
    <DrawerComponent
      title="Banners"
      header={
        <Stack direction="row">
          <Button
            variant="contained"
            onClick={() => navigate("/banners/adicionar")}
          >
            Adicionar banner
          </Button>
        </Stack>
      }
    >
      {bannersList.length === 0 ? (
        <NoData
          primaryColor={theme.palette.primary.main}
          description={
            <Stack direction="column" spacing={4} maxWidth={300}>
              <Typography variant="body2" textAlign="center">
                Sem banners cadastradas no momento. Adicione banners com
                chamadas de ação para seu site
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/banners/adicionar")}
              >
                Adicionar banner
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
            rows={bannersList}
            columns={[
              { field: "order", width: 10, headerName: "Ordem" },
              {
                field: "image",
                headerName: "Imagem",
                width: 150,
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
                        src={params.row.image === "" ? logo : params.row.image}
                        height="50"
                        alt={params.row.name}
                      />
                    </Box>
                  );
                },
              },
              { field: "title", headerName: "Titulo", flex: 1 },
              { field: "subtitle", headerName: "Subtitulo", flex: 1 },
              {
                field: "active",
                width: 30,
                headerName: "Status",
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
                    setSelectedBanner(params.row);
                    navigate("/banners/editar");
                  };

                  const handleDelete = (event) => {
                    event.stopPropagation();
                    handleDeleteBanner(params.row.id);
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
