import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import TableRow from "../classes/TableRow";
import AutocompleteTextField from "./AutocompleteTextField";
import type { Option } from "./AutocompleteTextField";
import CategoriesService from "../services/CategoriesService";

interface Props {
  handleChanges: (columnIndex: number, value: string) => void;
  editedRow: TableRow;
  columnNames: string[];
}

const AddProductForm = ({ handleChanges, editedRow, columnNames }: Props) => {
  const [categories, setCategories] = useState<Option[]>();
  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesService = new CategoriesService();
      const categories = await categoriesService.getCategoriesOptions();
      setCategories(categories);
    };

    fetchCategories();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {categories ? (
        <AutocompleteTextField
          label={columnNames[0]}
          key={"category"}
          options={categories}
          onChange={(value) => handleChanges(0, value)}
        />
      ) : (
        <TextField
          className="text-field"
          key={"category"}
          label={columnNames[1]}
          onChange={(event) => handleChanges(0, event.target.value)}
          variant="outlined"
          value={editedRow?.values[0] || ""}
          fullWidth
        />
      )}
      <TextField
        className="text-field"
        key={"product_name"}
        label={columnNames[1]}
        onChange={(event) => handleChanges(1, event.target.value)}
        variant="outlined"
        value={editedRow?.values[1] || ""}
        fullWidth
      />
      <TextField
        className="text-field"
        key={"characteristics"}
        label={columnNames[2]}
        onChange={(event) => handleChanges(2, event.target.value)}
        variant="outlined"
        value={editedRow?.values[2] || ""}
        fullWidth
      />
    </div>
  );
};

export default AddProductForm;
