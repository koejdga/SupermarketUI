import { TextField } from "@mui/material";
import React, { ReactNode, useEffect, useState } from "react";
import TableRow from "../classes/TableRow";
import "./ButtonLabelInEditWindow.css";
import AddProductForm from "./AddProductForm";
import AddStoreProductForm from "./AddStoreProductForm";
import { TableType } from "./PrintReportButton";
import AddWorkerForm from "./AddWorkerForm";
import "../App.css";
import AlertComponent from "./AlertComponent";

interface Props {
  columnNames: string[];
  selectedRow?: TableRow;
  onCancel?: () => void;
  saveNewRow?: (row: TableRow) => void;
  editRow?: (row: TableRow) => void;
  tableType?: TableType;
  editing?: boolean;
}

const EditOrCreateWindow = ({
  columnNames,
  selectedRow,
  onCancel,
  saveNewRow,
  tableType,
  editRow,
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
  const ed = editRow;

  const [showAlertChange, setShowAlertChange] = useState(false);
  const [alertMessageChange, setAlertMessageChange] = useState("Помилка");

  const handleChanges = (columnIndex: number, value: string) => {
    if (editedRow) {
      const updatedRowValues = [...editedRow.values];
      if (value === "change checkbox") {
        if (updatedRowValues[columnIndex] === "так") {
          updatedRowValues[columnIndex] = "ні";
        } else if (
          updatedRowValues[columnIndex] === "ні" ||
          updatedRowValues[columnIndex] === ""
        ) {
          updatedRowValues[columnIndex] = "так";
        } else {
          console.log("ERROR with checkbox in add store product form");
        }
      }

      if (value !== "change checkbox") {
        updatedRowValues[columnIndex] = value;
      }

      const updatedRow = new TableRow(editedRow.id, updatedRowValues);
      setEditedRow(updatedRow);
    }
  };

  const handleCloseAlert = () => {
    setShowAlertChange(false);
  };

  const handleSave = () => {
    console.log(saveNewRow);
    if (saveNewRow) {
      saveNewRow(editedRow);
      setAlertMessageChange("Додано");
    }

    setShowAlertChange(true);
    setTimeout(() => {
      setShowAlertChange(false);
    }, 3000);
  };

  return (
    <div
      className="edit-or-create-button-window offcanvas offcanvas-start"
      data-bs-scroll="true"
      data-bs-backdrop="false"
      tabIndex={-1}
      id="offcanvasScrolling"
      aria-labelledby="offcanvasScrollingLabel"
      style={{ width: "400px" }}
    >
      {showAlertChange && ( // Відображаємо спливаюче вікно, якщо showAlert === true
        <AlertComponent
          onClose={handleCloseAlert}
          errorMessage={alertMessageChange}
        />
      )}
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
      <div className="edit-or-create-button-window offcanvas-body">
        {/* Scrollspy */}
        <div
          data-bs-spy="scroll"
          data-bs-target="#navbar-example2"
          data-bs-offset="0"
          className="scrollspy-example"
          tabIndex={0}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          {tableType && tableType === TableType.Products && (
            <AddProductForm
              columnNames={columnNames}
              editedRow={editedRow}
              handleChanges={handleChanges}
            />
          )}
          {tableType && tableType === TableType.StoreProducts && (
            <AddStoreProductForm
              columnNames={columnNames}
              editedRow={editedRow}
              handleChanges={handleChanges}
            />
          )}

          {tableType && tableType === TableType.Workers && (
            <AddWorkerForm
              columnNames={columnNames}
              editedRow={editedRow}
              handleChanges={handleChanges}
            />
          )}

          {!tableType &&
            columnNames.map((columnName, index) => (
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
