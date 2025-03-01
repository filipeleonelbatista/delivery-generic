import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
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
import { useEffect } from "react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import * as Yup from "yup";
import Copyright from "../componentes/Copyright";
import SEO from "../componentes/SEO";
import { useAuth } from "../hooks/useAuth";
import { useLoader } from "../hooks/useLoader";

export default function Login() {
  const theme = useTheme();
  const { setIsLoading } = useLoader();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const { signInUser } = useAuth();
  const navigate = useNavigate();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      email: Yup.string().required("O campo Email é obrigatório"),
      password: Yup.string()
        .min(6, "A senha deve ter pelo menos 6 caracteres")
        .required("A senha é obrigatória"),
      remember: Yup.boolean(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
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
      if (formValues.remember) {
        secureLocalStorage.setItem(
          "remember",
          JSON.stringify({
            email: formValues.email,
            password: formValues.password,
          })
        );
      }
      const isLogged = await signInUser(formValues.email, formValues.password);
      if (isLogged.status) {
        if (isLogged?.user?.isActive) {
          navigate("/inicio");
        } else {
          alert(
            "Este usuário precisa ser aprovado pelo administrador do sistema."
          );
        }
      } else {
        alert(isLogged.message);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const executeAsync = async () => {
      const response = secureLocalStorage.getItem("remember");
      if (response) {
        const user = JSON.parse(response);
        const isLogged = await signInUser(user.email, user.password);
        if (isLogged.status) {
          if (isLogged?.user?.isActive) {
            navigate("/inicio");
          } else {
            alert(
              "Este usuário precisa ser aprovado pelo administrador do sistema."
            );
          }
        } else {
          alert(isLogged.message);
        }
      }
    };
    executeAsync();
  }, []);

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <SEO title="Login" />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(./login_bg.jpg)",
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
            Entrar
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
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(event) =>
                    formik.setFieldValue("remember", event.target.checked)
                  }
                  checked={formik.values.remember}
                  color="primary"
                />
              }
              label="Lembrar de mim"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, borderRadius: 8 }}
            >
              Entrar
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  to="/recuperacao"
                  style={{
                    textDecoration: "none",
                    color: theme.palette.primary.main,
                  }}
                >
                  <Typography variant="body2">Esqueceu a senha?</Typography>
                </Link>
              </Grid>
              <Grid item>
                <Link
                  to="/cadastro"
                  style={{
                    textDecoration: "none",
                    color: theme.palette.primary.main,
                  }}
                >
                  <Typography variant="body2">
                    {"Não tem conta? Faça seu cadastro!"}
                  </Typography>
                </Link>
              </Grid>
            </Grid>
            <Copyright color="gray.800" />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
