class TableRow {
  public id;
  public values: string[];
  public static generalId = 0;

  constructor(id = -1, values: string[]){
    this.id = TableRow.generalId + 1;
    this.values = values;

    TableRow.generalId += 1;
  };
}

export default TableRow;
