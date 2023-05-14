import * as React from "react";
import { ChangeEvent } from "react";
import Label from "./Label/Label";
import styles from "./SelectBox.module.css";

type Props = {
  value?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  options: string[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

const SelectBox = ({
  value,
  label,
  disabled,
  className,
  options,
  onChange,
}: Props) => {
  const selectBox = (
    <select
      className={className}
      disabled={disabled}
      onChange={onChange}
      value={value}
      defaultValue={options[0]}
    >
      {options.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );

  return (
    <div>
      {label && (
        <>
          {label}
          <br />
        </>
      )}
      {selectBox}
    </div>
  );
};

export { SelectBox };
