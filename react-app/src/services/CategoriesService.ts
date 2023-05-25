import axios from "axios";
import TableRow from "../classes/TableRow";
import Service from "./Service";

interface Category {
    categoryNumber: string;
    categoryName: string;
  }

  // ми коли створюємо нове, воно зберігається у вигляді TableRow, і для кожного класу (чи сервісу) треба
  // зробити конвертер з TableRow у те, що нам треба (Category, Check, Worker (interfaces))

class CategoriesService extends Service<Category> {
    constructor() {
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
  
    static counter = 0;
    // треба додати параметри
    createRow = async (): Promise<void> => {
      try {
        await axios.post(this.baseUrl, {
          category_name: "aaa " + CategoriesService.counter,
        });
        CategoriesService.counter += 1;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  }

  export default CategoriesService;