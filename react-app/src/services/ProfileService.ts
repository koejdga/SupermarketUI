import axios from "axios";
import { Worker } from "./WorkersService";

class ProfileService {
  url: string;
  constructor(id_employee: string) {
    this.url = `http://26.133.25.6:8080/api/user/employees/${id_employee}`;
  }

  async getRow(): Promise<Worker> {
    try {
      const response = await axios.get(this.url);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default ProfileService;
