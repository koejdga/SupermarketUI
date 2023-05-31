import { useState, useEffect, useRef } from "react";
import Table from "react-bootstrap/Table";
import TableRow from "../classes/TableRow";
import EditOrCreateWindow from "./EditOrCreateWindow";
import { Resizable, ResizableBox } from "react-resizable";
import CategoriesService from "../services/CategoriesService";
import "./AddRowButton.css";
import Modal from "react-modal";
import "./TableObject.css";
import ProductsService from "../services/ProductsService";

interface Props {
  columnNames: string[];
  withButtons?: boolean;
  service?: CategoriesService;
  rows?: TableRow[];
  updater?: boolean;
  onlyEditButton?: boolean;
  onDoubleClickRow?: () => void;
  getFunction?: number;
}

interface RowActionsProps {
  rowIndex: number;
  onDelete: (rowIndex: number) => void;
  onSelect: (rowIndex: number) => void;
  onlyEditButton?: boolean;
}

function RowActions({
  rowIndex,
  onDelete,
  onSelect,
  onlyEditButton = false,
}: RowActionsProps) {
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
      {!onlyEditButton && <button onClick={handleSelect}>Вибрати</button>}
      {showActions && (
        <div>
          <button
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasScrolling"
            aria-controls="offcanvasScrolling"
            onClick={handleEdit}
          >
            Редагувати
          </button>
          <button onClick={handleDelete}>Видалити</button>
          <button onClick={handleCancel}>Скасувати</button>
        </div>
      )}

      {onlyEditButton && (
        <button
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasScrolling"
          aria-controls="offcanvasScrolling"
          onClick={handleEdit}
        >
          Редагувати
        </button>
      )}
    </td>
  );
}

function TableObject({
  columnNames,
  withButtons = true,
  service,
  rows: initialRows,
  updater,
  onlyEditButton = false,
  onDoubleClickRow,
  getFunction = 0,
}: Props) {
  const [rows, setRows] = useState<TableRow[]>(initialRows || []);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const [selectedRow, setSelectedRow] = useState<TableRow>();

  useEffect(() => {
    getRows();
  }, [updater, getFunction]);

  const getRows = async () => {
    try {
      if (getFunction === 1) {
        let productsService = new ProductsService();
        const result = await productsService.getRowsByCategory(
          productsService.category
        );
        setRows(result);
      } else if (service && getFunction === 0) {
        const result = await service.getRows();
        setRows(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [showModal, setShowModal] = useState(false);
  let windowIs: string = "Помилка";

  const handleSelectRow = (rowIndex: number) => {
    console.log("Select row:", rowIndex);
    setSelectedRowIndex(Number(rows[rowIndex].id));
    setSelectedRow(rows[rowIndex]);
  };

  const handleSaveChanges = (updatedRow: TableRow) => {
    if (service) {
      service.updateRow(Number(updatedRow.id), updatedRow).then(() => {
        getRows();
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 1000);
        windowIs = "Успішно зміненою";
      });
    }

    setSelectedRow(undefined);
    setSelectedRowIndex(-1);
  };

  const handleCancelEditing = () => {
    setSelectedRow(undefined);
    setSelectedRowIndex(-1);
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
    }, 1000);
    windowIs = "Зміну відмінено";
  };

  const handleDeleteRow = (rowIndex: number) => {
    let rowIndexDb = rows[rowIndex].id;
    const updatedRows = rows.filter((row) => row.id !== rowIndexDb);
    setRows(updatedRows);
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
    }, 1000);
    windowIs = "Успішно видалено";
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
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 1000);
        windowIs = "Усе видалено успішно";
      });
    }
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
                    onlyEditButton={onlyEditButton}
                  />
                )}

                {row.values.map((rowData, index) => (
                  <td
                    key={`${rowIndex}-${index}`}
                    onDoubleClick={onDoubleClickRow}
                  >
                    {rowData}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        }
      </Table>
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel={windowIs}
        className="delete-button"
      >
        <h2>{windowIs}</h2>
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
