import http from "../axios.instance";
import type { UpdateIncomingStock } from "../types/medication.type";

export async function receiveShipment(id: string) {
  try {
    const response = await http.patch(`/medications/${id}/receive-shipment`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateMedication(id: string, body: UpdateIncomingStock) {
  try {
    const response = await http.put(`/medications/${id}`, body);
    return response.data;
  } catch (error) {
    throw error
  }
}