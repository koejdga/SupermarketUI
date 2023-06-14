import axios from "axios";
import TableRow from "../classes/TableRow";
import Service from "./Service";
import { formatDate, formatDateForDb } from "../utils/Utils";
import { Sale, SaleForDb } from "./SalesService";

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

  return new TableRow(check.card_number, values);
}

export function tableRowToCheck(tableRow: TableRow): Check {
  const check: Check = {
    check_number: tableRow.values[0],
    id_employee: tableRow.values[1],
    card_number: tableRow.values[2],
    print_date: new Date(tableRow.values[3]),
    sum_total: Number(tableRow.values[4]),
    vat: Number(tableRow.values[5]),
  };

  return check;
}

class ChecksService extends Service {
  today = new Date();
  id_employee = "em_1";

  static left_date = new Date();
  static right_date = new Date();

  constructor() {
    super(
      "http://26.133.25.6:8080/api/user/checks",
      "http://26.133.25.6:8080/api/user/checks"
    );
  }

  async getRows(): Promise<TableRow[]> {
    try {
      const response = await axios.get(
        this.baseUrl +
          `/${this.id_employee}/${formatDateForDb(
            ChecksService.left_date
          )}/${formatDateForDb(ChecksService.right_date)}`
      );

      console.log("get checks");
      console.log(response);
      return response.data.map((row: any) => checkToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateRow(id: number, data: TableRow): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/${id}`, tableRowToCheck(data));
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
      await axios.post(this.postUpdateUrl, {
        check: check,
        products: sales,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  createRow = async (row: TableRow): Promise<void> => {
    try {
      console.log(tableRowToCheck(row));
      await axios.post(this.baseUrl, tableRowToCheck(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default ChecksService;
