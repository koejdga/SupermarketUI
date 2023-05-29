import axios from "axios";
import { Worker } from "./WorkersService";

class ProfileService {
  url =
    "http://26.133.25.6:8080/api/workers/*TODO token, який треба потім буде додати*";

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
