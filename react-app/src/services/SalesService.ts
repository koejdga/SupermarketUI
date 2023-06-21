import axios from "axios";
import TableRow from "../classes/TableRow";
import Service from "./Service";

export interface Sale {
  upc: string;
  product_name: string;
  products_number: number;
  selling_price: number;
  total: number;
}

export interface SaleForDb {
  first: string;
  second: number;
}

export function saleToSaleForDb(sale: Sale): SaleForDb {
  return { first: sale.upc, second: sale.products_number };
}

export function tableRowToSale(tableRow: TableRow): Sale {
  return {
    upc: tableRow.values[0],
    product_name: tableRow.values[1],
    products_number: Number(tableRow.values[2]),
    selling_price: Number(tableRow.values[3]),
    total: Number(tableRow.values[4]),
  };
}

export function saleToTableRow(sale: Sale): TableRow {
  const values: string[] = [
    sale.upc,
    sale.product_name,
    sale.products_number.toString(),
    sale.selling_price.toString(),
    sale.total.toString(),
  ];

  return new TableRow(sale.upc, values);
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
      const response = await axios.get(this.url, this.config);
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
