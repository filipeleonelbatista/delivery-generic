import {
  Box,
  Button,
  Card,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { useLoader } from "../hooks/useLoader";
import { useToast } from "../hooks/useToast";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { celular } from "../utils/string";

export default function Floating() {
  const { setIsLoading } = useLoader();
  const { addToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [showCtaForm, setShowCtaForm] = useState(true);

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required("O campo Nome é obrigatório"),
      phone: Yup.string()
        .required("O campo Whatsapp é obrigatório")
        .length(15, "Numero digitado incorreto!"),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  async function handleSubmitForm(formValues) {
    let myIp;

    setIsLoading(true);

    await fetch("https://api.ipify.org/?format=json")
      .then((results) => results.json())
      .then((data) => {
        myIp = data.ip;
      });

    if (!false) {
      addToast({
        messate: `Houve um problema ao enviar seu contato. Estaremos encaminhando você para o nosso WhatsApp`,
      });

      let whatsPhone = `+5551992736445`;
      let whatsMsg = `Olá, me chamo *${formValues.name}* vi seu app e gostaria de conversar mais com você.`;
      let url = `https://api.whatsapp.com/send?phone=${whatsPhone}&text=${encodeURI(
        whatsMsg
      )}`;

      window.open(url, "_blank");
    } else {
      addToast({
        messate: `Salvamos seu contato. Em breve estaremos entrando em contato com você`,
      });
    }

    formik.resetForm();

    setIsLoading(false);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCtaForm(false);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <IconButton
        onClick={() => {
          setShowForm(!showForm);
          if (showForm) {
            formik.resetForm();
          }
        }}
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          width: 64,
          height: 64,
          position: "fixed",
          zIndex: 1500,
          bottom: 24,
          right: 24,
          boxShadow: 3,
          "&:hover": {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette.primary.main
                : theme.palette.primary.light,
          },
          "& > svg": {
            fill: (theme) =>
              theme.palette.mode === "dark" ? "#181818" : "#FFF",
          },
        }}
        color="primary"
        variant="contained"
      >
        <WhatsAppIcon color="#FFF" />
      </IconButton>
      <Card
        sx={{
          p: 1.5,
          boxShadow: 3,
          position: "fixed",
          zIndex: 200,
          bottom: 32,
          right: 100,
          transition: "all 0.5s",
          opacity: showCtaForm ? 1 : 0,
        }}
      >
        <Typography sx={{ width: "100%", textAlign: "center" }} variant="body1">
          Chama no WhatsApp!
        </Typography>
      </Card>
      <Box
        sx={{
          transition: "0.5s",
          position: "fixed",
          zIndex: 200,
          bottom: showForm ? 100 : -600,
          right: 24,
          width: 300,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 3,
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
        }}
      >
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.primary.dark,
            height: 90,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& > p": {
              color: (theme) =>
                theme.palette.mode === "dark" ? "#181818" : "#FFF",
            },
          }}
        >
          <Typography
            sx={{ maxWidth: 250, width: "100%", textAlign: "center" }}
            variant="body1"
            color="white"
          >
            Digite seu Nome/WhatsApp para entrar em contato.
          </Typography>
        </Box>
        <Box
          sx={{
            py: 4,
            px: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            backgroundColor: (theme) =>
              theme.palette.mode === "light" ? "#FFF" : theme.palette.grey[900],
          }}
          component="form"
          onSubmit={formik.handleSubmit}
        >
          <TextField
            fullWidth
            id="whats-name"
            name="name"
            label="Seu Nome"
            value={formik.values.name}
            helperText={formik.errors.name}
            error={!!formik.errors.name}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            id="whats-phone"
            name="phone"
            label="Seu WhatsApp"
            value={formik.values.phone}
            helperText={formik.errors.phone}
            error={!!formik.errors.phone}
            inputProps={{ maxLength: 15 }}
            onChange={(event) => {
              formik.setFieldValue("phone", celular(event.target.value));
            }}
          />
          <Button color="primary" variant="contained" type="submit">
            Chamar no WhatsApp
          </Button>
        </Box>
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.primary.dark,
            height: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            "& > span": {
              color: (theme) =>
                theme.palette.mode === "dark" ? "#181818" : "#FFF",
            },
          }}
        >
          <Typography
            sx={{ maxWidth: 250, width: "100%", textAlign: "center" }}
            variant="caption"
            color="white"
          >
            Não enviamos nada além do contato. É uma promessa!
          </Typography>
        </Box>
      </Box>
    </>
  );
}
