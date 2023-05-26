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

  return new TableRow(-1, values);
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

class ClientsService extends Service<Client> {
  constructor() {
    super("http://26.133.25.6:8080/api/customer_cards");
  }

  // TODO можливо можна зробити колонку адреса й там місто, вулиця та зіпкод
  async getRows(): Promise<TableRow[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data.map((row: any) => clientToTableRow(row));
      // (new TableRow(row.card_number, [row.card_number, row.cust_surname, row.cust_name,
      //     row.cust_patronymic, row.phone_number, row.city, row.street, row.zip_code, row.percent])));
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

  createRow = async (): Promise<void> => {
    try {
      await axios.post(this.baseUrl, {
        cust_number: "aaa ",
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default ClientsService;
