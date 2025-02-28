import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { Box, CardMedia, Stack, Typography } from "@mui/material";
import DrawerComponent from "../componentes/DrawerComponent";
import { Chip, useTheme } from "@mui/material";
import { DataGrid, ptBR } from "@mui/x-data-grid";
import { useEffect, useMemo } from "react";
import NoData from "../componentes/NoData";
import { useOrders } from "../hooks/useOrders";
import { formatCurrency, maskCurrency } from "../utils/formatCurrency";
import { celular } from "../utils/string";
import { useCategories } from "../hooks/useCategories";

export default function Dashboard() {
  // TODO:

  // Metricas de conversão
  //Taxa de conversão de visitantes em compradores,
  //ajudando a avaliar o sucesso das estratégias de vendas.

  // Taxa de Abandono de Carrinho
  // A porcentagem de pedidos iniciados, mas não finalizados.

  const { ordersList, updateOrdersList } = useOrders();

  const { categoriesList } = useCategories();

  const theme = useTheme();

  const dailyValue = useMemo(() => {
    const today = new Date();
    const dailyData = ordersList.reduce(
      (data, objeto) => {
        const createdAtDate = new Date(objeto.createdAt);
        if (
          createdAtDate.getDate() === today.getDate() &&
          createdAtDate.getMonth() === today.getMonth() &&
          createdAtDate.getFullYear() === today.getFullYear()
        ) {
          data.total += objeto.total;
          data.count++;
        }
        return data;
      },
      { total: 0, count: 0 }
    );

    return dailyData;
  }, [ordersList]);

  const weeklyValue = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyData = ordersList.reduce(
      (data, objeto) => {
        const createdAtDate = new Date(objeto.createdAt);
        if (createdAtDate >= oneWeekAgo) {
          data.total += objeto.total;
          data.count++;
        }
        return data;
      },
      { total: 0, count: 0 }
    );

    return weeklyData;
  }, [ordersList]);

  const monthlyValue = useMemo(() => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const monthlyData = ordersList.reduce(
      (data, objeto) => {
        const createdAtDate = new Date(objeto.createdAt);
        if (createdAtDate >= firstDayOfMonth) {
          data.total += objeto.total;
          data.count++;
        }
        return data;
      },
      { total: 0, count: 0 }
    );

    return monthlyData;
  }, [ordersList]);

  const annualValue = useMemo(() => {
    const currentDate = new Date();
    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const annualData = ordersList.reduce(
      (data, objeto) => {
        const createdAtDate = new Date(objeto.createdAt);
        if (createdAtDate >= firstDayOfYear) {
          data.total += objeto.total;
          data.count++;
        }
        return data;
      },
      { total: 0, count: 0 }
    );

    return annualData;
  }, [ordersList]);

  const mostSoldItems = useMemo(() => {
    const itemQuantities = {};

    ordersList.forEach((order) => {
      order.items.forEach((item) => {
        const itemId = item.productObject.id;
        const quantity = parseInt(item.quantity, 10);

        if (!isNaN(quantity)) {
          if (itemQuantities[itemId]) {
            itemQuantities[itemId].quantitySold += quantity;
          } else {
            itemQuantities[itemId] = {
              id: item.productObject.id,
              quantitySold: quantity,
              productObject: item.productObject,
            };
          }
        }
      });
    });

    const mostSoldItemsArray = Object.values(itemQuantities);

    mostSoldItemsArray.sort((a, b) => b.quantitySold - a.quantitySold);

    return mostSoldItemsArray;
  }, [ordersList]);

  const customersWithMostOrders = useMemo(() => {
    const customerOrdersCount = {};

    const customerObjects = {};

    const customerTotalSpent = {};

    ordersList.forEach((order) => {
      const customerId = order.clientId;

      if (customerOrdersCount[customerId]) {
        customerOrdersCount[customerId]++;
        customerTotalSpent[customerId] += order.total;
      } else {
        customerOrdersCount[customerId] = 1;
        customerTotalSpent[customerId] = order.total;
        customerObjects[customerId] = order.clientObject;
      }
    });

    const customersWithOrders = Object.keys(customerOrdersCount).map(
      (customerId) => ({
        customerId,
        id: customerObjects[customerId].id,
        orderCount: customerOrdersCount[customerId],
        totalSpent: customerTotalSpent[customerId],
        clientObject: customerObjects[customerId],
      })
    );

    customersWithOrders.sort((a, b) => b.orderCount - a.orderCount);

    return customersWithOrders;
  }, [ordersList]);

  const categorySalesData = useMemo(() => {
    const categoryData = {};

    ordersList.forEach((order) => {
      order.items.forEach((item) => {
        const category = item.productObject.categoryId;
        const quantity = parseInt(item.quantity, 10);
        const totalAmount = item.totalAmount;

        if (!isNaN(quantity) && !isNaN(totalAmount)) {
          if (categoryData[category]) {
            categoryData[category].quantitySold += quantity;
            categoryData[category].totalRevenue += totalAmount;
          } else {
            categoryData[category] = {
              quantitySold: quantity,
              totalRevenue: totalAmount,
            };
          }
        }
      });
    });

    const categorySalesArray = Object.keys(categoryData).map((categoryId) => ({
      categoryId,
      id: categoryId,
      quantitySold: categoryData[categoryId].quantitySold,
      totalRevenue: categoryData[categoryId].totalRevenue,
    }));

    return categorySalesArray;
  }, [ordersList]);

  useEffect(() => {
    const executeAsync = async () => {
      await updateOrdersList();
    };
    executeAsync();
  }, [updateOrdersList]);

  return (
    <DrawerComponent title="Página inicial" outBox={true}>
      <Stack direction={"column"} spacing={2}>
        <Typography variant="h5" fontWeight={"bold"}>
          Vendas totais
        </Typography>
        <Box
          sx={{
            margin: "18px 0",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Box
            sx={{
              w: "100%",
              minWidth: 180,
              borderRadius: 2,
              p: 2,
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? "#FFF"
                  : theme.palette.grey[800],
            }}
          >
            <Stack
              direction={"row"}
              alignItems="center"
              justifyContent="space-between"
              mb={1}
            >
              <Typography fontWeight={"bold"}>Diário</Typography>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  borderRadius: "50%",
                  backgroundColor: (theme) => theme.palette.primary.main,
                  "& svg": {
                    fontSize: 18,
                  },
                }}
              >
                <ContentPasteIcon />
              </Box>
            </Stack>
            <Typography fontWeight={"bold"} variant="h5">
              R$ {maskCurrency(dailyValue.total)}
            </Typography>
            <Typography variant="caption">
              ({dailyValue.count} pedidos)
            </Typography>
          </Box>
          <Box
            sx={{
              w: "100%",
              minWidth: 180,
              borderRadius: 2,
              p: 2,
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? "#FFF"
                  : theme.palette.grey[800],
            }}
          >
            <Stack
              direction={"row"}
              alignItems="center"
              justifyContent="space-between"
              mb={1}
            >
              <Typography fontWeight={"bold"}>Semanal</Typography>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  borderRadius: "50%",
                  backgroundColor: (theme) => theme.palette.primary.main,
                  "& svg": {
                    fontSize: 18,
                  },
                }}
              >
                <ContentPasteIcon />
              </Box>
            </Stack>
            <Typography fontWeight={"bold"} variant="h5">
              R$ {maskCurrency(weeklyValue.total)}
            </Typography>
            <Typography variant="caption">
              ({weeklyValue.count} pedidos)
            </Typography>
          </Box>
          <Box
            sx={{
              w: "100%",
              minWidth: 180,
              borderRadius: 2,
              p: 2,
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? "#FFF"
                  : theme.palette.grey[800],
            }}
          >
            <Stack
              direction={"row"}
              alignItems="center"
              justifyContent="space-between"
              mb={1}
            >
              <Typography fontWeight={"bold"}>Mensal</Typography>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  borderRadius: "50%",
                  backgroundColor: (theme) => theme.palette.primary.main,
                  "& svg": {
                    fontSize: 18,
                  },
                }}
              >
                <ContentPasteIcon />
              </Box>
            </Stack>
            <Typography fontWeight={"bold"} variant="h5">
              R$ {maskCurrency(monthlyValue.total)}
            </Typography>
            <Typography variant="caption">
              ({monthlyValue.count} pedidos)
            </Typography>
          </Box>
          <Box
            sx={{
              w: "100%",
              minWidth: 180,
              borderRadius: 2,
              p: 2,
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? "#FFF"
                  : theme.palette.grey[800],
            }}
          >
            <Stack
              direction={"row"}
              alignItems="center"
              justifyContent="space-between"
              mb={1}
            >
              <Typography fontWeight={"bold"}>Anual</Typography>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  borderRadius: "50%",
                  backgroundColor: (theme) => theme.palette.primary.main,
                  "& svg": {
                    fontSize: 18,
                  },
                }}
              >
                <ContentPasteIcon />
              </Box>
            </Stack>
            <Typography fontWeight={"bold"} variant="h5">
              R$ {maskCurrency(annualValue.total)}
            </Typography>
            <Typography variant="caption">
              ({annualValue.count} pedidos)
            </Typography>
          </Box>
        </Box>
      </Stack>
      <Box
        sx={{
          margin: "18px 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" fontWeight={"bold"}>
          Pedidos
        </Typography>
        <Box
          sx={{
            margin: "18px 0",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Stack
            sx={{
              width: { xs: "100%", md: "50%" },
            }}
            direction="column"
          >
            <Typography variant="body2" fontWeight={"bold"}>
              Pedidos em Aberto
            </Typography>

            {ordersList.filter(
              (objeto) => objeto.status !== "Saiu para entrega"
            ).length === 0 ? (
              <NoData
                primaryColor={theme.palette.primary.main}
                description={
                  <Stack direction="column" spacing={4} maxWidth={300}>
                    <Typography variant="body2" textAlign="center">
                      Sem Pedidos no momento. Adicione Pedidos ou aguarde seus
                      clientes adicionarem pedidos pelo site.
                    </Typography>
                  </Stack>
                }
                style={{
                  width: 250,
                  height: 250,
                }}
              />
            ) : (
              <Box
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === "light"
                      ? "#FFF"
                      : theme.palette.grey[800],
                  height: 650,
                  width: "100%",
                  mt: 2,
                }}
              >
                <DataGrid
                  getRowId={(row) => {
                    return row.id;
                  }}
                  rowHeight={100}
                  initialState={{
                    sorting: {
                      sortModel: [{ field: "createdAt", sort: "asc" }],
                    },
                  }}
                  rows={ordersList.filter(
                    (objeto) => objeto.status !== "Saiu para entrega"
                  )}
                  columns={[
                    {
                      field: "clientObject",
                      headerName: "Cliente",
                      flex: 1,
                      renderCell: (params) => (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography fontWeight={"bold"}>
                            {params.row.clientObject.name}
                          </Typography>
                          <Typography variant={"caption"}>
                            {`${params.row.clientObject.street}, ${params.row.clientObject.number}, ${params.row.clientObject.neigborhood}, ${params.row.clientObject.city}-${params.row.clientObject.state}, CEP: ${params.row.clientObject.zipcode}`}
                          </Typography>
                          <Typography
                            component={"a"}
                            color="primary"
                            variant="body2"
                            href={`tel:${celular(
                              params.row.clientObject.phoneNumber
                            )}`}
                          >
                            {celular(params.row.clientObject.phoneNumber)}
                          </Typography>

                          <Typography variant="body2">
                            {formatCurrency(params.row.total)}
                          </Typography>
                        </Box>
                      ),
                    },
                    {
                      field: "status",
                      headerName: "Status do pedido",
                      width: 160,
                      headerAlign: "center",
                      align: "center",
                      renderCell: (params) => (
                        <Chip
                          size="small"
                          label={params.row.status}
                          color="primary"
                        />
                      ),
                    },
                  ]}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  checkboxSelection={false}
                  disableSelectionOnClick
                  localeText={
                    ptBR.components.MuiDataGrid.defaultProps.localeText
                  }
                />
              </Box>
            )}
          </Stack>

          <Stack
            sx={{
              width: { xs: "100%", md: "50%" },
            }}
            direction="column"
          >
            <Typography variant="body2" fontWeight={"bold"}>
              Pedidos em entrega
            </Typography>

            {ordersList.filter(
              (objeto) => objeto.status === "Saiu para entrega"
            ).length === 0 ? (
              <NoData
                primaryColor={theme.palette.primary.main}
                description={
                  <Stack direction="column" spacing={4} maxWidth={300}>
                    <Typography variant="body2" textAlign="center">
                      Sem Pedidos no momento. Adicione Pedidos ou aguarde seus
                      clientes adicionarem pedidos pelo site.
                    </Typography>
                  </Stack>
                }
                style={{
                  width: 250,
                  height: 250,
                }}
              />
            ) : (
              <Box
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === "light"
                      ? "#FFF"
                      : theme.palette.grey[800],
                  height: 650,
                  width: "100%",
                  mt: 2,
                }}
              >
                <DataGrid
                  getRowId={(row) => {
                    return row.id;
                  }}
                  rowHeight={100}
                  initialState={{
                    sorting: {
                      sortModel: [{ field: "createdAt", sort: "asc" }],
                    },
                  }}
                  rows={ordersList.filter(
                    (objeto) => objeto.status === "Saiu para entrega"
                  )}
                  columns={[
                    {
                      field: "clientObject",
                      headerName: "Cliente",
                      flex: 1,
                      renderCell: (params) => (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography fontWeight={"bold"}>
                            {params.row.clientObject.name}
                          </Typography>
                          <Typography variant={"caption"}>
                            {`${params.row.clientObject.street}, ${params.row.clientObject.number}, ${params.row.clientObject.neigborhood}, ${params.row.clientObject.city}-${params.row.clientObject.state}, CEP: ${params.row.clientObject.zipcode}`}
                          </Typography>
                          <Typography
                            component={"a"}
                            color="primary"
                            variant="body2"
                            href={`tel:${celular(
                              params.row.clientObject.phoneNumber
                            )}`}
                          >
                            {celular(params.row.clientObject.phoneNumber)}
                          </Typography>

                          <Typography variant="body2">
                            {formatCurrency(params.row.total)}
                          </Typography>
                        </Box>
                      ),
                    },
                    {
                      field: "status",
                      headerName: "Status do pedido",
                      width: 160,
                      headerAlign: "center",
                      align: "center",
                      renderCell: (params) => (
                        <Chip
                          size="small"
                          label={params.row.status}
                          color="primary"
                        />
                      ),
                    },
                  ]}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  checkboxSelection={false}
                  disableSelectionOnClick
                  localeText={
                    ptBR.components.MuiDataGrid.defaultProps.localeText
                  }
                />
              </Box>
            )}
          </Stack>
        </Box>
      </Box>

      <Box
        sx={{
          margin: "18px 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" fontWeight={"bold"}>
          Produtos mais vendidos
        </Typography>

        {mostSoldItems.length === 0 ? (
          <NoData
            primaryColor={theme.palette.primary.main}
            description={
              <Stack direction="column" spacing={4} maxWidth={300}>
                <Typography variant="body2" textAlign="center">
                  Sem produtos mais vendidos no momento. Faça uma venda para que
                  apareçam aqui.
                </Typography>
              </Stack>
            }
            style={{
              width: 250,
              height: 250,
            }}
          />
        ) : (
          <Box
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? "#FFF"
                  : theme.palette.grey[800],
              height: 650,
              width: "100%",
              mt: 2,
            }}
          >
            <DataGrid
              getRowId={(row) => {
                return row.id;
              }}
              rowHeight={100}
              initialState={{
                sorting: {
                  sortModel: [{ field: "quantitySold", sort: "asc" }],
                },
              }}
              rows={mostSoldItems}
              columns={[
                {
                  field: "quantitySold",
                  headerName: "Qtd",
                  width: 61,
                  align: "center",
                },
                {
                  field: "product",
                  headerName: "Produto",
                  flex: 1,
                  renderCell: (params) => (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        alignItems: "center",
                      }}
                    >
                      <CardMedia
                        component="img"
                        sx={{
                          width: 90,
                          height: 90,
                          display: { sm: "block" },
                          borderRadius: 1,
                        }}
                        image={params.row.productObject?.featuredImage}
                        alt={"imagem do produto"}
                      />

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography fontWeight={"bold"}>
                          {params.row.productObject.name}
                        </Typography>
                        <Typography variant={"caption"}>
                          {params.row.productObject.description}
                        </Typography>

                        <Typography variant="body2">
                          {formatCurrency(
                            params.row.productObject.currentValue
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  ),
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
      </Box>

      <Box
        sx={{
          margin: "18px 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" fontWeight={"bold"}>
          Faturamento
        </Typography>
        <Box
          sx={{
            margin: "18px 0",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Stack
            sx={{
              width: { xs: "100%", md: "50%" },
            }}
            direction="column"
          >
            <Typography variant="body2" fontWeight={"bold"}>
              Por cliente
            </Typography>

            {customersWithMostOrders.length === 0 ? (
              <NoData
                primaryColor={theme.palette.primary.main}
                description={
                  <Stack direction="column" spacing={4} maxWidth={300}>
                    <Typography variant="body2" textAlign="center">
                      Sem Clientes mais vendidos no momento. Faça uma venda para
                      que apareçam aqui.
                    </Typography>
                  </Stack>
                }
                style={{
                  width: 250,
                  height: 250,
                }}
              />
            ) : (
              <Box
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === "light"
                      ? "#FFF"
                      : theme.palette.grey[800],
                  height: 650,
                  width: "100%",
                  mt: 2,
                }}
              >
                <DataGrid
                  getRowId={(row) => {
                    return row.customerId;
                  }}
                  rowHeight={100}
                  initialState={{
                    sorting: {
                      sortModel: [{ field: "orderCount", sort: "asc" }],
                    },
                  }}
                  rows={customersWithMostOrders}
                  columns={[
                    {
                      field: "orderCount",
                      headerName: "Qtd",
                      width: 61,
                      align: "center",
                    },
                    {
                      field: "product",
                      headerName: "Cliente",
                      flex: 1,
                      renderCell: (params) => (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 2,
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Typography fontWeight={"bold"}>
                              {params.row.clientObject.name}
                            </Typography>
                            <Typography variant={"caption"}>
                              {`${params.row.clientObject.neigborhood}, ${params.row.clientObject.city}-${params.row.clientObject.state}`}
                            </Typography>
                            <Typography
                              component={"a"}
                              color="primary"
                              variant="body2"
                              href={`tel:${celular(
                                params.row.clientObject.phoneNumber
                              )}`}
                            >
                              {celular(params.row.clientObject.phoneNumber)}
                            </Typography>
                          </Box>
                        </Box>
                      ),
                    },
                    {
                      field: "totalSpent",
                      headerName: "Total",
                      width: 130,
                      headerAlign: "right",
                      align: "right",
                      renderCell: (params) => (
                        <Typography variant={"body1"}>
                          {formatCurrency(params.row.totalSpent)}
                        </Typography>
                      ),
                    },
                  ]}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  checkboxSelection={false}
                  disableSelectionOnClick
                  localeText={
                    ptBR.components.MuiDataGrid.defaultProps.localeText
                  }
                />
              </Box>
            )}
          </Stack>
          <Stack
            sx={{
              width: { xs: "100%", md: "50%" },
            }}
            direction="column"
          >
            <Typography variant="body2" fontWeight={"bold"}>
              Por Categorias
            </Typography>
            {categorySalesData.length === 0 ? (
              <NoData
                primaryColor={theme.palette.primary.main}
                description={
                  <Stack direction="column" spacing={4} maxWidth={300}>
                    <Typography variant="body2" textAlign="center">
                      Sem Categorias mais vendidos no momento. Faça uma venda
                      para que apareçam aqui.
                    </Typography>
                  </Stack>
                }
                style={{
                  width: 250,
                  height: 250,
                }}
              />
            ) : (
              <Box
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === "light"
                      ? "#FFF"
                      : theme.palette.grey[800],
                  height: 650,
                  width: "100%",
                  mt: 2,
                }}
              >
                <DataGrid
                  getRowId={(row) => {
                    return row.id;
                  }}
                  rowHeight={100}
                  initialState={{
                    sorting: {
                      sortModel: [{ field: "quantitySold", sort: "asc" }],
                    },
                  }}
                  rows={categorySalesData}
                  columns={[
                    {
                      field: "quantitySold",
                      headerName: "Qtd",
                      width: 61,
                      align: "center",
                    },
                    {
                      field: "id",
                      headerName: "Categoria",
                      flex: 1,
                      renderCell: (params) => (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 2,
                            alignItems: "center",
                          }}
                        >
                          <CardMedia
                            component="img"
                            sx={{
                              width: 90,
                              height: 90,
                              display: { sm: "block" },
                              borderRadius: 1,
                            }}
                            image={
                              categoriesList.filter(
                                (item) => item.id === params.row.categoryId
                              )[0].avatar
                            }
                            alt={"imagem do produto"}
                          />

                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Typography fontWeight={"bold"}>
                              {
                                categoriesList.filter(
                                  (item) => item.id === params.row.categoryId
                                )[0].name
                              }
                            </Typography>
                          </Box>
                        </Box>
                      ),
                    },
                    {
                      field: "totalRevenue",
                      headerName: "Total",
                      width: 130,
                      headerAlign: "right",
                      align: "right",
                      renderCell: (params) => (
                        <Typography variant={"body1"}>
                          {formatCurrency(params.row.totalRevenue)}
                        </Typography>
                      ),
                    },
                  ]}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  checkboxSelection={false}
                  disableSelectionOnClick
                  localeText={
                    ptBR.components.MuiDataGrid.defaultProps.localeText
                  }
                />
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </DrawerComponent>
  );
}
