import axios from "axios";
import TableRow from "../classes/TableRow";
import Service from "./Service";
import { formatDate } from "../utils/Utils";

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
    formatDate(worker.date_of_birth),
    formatDate(worker.date_of_start),
    worker.phone_number,
    worker.city,
    worker.street,
    worker.zip_code,
  ];

  return new TableRow(worker.id_employee, values);
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
    phone_number: tableRow.values[8],
    city: tableRow.values[9],
    street: tableRow.values[10],
    zip_code: tableRow.values[11],
  };

  return client;
}

class WorkersService extends Service {
  constructor() {
    super("http://26.133.25.6:8080/api/employees");
  }

  // TODO можливо можна зробити колонку адреса й там місто, вулиця та зіпкод
  async getRows(): Promise<TableRow[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data.map((row: any) => workerToTableRow(row));
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
      console.log(tableRowToWorker(row));
      await axios.post(this.baseUrl, tableRowToWorker(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default WorkersService;
