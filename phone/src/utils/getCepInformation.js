import axios from "axios";

export const getCepInformation = async (cep) => {
  const cepResult = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
  return cepResult;
};
