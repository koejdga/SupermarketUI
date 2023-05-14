class TableRow {
  private id ;
  public values: string[];

  constructor(id = -1, values: string[]){
    this.id = id ;
    this.values = values;
  };
}

export default TableRow;
