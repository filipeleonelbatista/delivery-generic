import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import ctaPhone from "../assets/images/landing/mockup-cta-2.png";
import petImage from "../assets/images/pet.jpg";
import AcceptTerms from "../componentes/AcceptTerms";
import PetsIcon from "@mui/icons-material/Pets";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ContactSection from "../componentes/ContactSection";
import Floating from "../componentes/Floating";
import Footer from "../componentes/LandingFooter";
import HomeNavigation from "../componentes/HomeNavigation";
import { useResize } from "../hooks/useResize";
import { useToast } from "../hooks/useToast";
import { celular } from "../utils/string";

export default function Landing() {
  const size = useResize();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isShow, setIsShow] = useState(false);
  const [myIp, setMyIp] = useState("");

  async function getCurrentIP() {
    await fetch("https://api.ipify.org/?format=json")
      .then((results) => results.json())
      .then((data) => {
        setMyIp(data.ip);
      });
  }

  const handleCadastrar = () => {};

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required("O campo Nome é obrigatório"),
      phone: Yup.string()
        .required("O campo Celular/Whatsapp é obrigatório")
        .length(15, "Numero digitado incorreto!"),
      email: Yup.string()
        .required("O campo Email é obrigatório")
        .email("Digite um Email válido"),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  // function handleDownload() {
  //   const downloadLink = document.createElement("a");
  //   downloadLink.href = "./dicas_para_sua_loja.pdf";
  //   downloadLink.download = "dicas_para_sua_loja.pdf";
  //   document.body.appendChild(downloadLink);
  //   setTimeout(() => {
  //     downloadLink.click();
  //   }, 500);
  //   document.body.removeChild(downloadLink);
  // }

  async function handleSubmitForm(formValues) {
    // handleDownload();
    // if (
    //   await conversion(
    //     formValues.name,
    //     formValues.email,
    //     "Modal leaving home",
    //     formValues.phone,
    //     myIp,
    //     window.location.href,
    //     `Quantidade de pets: ${formValues.quant}`
    //   )
    // ) {
    //   setIsShow(false);
    //   localStorage.setItem("contact", true);
    //   addToast({
    //     message:
    //       "Contato enviado com sucesso! Aguarde que enviaremos seu conteúdo!",
    //   });
    //   return;
    // }
  }

  useEffect(() => {
    getCurrentIP();
  }, []);

  return (
    <Box
      component="div"
      onMouseLeave={() => {
        const isContacted = localStorage.getItem("contact");
        if (isContacted === null || JSON.parse(isContacted) === false) {
          setIsShow(true);
        }
      }}
      sx={{
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "auto",
        backgroundColor: "#fff",
        color: "#000",
      }}
    >
      <Modal
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        open={isShow}
        onClose={() => {
          setIsShow(false);
          localStorage.setItem("contact", true);
        }}
      >
        <Card
          sx={{
            width: size[0] > 720 ? 870 : "90vw",
            height: "90vh",
            outline: "none",
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => {
              setIsShow(false);
              localStorage.setItem("contact", true);
            }}
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: "#00000033",
            }}
          >
            <CloseIcon />
          </IconButton>
          <Grid container sx={{ height: "100vh" }}>
            {size[0] > 720 && (
              <Grid item xs={6} sx={{ pl: 0, pt: 0, height: "100vh" }}>
                <CardMedia
                  component="img"
                  src={petImage}
                  sx={{
                    height: "100vh",
                  }}
                  alt="PET"
                />
              </Grid>
            )}
            <Grid
              item
              xs={size[0] > 720 ? 6 : 12}
              sx={{ p: 0, height: "100vh" }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  flexDirection: "column",
                  gap: 1,
                  overflow: "auto",
                  alignItems: "center",
                  py: 2,
                  px: 1,
                }}
              >
                <Typography variant="h5" textAlign="center">
                  Não vá agora. Preparamos um conteúdo especial
                </Typography>
                <Typography variant="body1" textAlign="center">
                  Deixe seu email e Whatsapp que enviaremos pra você conteúdo
                  especial sobre cuidados com o pet. É de graça e prometemos que
                  não enviaremos Span.
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    maxWidth: 320,
                    width: "100%",
                    flexDirection: "column",
                    gap: 2,
                    pt: 2,
                  }}
                  component="form"
                  onSubmit={formik.handleSubmit}
                >
                  <TextField
                    fullWidth
                    id="modal-name"
                    name="name"
                    label="Nome completo"
                    value={formik.values.name}
                    error={!!formik.errors.name}
                    helperText={formik.errors.name}
                    onChange={formik.handleChange}
                  />
                  <TextField
                    fullWidth
                    id="modal-phone"
                    name="phone"
                    label="Celular/WhatsApp"
                    value={formik.values.phone}
                    error={!!formik.errors.phone}
                    helperText={formik.errors.phone}
                    inputProps={{ maxLength: 15 }}
                    onChange={(event) => {
                      formik.setFieldValue(
                        "phone",
                        celular(event.target.value)
                      );
                    }}
                  />
                  <TextField
                    fullWidth
                    id="modal-email"
                    name="email"
                    label="Coloque seu melhor email"
                    value={formik.values.email}
                    error={!!formik.errors.email}
                    helperText={formik.errors.email}
                    onChange={formik.handleChange}
                  />
                  <TextField
                    fullWidth
                    type="number"
                    id="modal-how-many-pets"
                    name="quant"
                    label="Quantos pets você tem hoje?"
                    value={formik.values.quant}
                    error={!!formik.errors.quant}
                    helperText={formik.errors.quant}
                    onChange={formik.handleChange}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<PetsIcon />}
                  >
                    Quero receber o conteúdo
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Modal>
      <HomeNavigation />
      <Box
        sx={{
          backgroundColor: "#f9f9f9",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* CTA */}
        <Box
          sx={{
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pt: 12,
            px: 1,
            pb: 12,
            backgroundColor: (theme) => theme.palette.primary.light,
          }}
        >
          <Container
            sx={{
              display: "flex",
              flexDirection: size[0] < 720 ? "column" : "row",
              alignItems: size[0] < 720 ? "center" : "flex-start",
              justifyContent: size[0] < 720 ? "center" : "flex-start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: size[0] < 720 ? "center" : "flex-start",
                width: "100%",
                gap: 2,
              }}
            >
              <Typography variant="body1" color="white">
                Já pensou em ter seu delivery? 👋
              </Typography>
              <Typography color="white" sx={{ maxWidth: 450 }} variant="h2">
                Meu <b>Whats</b> Delivery é seu delivery online
              </Typography>
              <u></u>
              <Typography color="white" sx={{ maxWidth: 450 }} variant="body1">
                Com o app Meu <b>Whats</b> Delivery seus clientes fazem os
                pedidos online e podem acompanhar em tempo real sem burocracia e
                você tem total controle dos pedidos online.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  my: 2,
                  maxWidth: 450,
                  borderRadius: 8,
                  backgroundColor: "white",
                  color: (theme) => theme.palette.primary.main,
                  "&:hover": {
                    background: (theme) => theme.palette.grey[400],
                  },
                }}
                size="large"
                onClick={handleCadastrar}
              >
                Solicite sua demonstração agora
              </Button>
            </Box>
            <CardMedia
              component="img"
              sx={{
                margin: "1.4rem 0",
                width: "50%",
                height: "auto",
              }}
              src={ctaPhone}
              alt="Phone"
            />
          </Container>
        </Box>

        <Container
          sx={{
            maxWidth: size[0] < 720 ? "80%" : "980px",
            width: "100%",
            paddingBlock: 4,
            marginInline: "auto",
            backgroundColor: "#FFF",
            border: "1px solid #CCC",
            borderRadius: 2,

            display: "flex",
            flexDirection: size[0] < 720 ? "column" : "row",
            justifyContent: size[0] < 720 ? "center" : "space-evenly",
            alignItems: size[0] < 720 ? "center" : "flex-start",
            gap: 3,
            mt: -10,
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h2">+35,3 Bi</Typography>
            <Typography variant="body2" color="primary">
              Em vendas por delivery no Brasil
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography textAlign="center" variant="h2">
              200%
            </Typography>
            <Typography textAlign="center" variant="body2" color="primary">
              Aumente seus ganhos
              <br />
              <small>Vendendo por um delivery proprio</small>
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h2">Agora</Typography>
            <Typography variant="body2" color="primary">
              Solicite uma demonstração
            </Typography>
          </Box>
        </Container>
        {/* CTA */}
        {/* features */}
        <Box
          sx={{
            width: "100vw",
            maxWidth: "980px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            my: 8,
            px: 2,
            gap: 4,
          }}
        >
          <Typography variant="body1" color="primary">
            SERVIÇOS
          </Typography>
          <Typography variant="h2" textAlign="center">
            Veja o que o Meu <b>Whats</b> delivery pode fazer por sua empresa
          </Typography>
          <Grid container spacing={2}>
            <Grid item sx={4}>
              <Card
                sx={{
                  width: 300,
                  height: 250,
                  p: 2.4,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#ffbcbc",
                    borderRadius: "50%",
                  }}
                >
                  <CheckIcon color="primary" />
                </Box>
                <Typography variant="h5">
                  <b>Loja online</b>
                </Typography>
                <Typography variant="body1">
                  Tenha sua loja online e disponível aos seus clientes.
                </Typography>
              </Card>
            </Grid>
            <Grid item sx={4}>
              <Card
                sx={{
                  width: 300,
                  height: 250,
                  p: 2.4,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#ffbcbc",
                    borderRadius: "50%",
                  }}
                >
                  <CheckIcon color="primary" />
                </Box>
                <Typography variant="h5">
                  <b>Acompanhe o pedido</b>
                </Typography>
                <Typography variant="body1">
                  Seu cliente e você podem ter acesso em tempo real ao pedido.
                </Typography>
              </Card>
            </Grid>
            <Grid item sx={4}>
              <Card
                sx={{
                  width: 300,
                  height: 250,
                  p: 2.4,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#ffbcbc",
                    borderRadius: "50%",
                  }}
                >
                  <CheckIcon color="primary" />
                </Box>
                <Typography variant="h5">
                  <b>Painel centralizado</b>
                </Typography>
                <Typography variant="body1">
                  Tenha em mãos todos os pedidos, gráficos, produtos mais
                  vendidos na sua tela!
                </Typography>
              </Card>
            </Grid>
            <Grid item sx={4}>
              <Card
                sx={{
                  width: 300,
                  height: 250,
                  p: 2.4,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#ffbcbc",
                    borderRadius: "50%",
                  }}
                >
                  <CheckIcon color="primary" />
                </Box>
                <Typography variant="h5">
                  <b>Entrega dinâmica</b>
                </Typography>
                <Typography variant="body1">
                  Defina preço fixo da entrega ou calcule a entrega pelo
                  endereço do seu cliente.
                </Typography>
              </Card>
            </Grid>
            <Grid item sx={4}>
              <Card
                sx={{
                  width: 300,
                  height: 250,
                  p: 2.4,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#ffbcbc",
                    borderRadius: "50%",
                  }}
                >
                  <CheckIcon color="primary" />
                </Box>
                <Typography variant="h5">
                  <b>Cupons de desconto</b>
                </Typography>
                <Typography variant="body1">
                  Crie cupons de desconto para seus clientes e para controlar
                  campanhas da sua loja
                </Typography>
              </Card>
            </Grid>
            <Grid item sx={4}>
              <Card
                sx={{
                  width: 300,
                  height: 250,
                  p: 2.4,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#ffbcbc",
                    borderRadius: "50%",
                  }}
                >
                  <CheckIcon color="primary" />
                </Box>
                <Typography variant="h5">
                  <b>Aumente suas vendas</b>
                </Typography>
                <Typography variant="body1">
                  Foque seu tempo em conquistar seu cliente e o resto o sistema
                  cuida pra você!
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
        {/* features */}

        {/* testemonials */}
        {/* <section id="testemonials" className={styles.testemonials}>
          <p>DEPOIMENTOS</p>
          <h2>O que os clientes dizem sobre a CadastraPet</h2>
          <div className={styles.testemonialsList}>
            <div className={styles.testemonial}>
              <FaQuoteLeft color="#566dea" />
              <p>
                Tenha históricos médicos, de vacinação e de medicação completo
                do seu pet em qualquer lugar.
              </p>
              <div className={styles.userInfo}>
                <img src="./images/favicon.png" alt="imagem do usuario" />
                <p>Nome</p>
              </div>
            </div>
            <div className={styles.testemonial}>
              <FaQuoteLeft color="#566dea" />
              <p>
                Tenha históricos médicos, de vacinação e de medicação completo
                do seu pet em qualquer lugar.
              </p>
              <div className={styles.userInfo}>
                <img src="./images/favicon.png" alt="imagem do usuario" />
                <p>Nome</p>
              </div>
            </div>
          </div>
        </section> */}
        {/* testemonials */}
        {/* ctaContact */}
        <Container>
          <Box
            sx={{
              width: "100%",
              py: 4,
              px: 4,
              backgroundColor: (theme) => theme.palette.primary.main,
              borderRadius: 4,
              boxShadow: 3,
              display: "flex",
              flexDirection: size[0] > 720 ? "row" : "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography variant="h3" color="white" textAlign="center">
              Peça agora uma demonstração do sistema agora!
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                borderRadius: 8,
                backgroundColor: "white",
                color: (theme) => theme.palette.primary.main,
                "&:hover": {
                  background: (theme) => theme.palette.grey[400],
                },
              }}
              onClick={handleCadastrar}
            >
              Quero agendar uma demonstração agora!
            </Button>
          </Box>
        </Container>
        {/* ctaContact */}
        {/* video */}
        <Container
          sx={{
            display: "flex",
            flexDirection: size[0] < 720 ? "column-reverse" : "row",
            gap: 3,
            textAlign: size[0] > 720 ? "start" : "center",
            alignItems: "center",
            my: 4,
            py: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: size[0] < 720 ? "center" : "flex-start",
            }}
          >
            <Typography variant="body1" color="primary">
              <b>SOBRE NÓS</b>
            </Typography>
            <Typography variant="h4">
              Entenda quem somos e por que existimos
            </Typography>
            <Typography variant="body2">
              A empresa nasceu para pessoas que querem terem uma forma de
              agilizar seus pedidos online, sem depender ou pagar altos valores
              para plataformas de delivery, democratizando o acesso a todos.
              <br />
              <br />
              Com uma equipe empenhada a encontrar soluções que agregam aos
              comerciantes e seus clientes.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleCadastrar}
            >
              Quero agendar uma demonstração
            </Button>
          </Box>
          <Box
            sx={{
              maxWidth: size[0] < 720 ? "90vw" : "50vw",
              width: "100%",
              height: "auto",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <ReactPlayer
              style={{
                maxWidth: size[0] < 720 ? "90vw" : "50vw",
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                overflow: "hidden",
              }}
              url="./videos/Cadastrapet.mp4"
              width="100%"
              height="100%"
              controls={true}
            />
          </Box>
        </Container>
        {/* video */}
        <ContactSection location="Home" />
      </Box>
      <Footer />
      <AcceptTerms />
      <Floating location="Home Tutor" />
    </Box>
  );
}
