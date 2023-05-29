import { useState, useEffect, useRef } from "react";
import Table from "react-bootstrap/Table";
import TableRow from "../classes/TableRow";
import EditOrCreateWindow from "./EditOrCreateWindow";
import { Resizable, ResizableBox } from "react-resizable";
import CategoriesService from "../services/CategoriesService";
import "./AddRowButton.css";
import Modal from "react-modal";
import "./TableObject.css";

interface Props {
  columnNames: string[];
  withButtons?: boolean;
  service?: CategoriesService;
  rows?: TableRow[]; // треба видалити буде цю штуку взагалі, коли всі таблиці будуть з сервісами
  updater?: boolean;
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
          {/* TODO: подивитися чому воно тепер видаляє все, а не один рядок */}
          <button onClick={handleDelete}>Видалити</button>
          <button onClick={handleCancel}>Скасувати</button>
        </div>
      )}
    </td>
  );
}

function TableObject({
  columnNames,
  withButtons = true,
  service,
  rows: initialRows,
  updater: testVar,
}: Props) {
  const [rows, setRows] = useState<TableRow[]>(initialRows || []);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const [selectedRow, setSelectedRow] = useState<TableRow>();

  useEffect(() => {
    getRows();
  }, [testVar]);

  const getRows = async () => {
    try {
      if (service) {
        const result = await service.getRows();
        setRows(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectRow = (rowIndex: number) => {
    console.log("Select row:", rowIndex);
    setSelectedRowIndex(Number(rows[rowIndex].id));
    setSelectedRow(rows[rowIndex]);
  };

  const handleSaveChanges = (updatedRow: TableRow) => {
    if (service) {
      service.updateRow(Number(updatedRow.id), updatedRow).then(() => {
        getRows();
      });
    }

    setSelectedRow(undefined);
    setSelectedRowIndex(-1);
  };

  const handleCancelEditing = () => {
    setSelectedRow(undefined);
    setSelectedRowIndex(-1);
  };

  const [showModal, setShowModal] = useState(false);

  const handleDeleteRow = (rowIndex: number) => {
    let rowIndexDb = rows[rowIndex].id;
    const updatedRows = rows.filter((row) => row.id !== rowIndexDb);
    setRows(updatedRows);
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
    }, 1000);
    console.log(rowIndex + " - row index");
    console.log(rowIndexDb + " - row index database");

    if (service) service.deleteRow(Number(rowIndexDb));
  };

  const handleDeleteAll = () => {
    const rowIdsToDelete = rows.map((row) => row.id);
    const updatedRows: TableRow[] = [];
    setRows(updatedRows);

    console.log(rowIdsToDelete + " - ids to be deleted");
    if (service) {
      rowIdsToDelete.forEach((rowId) => {
        service.deleteRow(Number(rowId));
      });
    }
  };

  if (rows.length > 0 && columnNames.length !== rows[0].values.length)
    return <div>Error</div>;

  return (
    <div>
      <label>{testVar}</label>
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
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Рядок видалено"
        className="delete-button"
      >
        <h2>Рядок видалено</h2>
      </Modal>
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
