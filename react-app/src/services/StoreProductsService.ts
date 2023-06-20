import axios from "axios";
import TableRow from "../classes/TableRow";
import Service from "./Service";

export interface StoreProduct {
  upc: string;
  upc_prom: string;
  product_name: string;
  id_product?: number;
  selling_price: number;
  products_number: number;
  promotional_product: boolean;
}

export interface StoreProductToPost {
  upc: string;
  upc_prom: string;
  id_product: number;
  selling_price: number;
  products_number: number;
  promotional_product: boolean;
}

function storeProductToTableRow(product: StoreProduct): TableRow {
  const values: string[] = [
    product.upc,
    product.upc_prom,
    product.product_name.toString(),
    product.selling_price.toString(),
    product.products_number.toString(),
    product.promotional_product ? "так" : "ні",
  ];

  return new TableRow(product.upc, values);
}

export function tableRowToStoreProduct(tableRow: TableRow): StoreProduct {
  const product: StoreProduct = {
    upc: tableRow.values[0],
    upc_prom: tableRow.values[1],
    product_name: tableRow.values[2],
    selling_price: Number(tableRow.values[3]),
    products_number: Number(tableRow.values[4]),
    promotional_product: tableRow.values[5] === "так" ? true : false,
  };

  return product;
}

export async function tableRowToStoreProductToPost(
  tableRow: TableRow
): Promise<StoreProductToPost> {
  const product: StoreProductToPost = {
    upc: tableRow.values[0],
    upc_prom: tableRow.values[1],
    id_product: Number(tableRow.values[2]),
    selling_price: Number(tableRow.values[3]),
    products_number: Number(tableRow.values[4]),
    promotional_product: tableRow.values[5] === "так" ? true : false,
  };

  return product;
}

class StoreProductsService extends Service {
  static UPC = "";
  constructor() {
    super(
      "http://26.133.25.6:8080/api/user/store_products",
      "http://26.133.25.6:8080/api/admin/store_products"
    );
  }

  async getRows(): Promise<TableRow[]> {
    try {
      const response = await axios.get(this.baseUrl, Service.config);
      console.log("get store products");
      console.log(response);
      return response.data.map((row: any) => storeProductToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getRowsSortedByName(): Promise<TableRow[]> {
    try {
      const response = await axios.get(
        this.baseUrl + "/by_product_name",
        Service.config
      );
      return response.data.map((row: any) => storeProductToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getRowByUPC(UPC: string): Promise<StoreProduct> {
    try {
      console.log(UPC);
      console.log(this.baseUrl + "/" + UPC);
      const response = await axios.get(
        this.baseUrl + "/" + UPC,
        Service.config
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getRowsOnlyPromo(): Promise<TableRow[]> {
    try {
      console.log(this.baseUrl + "/promo");
      const response = await axios.get(this.baseUrl + "/promo", Service.config);
      return response.data.map((row: any) => storeProductToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getRowsOnlyNotPromo(): Promise<TableRow[]> {
    try {
      console.log(this.baseUrl + "/not_promo");
      const response = await axios.get(
        this.baseUrl + "/not_promo",
        Service.config
      );
      return response.data.map((row: any) => storeProductToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getUPCs(): Promise<string[]> {
    try {
      const response = await axios.get(this.baseUrl, Service.config);
      return response.data.map((storeProduct: any) => storeProduct.upc);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateRow(id: number, data: TableRow): Promise<void> {
    try {
      let storeProduct = await tableRowToStoreProductToPost(data);
      console.log(storeProduct);
      await axios.put(
        `${this.postUpdateUrl}/${id}`,
        storeProduct,
        Service.config
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  createRow = async (row: TableRow): Promise<void> => {
    try {
      let storeProduct = await tableRowToStoreProductToPost(row);
      await axios.post(this.postUpdateUrl, storeProduct, Service.config);
    } catch (error) {
      console.log(error);
      throw error;
    }
    console.log("added");
  };
}

export default StoreProductsService;
