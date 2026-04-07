import http from "../axios.instance";
import type { UpdateIncomingStock } from "../types/medication.type";

export async function getMedications(params: {
  page?: number;
  limit?: number;
  name?: string;
  status?: string;
  hasReposition?: boolean;
}) {
  try {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.name) query.append("name", params.name);
    if (params.status && params.status !== "TODOS") {
        const statusMap: Record<string, string> = {
            "DISPONIBLE": "active",
            "BAJO STOCK": "low-stock",
            "AGOTADO": "out-of-stock"
        };
        if (statusMap[params.status]) query.append("status", statusMap[params.status]);
    }
    if (params.hasReposition) query.append("hasReposition", "true");

    const response = await http.get(`/medications?${query.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

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