import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  useTheme
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Copyright from "../componentes/Copyright";
import SEO from "../componentes/SEO";
import { useAuth } from "../hooks/useAuth";
import { useLoader } from "../hooks/useLoader";

export default function Recovery() {
  const theme = useTheme();
  const { setIsLoading } = useLoader();
  const { handleForgotUser } = useAuth();
  const navigate = useNavigate();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      email: Yup.string().required("O campo Email é obrigatório"),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (formValues) => {
    try {
      setIsLoading(true);
      await handleForgotUser(formValues.email);
    } catch (error) {
      console.log("handleSubmitForm error", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <SEO title="Recuperar senha" />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random?food)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Recuperação de senha
          </Typography>

          <Typography
            sx={{ my: 2 }}
            component="p"
            variant="body2"
            maxWidth={350}
            textAlign="center"
          >
            Digite seu email cadastrado para receber as instruções de
            recuperação de senha
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              label="Email"
              margin="normal"
              fullWidth
              id="email"
              onChange={(event) =>
                formik.setFieldValue("email", event.target.value)
              }
              value={formik.values.email}
              helperText={formik.errors.email}
              error={!!formik.errors.email}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, borderRadius: 8 }}
            >
              Solicitar recuperação
            </Button>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                alignItems: "center",
                justfyContent: "center",
                mt: 2,
              }}
            >
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                }}
              >
                <Typography variant="body2">
                  {"Já tem conta? Então entre no sistema"}
                </Typography>
              </Link>
            </Box>
            <Copyright color="gray.800" />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
