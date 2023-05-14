import React, { ChangeEvent } from "react";

interface Props {
  value?: string;
  label?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

// TODO: вирішити, що можливо краще використовувати TextField з "@mui/material/TextField",
// бо тоді однаковий стиль у TextField та AutocompleteTextField

const TextField = ({ value, label, onChange, className }: Props) => {
  return (
    <div className={className}>
      {label && (
        <>
          <label>{label}</label>
          <br />
        </>
      )}
      <input type="text" value={value} onChange={onChange} />
    </div>
  );
};

export default TextField;
