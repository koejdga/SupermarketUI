import axios from "axios";
import TableRow from "../classes/TableRow";
import Service from "./Service";

export interface Worker {
  id_employee: string;
  empl_surname: string;
  empl_name: string;
  empl_patronymic: string;
  empl_role: string;
  salary: number;
  date_of_birth: Date;
  date_of_start: Date;
  phone_number: string;
  city: string;
  street: string;
  zip_code: string;
}

function workerToTableRow(worker: Worker): TableRow {
  const values: string[] = [
    worker.id_employee,
    worker.empl_surname,
    worker.empl_name,
    worker.empl_patronymic,
    worker.empl_role,
    worker.salary.toString(),
    worker.date_of_birth.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    worker.date_of_start.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    worker.phone_number,
    worker.city,
    worker.street,
    worker.zip_code,
  ];

  return new TableRow(-1, values);
}

export function tableRowToWorker(tableRow: TableRow): Worker {
  const client: Worker = {
    id_employee: tableRow.values[0],
    empl_surname: tableRow.values[1],
    empl_name: tableRow.values[2],
    empl_patronymic: tableRow.values[3],
    empl_role: tableRow.values[4],
    salary: Number(tableRow.values[5]),
    date_of_birth: new Date(tableRow.values[6]),
    date_of_start: new Date(tableRow.values[7]),
    phone_number: tableRow.values[4],
    city: tableRow.values[5],
    street: tableRow.values[6],
    zip_code: tableRow.values[7],
  };

  return client;
}

class WorkersService extends Service<Worker> {
  constructor() {
    super("http://26.133.25.6:8080/api/employees");
  }

  // TODO можливо можна зробити колонку адреса й там місто, вулиця та зіпкод
  async getRows(): Promise<TableRow[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data.map((row: any) => workerToTableRow(row));
      // (new TableRow(row.card_number, [row.card_number, row.cust_surname, row.cust_name,
      //     row.cust_patronymic, row.phone_number, row.city, row.street, row.zip_code, row.percent])));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateRow(id: number, data: TableRow): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/${id}`, tableRowToWorker(data));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  createRow = async (row: TableRow): Promise<void> => {
    try {
      await axios.post(this.baseUrl, tableRowToWorker(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default WorkersService;
