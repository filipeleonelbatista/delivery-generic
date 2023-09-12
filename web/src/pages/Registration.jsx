import AssignmentIcon from "@mui/icons-material/Assignment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  useTheme,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Copyright from "../componentes/Copyright";
import SEO from "../componentes/SEO";
import { useAuth } from "../hooks/useAuth";
import { useLoader } from "../hooks/useLoader";

export default function Registration() {
  const theme = useTheme();
  const { setIsLoading } = useLoader();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const { RegisterUser } = useAuth();
  const navigate = useNavigate();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required("O campo Local é obrigatório"),
      email: Yup.string().required("O campo Email é obrigatório"),
      whatsapp: Yup.string().required("O campo Email é obrigatório"),
      password: Yup.string()
        .min(6, "A senha deve ter pelo menos 6 caracteres")
        .required("A senha é obrigatória"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "As senhas não coincidem")
        .required("Confirme sua senha"),
      acceptTerms: Yup.boolean().oneOf(
        [true],
        "Você deve concordar com os termos"
      ),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      whatsapp: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
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
        email: formValues.email,
        password: formValues.password,
        user: {
          email: formValues.email,
          password: formValues.password,
          name: formValues.name,
          avatar: "",
          isActive: false,
        },
      };

      const result = await RegisterUser(data);

      if (result) {
        alert(
          "Seu usuário foi criado, peça para o administrador aprovar seu acesso para entrar!"
        );
        navigate("/login");
      }
    } catch (error) {
      console.log("handleSubmitForm error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <SEO title="Cadastro" />
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
            <AssignmentIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Faça seu cadastro
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              label="Nome do usuário"
              margin="normal"
              fullWidth
              id="name"
              onChange={(event) =>
                formik.setFieldValue("name", event.target.value)
              }
              value={formik.values.name}
              helperText={formik.errors.name}
              error={!!formik.errors.name}
            />
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
            <TextField
              label="Whatsapp"
              margin="normal"
              fullWidth
              id="whatsapp"
              onChange={(event) =>
                formik.setFieldValue("whatsapp", event.target.value)
              }
              value={formik.values.whatsapp}
              helperText={formik.errors.whatsapp}
              error={!!formik.errors.whatsapp}
            />
            <FormControl sx={{ my: 1 }} fullWidth variant="outlined">
              <InputLabel htmlFor="password">Senha</InputLabel>
              <OutlinedInput
                label="Senha"
                fullWidth
                id="password"
                onChange={(event) =>
                  formik.setFieldValue("password", event.target.value)
                }
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                error={!!formik.errors.password}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />

              {!!formik.errors.password && (
                <FormHelperText
                  error={!!formik.errors.password}
                  id="password-helper-text"
                >
                  {formik.errors.password}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ my: 1 }} fullWidth variant="outlined">
              <InputLabel htmlFor="confirmPassword">Confirmar senha</InputLabel>
              <OutlinedInput
                label="Confirmar Senha"
                fullWidth
                id="confirmPassword"
                onChange={(event) =>
                  formik.setFieldValue("confirmPassword", event.target.value)
                }
                type={showConfirmPassword ? "text" : "password"}
                value={formik.values.confirmPassword}
                error={!!formik.errors.confirmPassword}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />

              {!!formik.errors.confirmPassword && (
                <FormHelperText
                  error={!!formik.errors.confirmPassword}
                  id="confirmPassword-helper-text"
                >
                  {formik.errors.confirmPassword}
                </FormHelperText>
              )}
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(event) =>
                    formik.setFieldValue("acceptTerms", event.target.checked)
                  }
                  checked={formik.values.acceptTerms}
                  color="primary"
                />
              }
              label="Aceito os termos de uso e políticas de privacidades"
            />

            {!!formik.errors.acceptTerms && (
              <FormHelperText
                error={!!formik.errors.acceptTerms}
                id="acceptTerms-helper-text"
              >
                {formik.errors.acceptTerms}
              </FormHelperText>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, borderRadius: 8 }}
            >
              Cadastrar
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
                <Typography href="/login" variant="body2">
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
