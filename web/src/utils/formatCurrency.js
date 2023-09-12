export const formatCurrency = (value) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  });
};

export function maskCurrency(e) {
  const currentValue = typeof e === "number" ? e.toFixed(2) : e;
  let value = String(currentValue);
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d)(\d{2})$/, "$1,$2");
  value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
  return value;
}

export function parseToFloat(maskedValue) {
  return parseFloat(String(maskedValue).replaceAll(".", "").replace(",", "."));
}
