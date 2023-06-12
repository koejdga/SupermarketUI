import axios from "axios";
import TableRow from "../classes/TableRow";
import Service from "./Service";

export interface Client {
  card_number: string;
  cust_surname: string;
  cust_name: string;
  cust_patronymic: string;
  phone_number: string;
  city: string;
  street: string;
  zip_code: string;
  percent: number;
}

function clientToTableRow(client: Client): TableRow {
  const values: string[] = [
    client.card_number,
    client.cust_surname,
    client.cust_name,
    client.cust_patronymic,
    client.phone_number,
    client.city,
    client.street,
    client.zip_code,
    client.percent.toString(),
  ];

  return new TableRow(client.card_number, values);
}

export function tableRowToClient(tableRow: TableRow): Client {
  const client: Client = {
    card_number: tableRow.values[0],
    cust_surname: tableRow.values[1],
    cust_name: tableRow.values[2],
    cust_patronymic: tableRow.values[3],
    phone_number: tableRow.values[4],
    city: tableRow.values[5],
    street: tableRow.values[6],
    zip_code: tableRow.values[7],
    percent: Number(tableRow.values[8]),
  };

  return client;
}

class ClientsService extends Service {
  static surname = "";
  constructor() {
    super("http://26.133.25.6:8080/api/customer_cards");
  }

  // TODO можливо можна зробити колонку адреса й там місто, вулиця та зіпкод
  async getRows(): Promise<TableRow[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data.map((row: any) => clientToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getRowsBySurname(surname: string): Promise<TableRow[]> {
    try {
      const response = await axios.get(
        this.baseUrl + `/with_surname/${surname}`
      );
      console.log(response);
      return response.data.map((row: any) => clientToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getSurnames(): Promise<string[]> {
    try {
      const response = await axios.get(this.baseUrl);
      let result = response.data.map((client: any) => client.cust_surname);
      result = [...new Set(result)];
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateRow(id: number, data: TableRow): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/${id}`, tableRowToClient(data));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  createRow = async (row: TableRow): Promise<void> => {
    try {
      await axios.post(this.baseUrl, tableRowToClient(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default ClientsService;
