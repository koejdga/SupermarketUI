import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import TableRow from "../classes/TableRow";
import AutocompleteTextField from "./AutocompleteTextField";
import type { Option } from "./AutocompleteTextField";
import CategoriesService from "../services/CategoriesService";
import DateRangeInput from "./DateRangeInput";
import SingleDateInput from "./SingleDateInput";
import { formatDate } from "../utils/Utils";

interface Props {
  handleChanges: (columnIndex: number, value: string) => void;
  editedRow: TableRow;
  columnNames: string[];
}

const AddWorkerForm = ({ handleChanges, editedRow, columnNames }: Props) => {
  const [roles] = useState([
    { value: "Касирка", label: "Касирка" },
    { value: "Менеджерка", label: "Менеджерка" },
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <TextField
        className="text-field"
        key={"nickname"}
        label={"Нікнейм"}
        onChange={(event) => handleChanges(11, event.target.value)}
        variant="outlined"
        value={editedRow?.values[11] || ""}
        fullWidth
      />

      <TextField
        className="text-field"
        key={"password"}
        label={"Пароль"}
        onChange={(event) => handleChanges(12, event.target.value)}
        variant="outlined"
        value={editedRow?.values[12] || ""}
        fullWidth
      />
      <TextField
        className="text-field"
        key={"surname"}
        label={columnNames[0]}
        onChange={(event) => handleChanges(0, event.target.value)}
        variant="outlined"
        value={editedRow?.values[0] || ""}
        fullWidth
      />
      <TextField
        className="text-field"
        key={"name"}
        label={columnNames[1]}
        onChange={(event) => handleChanges(1, event.target.value)}
        variant="outlined"
        value={editedRow?.values[1] || ""}
        fullWidth
      />
      <TextField
        className="text-field"
        key={"patronymic"}
        label={columnNames[2]}
        onChange={(event) => handleChanges(2, event.target.value)}
        variant="outlined"
        value={editedRow?.values[2] || ""}
        fullWidth
      />
      <AutocompleteTextField
        label={columnNames[3]}
        key={"role"}
        options={roles}
        onChange={(value) => handleChanges(3, value)}
      />
      <TextField
        className="text-field"
        key={"salary"}
        label={columnNames[4]}
        onChange={(event) => handleChanges(4, event.target.value)}
        variant="outlined"
        value={editedRow?.values[4] || ""}
        fullWidth
      />

      <div style={{ display: "flex", gap: "2em" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5em",
            marginLeft: "0.5em",
          }}
        >
          <label style={{ whiteSpace: "nowrap" }}>{columnNames[5]}</label>
          <label style={{ whiteSpace: "nowrap" }}>{columnNames[6]}</label>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5em",
            marginLeft: "0.5em",
          }}
        >
          <SingleDateInput
            date={new Date("01/01/2000")}
            handleDateChange={(date: Date | null) => {
              if (date) handleChanges(5, formatDate(date));
            }}
          />
          <SingleDateInput
            date={new Date()}
            handleDateChange={(date: Date | null) => {
              if (date) handleChanges(6, formatDate(date));
            }}
          />
        </div>
      </div>

      <TextField
        className="text-field"
        key={"telephone_number"}
        label={columnNames[7]}
        onChange={(event) => handleChanges(7, event.target.value)}
        variant="outlined"
        value={editedRow?.values[7] || ""}
        fullWidth
      />

      <TextField
        className="text-field"
        key={"city"}
        label={columnNames[8]}
        onChange={(event) => handleChanges(8, event.target.value)}
        variant="outlined"
        value={editedRow?.values[8] || ""}
        fullWidth
      />

      <TextField
        className="text-field"
        key={"street"}
        label={columnNames[9]}
        onChange={(event) => handleChanges(9, event.target.value)}
        variant="outlined"
        value={editedRow?.values[9] || ""}
        fullWidth
      />

      <TextField
        className="text-field"
        key={"zip_code"}
        label={columnNames[10]}
        onChange={(event) => handleChanges(10, event.target.value)}
        variant="outlined"
        value={editedRow?.values[10] || ""}
        fullWidth
      />
    </div>
  );
};

export default AddWorkerForm;
