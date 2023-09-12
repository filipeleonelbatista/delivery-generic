import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  IconButton,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, ptBR } from "@mui/x-data-grid";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DrawerComponent from "../componentes/DrawerComponent";
import NoData from "../componentes/NoData";
import { useClientes } from "../hooks/useClientes";
import { celular } from "../utils/string";

export default function Clients() {
  const {
    clientesList,
    setSelectedCliente,
    handleDeleteCliente,
    updateClientesList,
  } = useClientes();

  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const executeAsync = async () => {
      await updateClientesList();
    };
    executeAsync();
  }, [updateClientesList]);

  return (
    <DrawerComponent
      title="Cupons de desconto"
      header={
        <Stack direction="row">
          <Button
            variant="contained"
            onClick={() => navigate("/clientes/adicionar")}
          >
            Adicionar Cliente
          </Button>
        </Stack>
      }
    >
      {clientesList.length === 0 ? (
        <NoData
          primaryColor={theme.palette.primary.main}
          description={
            <Stack direction="column" spacing={4} maxWidth={300}>
              <Typography variant="body2" textAlign="center">
                Sem clientes cadastradas no momento. Adicione clientes para usar
                nos pedidos
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/clientes/adicionar")}
              >
                Adicionar cliente
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
            rows={clientesList}
            columns={[
              { field: "name", headerName: "Nome", flex: 1 },
              { field: "cpf", headerName: "CPF", flex: 1 },
              {
                field: "address",
                flex: 1,
                headerName: "Endereço",
                renderCell: (params) => (
                  <Typography variant={"caption"}>
                    {`${params.row.street}, ${params.row.number}, ${params.row.neigborhood}, ${params.row.city}-${params.row.state}, CEP: ${params.row.zipcode}`}
                  </Typography>
                ),
              },
              {
                field: "phoneNummber",
                flex: 1,
                headerName: "Telefone",
                renderCell: (params) => (
                  <Link
                    variant="inherit"
                    href={`tel:${celular(params.row.phoneNumber)}`}
                  >
                    {celular(params.row.phoneNumber)}
                  </Link>
                ),
              },
              {
                field: "action",
                headerName: "Ações",
                sortable: false,
                renderCell: (params) => {
                  const handleEdit = (event) => {
                    event.stopPropagation();
                    setSelectedCliente(params.row);
                    navigate("/clientes/editar");
                  };

                  const handleDelete = (event) => {
                    event.stopPropagation();
                    handleDeleteCliente(params.row.id);
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
