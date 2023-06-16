import axios from "axios";
import { Worker } from "./WorkersService";
import Service from "./Service";

class ProfileService {
  url: string;
  config = {};
  constructor(id_employee: string) {
    this.url = `http://26.133.25.6:8080/api/user/employees/${id_employee}`;

    this.config = Service.config;
  }

  async getRow(): Promise<Worker> {
    try {
      const response = await axios.get(this.url, this.config);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default ProfileService;
