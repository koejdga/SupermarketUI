import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import TableRow from "../classes/TableRow";
import { Backdrop, Button, CircularProgress, TextField } from "@mui/material";
import "./Backdrop.css";

interface Props {
  columnNames: string[];
  rows: TableRow[];
}

interface RowActionsProps {
  rowIndex: number;
  onEdit: (rowIndex: number) => void;
  onDelete: (rowIndex: number) => void;
}

function RowActions({ rowIndex, onEdit, onDelete }: RowActionsProps) {
  const [showActions, setShowActions] = useState(false);

  const handleSelect = () => {
    setShowActions(true);
  };

  const handleCancel = () => {
    setShowActions(false);
  };

  const handleEdit = () => {
    setShowActions(false);
    onEdit(rowIndex);
  };

  const handleDelete = () => {
    setShowActions(false);
    onDelete(rowIndex);
  };

  return (
    <td>
      <button onClick={handleSelect}>Вибрати</button>
      {showActions && (
        <div>
          <button onClick={handleEdit}>Редагувати</button>
          <button onClick={handleDelete}>Видалити</button>
          <button onClick={handleCancel}>Скасувати</button>
        </div>
      )}
    </td>
  );
}

function TableObject({ columnNames, rows: initialRows }: Props) {
  const [rows, setRows] = useState(initialRows);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const [amount, setAmount] = useState(1);
  const [editedRow, setEditedRow] = useState<TableRow | null>(null); // Store the edited row's data

  const handleEditRow = (rowIndex: number) => {
    console.log("Edit row:", rowIndex);
    setSelectedRowIndex(rowIndex);
    setEditedRow(rows[rowIndex]);
    console.log(editedRow);
    handleBackdropOpen();
  };

  const applyChangesToTheRow = () => {
    if (editedRow) {
      const updatedRows = rows.map((row, index) => {
        if (index === selectedRowIndex) {
          return editedRow;
        }
        return row;
      });
      setRows(updatedRows);
      handleBackdropClose();
    }
  };

  const handleDeleteRow = (rowIndex: number) => {
    const updatedRows = rows.filter((_, index) => index !== rowIndex);
    setRows(updatedRows);
    // TODO: зробити так, щоб у базі даних теж видалялося
  };

  const handleChanges = (columnIndex: number, value: string) => {
    if (editedRow) {
      const updatedRowValues = [...editedRow.values];
      updatedRowValues[columnIndex] = value;
      const updatedRow = new TableRow(editedRow.id, updatedRowValues);
      setEditedRow(updatedRow);
    }
  };

  const [backdropOpen, setBackdropOpen] = useState(false);
  const handleBackdropClose = () => {
    setBackdropOpen(false);
  };
  const handleBackdropOpen = () => {
    setBackdropOpen(true);
  };

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows, editedRow]);

  if (rows.length > 0 && columnNames.length !== rows[0].values.length)
    return <div>Mistake</div>;

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            {columnNames.map((columnName) => (
              <th key={columnName}>{columnName}</th>
            ))}
          </tr>
        </thead>
        {
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <RowActions
                  rowIndex={rowIndex}
                  onEdit={handleEditRow}
                  onDelete={handleDeleteRow}
                />
                {row.values.map((rowData, index) => (
                  <td key={`${rowIndex}-${index}`}>{rowData}</td>
                ))}
              </tr>
            ))}
          </tbody>
        }
      </Table>
      <Backdrop className="backdrop" open={backdropOpen}>
        <div>
          <h3>Редагування</h3>
          {/* <div className="backdrop-content"> */}
          <div
            id="carouselExampleControls"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <Button onClick={applyChangesToTheRow}>Готово12</Button>
              </div>
              <div className="carousel-item">
                <Button onClick={applyChangesToTheRow}>Готово21</Button>
              </div>
              <div className="carousel-item">
                <Button onClick={applyChangesToTheRow}>Готово444</Button>
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="false"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="false"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
          {/* </div> */}

          <Button onClick={applyChangesToTheRow}>Готово</Button>
        </div>
      </Backdrop>
    </div>
  );
}

export default TableObject;

{
  /* {columnNames.map((columnName, index) => (
              <TextField
                className="text-field"
                label={columnName}
                onChange={(event) => handleChanges(index, event.target.value)}
                variant="outlined"
                value={editedRow?.values[index] || ""}
                inputProps={{ defaultValue: editedRow?.values[index] }}
                fullWidth
              />
            ))} */
}
{
  /* </div> */
}
