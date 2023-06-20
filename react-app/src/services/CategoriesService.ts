import axios from "axios";
import TableRow from "../classes/TableRow";
import Service from "./Service";

export interface Category {
  category_number: string;
  category_name: string;
}

function categoryToTableRow(category: Category): TableRow {
  const values: string[] = [category.category_number, category.category_name];

  return new TableRow(Number(category.category_number), values);
}

export function tableRowToCategory(tableRow: TableRow): Category {
  let client: Category;
  if (tableRow.values.length === 2) {
    client = {
      category_number: tableRow.values[0],
      category_name: tableRow.values[1],
    };
  } else {
    client = {
      category_number: "-1",
      category_name: tableRow.values[0],
    };
  }

  return client;
}

class CategoriesService extends Service {
  static categoryWithSoldProducts: String;
  constructor() {
    super(
      "http://26.133.25.6:8080/api/user/categories",
      "http://26.133.25.6:8080/api/admin/categories"
    );
  }

  async getRows(): Promise<TableRow[]> {
    try {
      const response = await axios.get(this.baseUrl, Service.config);
      return response.data.map((row: any) => categoryToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAmountOfSoldProductsInCategory(category: string): Promise<number> {
    try {
      console.log("not implemented");
      // const response = await axios.get(this.baseUrl, Service.config);
      // return response.data;
      return 300;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getStatistics(): Promise<TableRow[]> {
    try {
      const response = await axios.get(
        "http://26.133.25.6:8080/api/admin/store_products/strange_statistic",
        Service.config
      );
      console.log(response);
      // return response.data.map((response) => (new TableRow(response.data)));
      return [];
    } catch (error) {
      console.error("Failed to fetch category options:", error);
      return [];
    }
  }

  getCategoriesOptions = async () => {
    try {
      const response = await axios.get(this.baseUrl, Service.config);
      return response.data.map((category: Category) => ({
        value: category.category_number,
        label: category.category_name,
      }));
    } catch (error) {
      console.error("Failed to fetch category options:", error);
      return [];
    }
  };

  async updateRow(id: number, data: TableRow): Promise<void> {
    try {
      await axios.put(
        `${this.postUpdateUrl}/${id}`,
        tableRowToCategory(data),
        Service.config
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  createRow = async (row: TableRow): Promise<void> => {
    try {
      await axios.post(
        this.postUpdateUrl,
        tableRowToCategory(row),
        Service.config
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default CategoriesService;
