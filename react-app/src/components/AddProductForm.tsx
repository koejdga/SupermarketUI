import AutocompleteTextField from "./AutocompleteTextField";
import { useState } from "react";
import type { Option } from "./AutocompleteTextField";
import "./AddProductForm.css";
import TextField from "@mui/material/TextField";

interface Props {
  options: Option[];
  onAdd: (upc: string, amount: number) => void;
}

const AddProductForm = ({ options, onAdd }: Props) => {
  const [upc, setUpc] = useState("");
  const [amount, setAmount] = useState(0);

  const handleOnChangeUPC = (value: string) => {
    setUpc(value);
  };

  const handleAmountOfProductInCheckChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAmount(Number(event.target.value));
  };

  const handleAddProduct = () => {
    onAdd(upc, amount);
    setUpc("");
    setAmount(0);
  };

  return (
    <div className="add-product-form">
      <h3>Додати продукт</h3>
      <AutocompleteTextField
        className="autocomplete-field"
        options={options}
        onChange={handleOnChangeUPC}
        label="UPC"
      />
      <TextField
        className="text-field"
        label="Кількість"
        onChange={handleAmountOfProductInCheckChange}
        variant="outlined"
        fullWidth
      />
      <button className="btn btn-secondary" onClick={handleAddProduct}>
        Додати продукт
      </button>
    </div>
  );
};

export default AddProductForm;
