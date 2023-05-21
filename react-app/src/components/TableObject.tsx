import { useState, useEffect, useRef } from "react";
import Table from "react-bootstrap/Table";
import TableRow from "../classes/TableRow";
import EditOrCreateWindow from "./EditOrCreateWindow";
import { Resizable, ResizableBox } from "react-resizable";

interface Props {
  columnNames: string[];
  rows: TableRow[];
  withButtons?: boolean;
  getDataFromDB?: () => Promise<TableRow[]>;
  updateDataFromDB?: (id: string, name: string) => Promise<void>;
}

interface RowActionsProps {
  rowIndex: number;
  onDelete: (rowIndex: number) => void;
  onSelect: (rowIndex: number) => void;
}

function RowActions({ rowIndex, onDelete, onSelect }: RowActionsProps) {
  const [showActions, setShowActions] = useState(false);
  const buttonARef = useRef<HTMLButtonElement>(null);
  const buttonBRef = useRef<HTMLButtonElement>(null);

  const handleSelect = () => {
    onSelect(rowIndex);
    setShowActions(true);
  };

  const handleCancel = () => {
    setShowActions(false);
  };

  const handleEdit = () => {
    setShowActions(false);

    if (buttonARef.current) {
      buttonARef.current.click();
    }
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
          <button ref={buttonBRef} onClick={handleEdit}>
            Редагувати
          </button>
          <button
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasScrolling"
            aria-controls="offcanvasScrolling"
            ref={buttonARef}
            style={{ display: "none" }}
          >
            Невидима
          </button>
          <button onClick={handleDelete}>Видалити</button>
          <button onClick={handleCancel}>Скасувати</button>
        </div>
      )}
    </td>
  );
}

function TableObject({
  columnNames,
  rows: initialRows,
  withButtons = true,
  getDataFromDB,
  updateDataFromDB,
}: Props) {
  const [rows, setRows] = useState(initialRows);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const [selectedRow, setSelectedRow] = useState<TableRow>();

  useEffect(() => {
    console.log("rows з компонента таблиці");
    console.log(rows);
  }, [rows]);

  const handleSelectRow = (rowIndex: number) => {
    console.log("Select row:", rowIndex);
    setSelectedRowIndex(rowIndex);
    setSelectedRow(rows[rowIndex]);
  };

  const handleSaveChanges = (updatedRow: TableRow) => {
    const updatedRows = [...rows];
    updatedRows[selectedRowIndex] = updatedRow;
    console.log("UpdatedRows = ", updatedRows);

    if (updateDataFromDB && getDataFromDB) {
      updateDataFromDB(updatedRow.values[0], updatedRow.values[1]).then(() => {
        getDataFromDB()
          .then((result: TableRow[]) => {
            console.log(result);
            setRows(result);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    } else {
      setRows(updatedRows);
    }

    setSelectedRow(undefined);
    setSelectedRowIndex(-1);
  };

  const handleCancelEditing = () => {
    setSelectedRow(undefined);
    setSelectedRowIndex(-1);
  };

  const handleDeleteRow = (rowIndex: number) => {
    const updatedRows = rows.filter((_, index) => index !== rowIndex);
    setRows(updatedRows);
    // TODO: зробити так, щоб у базі даних теж видалялося
  };

  if (rows.length > 0 && columnNames.length !== rows[0].values.length)
    return <div>Error</div>;

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            {withButtons && <th></th>}
            {columnNames.map((columnName) => (
              <th key={columnName}>{columnName}</th>
            ))}
          </tr>
        </thead>
        {
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {withButtons && (
                  <RowActions
                    rowIndex={rowIndex}
                    onDelete={handleDeleteRow}
                    onSelect={handleSelectRow}
                  />
                )}

                {row.values.map((rowData, index) => (
                  <td key={`${rowIndex}-${index}`}>{rowData}</td>
                ))}
              </tr>
            ))}
          </tbody>
        }
      </Table>
      {selectedRow && (
        // <Resizable>
        <EditOrCreateWindow
          columnNames={columnNames}
          selectedRow={selectedRow}
          onSave={handleSaveChanges}
          onCancel={handleCancelEditing}
        />
        // </Resizable>
      )}
    </div>
  );
}

export default TableObject;
