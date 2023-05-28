import axios from "axios";
import TableRow from "../classes/TableRow";
import Service from "./Service";

export interface Product {
  id_product: number;
  category_number: number;
  product_name: string;
  characteristics: string;
}

function productToTableRow(product: Product): TableRow {
  const values: string[] = [
    product.id_product.toString(),
    product.category_number.toString(),
    product.product_name,
    product.characteristics,
  ];

  return new TableRow(product.id_product, values);
}

export function tableRowToProduct(tableRow: TableRow): Product {
  const product: Product = {
    id_product: Number(tableRow.values[0]),
    category_number: Number(tableRow.values[1]),
    product_name: tableRow.values[2],
    characteristics: tableRow.values[3],
  };

  return product;
}

class ProductsService extends Service<Product> {
  constructor() {
    super("http://26.133.25.6:8080/api/products");
  }

  async getRows(): Promise<TableRow[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data.map((row: any) => productToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateRow(id: number, data: TableRow): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/${id}`, tableRowToProduct(data));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  createRow = async (row: TableRow): Promise<void> => {
    try {
      console.log(tableRowToProduct(row));
      await axios.post(this.baseUrl, tableRowToProduct(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default ProductsService;
