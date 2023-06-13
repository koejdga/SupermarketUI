import { TextField } from "@mui/material";
import React, { ReactNode, useEffect, useState } from "react";
import TableRow from "../classes/TableRow";
import "./ButtonLabelInEditWindow.css";

interface Props {
  columnNames: string[];
  selectedRow?: TableRow;
  onCancel?: () => void;
  saveNewRow?: (row: TableRow) => void;
}

const EditOrCreateWindow = ({
  columnNames,
  selectedRow,
  onCancel,
  saveNewRow,
}: Props) => {
  var buttonStyle = {
    color: "#fff",
    backgroundColor: "transparent",
    border: "none",
    padding: "5px",
  };

  const row: TableRow = new TableRow(-1, Array(columnNames.length).fill(""));
  const [editedRow, setEditedRow] = useState(selectedRow || row);
  const isEditing = selectedRow ? true : false;

  const handleChanges = (columnIndex: number, value: string) => {
    if (editedRow) {
      const updatedRowValues = [...editedRow.values];
      updatedRowValues[columnIndex] = value;
      const updatedRow = new TableRow(editedRow.id, updatedRowValues);
      setEditedRow(updatedRow);
    }
  };

  // console.log("we are in EditWindow");

  const handleSave = () => {
    if (saveNewRow) saveNewRow(editedRow);
  };

  return (
    <div
      className="offcanvas offcanvas-start"
      data-bs-scroll="true"
      data-bs-backdrop="false"
      tabIndex={-1}
      id="offcanvasScrolling"
      aria-labelledby="offcanvasScrollingLabel"
      style={{ backgroundColor: "#efcfe3", width: "400px" }}
    >
      <div className="offcanvas-header" style={{ backgroundColor: "#857" }}>
        <h5 className="offcanvas-title" id="offcanvasScrollingLabel">
          {isEditing ? "Редагування" : "Додавання"}
        </h5>
        <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
          <button
            className="btn btn-secondary"
            data-bs-dismiss="offcanvas"
            style={buttonStyle}
            onClick={handleSave}
          >
            <label className="button-label">Зберегти</label>
          </button>

          <button
            className="btn btn-secondary"
            data-bs-dismiss="offcanvas"
            style={buttonStyle}
            onClick={onCancel}
          >
            <label className="button-label">Скасувати</label>
          </button>
        </div>
      </div>
      <div className="offcanvas-body">
        {/* Scrollspy */}
        <div
          data-bs-spy="scroll"
          data-bs-target="#navbar-example2"
          data-bs-offset="0"
          className="scrollspy-example"
          tabIndex={0}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          {columnNames.map((columnName, index) => (
            <TextField
              className="text-field"
              key={index}
              label={columnName}
              onChange={(event) => handleChanges(index, event.target.value)}
              variant="outlined"
              value={editedRow?.values[index] || ""}
              fullWidth
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditOrCreateWindow;
