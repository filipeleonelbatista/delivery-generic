import SaveIcon from "@mui/icons-material/Save";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as Yup from "yup";

import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [20, 20],
});

L.Marker.prototype.options.icon = DefaultIcon;

import { useAuth } from "../../../hooks/useAuth";
import { useConfig } from "../../../hooks/useConfig";
import { useLoader } from "../../../hooks/useLoader";
import { useToast } from "../../../hooks/useToast";
import { maskCurrency, parseToFloat } from "../../../utils/formatCurrency";
import { getCepInformation } from "../../../utils/getCepInformation";
import { cep } from "../../../utils/string";

export default function DeliveryConfigs() {
  const { config, updateConfig } = useConfig();
  const { setIsLoading } = useLoader();
  const { addToast } = useToast();
  const { user } = useAuth();

  const [map, setMap] = useState(null);

  const [position, setPosition] = useState();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      isFixedDeliveryTax: Yup.boolean(),
      isDeliveryOpen: Yup.boolean(),
      deliveryTaxValue: Yup.string(),
      minimumDeliveryTime: Yup.string(),
      zipcode: Yup.string(),
      street: Yup.string(),
      number: Yup.string(),
      neigborhood: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      lat: Yup.number(),
      lng: Yup.number(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      lat: config.location.lat ?? 0,
      lng: config.location.lng ?? 0,
      minimumDeliveryTime: config.minimumDeliveryTime ?? "",
      deliveryTaxValue: maskCurrency(config.deliveryTaxValue) ?? "0,00",
      isFixedDeliveryTax: config.isFixedDeliveryTax ?? false,
      isDeliveryOpen: config.isDeliveryOpen ?? false,
      zipcode: config.zipcode !== "" ? cep(config.zipcode) : "",
      street: config.street ?? "",
      number: config.number ?? "",
      neigborhood: config.neigborhood ?? "",
      city: config.city ?? "",
      state: config.state ?? "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (formValues) => {
    try {
      setIsLoading(true);

      const data = {
        ...config,
        location: {
          lat: formValues.lat,
          lng: formValues.lng,
        },
        minimumDeliveryTime: parseToFloat(formValues.minimumDeliveryTime),
        deliveryTaxValue: parseToFloat(formValues.deliveryTaxValue),
        isFixedDeliveryTax: formValues.isFixedDeliveryTax,
        isDeliveryOpen: formValues.isDeliveryOpen,
        street: formValues.street,
        zipcode: formValues.zipcode,
        number: formValues.number,
        neigborhood: formValues.neigborhood,
        city: formValues.city,
        state: formValues.state,
        updatedAt: new Date(Date.now()).getTime(),
        updatedBy: user.uid,
      };

      await updateConfig(data);

      addToast({
        message: "Informações de entrega atualizados!",
      });
    } catch (error) {
      console.log("handleSubmit error", error);

      addToast({
        severity: "error",
        message: "Erro ao Atualizar os Informações de entrega!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onMove = useCallback(() => {
    formik.setFieldValue("lat", map.getCenter().lat);
    formik.setFieldValue("lng", map.getCenter().lng);
    setPosition(map.getCenter());
  }, [map]);

  useEffect(() => {
    if (map) {
      map.on("move", onMove);
      return () => {
        map.off("move", onMove);
      };
    }
  }, [map, onMove]);

  const getCurrentLocation = () => {
    if (config.location.lat && config.location.lng) {
      setPosition(config.location);
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        formik.setFieldValue("lat", latitude);
        formik.setFieldValue("lng", longitude);
        setPosition({ lat: latitude, lng: longitude });
      });
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <Stack>
      <Grid container justifyContent="flex-end" sx={{ width: "100%" }}>
        <Button
          variant="contained"
          onClick={formik.handleSubmit}
          startIcon={<SaveIcon />}
          sx={{ mr: 2 }}
        >
          Salvar
        </Button>
      </Grid>
      <Box
        sx={{
          width: "100%",
          mt: 1,
        }}
      >
        <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
          Endereço do estabelecimento
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="CEP"
              inputProps={{
                maxLength: 9,
              }}
              fullWidth
              id="zipcode"
              onChange={(event) => {
                formik.setFieldValue("zipcode", cep(event.target.value));
              }}
              onBlur={async (event) => {
                if (event.target.value.length === 9) {
                  try {
                    setIsLoading(true);
                    const resultCep = await getCepInformation(
                      event.target.value
                    );
                    if (resultCep.data.erro) {
                      addToast({
                        message: "CEP Não encontrado!",
                        severity: "warning",
                      });
                    } else {
                      if (resultCep.status === 200) {
                        formik.setFieldValue(
                          "neigborhood",
                          resultCep.data.bairro
                        );
                        formik.setFieldValue(
                          "street",
                          resultCep.data.logradouro
                        );
                        formik.setFieldValue("city", resultCep.data.localidade);
                        formik.setFieldValue("state", resultCep.data.uf);

                        addToast({
                          message: "CEP Encontrado!",
                          severity: "success",
                        });
                      } else {
                        addToast({
                          message: "Não foi possivel pesquisar o CEP!",
                          severity: "error",
                        });
                      }
                    }
                  } catch (error) {
                    console.log("locateCep error", error);
                  } finally {
                    setIsLoading(false);
                  }
                }
              }}
              value={formik.values.zipcode}
              helperText={formik.errors.zipcode}
              error={!!formik.errors.zipcode}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Rua"
              fullWidth
              id="street"
              onChange={(event) =>
                formik.setFieldValue("street", event.target.value)
              }
              value={formik.values.street}
              helperText={formik.errors.street}
              error={!!formik.errors.street}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Numero"
              fullWidth
              id="number"
              onChange={(event) =>
                formik.setFieldValue("number", event.target.value)
              }
              value={formik.values.number}
              helperText={formik.errors.number}
              error={!!formik.errors.number}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Bairro"
              fullWidth
              id="neigborhood"
              onChange={(event) =>
                formik.setFieldValue("neigborhood", event.target.value)
              }
              value={formik.values.neigborhood}
              helperText={formik.errors.neigborhood}
              error={!!formik.errors.neigborhood}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Cidade"
              fullWidth
              id="city"
              onChange={(event) =>
                formik.setFieldValue("city", event.target.value)
              }
              value={formik.values.city}
              helperText={formik.errors.city}
              error={!!formik.errors.city}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Estado"
              fullWidth
              id="state"
              onChange={(event) =>
                formik.setFieldValue("state", event.target.value)
              }
              value={formik.values.state}
              helperText={formik.errors.state}
              error={!!formik.errors.state}
            />
          </Grid>
        </Grid>

        <Stack direction="column" sx={{ my: 2 }} spacing={1}>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(event) =>
                  formik.setFieldValue("isDeliveryOpen", event.target.checked)
                }
                checked={formik.values.isDeliveryOpen}
                color="primary"
              />
            }
            label="Delivery aberto"
          />
          <Stack direction="row" spacing={2} sx={{ my: 2 }}>
            <FormControl fullWidth sx={{ my: 1, maxWidth: 200 }}>
              <InputLabel htmlFor="minimumDeliveryTime">
                Tempo de entrega
              </InputLabel>
              <OutlinedInput
                label="Tempo de entrega"
                margin="normal"
                fullWidth
                endAdornment={
                  <InputAdornment position="end">min.</InputAdornment>
                }
                startAdornment={
                  <InputAdornment position="start">
                    <AccessTimeIcon />
                  </InputAdornment>
                }
                id="minimumDeliveryTime"
                onChange={(event) =>
                  formik.setFieldValue(
                    "minimumDeliveryTime",
                    event.target.value
                  )
                }
                value={formik.values.minimumDeliveryTime}
                error={!!formik.errors.minimumDeliveryTime}
              />

              {!!formik.errors.minimumDeliveryTime && (
                <FormHelperText
                  error={!!formik.errors.minimumDeliveryTime}
                  id="minimumDeliveryTime-helper-text"
                >
                  {formik.errors.minimumDeliveryTime}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ my: 1, maxWidth: 200 }}>
              <InputLabel htmlFor="deliveryTaxValue">Valor do frete</InputLabel>
              <OutlinedInput
                label="Valor do frete"
                margin="normal"
                fullWidth
                startAdornment={
                  <InputAdornment position="start">R$</InputAdornment>
                }
                id="deliveryTaxValue"
                onChange={(event) =>
                  formik.setFieldValue(
                    "deliveryTaxValue",
                    maskCurrency(event.target.value)
                  )
                }
                value={formik.values.deliveryTaxValue}
                error={!!formik.errors.deliveryTaxValue}
              />

              {!!formik.errors.deliveryTaxValue && (
                <FormHelperText
                  error={!!formik.errors.deliveryTaxValue}
                  id="deliveryTaxValue-helper-text"
                >
                  {formik.errors.deliveryTaxValue}
                </FormHelperText>
              )}
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(event) =>
                    formik.setFieldValue(
                      "isFixedDeliveryTax",
                      event.target.checked
                    )
                  }
                  checked={formik.values.isFixedDeliveryTax}
                  color="primary"
                />
              }
              label="Frete fixo"
            />
          </Stack>

          <Typography variant="caption">
            O Frete será cobrado o valor por Km do endereço solicitado se passar
            o valor definido, se for menor a taxa de entrega sera o valor do
            frete, se for fixo será o mesmo valor sempre, independente da
            distância.
          </Typography>
        </Stack>

        <Stack direction="column" sx={{ my: 2 }} spacing={1}>
          {position && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h5" color="primary">
                Sua localização
              </Typography>
              <Typography variant="body2">
                Localização precisa para calcular o frete baseado no
                deslocamento
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 300,
                  borderRadius: 2,
                  mt: 2,
                  overflow: "hidden",
                }}
              >
                <MapContainer
                  key="store-location"
                  id="store-location"
                  center={position}
                  zoom={15}
                  style={{ width: "100%", height: "100%", zIndex: 1 }}
                  ref={(map) => {
                    setMap(map);
                  }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={position}>
                    <Popup>Sua localização</Popup>
                  </Marker>
                </MapContainer>
              </Box>
            </Box>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
