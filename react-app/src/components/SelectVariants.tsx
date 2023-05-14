import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ReactNode, useState } from "react";

interface Props {
  label?: string;
  value?: string;
  options: string[];
  onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void;
  width?: number;
}

export default function SelectVariants({
  label,
  value,
  options,
  onChange,
  width,
}: Props) {
  return (
    <div>
      <FormControl sx={{ m: 1, width: width }}>
        <InputLabel id="demo-simple-select-standard-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={value}
          onChange={onChange}
        >
          <MenuItem value="">
            <em>Вибрати..</em>
          </MenuItem>
          {options.map((value: string) => (
            <MenuItem value={value}>{value}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
