import axios from "axios";
import TableRow from "../classes/TableRow";

abstract class Service {
  protected baseUrl: string;
  protected postUpdateUrl: string;

  constructor(baseUrl: string, postUpdateUrl: string) {
    this.baseUrl = baseUrl;
    this.postUpdateUrl = postUpdateUrl;
  }

  abstract getRows(): Promise<TableRow[]>;

  // abstract updateRow(id: number, data: T): Promise<void>;
  abstract updateRow(id: number, data: TableRow): Promise<void>;

  // abstract createRow(data: T): Promise<void>;
  abstract createRow(row: TableRow): Promise<void>;

  async deleteRow(id: number): Promise<void> {
    try {
      await axios.delete(`${this.postUpdateUrl}/${id}`);
      console.log("deleted from db");
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default Service;
