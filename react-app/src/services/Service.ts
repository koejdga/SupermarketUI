import TableRow from "../classes/TableRow";

abstract class Service<T> {
    protected baseUrl: string;
  
    constructor(baseUrl: string) {
      this.baseUrl = baseUrl;
    }
  
    abstract getRows(): Promise<TableRow[]>;
  
    // abstract updateRow(id: number, data: T): Promise<void>;
    abstract updateRow(id: number, data: string): Promise<void>;
  
    abstract deleteRow(id: number): Promise<void>;
  
    // abstract createRow(data: T): Promise<void>;
    abstract createRow(): Promise<void>;
  }
  
  export default Service;