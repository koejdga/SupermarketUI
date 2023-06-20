import axios from "axios";
import TableRow from "../classes/TableRow";
import Service from "./Service";
import CategoriesService from "./CategoriesService";
import { Option } from "../components/AutocompleteTextField";
import { formatDate, formatDateForDb } from "../utils/Utils";

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
  // console.log(new TableRow(product.id_product, values));

  return new TableRow(product.id_product, values);
}

export function tableRowToProduct(tableRow: TableRow): Product {
  let product: Product;

  // const categoriesService = new CategoriesService();
  // let categories;
  // try {
  //   categories = await categoriesService.getCategoriesOptions();
  // } catch (error) {
  //   console.log(error);
  // }

  // const element = tableRow.values.length === 4 ? 1 : 0;
  // let categoryNumber;
  // try {
  //   console.log(tableRow.values[element]);
  //   const category = categories.filter(
  //     (category: Option) => category.label === tableRow.values[element]
  //   )[0];
  //   console.log(category);
  //   categoryNumber = category;
  // } catch (error) {
  //   console.log(error);
  // }
  // console.log(categoryNumber);

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
  static id: number;

  static left_date = new Date();
  static right_date = new Date();

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

  async getAmountOfSoldProduct(): Promise<number> {
    try {
      if (!ProductsService.id) return -1;

      const url =
        this.baseUrl +
        `/count/${ProductsService.id}/${formatDateForDb(
          ProductsService.left_date
        )}/${formatDateForDb(ProductsService.right_date)}`;
      console.log(url);
      const response = await axios.get(url, Service.config);
      console.log(response);
      return response.data;
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
        value: product.id_product,
        label: product.product_name,
      }));
    } catch (error) {
      console.error("Failed to fetch product name options:", error);
      return [];
    }
  };

  async updateRow(id: number, data: TableRow): Promise<void> {
    try {
      const product = await tableRowToProduct(data);
      console.log(data);
      console.log(product);
      await axios.put(`${this.postUpdateUrl}/${id}`, product, Service.config);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  createRow = async (row: TableRow): Promise<void> => {
    try {
      const product = await tableRowToProduct(row);
      console.log(product);
      await axios.post(this.postUpdateUrl, product, Service.config);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default ProductsService;
