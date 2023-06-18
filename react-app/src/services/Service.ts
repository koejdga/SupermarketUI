import axios from "axios";
import TableRow from "../classes/TableRow";
import { User } from "./UserService";

abstract class Service {
  protected baseUrl: string;
  protected postUpdateUrl: string;
  static user: User;

  public static get config() {
    if (!Service.user) return undefined;

    return {
      headers: {
        Authorization: `Basic ${btoa(
          `${Service.user.username}:${Service.user.password}`
        )} `,
        "X-Requested-With": "XMLHttpRequest",
      },
    };
  }

  constructor(baseUrl: string, postUpdateUrl: string) {
    this.baseUrl = baseUrl;
    this.postUpdateUrl = postUpdateUrl;
  }

  abstract getRows(): Promise<TableRow[]>;

  // abstract updateRow(id: number, data: T): Promise<void>;
  abstract updateRow(id: number, data: TableRow): Promise<void>;

  // abstract createRow(data: T): Promise<void>;
  abstract createRow(row: TableRow): Promise<void>;

  async deleteRow(id: number | string): Promise<boolean> {
    try {
      await axios.delete(`${this.postUpdateUrl}/${id}`, Service.config);
      console.log("deleted from db");
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export default Service;
