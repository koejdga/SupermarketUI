import React from "react";
import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export type Option = {
  value: string;
  label: string;
};

interface Props {
  options: Option[];
  onChange: (value: string) => void;
  label: string;
  className?: string;
  style?: React.CSSProperties;
  defaultValue?: Option;
}

const AutocompleteTextField = ({
  options,
  onChange,
  label,
  className,
  style,
  defaultValue,
}: Props) => {
  const handleOnChange = (
    event: React.ChangeEvent<{}>,
    value: Option | null
  ) => {
    onChange(value !== null ? value.value : "");
  };

  return (
    <Autocomplete
      style={style}
      className={className}
      options={options}
      getOptionLabel={(option: { label: any }) => option.label}
      onChange={handleOnChange}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField {...params} label={label} variant="outlined" fullWidth />
      )}
      defaultValue={defaultValue}
    />
  );
};

export default AutocompleteTextField;
