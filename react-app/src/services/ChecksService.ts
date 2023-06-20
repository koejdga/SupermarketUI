import axios from "axios";
import TableRow from "../classes/TableRow";
import Service from "./Service";
import {
  convertStringToDate,
  formatDate,
  formatDateForDb,
} from "../utils/Utils";
import { SaleForDb } from "./SalesService";

export interface Check {
  check_number: string;
  id_employee: string;
  card_number: string;
  print_date: Date;
  sum_total: number;
  vat: number;
}

function checkToTableRow(check: Check): TableRow {
  const values: string[] = [
    check.check_number,
    check.id_employee,
    check.card_number,
    formatDate(check.print_date),
    check.sum_total.toString(),
    check.vat.toString(),
  ];

  return new TableRow(check.check_number, values);
}

export function tableRowToCheck(tableRow: TableRow): Check {
  const check: Check = {
    check_number: tableRow.values[0],
    id_employee: tableRow.values[1],
    card_number: tableRow.values[2],
    print_date: convertStringToDate(tableRow.values[3]),
    sum_total: Number(tableRow.values[4]),
    vat: Number(tableRow.values[5]),
  };

  return check;
}

class ChecksService extends Service {
  today = new Date();
  isCashier: boolean;
  idEmployee?: string;

  static left_date = new Date();
  static right_date = new Date();

  constructor(isCashier: boolean, idEmployee?: string) {
    super(
      "http://26.133.25.6:8080/api/user/checks",
      "http://26.133.25.6:8080/api/user/checks"
    );
    this.isCashier = isCashier;
    this.idEmployee = idEmployee;

    if (isCashier && !idEmployee)
      throw "Provide an id employee to checks service";
  }

  async getRows(): Promise<TableRow[]> {
    if (this.isCashier && this.idEmployee) {
      console.log("cashier get checks");
      return this.getRowsByEmployee(this.idEmployee);
    }

    try {
      const response = await axios.get(
        "http://26.133.25.6:8080/api/admin/checks" +
          `/all/${formatDateForDb(ChecksService.left_date)}/${formatDateForDb(
            ChecksService.right_date
          )}`,
        Service.config
      );

      console.log("get checks");
      console.log(response);
      return response.data.map((row: any) => checkToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllRows(): Promise<TableRow[]> {
    try {
      const response = await axios.get(
        "http://26.133.25.6:8080/api/admin/checks",
        Service.config
      );

      return response.data.map((row: any) => checkToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getRowsByEmployee(idEmployee: string): Promise<TableRow[]> {
    try {
      const response = await axios.get(
        "http://26.133.25.6:8080/api/user/checks" +
          `/${idEmployee}/${formatDateForDb(
            ChecksService.left_date
          )}/${formatDateForDb(ChecksService.right_date)}`,
        Service.config
      );

      console.log("get checks by employee");
      console.log(response);
      return response.data.map((row: any) => checkToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getCheckByNumber(checkNumber: string | number): Promise<Check> {
    try {
      const response = await axios.get(
        this.baseUrl + `/${checkNumber}`,
        Service.config
      );

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  createCheck = async (check: Check, sales: SaleForDb[]): Promise<void> => {
    try {
      console.log("creating check in db");
      console.log(check);
      console.log(sales);
      await axios.post(
        this.postUpdateUrl,
        {
          check: check,
          products: sales,
        },
        Service.config
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  async updateRow(id: number, data: TableRow): Promise<void> {
    // TODO delete this method (leave mock method for interface)
  }

  createRow = async (row: TableRow): Promise<void> => {
    // TODO delete this method (leave mock method for interface)
  };
}

export default ChecksService;
