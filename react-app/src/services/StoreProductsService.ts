import axios from "axios";
import TableRow from "../classes/TableRow";
import Service from "./Service";

export interface StoreProduct {
  UPC: string;
  UPC_prom: string;
  product_name: string;
  selling_price: number;
  products_number: number;
  promotional_product: boolean;
}

function storeProductToTableRow(product: StoreProduct): TableRow {
  const values: string[] = [
    product.UPC,
    product.UPC_prom,
    product.product_name,
    product.selling_price.toString(),
    product.products_number.toString(),
    product.promotional_product ? "так" : "ні",
  ];

  return new TableRow(product.UPC, values);
}

export function tableRowToStoreProduct(tableRow: TableRow): StoreProduct {
  const product: StoreProduct = {
    UPC: tableRow.values[0],
    UPC_prom: tableRow.values[1],
    product_name: tableRow.values[2],
    selling_price: Number(tableRow.values[3]),
    products_number: Number(tableRow.values[4]),
    promotional_product: tableRow.values[5] === "так" ? true : false,
  };

  return product;
}

class StoreProductsService extends Service<StoreProduct> {
  constructor() {
    super("http://26.133.25.6:8080/api/storeProducts");
  }

  async getRows(): Promise<TableRow[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data.map((row: any) => storeProductToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateRow(id: number, data: TableRow): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/${id}`, tableRowToStoreProduct(data));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  createRow = async (row: TableRow): Promise<void> => {
    try {
      console.log(tableRowToStoreProduct(row));
      await axios.post(this.baseUrl, tableRowToStoreProduct(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default StoreProductsService;
