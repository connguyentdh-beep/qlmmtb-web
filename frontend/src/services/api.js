const API_URL = "https://qlmmtb-api.onrender.com";

export const getEquipments = async () => {
  const res = await fetch(`${API_URL}/equipments/`);
  return res.json();
};