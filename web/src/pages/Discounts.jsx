import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  Box,
  Button,
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
import { useCupons } from "../hooks/useCupons";
import { formatCurrency } from "../utils/formatCurrency";
import { dateToString } from "../utils/string";

export default function Discounts() {
  const { cuponsList, setSelectedCupom, handleDeleteCupom, updateCuponsList } =
    useCupons();

  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const executeAsync = async () => {
      await updateCuponsList();
    };
    executeAsync();
  }, [updateCuponsList]);

  return (
    <DrawerComponent
      title="Cupons de desconto"
      header={
        <Stack direction="row">
          <Button
            variant="contained"
            onClick={() => navigate("/descontos/adicionar")}
          >
            Adicionar Cupom
          </Button>
        </Stack>
      }
    >
      {cuponsList.length === 0 ? (
        <NoData
          primaryColor={theme.palette.primary.main}
          description={
            <Stack direction="column" spacing={4} maxWidth={300}>
              <Typography variant="body2" textAlign="center">
                Sem cupons cadastradas no momento. Adicione cupons para usar na
                suas promoções
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/descontos/adicionar")}
              >
                Adicionar cupom
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
                sortModel: [{ field: "startDate", sort: "asc" }],
              },
            }}
            rows={cuponsList}
            columns={[
              { field: "description", headerName: "Desconto", flex: 1 },
              {
                field: "valueDiscount",
                flex: 1,
                headerName: "Valor",
                renderCell: (params) => (
                  <Typography>
                    {params.row.isPercentage
                      ? "" + params.row.valueDiscount + " %"
                      : formatCurrency(params.row.valueDiscount)}
                  </Typography>
                ),
              },
              {
                field: "startDate",
                flex: 1,
                headerName: "Data inicio",
                renderCell: (params) =>
                  params.row.startDate !== "" && (
                    <Typography>
                      {dateToString(params.row.startDate)}
                    </Typography>
                  ),
              },
              {
                field: "endDate",
                flex: 1,
                headerName: "Data fim",
                renderCell: (params) =>
                  params.row.endDate !== "" && (
                    <Typography>{dateToString(params.row.endDate)}</Typography>
                  ),
              },
              {
                field: "isPercentage",
                width: 30,
                headerName: "Desconto percentual",
                renderCell: (params) =>
                  params.row.isPercentage ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <HighlightOffIcon color="error" />
                  ),
              },
              {
                field: "isDelivery",
                width: 30,
                headerName: "Desconto no frete",
                renderCell: (params) =>
                  params.row.isDelivery ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <HighlightOffIcon color="error" />
                  ),
              },
              {
                field: "isFreeDelivery",
                width: 30,
                headerName: "Frete Grátis",
                renderCell: (params) =>
                  params.row.isFreeDelivery ? (
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
                    setSelectedCupom(params.row);
                    navigate("/descontos/editar");
                  };

                  const handleDelete = (event) => {
                    event.stopPropagation();
                    handleDeleteCupom(params.row.id);
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
