import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, ptBR } from "@mui/x-data-grid";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DrawerComponent from "../componentes/DrawerComponent";
import NoData from "../componentes/NoData";
import { useOrders } from "../hooks/useOrders";
import { celular, dateToStringFull } from "../utils/string";
import { formatCurrency } from "../utils/formatCurrency";
import BlockIcon from "@mui/icons-material/Block";

export default function Orders() {
  const {
    ordersList,
    setSelectedOrder,
    handleDeleteOrder,
    updateOrdersList,
    handleUpdateStatus,
    handleCancelOrder,
  } = useOrders();

  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const executeAsync = async () => {
      await updateOrdersList();
    };
    executeAsync();
  }, [updateOrdersList]);

  return (
    <DrawerComponent
      title="Pedidos"
      header={
        <Stack direction="row">
          <Button
            variant="contained"
            onClick={() => navigate("/pedidos/adicionar")}
          >
            Adicionar Pedido
          </Button>
        </Stack>
      }
    >
      {ordersList.length === 0 ? (
        <NoData
          primaryColor={theme.palette.primary.main}
          description={
            <Stack direction="column" spacing={4} maxWidth={300}>
              <Typography variant="body2" textAlign="center">
                Sem Pedidos no momento. Adicione Pedidos ou aguarde seus
                clientes adicionarem pedidos pelo site.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/pedidos/adicionar")}
              >
                Adicionar Pedido
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
                sortModel: [{ field: "createdAt", sort: "asc" }],
              },
            }}
            rows={ordersList}
            columns={[
              {
                field: "id",
                headerName: "ID",
                flex: 1,
              },
              {
                field: "clientObject",
                headerName: "Cliente",
                flex: 1,
                renderCell: (params) => (
                  <Typography>{params.row.clientObject.name}</Typography>
                ),
              },
              {
                field: "address",
                flex: 1,
                headerName: "Endereço",
                renderCell: (params) => (
                  <Typography variant={"caption"}>
                    {`${params.row.clientObject.street}, ${params.row.clientObject.number}, ${params.row.clientObject.neigborhood}, ${params.row.clientObject.city}-${params.row.clientObject.state}, CEP: ${params.row.clientObject.zipcode}`}
                  </Typography>
                ),
              },
              {
                field: "neigborhood",
                flex: 1,
                headerName: "Bairro",
                renderCell: (params) => (
                  <Typography variant={"caption"}>
                    {params.row.clientObject.neigborhood}
                  </Typography>
                ),
              },
              {
                field: "phoneNumber",
                headerName: "Telefone",
                flex: 1,
                renderCell: (params) => (
                  <Typography
                    component={"a"}
                    color="primary"
                    variant="body2"
                    href={`tel:${celular(params.row.clientObject.phoneNumber)}`}
                  >
                    {celular(params.row.clientObject.phoneNumber)}
                  </Typography>
                ),
              },
              {
                field: "products",
                headerName: "Produtos",
                flex: 1,
                renderCell: (params) => (
                  <Typography variant="body2">
                    {params.row.items.length}{" "}
                    {params.row.items.length > 1 ? "Produtos" : "Produto"}
                  </Typography>
                ),
              },
              {
                field: "observation",
                flex: 1,
                headerName: "Observações",
                renderCell: (params) => (
                  <Typography variant={"body2"}>
                    {params.row.observation}
                  </Typography>
                ),
              },
              {
                field: "total",
                headerName: "Valor",
                flex: 1,
                renderCell: (params) => (
                  <Typography variant="body2">
                    {formatCurrency(params.row.total)}
                  </Typography>
                ),
              },
              {
                field: "createdAt",
                headerName: "Criado em",
                flex: 1,
                renderCell: (params) => (
                  <Typography variant="body2">
                    {dateToStringFull(params.row.createdAt)}
                  </Typography>
                ),
              },
              {
                field: "status",
                headerName: "Status do pedido",
                width: 210,
                renderCell: (params) => {
                  return (
                    <Stack
                      width="100%"
                      justifyContent="center"
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <IconButton
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleUpdateStatus(params.row, "back")}
                      >
                        <ArrowBackIosNewIcon />
                      </IconButton>
                      <Chip
                        size="small"
                        label={params.row.status}
                        color="primary"
                      />
                      <IconButton
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleUpdateStatus(params.row, "next")}
                      >
                        <ArrowForwardIosIcon />
                      </IconButton>
                    </Stack>
                  );
                },
              },
              {
                field: "action",
                headerName: "Ações",
                sortable: false,
                width: 180,
                renderCell: (params) => {
                  const handleEdit = (event) => {
                    event.stopPropagation();
                    setSelectedOrder(params.row);
                    navigate("/pedidos/editar");
                  };

                  const handleDelete = (event) => {
                    event.stopPropagation();
                    handleDeleteOrder(params.row.id);
                  };

                  const handleCancel = (event) => {
                    event.stopPropagation();
                    handleCancelOrder(params.row);
                  };
                  return (
                    <>
                      <IconButton
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={handleCancel}
                        title="Cancelar pedido"
                      >
                        <BlockIcon fontSize="inherit" />
                      </IconButton>

                      <IconButton
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>

                      <IconButton
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={handleEdit}
                      >
                        <EditIcon fontSize="inherit" />
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
