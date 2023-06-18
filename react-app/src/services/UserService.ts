import axios from "axios";
import TableRow from "../classes/TableRow";
import Service from "./Service";

export interface User {
  username: string;
  password: string;
}

class UserService {
  baseUrl: string;
  constructor(user: User) {
    this.baseUrl = `http://26.133.25.6:8080/api/public/login/${
      user.username
    }/${btoa(user.password)}`;
  }

  async logIn(): Promise<string> {
    try {
      const response = await axios.get(this.baseUrl);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default UserService;
