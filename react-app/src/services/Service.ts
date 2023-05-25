import TableRow from "../classes/TableRow";

abstract class Service<T> {
    protected baseUrl: string;
  
    constructor(baseUrl: string) {
      this.baseUrl = baseUrl;
    }
  
    abstract getRows(): Promise<TableRow[]>;
  
    // TODO розкоментувати ці штуки, бо вони нормально написані, 
    // просто мені для простоти треба були такі, які зараз не закоментовані
    
    // abstract updateRow(id: number, data: T): Promise<void>;
    abstract updateRow(id: number, data: string): Promise<void>;
  
    abstract deleteRow(id: number): Promise<void>;
  
    // abstract createRow(data: T): Promise<void>;
    abstract createRow(): Promise<void>;
  }
  
  export default Service;