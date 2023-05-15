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
        <div className="backdrop-content">
          <h3>Редагування</h3>
          {columnNames.map((columnName, index) => (
            <TextField
              className="text-field"
              label={columnName}
              onChange={(event) => handleChanges(index, event.target.value)}
              variant="outlined"
              value={editedRow?.values[index] || ""}
              inputProps={{ defaultValue: editedRow?.values[index] }}
              fullWidth
            />
          ))}
          <Button onClick={applyChangesToTheRow}>Готово</Button>
        </div>
      </Backdrop>
    </div>
  );
}

export default TableObject;
