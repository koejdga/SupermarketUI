import React from "react";
import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { JSX } from "react/jsx-runtime";

export type Option = {
  value: string;
  label: string;
};

interface Props {
  options: Option[];
  onChange: (value: string) => void;
  label: string;
  className?: string;
}

const AutocompleteTextField = ({
  options,
  onChange,
  label,
  className,
}: Props) => {
  const handleOnChange = (
    event: React.ChangeEvent<{}>,
    value: Option | null
  ) => {
    onChange(value !== null ? value.value : "");
  };

  return (
    <Autocomplete
      className={className}
      options={options}
      getOptionLabel={(option: { label: any }) => option.label}
      onChange={handleOnChange}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField {...params} label={label} variant="outlined" fullWidth />
      )}
    />
  );
};

export default AutocompleteTextField;
