import axios from "axios";
import TableRow from "../classes/TableRow";
import Service from "./Service";

interface Category {
    categoryNumber: string;
    categoryName: string;
  }

class CategoriesService extends Service<Category> {
    constructor() {
      // Provide the base URL for the "categories" API
      super("http://26.133.25.6:8080/api/categories");
    }
  
    async getRows(): Promise<TableRow[]> {
        try {
            const response = await axios.get(this.baseUrl);
            return response.data.map((row: any) => 
            (new TableRow(row.category_number, [row.category_number, row.category_name])));
          } catch (error) {
            console.log(error);
            throw error;
          }
    }
  
    async updateRow(id: number, data: string): Promise<void> {
        try {
            await axios.put(`${this.baseUrl}/${id}`, {
              category_number: id,
              category_name: data,
            });
          } catch (error) {
            console.log(error);
            throw error;
          }
    }
  
    async deleteRow(id: number): Promise<void> {
        try {
            await axios.delete(`${this.baseUrl}/${id}`);
            console.log('deleted from db')
          } catch (error) {
            console.log(error);
            throw error;
          }
    }
  
    async createRow(data: Category): Promise<void> {
        try {
            await axios.post(this.baseUrl, {
              category_name: data.categoryName,
            });
          } catch (error) {
            console.log(error);
            throw error;
          }
    }
  }

  export default CategoriesService;