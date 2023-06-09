class TableRow {
  public id: string | number;
  public values: string[];
  public static generalId = 0;

  constructor(id: string | number = "-1", values: string[]) {
    if (id === "-1") {
      this.id = TableRow.generalId + 1;
      TableRow.generalId += 1;
    } else {
      this.id = id;
    }

    this.values = values;
  }
}

export default TableRow;
