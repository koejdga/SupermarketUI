import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import TableRow from "../classes/TableRow";
import AutocompleteTextField from "./AutocompleteTextField";
import type { Option } from "./AutocompleteTextField";
import ProductsService from "../services/ProductsService";
import { Checkbox, FormControlLabel } from "@mui/material";

interface Props {
  handleChanges: (columnIndex: number, value: string) => void;
  editedRow: TableRow;
  columnNames: string[];
}

const AddStoreProductForm = ({
  handleChanges,
  editedRow,
  columnNames,
}: Props) => {
  const [productNames, setProductNames] = useState<Option[]>();
  useEffect(() => {
    const fetchProductNames = async () => {
      const productsService = new ProductsService();
      const productNames = await productsService.getProductNamesOptions();
      setProductNames(productNames);
    };

    fetchProductNames();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <TextField
        className="text-field"
        key={"upc"}
        label={columnNames[0]}
        onChange={(event) => handleChanges(0, event.target.value)}
        variant="outlined"
        value={editedRow?.values[0] || ""}
        fullWidth
      />
      {productNames ? (
        <AutocompleteTextField
          label={columnNames[2]}
          key={"product_name"}
          options={productNames}
          onChange={(value) => handleChanges(2, value)}
        />
      ) : (
        <TextField
          className="text-field"
          key={"product_name"}
          label={columnNames[2]}
          onChange={(event) => handleChanges(2, event.target.value)}
          variant="outlined"
          value={editedRow?.values[2] || ""}
          fullWidth
        />
      )}

      <TextField
        className="text-field"
        key={"price"}
        label={columnNames[3]}
        onChange={(event) => handleChanges(3, event.target.value)}
        variant="outlined"
        value={editedRow?.values[3] || ""}
        fullWidth
      />
      <TextField
        className="text-field"
        key={"amount"}
        label={columnNames[4]}
        onChange={(event) => handleChanges(4, event.target.value)}
        variant="outlined"
        value={editedRow?.values[4] || ""}
        fullWidth
      />
      <FormControlLabel
        control={<Checkbox />}
        label="Акційний"
        key={"prom"}
        onChange={(event) => {
          console.log(event);
          handleChanges(5, "change checkbox");
        }}
      />
    </div>
  );
};

export default AddStoreProductForm;