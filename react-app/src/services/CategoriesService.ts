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
  constructor() {
    super("http://26.133.25.6:8080/api/categories");
  }

  async getRows(): Promise<TableRow[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data.map((row: any) => categoryToTableRow(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getCategoriesIds(): Promise<string[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data.map((category: any) =>
        category.category_number.toString()
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateRow(id: number, data: TableRow): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/${id}`, tableRowToCategory(data));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  createRow = async (row: TableRow): Promise<void> => {
    try {
      await axios.post(this.baseUrl, tableRowToCategory(row));
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default CategoriesService;
