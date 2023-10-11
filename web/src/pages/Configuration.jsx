import { Box, Tab, Tabs, Typography } from "@mui/material";
import { tabsClasses } from "@mui/material/Tabs";
import { useState } from "react";
import DrawerComponent from "../componentes/DrawerComponent";
import ApparenceConfig from "./forms/configs/ApparenceConfig";
import DeliveryConfigs from "./forms/configs/DeliveryConfigs";
import GeneralConfig from "./forms/configs/GeneralConfig";
import PaymentMethods from "./forms/configs/PaymentMethods";
import StoreConfig from "./forms/configs/StoreConfig";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`configuration-tabpanel-${index}`}
      aria-labelledby={`configuration -tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `configuration-tab-${index}`,
    "aria-controls": `configuration-tabpanel-${index}`,
  };
}

export default function Configuration() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <DrawerComponent
      title="Configurações"
      header={
        <Box>
          <Typography>
            Ative seus métodos de pagamento, edite informações da empresa e
            outros detalhes
          </Typography>
        </Box>
      }
    >
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Configuração do sistema"
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            sx={{
              [`& .${tabsClasses.scrollButtons}`]: {
                "&.Mui-disabled": { opacity: 0.3 },
              },
            }}
          >
            <Tab label="Geral" {...a11yProps(0)} />
            <Tab label="Metodos de pagamento" {...a11yProps(1)} />
            <Tab label="Entrega" {...a11yProps(2)} />
            <Tab label="Horarios de atendimento" {...a11yProps(2)} />
            <Tab label="Aparência" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <GeneralConfig />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <PaymentMethods />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <DeliveryConfigs />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <StoreConfig />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          <ApparenceConfig />
        </CustomTabPanel>
      </Box>
    </DrawerComponent>
  );
}
