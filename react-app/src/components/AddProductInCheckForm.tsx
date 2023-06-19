import AutocompleteTextField from "./AutocompleteTextField";
import { useState } from "react";
import type { Option } from "./AutocompleteTextField";
import "./AddProductInCheckForm.css";
import TextField from "@mui/material/TextField";
import AlertComponent from "./AlertComponent";

interface Props {
  options: Option[];
  onAdd: (upc: string, amount: number) => void;
}

const AddProductInCheckForm = ({ options, onAdd }: Props) => {
  const defaultAmountValue = 1;
  const errorValue = -1;
  const [upc, setUpc] = useState("");
  const [amount, setAmount] = useState(defaultAmountValue);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleOnChangeUPC = (value: string) => {
    setUpc(value);
  };

  const handleAmountOfProductInCheckChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!isNaN(Number(event.target.value))) {
      setAmount(Number(event.target.value));
    } else {
      setAmount(errorValue);
    }
  };

  const handleAddProduct = async () => {
    if (upc === "") {
      showErrorFunction("Неправильно введено UPC");
    } else if (amount === errorValue) {
      showErrorFunction("Неправильно введено кількість товару");
    } else {
      try {
        await onAdd(upc, amount);
      } catch (error) {
        showErrorFunction((error as Error).message);
      }
    }
  };

  const showErrorFunction = (errorMessage?: string) => {
    if (errorMessage) {
      console.log("settt");
      setErrorMessage(errorMessage);
    }
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
    }, 3000);
  };

  return (
    <div className="add-product-in-check-form">
      {showError && <AlertComponent errorMessage={errorMessage} />}
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
        defaultValue={defaultAmountValue}
        fullWidth
      />
      <button className="btn btn-secondary" onClick={handleAddProduct}>
        Додати продукт
      </button>
    </div>
  );
};

export default AddProductInCheckForm;
