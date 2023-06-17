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
import Service from "../services/Service";
import StoreProductsService from "../services/StoreProductsService";
import ClientsService from "../services/ClientsService";
import ChecksService from "../services/ChecksService";
import AlertComponent from "./AlertComponent";
import { is } from "date-fns/locale";
import WorkersService from "../services/WorkersService";

interface Props {
  columnNames: string[];
  withButtons?: boolean;
  service?: Service;
  rows?: TableRow[];
  updater?: boolean;
  onlyEditButton?: boolean;
  onDoubleClickRow?: () => void;
  getFunction?: number;
}

export enum Get {
  Default = 0,
  Category,
  ProductName,
  UPC,
  Promo,
  NotPromo,
  SortByName,
  SortByAmount,
  ClientSurname,
  ChecksDateRangeCashier,
  OnlyCashiers,
  WorkerSurname,
}

interface RowActionsProps {
  rowIndex: number | string;
  onDelete: (rowIndex: number | string) => void;
  onSelect: (rowIndex: number | string) => void;
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

  //const [alertOpen, setAlertOpen] = useState(true);
  //const [alertMessage, setAlertMessage] = useState("Помилка");

  const handleCloseAlert = () => {
    // Дії, які треба виконати при закритті сповіщення
    //setAlertOpen(false);
  };

  const handleSelect = () => {
    onSelect(rowIndex);
    setShowActions(true);
  };

  const handleCancel = () => {
    setShowActions(false);
    //setAlertMessage("Скасовано");
  };

  const handleEdit = () => {
    setShowActions(false);

    if (buttonARef.current) {
      buttonARef.current.click();
    }
    //setAlertMessage("Змінено");
  };

  const handleDelete = () => {
    setShowActions(false);
    onDelete(rowIndex);
    //setAlertMessage("Видалено");
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
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | string>(-1);
  const [selectedRow, setSelectedRow] = useState<TableRow>();

  useEffect(() => {
    getRows();
  }, [updater, getFunction, initialRows]);

  const getRows = async () => {
    try {
      let result;
      if (initialRows) {
        setRows(initialRows);
      } else if (service && getFunction === Get.Default) {
        result = await service.getRows();
      } else if (getFunction === Get.Category) {
        let productsService = new ProductsService();
        result = await productsService.getRowsByCategory(
          ProductsService.category
        );
      } else if (getFunction === Get.ProductName) {
        let productsService = new ProductsService();
        result = await productsService.getRowsByName(
          ProductsService.productName
        );
      } else if (getFunction === Get.UPC) {
        console.log("це взагалі треба видалити");
        // let storeProductsService = new StoreProductsService();
        // result = await storeProductsService.getRowByUPC(
        //   StoreProductsService.UPC
        // );
      } else if (getFunction === Get.Promo) {
        console.log("Not implemented");
      } else if (getFunction === Get.ClientSurname) {
        let clientsService = new ClientsService();
        result = await clientsService.getRowsBySurname(ClientsService.surname);
      } else if (getFunction === Get.ChecksDateRangeCashier) {
        let checksService = new ChecksService();
        result = await checksService.getRows();
      } else if (getFunction === Get.OnlyCashiers) {
        let workersService = new WorkersService();
        result = await workersService.getOnlyCashiers();
      }
      if (result) setRows(result);
    } catch (error) {
      console.log(error);
    }
  };

  const [alertOpen, setAlertOpen] = useState(true);
  const [alertMessage, setAlertMessage] = useState("Помилка");

  const handleCloseAlert = () => {
    // Дії, які треба виконати при закритті сповіщення
    setAlertOpen(false);
  };

  const handleSelectRow = (rowIndex: number | string) => {
    console.log("Select row:", rowIndex);
    setSelectedRowIndex(rowIndex);
    setSelectedRow(rows.filter((row) => row.id === rowIndex)[0]);
  };

  const handleSaveChanges = (updatedRow: TableRow) => {
    if (service) {
      service.updateRow(Number(updatedRow.id), updatedRow).then(() => {
        getRows();
      });
    }
    setSelectedRow(undefined);
    setSelectedRowIndex(-1);
    setAlertMessage("Змінено");
  };

  const handleCancelEditing = () => {
    setSelectedRow(undefined);
    setSelectedRowIndex(-1);
    setAlertMessage("Скасовано");
  };

  const handleDeleteRow = (rowIndexDb: number | string) => {
    // let rowIndexDb = rows[rowIndex].id;
    const updatedRows = rows.filter((row) => row.id !== rowIndexDb);
    setRows(updatedRows);
    console.log(rowIndexDb + " - row index database");

    if (service) service.deleteRow(rowIndexDb);
    setAlertMessage("Видалено");
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
    setAlertMessage("Усе видалено");
  };

  if (rows.length > 0 && columnNames.length !== rows[0].values.length)
    return <div>Error: Rows length and column names length is different</div>;

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
                    rowIndex={rows[rowIndex].id}
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
      {alertMessage !== "Помилка" && alertOpen && (
        <AlertComponent
          onClose={handleCloseAlert}
          errorMessage={alertMessage}
        />
      )}
      {selectedRow && (
        // <Resizable>
        <EditOrCreateWindow
          columnNames={columnNames}
          selectedRow={selectedRow}
          onCancel={handleCancelEditing}
        />
        // </Resizable>
      )}
    </div>
  );
}

export default TableObject;
