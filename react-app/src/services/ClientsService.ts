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
  let client: Client;
  if (tableRow.values.length === 9) {
    client = {
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
  } else {
    client = {
      card_number: tableRow.id.toString(),
      cust_surname: tableRow.values[0],
      cust_name: tableRow.values[1],
      cust_patronymic: tableRow.values[2],
      phone_number: tableRow.values[3],
      city: tableRow.values[4],
      street: tableRow.values[5],
      zip_code: tableRow.values[6],
      percent: Number(tableRow.values[7]),
    };
  }

  return client;
}

class ClientsService extends Service {
  static surname = "";
  static city = "";
  static percent = "";
  constructor() {
    super(
      "http://26.133.25.6:8080/api/user/customer_cards",
      "http://26.133.25.6:8080/api/user/customer_cards"
    );
  }

  async getRows(): Promise<TableRow[]> {
    try {
      const response = await axios.get(this.baseUrl, Service.config);
      console.log("get client cards");
      console.log(response);
      return response.data.map((row: any) => clientToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getRowsBySurname(surname: string): Promise<TableRow[]> {
    try {
      const response = await axios.get(
        this.baseUrl + `/with_surname/${surname}`,
        Service.config
      );
      console.log(response);
      return response.data.map((row: any) => clientToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getRowsByPercent(percent: string): Promise<TableRow[]> {
    try {
      const response = await axios.get(
        `http://26.133.25.6:8080/api/admin/customer_cards/${percent}`,
        Service.config
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
      const response = await axios.get(this.baseUrl, Service.config);
      let result = response.data.map((client: any) => client.cust_surname);
      result = [...new Set(result)];
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getPercents(): Promise<string[]> {
    try {
      const response = await axios.get(this.baseUrl, Service.config);
      let result = response.data.map((client: Client) => client.percent);
      result = [...new Set(result)];
      result = result.sort((n1: number, n2: number) => n1 - n2);
      return result.map((percent: number) => percent.toString());
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getActiveClients(city: string): Promise<TableRow[]> {
    try {
      const response = await axios.get(
        `http://26.133.25.6:8080/api/admin/customer_cards/tried_everything/${city}`,
        Service.config
      );
      console.log(response);
      return response.data.map((row: any) => clientToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getClientCards(): Promise<string[]> {
    try {
      const response = await axios.get(this.baseUrl, Service.config);
      return response.data.map((client: any) => client.card_number);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateRow(id: number, data: TableRow): Promise<void> {
    try {
      await axios.put(
        `${this.postUpdateUrl}/${id}`,
        tableRowToClient(data),
        Service.config
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  createRow = async (row: TableRow): Promise<void> => {
    try {
      await axios.post(
        this.postUpdateUrl,
        tableRowToClient(row),
        Service.config
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default ClientsService;
