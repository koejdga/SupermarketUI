import axios from "axios";
import TableRow from "../classes/TableRow";
import Service from "./Service";

export interface Sale {
  UPC: string;
  product_name: string;
  product_number: number;
  selling_price: number;
  total: number;
}

export interface SaleForDb {
  first: string;
  second: number;
}

export function saleToSaleForDb(sale: Sale): SaleForDb {
  return { first: sale.UPC, second: sale.product_number };
}

export function saleToTableRow(sale: Sale): TableRow {
  const values: string[] = [
    sale.UPC,
    sale.product_name,
    sale.product_number.toString(),
    sale.selling_price.toString(),
    sale.total.toString(),
  ];

  return new TableRow(sale.UPC, values);
}

class SalesService {
  url: string;
  config = {} || undefined;
  constructor(check_number: string) {
    this.url = `http://26.133.25.6:8080/api/user/sales/${check_number}`;
    this.config = Service.config;
  }

  async getRows(): Promise<TableRow[]> {
    try {
      const response = await axios.get(this.url);
      console.log("sales");
      console.log(response);
      return response.data.map((row: any) => saleToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default SalesService;
