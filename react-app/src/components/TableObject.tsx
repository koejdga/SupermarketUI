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
import { is, tr } from "date-fns/locale";
import WorkersService from "../services/WorkersService";
import { TableType } from "./PrintReportButton";

interface Props {
  columnNames: string[];
  withButtons?: boolean;
  service?: Service;
  rows?: TableRow[];
  updater?: boolean;
  onlyEditButton?: boolean;
  onDoubleClickRow?: () => void;
  getFunction?: number;
  setEditing?: (editing: boolean) => void;
  selectRow?: (row: TableRow) => void;
  saveNewRow?: (row: TableRow) => void;
  tableType?: TableType;
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
  ChecksDateRange,
  OnlyCashiers,
  onlyAllClients,
  WorkerSurname,
  ActiveClients,
  CertainCashierChecks,
  ClientsWithPercent,
}

interface RowActionsProps {
  rowIndex: number | string;
  onDelete: (rowIndex: number | string) => void;
  onSelect: (rowIndex: number | string) => void;
  onlyEditButton?: boolean;
  setEditing?: (editing: boolean) => void;
}

function RowActions({
  rowIndex,
  onDelete,
  onSelect,
  onlyEditButton = false,
  setEditing,
}: RowActionsProps) {
  const [showActions, setShowActions] = useState(false);
  const buttonARef = useRef<HTMLButtonElement>(null);
  const buttonBRef = useRef<HTMLButtonElement>(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("Скасовано");

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleSelect = () => {
    onSelect(rowIndex);
    setShowActions(true);
  };

  const handleCancel = () => {
    setShowActions(false);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    if (setEditing) setEditing(false);
  };

  const handleEdit = () => {
    setShowActions(false);
    if (setEditing) {
      setEditing(true);
      console.log("set editing true");
    }

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
      {showAlert && (
        <AlertComponent
          onClose={handleCloseAlert}
          errorMessage={alertMessage}
        />
      )}
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
  setEditing,
  selectRow,
  saveNewRow,
  tableType,
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
        console.log("default");
        result = await service.getRows();
      } else if (getFunction === Get.Category) {
        let productsService = new ProductsService();
        result = await productsService.getRowsByCategory(
          ProductsService.category
        );
        console.log("category");
      } else if (getFunction === Get.ProductName) {
        let productsService = new ProductsService();
        result = await productsService.getRowsByName(
          ProductsService.productName
        );
      } else if (getFunction === Get.Promo) {
        console.log("Not implemented");
      } else if (getFunction === Get.ClientSurname) {
        let clientsService = new ClientsService();
        result = await clientsService.getRowsBySurname(ClientsService.surname);
      } else if (getFunction === Get.ChecksDateRange) {
        console.log("getting checks");
        if (service) result = await service.getRows();
      } else if (getFunction === Get.OnlyCashiers) {
        let workersService = new WorkersService();
        result = await workersService.getOnlyCashiersRows();
      } else if (getFunction === Get.onlyAllClients) {
        let workersService = new WorkersService();
        result = await workersService.getonlyAllClients();
      } else if (getFunction === Get.ActiveClients) {
        let clientsService = new ClientsService();
        result = await clientsService.getActiveClients(ClientsService.city);
      } else if (getFunction === Get.CertainCashierChecks) {
        let checksService = new ChecksService(false);
        result = await checksService.getRowsByEmployee(WorkersService.ID);
      } else if (getFunction === Get.ClientsWithPercent) {
        let clientsService = new ClientsService();
        result = await clientsService.getRowsByPercent(ClientsService.percent);
      }
      console.log(result);
      if (result) setRows(result);
    } catch (error) {
      console.log(error);
    }
  };

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("Помилка");

  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [alertMessageDelete, setAlertMessageDelete] = useState("Помилка");

  const [showAlertChange, setShowAlertChange] = useState(false);
  const [alertMessageChange, setAlertMessageChange] = useState("Помилка");

  const [showAlertCancel, setShowAlertCancel] = useState(false);
  const [alertMessageCancel, setAlertMessageCancel] = useState("Помилка");

  const [showAlertNotDelete, setShowAlertNotDelete] = useState(false);
  const [alertMessageNotDelete, setAlertMessageNotDelete] = useState("Помилка");

  const showRowAlert = (alertNotification: string) => {
    if (alertNotification === "Видалено") {
      setAlertMessageDelete(alertNotification);
      setShowAlertDelete(true);
      setTimeout(() => {
        setShowAlertDelete(false);
      }, 3000);
    } else if (alertNotification === "Змінено") {
      setAlertMessageChange(alertNotification);
      setShowAlertChange(true);
      setTimeout(() => {
        setShowAlertChange(false);
      }, 3000);
    } else if (alertNotification === "Скасовано") {
      setAlertMessageCancel(alertNotification);
      setShowAlertCancel(true);
      setTimeout(() => {
        setShowAlertCancel(false);
      }, 3000);
    } else if (alertNotification === "Не видалено") {
      setAlertMessageNotDelete(alertNotification);
      setShowAlertNotDelete(true);
      setTimeout(() => {
        setShowAlertNotDelete(false);
      }, 3000);
    } else {
      setAlertMessage(alertNotification);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  const handleCloseAlert = () => {
    // Дії, які треба виконати при закритті сповіщення
    setShowAlert(false);
    setShowAlertDelete(false);
    setShowAlertChange(false);
    setShowAlertCancel(false);
    setShowAlertNotDelete(false);
  };

  const handleSelectRow = (rowIndex: number | string) => {
    console.log("Select row:", rowIndex);
    console.log(rows.filter((row) => row.id === rowIndex)[0]);
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
    showRowAlert("Змінено");
  };

  const handleCancelEditing = () => {
    setSelectedRow(undefined);
    setSelectedRowIndex(-1);
    showRowAlert("Скасовано");
  };

  const handleDeleteRow = (rowIndexDb: number | string) => {
    if (service) {
      try {
        service.deleteRow(rowIndexDb);
        const updatedRows = rows.filter((row) => row.id !== rowIndexDb);
        setRows(updatedRows);
        console.log(rowIndexDb + " - row index database");

        showRowAlert("Видалено");
      } catch (error) {
        showRowAlert("Не видалено");
      }
    } else {
      showRowAlert("Не видалено");
    }
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
    showRowAlert("Усе видалено");
  };

  if (rows.length > 0 && columnNames.length !== rows[0].values.length)
    return <div>Error: Rows length and column names length is different</div>;

  return (
    <div>
      {/* <Table>...</Table> */}
      {showAlert && ( // Відображаємо спливаюче вікно, якщо showAlert === true
        <AlertComponent
          onClose={handleCloseAlert}
          errorMessage={alertMessage}
        />
      )}
      {showAlertDelete && (
        <AlertComponent
          onClose={handleCloseAlert}
          errorMessage={alertMessageDelete}
        />
      )}
      {showAlertChange && (
        <AlertComponent
          onClose={handleCloseAlert}
          errorMessage={alertMessageChange}
        />
      )}
      {showAlertNotDelete && (
        <AlertComponent
          onClose={handleCloseAlert}
          errorMessage={alertMessageNotDelete}
        />
      )}
      {showAlertCancel && (
        <AlertComponent
          onClose={handleCloseAlert}
          errorMessage={alertMessageCancel}
        />
      )}
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
                    setEditing={setEditing}
                  />
                )}

                {row.values.map((rowData, index) => (
                  <td
                    key={`${rowIndex}-${index}`}
                    onDoubleClick={() => {
                      handleSelectRow(rows[rowIndex].id);
                      if (onDoubleClickRow) {
                        console.log(selectRow);
                        console.log(selectedRow);
                        if (selectRow)
                          selectRow(
                            rows.filter(
                              (row) => row.id === rows[rowIndex].id
                            )[0]
                          );
                        onDoubleClickRow();
                      }
                    }}
                  >
                    {rowData}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        }
      </Table>

      {selectedRow && (
        <EditOrCreateWindow
          columnNames={
            tableType === TableType.StoreProducts
              ? columnNames
              : columnNames.slice(1)
          }
          selectedRow={
            tableType === TableType.StoreProducts
              ? selectedRow
              : new TableRow(selectedRow.id, selectedRow.values.slice(1))
          }
          saveNewRow={saveNewRow}
          onCancel={handleCancelEditing}
          tableType={tableType}
        />
      )}
    </div>
  );
}

export default TableObject;
