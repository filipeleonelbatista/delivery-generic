import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddressForm from "../componentes/AddressForm";
import PaymentForm from "../componentes/PaymentForm";
import Review from "../componentes/Review";
import React, { useState } from "react";
import Footer from "../componentes/Footer";
import Header from "../componentes/Header";
import Items from "../componentes/Items";
import SEO from "../componentes/SEO";

function Checkout() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const steps = [
    "Seu pedido",
    "Endereço para entrega",
    "Método de pagamento",
    "Revise seu pedido",
  ];

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Items
            handleBack={handleBack}
            handleNext={handleNext}
            activeStep={activeStep}
            steps={steps}
          />
        );
      case 1:
        return (
          <AddressForm
            handleBack={handleBack}
            handleNext={handleNext}
            activeStep={activeStep}
            steps={steps}
          />
        );
      case 2:
        return (
          <PaymentForm
            handleBack={handleBack}
            handleNext={handleNext}
            activeStep={activeStep}
            steps={steps}
          />
        );
      case 3:
        return (
          <Review
            handleBack={handleBack}
            handleNext={handleNext}
            activeStep={activeStep}
            steps={steps}
          />
        );
      default:
        throw new Error("Passo desconhecido");
    }
  }

  return (
    <>
      <SEO title="Finalizar Pedido" />
      <Container maxWidth="lg">
        <Header />
        <main>
          <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Paper
              variant="outlined"
              sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
            >
              <Typography component="h1" variant="h4" align="center">
                Seu pedido
              </Typography>
              <Stepper
                activeStep={activeStep}
                sx={{ pt: 3, pb: 5 }}
                alternativeLabel
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {activeStep === steps.length ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    my: 4,
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    Obrigado por comprar.
                  </Typography>
                  <Typography variant="subtitle1">
                    Finalize seu pedido no WhatsApp.
                  </Typography>
                  <Button sx={{ mt: 4 }}>Voltar ao inicio</Button>
                </Box>
              ) : (
                <React.Fragment>{getStepContent(activeStep)}</React.Fragment>
              )}
            </Paper>
          </Container>
        </main>
      </Container>
      <Footer title="Food Delivery" />
    </>
  );
}

export default Checkout;
