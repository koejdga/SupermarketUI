import axios from "axios";
import TableRow from "../classes/TableRow";
import Service from "./Service";
import { convertStringToDate, formatDate } from "../utils/Utils";

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
  let worker: Worker;
  // without id
  if (tableRow.values.length === 11) {
    tableRow = new TableRow(tableRow.id, ["-1"].concat(tableRow.values));
  }

  // without id but with username and password
  if (tableRow.values.length === 13) {
    worker = {
      id_employee: "-1",
      empl_surname: tableRow.values[0],
      empl_name: tableRow.values[1],
      empl_patronymic: tableRow.values[2],
      empl_role: tableRow.values[3],
      salary: Number(tableRow.values[4]),
      date_of_birth:
        tableRow.values[5] !== ""
          ? new Date(tableRow.values[5])
          : new Date("01/01/2000"),
      date_of_start:
        tableRow.values[6] !== "" ? new Date(tableRow.values[6]) : new Date(),
      phone_number: tableRow.values[7],
      city: tableRow.values[8],
      street: tableRow.values[9],
      zip_code: tableRow.values[10],
    };
  } else {
    worker = {
      id_employee: tableRow.values[0],
      empl_surname: tableRow.values[1],
      empl_name: tableRow.values[2],
      empl_patronymic: tableRow.values[3],
      empl_role: tableRow.values[4],
      salary: Number(tableRow.values[5]),
      date_of_birth: convertStringToDate(tableRow.values[6]),
      date_of_start: convertStringToDate(tableRow.values[7]),
      phone_number: tableRow.values[8],
      city: tableRow.values[9],
      street: tableRow.values[10],
      zip_code: tableRow.values[11],
    };
  }

  return worker;
}

class WorkersService extends Service {
  static surname = "";
  static ID = "";
  constructor() {
    super(
      "http://26.133.25.6:8080/api/admin/employees",
      "http://26.133.25.6:8080/api/admin/employees"
    );
  }

  async getRows(): Promise<TableRow[]> {
    try {
      const response = await axios.get(this.baseUrl, Service.config);
      return response.data.map((row: any) => workerToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getOnlyCashiersRows(): Promise<TableRow[]> {
    try {
      const response = await axios.get(
        this.baseUrl + "/cashiers",
        Service.config
      );
      return response.data.map((row: any) => workerToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getSoldSumsOfWorkers(minSum: number): Promise<TableRow[]> {
    try {
      const response = await axios.get(
        this.baseUrl + `/get_sold_products/${minSum}`,
        Service.config
      );

      return response.data.map(
        (row: any) =>
          new TableRow(row.id_employee, [
            row.id_employee,
            row.empl_surname,
            row.empl_name,
            row.empl_role,
            row.sold_products_amount,
            row.sell_sum,
          ])
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getonlyAllClients(): Promise<TableRow[]> {
    try {
      const response = await axios.get(
        this.baseUrl + "/served_all_customers",
        Service.config
      );
      return response.data.map((row: any) => workerToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getRowsBySurname(surname: string): Promise<Worker[]> {
    try {
      const response = await axios.get(
        this.baseUrl + `/with_surname/${surname}`,
        Service.config
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getCashiersObjects(): Promise<Worker[]> {
    try {
      const response = await axios.get(
        this.baseUrl + "/cashiers",
        Service.config
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getSurnames(): Promise<string[]> {
    try {
      const response = await axios.get(this.baseUrl, Service.config);
      let result = response.data.map((worker: any) => worker.empl_surname);
      result = [...new Set(result)];
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateRow(id: number | string, data: TableRow): Promise<void> {
    try {
      await axios.put(
        `${this.postUpdateUrl}/${id}`,
        tableRowToWorker(data),
        Service.config
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  createRow = async (row: TableRow): Promise<void> => {
    try {
      console.log(tableRowToWorker(row));
      console.log(row.values[11], row.values[12]);
      await axios.post(
        this.postUpdateUrl,
        {
          employee: tableRowToWorker(row),
          user: { username: row.values[11], password: btoa(row.values[12]) },
        },
        Service.config
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default WorkersService;
