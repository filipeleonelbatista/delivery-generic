export function calcularDistancia(
  { lat: lat1, lng: lon1 },
  { lat: lat2, lng: lon2 }
) {
  const raioTerra = 6371; // Raio médio da Terra em quilômetros

  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
    throw new Error("As coordenadas devem ser números válidos.");
  }

  // Converte graus para radianos
  const degToRad = (graus) => {
    return graus * (Math.PI / 180);
  };

  // Diferença de latitude e longitude
  const dLat = degToRad(lat2 - lat1);
  const dLon = degToRad(lon2 - lon1);

  // Fórmula de Haversine
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) *
      Math.cos(degToRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distancia = raioTerra * c;
  return distancia;
}
