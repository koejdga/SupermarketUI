import axios from "axios";
import TableRow from "../classes/TableRow";

abstract class Service {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  abstract getRows(): Promise<TableRow[]>;

  // TODO розкоментувати ці штуки, бо вони нормально написані,
  // просто мені для простоти треба були такі, які зараз не закоментовані

  // abstract updateRow(id: number, data: T): Promise<void>;
  abstract updateRow(id: number, data: TableRow): Promise<void>;

  // abstract createRow(data: T): Promise<void>;
  abstract createRow(row: TableRow): Promise<void>;

  async deleteRow(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`);
      console.log("deleted from db");
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default Service;
