import axios from "axios";
import TableRow from "../classes/TableRow";
import Service from "./Service";

export interface Product {
  id_product: number;
  category_number?: number;
  category_name?: string;
  product_name: string;
  characteristics: string;
}

function productToTableRow(product: Product): TableRow {
  let values: string[] = [];
  if (product.category_name) {
    values = [
      product.id_product.toString(),
      product.category_name,
      product.product_name,
      product.characteristics,
    ];
  }
  console.log(new TableRow(product.id_product, values));

  return new TableRow(product.id_product, values);
}

export function tableRowToProduct(tableRow: TableRow): Product {
  let product: Product;
  if (tableRow.values.length === 4) {
    product = {
      id_product: Number(tableRow.values[0]),
      category_number: Number(tableRow.values[1]),
      product_name: tableRow.values[2],
      characteristics: tableRow.values[3],
    };
  } else {
    product = {
      id_product: -1,
      category_number: Number(tableRow.values[0]),
      product_name: tableRow.values[1],
      characteristics: tableRow.values[2],
    };
  }

  return product;
}

class ProductsService extends Service {
  static category = "";
  static productName = "";

  constructor() {
    super(
      "http://26.133.25.6:8080/api/user/products",
      "http://26.133.25.6:8080/api/admin/products"
    );
  }

  async getRows(): Promise<TableRow[]> {
    try {
      const response = await axios.get(this.baseUrl, Service.config);
      return response.data.map((row: any) => productToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getRowsByCategory(category: string): Promise<TableRow[]> {
    try {
      const response = await axios.get(
        this.baseUrl + "/by_category/" + category,
        Service.config
      );
      console.log(response);
      return response.data.map((row: any) => productToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getRowsByName(name: string): Promise<TableRow[]> {
    try {
      console.log(name);
      console.log(this.baseUrl + "/with_name/" + name);
      const response = await axios.get(
        this.baseUrl + "/with_name/" + name,
        Service.config
      );
      console.log(response);
      return response.data.map((row: any) => productToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getProductNames(): Promise<string[]> {
    try {
      const response = await axios.get(this.baseUrl, Service.config);
      return response.data.map((product: any) => product.product_name);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  getProductNamesOptions = async () => {
    try {
      const response = await axios.get(this.baseUrl, Service.config);

      return response.data.map((product: Product) => ({
        value: product.product_name,
        label: product.product_name,
      }));
    } catch (error) {
      console.error("Failed to fetch product name options:", error);
      return [];
    }
  };

  async updateRow(id: number, data: TableRow): Promise<void> {
    try {
      await axios.put(
        `${this.postUpdateUrl}/${id}`,
        tableRowToProduct(data),
        Service.config
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  createRow = async (row: TableRow): Promise<void> => {
    try {
      console.log(tableRowToProduct(row));
      await axios.post(
        this.postUpdateUrl,
        tableRowToProduct(row),
        Service.config
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default ProductsService;
