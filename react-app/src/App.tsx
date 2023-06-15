import ButtonPanel from "./components/ButtonGroup";
import TableObject, { Get } from "./components/TableObject";
import TableRow from "./classes/TableRow";
import Profile from "./components/Profile";
import { useState, ChangeEvent, useEffect } from "react";
import DateInput from "./components/DateInput";
import TovarCard from "./components/TovarCard";
import AutocompleteTextField from "./components/AutocompleteTextField";
import { Checkbox, FormControlLabel, SelectChangeEvent } from "@mui/material";
import PrintReportButton, {
  TableType,
  printReport,
} from "./components/PrintReportButton";
import AddProductInCheckForm from "./components/AddProductInCheckForm";
import type { Option } from "./components/AutocompleteTextField";
import AlertComponent from "./components/AlertComponent";
import TextField from "@mui/material/TextField";
import LoginForm from "./components/LoginForm";
import EditOrCreateWindow from "./components/EditOrCreateWindow";
import { Link, Upc } from "react-bootstrap-icons";
import CategoriesService from "./services/CategoriesService";
import ClientsService from "./services/ClientsService";
import WorkersService, { tableRowToWorker } from "./services/WorkersService";
import ButtonGrid from "./components/ButtonGrid";
import "./App.css";
import ProductsService from "./services/ProductsService";
import ChecksService, { Check } from "./services/ChecksService";
import StoreProductsService from "./services/StoreProductsService";
import ProfileService from "./services/ProfileService";
import CheckInfo from "./components/CheckInfo";
import BasicCheckInfo from "./components/BasicCheckInfo";
import Service from "./services/Service";
import { Sale, saleToSaleForDb, saleToTableRow } from "./services/SalesService";
import { Worker } from "./services/WorkersService";
import ReactDOMServer from "react-dom/server";

function App() {
  //#region Services
  const categoriesService = new CategoriesService();
  const clientsService = new ClientsService();
  const workersService = new WorkersService();
  const productsService = new ProductsService();
  const checksService = new ChecksService();
  const storeProductsService = new StoreProductsService();
  const [currentService, setCurrentService] =
    useState<Service>(categoriesService);

  //#endregion

  //#region Constants
  const cashierID = "1";

  const isCashier = false;

  const id_employee = "em_1";

  const isPromotionalOptions = [
    { value: "Всі", label: "Всі" },
    { value: "Акційні", label: "Акційні" },
    { value: "Не акційні", label: "Не акційні" },
  ];

  const sortingStoreProductsOptions = [
    { value: "За кількістю товару", label: "За кількістю товару" },
    { value: "За назвою", label: "За назвою" },
  ];

  enum Table {
    Main = 0,
    Products,
    StoreProducts,
    Categories,
    Clients,
    Checks,
    Workers,
    Profile,
  }

  const buttonNamesCashier = [
    "Головна",
    "Товари",
    "Товари в магазині",
    "Клієнтки",
    "Чеки",
    "Профіль",
  ];
  const buttonNamesManager = [
    "Головна",
    "Товари",
    "Товари в магазині",
    "Категорії",
    "Клієнтки",
    "Чеки",
    "Працівники",
  ];
  const onClickFunctionsCashierNotFull = [
    () => setTableVisible(Table.Main),
    () => {
      setTableVisible(Table.Products);
      setCurrentService(productsService);
    },
    () => {
      setTableVisible(Table.StoreProducts);
      setCurrentService(storeProductsService);
    },
    () => {
      setTableVisible(Table.Clients);
      setCurrentService(clientsService);
    },
    () => {
      setTableVisible(Table.Checks);
      setCurrentService(checksService);
    },
    () => setTableVisible(Table.Profile),
  ];

  const onClickFunctionsCashier = onClickFunctionsCashierNotFull.map((func) => {
    const newFunc = () => {
      func();
      setSelectedUPC("");
    };
    return newFunc;
  });
  const onClickFunctionsManager = [
    () => setTableVisible(Table.Main),
    () => {
      setTableVisible(Table.Products);
      setCurrentService(productsService);
    },
    () => {
      setTableVisible(Table.StoreProducts);
      setCurrentService(storeProductsService);
    },
    () => {
      setTableVisible(Table.Categories);
      setCurrentService(categoriesService);
    },
    () => {
      setTableVisible(Table.Clients);
      setCurrentService(clientsService);
    },
    () => {
      setTableVisible(Table.Checks);
      setCurrentService(checksService);
    },
    () => {
      setTableVisible(Table.Workers);
      setCurrentService(workersService);
    },
  ];

  const createCheckLabel = "Створити чек";

  enum ShowOnChecksPage {
    showCheckInfo = 0,
    showChecksTable,
  }

  //#endregion

  //#region Column names
  const categoriesColumnNames = ["ID", "Категорія"];
  const checkColumnNames = ["UPC", "Назва", "Кількість", "Ціна", "Вартість"];

  const productsColumnNames = [
    "ID",
    "ID категорії",
    "Назва продукту",
    "Характеристики",
  ];

  const storeProductsColumnNames = [
    "UPC",
    "Акційне UPC",
    "Назва",
    "Ціна",
    "Кількість одиниць",
    "Акційний",
  ];
  const storeProductsColumnNamesToPost = [
    "UPC",
    "Акційне UPC",
    "ID товару",
    "Ціна",
    "Кількість одиниць",
    "Акційний",
  ];

  const clientsColumnNames = [
    "Номер картки",
    "Прізвище",
    "Ім'я",
    "По батькові",
    "Номер телефону",
    "Місто",
    "Вулиця",
    "Поштовий індекс",
    "Відсоток знижки",
  ];

  const workersColumnNames = [
    "ID",
    "Прізвище",
    "Ім'я",
    "По батькові",
    "Посада",
    "Зарплата",
    "Дата народження",
    "Дата початку роботи",
    "Номер телефону",
    "Місто",
    "Вулиця",
    "Поштовий індекс",
  ];

  const checksColumnNames = [
    "Номер чека",
    "ID працівника/ці",
    "Номер карти клієнт/ки",
    "Дата",
    "Сума",
    "ПДВ",
  ];
  //#endregion

  //#region Variables
  const [checksPageView, setChecksPageView] = useState(
    ShowOnChecksPage.showChecksTable
  );

  const [whatTableIsVisible, setTableVisible] = useState(-1);

  const [selectedUPC, setSelectedUPC] = useState<string>("");

  const [selectedSurname, setSelectedSurname] = useState("");

  const [selectedPercent, setSelectedPercent] = useState("");

  const [soldProductsAmount, setSoldProductsAmount] = useState(300);

  const [onlyCashiers, setOnlyCashiers] = useState(false);

  const [showAddCheckForm, setShowAddCheckForm] = useState(false);

  const [checkRows, setCheckRows] = useState<TableRow[]>([]);

  const [selectedCheck, setSelectedCheck] = useState<Check>({
    id_employee: "23452",
    check_number: "98989",
    card_number: "",
    print_date: new Date(),
    sum_total: 800,
    vat: 40,
  });

  const [amountOfProductInCheck, setAmountOfProductInCheck] = useState(0);

  const [checksDateRangeCashier, setChecksDateRangeCashier] = useState<
    [Date | null, Date | null]
  >([null, null]);

  const [tovarDateRange, setTovarDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);

  const [checksDateRangeManager, setChecksDateRangeManager] = useState<
    [Date | null, Date | null]
  >([null, null]);

  const [newRow, setNewRow] = useState<TableRow>();

  const [currentGet, setCurrentGet] = useState(Get.Default);

  const [sales, setSales] = useState<Sale[]>([]);

  const [currentCheck, setCurrentCheck] = useState<Check>();

  //#endregion

  //#region useEffect

  const [updater, setUpdater] = useState(true);
  useEffect(() => {
    if (newRow) {
      currentService.createRow(newRow).then(() => {
        setUpdater(!updater);
      });
    }
  }, [newRow]);

  useEffect(() => {
    const fetchCategories = async () => {
      const options = await categoriesService.getCategoriesOptions();
      setCategories(options);
    };

    const fetchProductNames = async () => {
      const options = await getProductNamesOptions();
      setProductNames(options);
    };

    const fetchUPCs = async () => {
      const options = await getUPCsOptions();
      setUPCs(options);
    };

    const fetchSurnames = async () => {
      const options = await getClientSurnamesOptions();
      setClientSurnames(options);
    };

    const fetchClientCards = async () => {
      const options = await getClientCardsOptions();
      setClientCards(options);
    };

    fetchCategories();
    fetchProductNames();
    fetchUPCs();
    fetchSurnames();
    fetchClientCards();
  }, []);

  useEffect(() => {
    if (checksDateRangeCashier[0] && checksDateRangeCashier[1]) {
      ChecksService.left_date = checksDateRangeCashier[0];
      ChecksService.right_date = checksDateRangeCashier[1];
      setCurrentGet(Get.ChecksDateRangeCashier);
    }
  }, [checksDateRangeCashier]);

  //#endregion

  //#region HandleOnChange functions

  const handleOnChangeIsPromotional = (value: string) => {
    if (value === "Акційні") setCurrentGet(Get.Promo);
    else if (value === "Не акційні") setCurrentGet(Get.NotPromo);
    else setCurrentGet(Get.Default);
  };

  const handleOnChangeSortingStoreProducts = (value: string) => {
    if (value === "За кількістю товару") setCurrentGet(Get.SortByAmount);
    else if (value === "За назвою") setCurrentGet(Get.SortByName);
  };

  const handleOnChangeCategory = (value: string) => {
    ProductsService.category = value;
    if (value !== "") {
      setCurrentGet(Get.Category);
    } else setCurrentGet(Get.Default);
  };

  const handleOnChangeProductName = (value: string) => {
    ProductsService.productName = value;
    if (value !== "") {
      setCurrentGet(Get.ProductName);
    } else setCurrentGet(Get.Default);
  };

  const handleOnChangeUPC = (value: string) => {
    StoreProductsService.UPC = value;
    if (value !== "") {
      setCurrentGet(Get.UPC);
    } else setCurrentGet(Get.Default);
  };

  const handleOnChangeClientSurname = (value: string) => {
    ClientsService.surname = value;
    console.log(value);
    if (value !== "") {
      setCurrentGet(Get.ClientSurname);
    } else setCurrentGet(Get.Default);
  };

  const [selectedClientCard, setSelectedClientCard] = useState("");

  const handleOnChangeClientCard = (value: string) => {
    setSelectedClientCard(value);
  };

  const handleOnChangePercent = (value: string) => {
    setSelectedPercent(value);
  };

  const handleOnChangeOnlyCashiers = (
    _event: React.SyntheticEvent<Element, Event>,
    checked: boolean
  ) => {
    setOnlyCashiers(!onlyCashiers);
  };

  //#endregion

  //#region Variables that are taken from the database

  const getProductNamesOptions = async () => {
    try {
      const result = await productsService.getProductNames();
      return result.map((productName) => ({
        value: productName,
        label: productName,
      }));
    } catch (error) {
      console.error("Failed to fetch product name options:", error);
      return [];
    }
  };

  const [categories, setCategories] = useState<Option[]>([]);

  const [productNames, setProductNames] = useState<Option[]>([]);

  const getUPCsOptions = async () => {
    try {
      const result = await storeProductsService.getUPCs();
      return result.map((UPC) => ({
        value: UPC,
        label: UPC,
      }));
    } catch (error) {
      console.error("Failed to fetch UPC options:", error);
      return [];
    }
  };

  const [UPCs, setUPCs] = useState<Option[]>([]);

  const getClientSurnamesOptions = async () => {
    try {
      let result = await clientsService.getSurnames();
      return result.map((surname) => ({
        value: surname,
        label: surname,
      }));
    } catch (error) {
      console.error("Failed to fetch surnames options:", error);
      return [];
    }
  };

  const [clientSurnames, setClientSurnames] = useState<Option[]>([]);

  const getClientCardsOptions = async () => {
    try {
      let result = await clientsService.getClientCards();
      return result.map((clientCard) => ({
        value: clientCard,
        label: clientCard,
      }));
    } catch (error) {
      console.error("Failed to fetch surnames options:", error);
      return [];
    }
  };

  const [сlientCards, setClientCards] = useState<Option[]>([]);

  const clientsPercents = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "25", label: "25" },
  ];

  //#endregion

  //#region Functions

  const addCheckRowToUITable = (newRow: TableRow) => {
    if (checkRows.length === 0) {
      setCheckRows([newRow]);
    } else {
      setCheckRows([...checkRows, newRow]);
    }
  };

  const addSaleToSales = (sale: Sale) => {
    if (sales.length === 0) {
      setSales([sale]);
    } else {
      setSales([...sales, sale]);
    }
  };

  const addCheckRow = async function (
    upc: string,
    amount: number
  ): Promise<void> {
    const storeProductService = new StoreProductsService();
    const result = await storeProductService.getRowByUPC(upc);

    const newSale = {
      UPC: upc,
      product_name: result.product_name.toString(),
      product_number: amount,
      selling_price: result.selling_price,
      total: amount * result.selling_price,
    };

    addCheckRowToUITable(saleToTableRow(newSale));
    addSaleToSales(newSale);
  };

  const countSumTotal = () => {
    let result = 0;
    for (let i = 0; i < sales.length; i++) {
      result += sales[i].total;
    }
    return result;
  };

  const createCheck = (): Check => {
    const sum_total = countSumTotal();
    console.log("created check and sum_total = " + sum_total);

    return {
      check_number: "-1",
      id_employee: id_employee,
      card_number: selectedClientCard,
      print_date: new Date(),
      sum_total: sum_total,
      vat: sum_total * 0.2,
    };
  };

  const saveCheck = async () => {
    const checksService = new ChecksService();
    setCurrentCheck(createCheck());

    let salesForDb = sales.map((sale) => saleToSaleForDb(sale));

    if (currentCheck) await checksService.createCheck(currentCheck, salesForDb);
    console.log("Check is saved");
    console.log("TODO add alert check is saved");
    setShowAddCheckForm(false);
  };

  const showCheckInfo = () => {
    setChecksPageView(ShowOnChecksPage.showCheckInfo);
  };

  const printCheck = () => {
    const checkForPrinting = `<!DOCTYPE html>
    <html>
      <head>
        <title>Check</title>
        <style>
          h1 {
            text-align: center;
          }
          .sale-info {
            display: flex;
            justify-content: space-between;
           width: 12rem;
          }
        </style>
      </head>
      <body>
        <h1>Супермаркет “ZLAGODA”</h1>
        <div>
          <label>ID касир/ки: ${cashierID}</label>
            <br />
            <label>
              Дата: ${new Date().toLocaleDateString("uk-ua")}
            </label>
            <br />
          <label>
            Час: ${new Date().toLocaleTimeString("uk-ua")}
          </label>
        </div>
      <br />
        ${sales
          .map(
            (sale) => `
            <label>${sale.product_name}</label>
              <div class="sale-info">
                <label>${sale.selling_price} х ${sale.product_number}</label>
                <label>${sale.total}</label>
              </div>
            <hr>
          `
          )
          .join("")}
      <br />
        <h3>Total: ${currentCheck?.sum_total}</h3>
      
      </body>
    </html>`;

    printReport(checkForPrinting);
  };

  const getWithoutId = (array: string[]) => {
    return array.slice(1);
  };

  //#endregion

  //#region Parts of return

  const managerPage = (
    <div>
      <div className="button-panel">
        <ButtonPanel
          buttonNames={buttonNamesManager}
          onClickFunctions={onClickFunctionsManager}
          defaultValue={0}
        />
      </div>
      <div className="full-page">
        {whatTableIsVisible === Table.Main && (
          <div>
            <ButtonGrid
              buttonLabels={buttonNamesManager.slice(1)}
              onClickFunctions={onClickFunctionsManager.slice(1)}
            />
          </div>
        )}
        {whatTableIsVisible === Table.Products && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
                marginRight: "2rem",
                height: "80px",
                gap: "30px",
              }}
            >
              <AutocompleteTextField
                label="Категорія"
                options={categories}
                onChange={handleOnChangeCategory}
                style={{ width: "10rem" }}
              />

              <div>
                <button
                  style={{ marginRight: "1rem" }}
                  type="button"
                  className="btn btn-secondary"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasScrolling"
                  aria-controls="offcanvasScrolling"
                >
                  Додати товар
                </button>
                <PrintReportButton
                  service={productsService}
                  tableType={TableType.Product}
                />
              </div>
            </div>

            <div
              style={{
                width: "80%",
              }}
            >
              <TableObject
                columnNames={productsColumnNames}
                service={productsService}
                updater={updater}
              />

              <EditOrCreateWindow
                columnNames={getWithoutId(productsColumnNames)}
                saveNewRow={setNewRow}
              />
            </div>
          </div>
        )}
        {whatTableIsVisible === Table.StoreProducts && (
          <div
            style={{
              display: "flex",
              width: "90%",
              minHeight: "100vh",
              gap: "15px",
            }}
          >
            <div style={{ minWidth: "200px" }}>
              <AutocompleteTextField
                options={UPCs}
                onChange={handleOnChangeUPC}
                label="UPC"
              />
            </div>

            <div style={{ width: "1px", backgroundColor: "grey" }} />

            <div className="column-container" style={{ flexGrow: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", gap: "1rem" }}>
                  <AutocompleteTextField
                    label="Чи акційний товар"
                    options={isPromotionalOptions}
                    onChange={handleOnChangeIsPromotional}
                    defaultValue={isPromotionalOptions[0]}
                    style={{ width: "200px" }}
                  />
                  <AutocompleteTextField
                    label="Сортування"
                    options={sortingStoreProductsOptions}
                    onChange={handleOnChangeSortingStoreProducts}
                    defaultValue={sortingStoreProductsOptions[0]}
                    style={{ width: "250px" }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasScrolling"
                    aria-controls="offcanvasScrolling"
                  >
                    Додати товар у магазині
                  </button>
                  <PrintReportButton />
                </div>
              </div>
              <div>
                {currentGet !== Get.UPC && (
                  <TableObject
                    columnNames={storeProductsColumnNames}
                    service={storeProductsService}
                    updater={updater}
                  />
                )}
                {currentGet === Get.UPC && (
                  <div
                    style={{
                      display: "flex",
                      gap: "55px",
                      width: "100vh",
                    }}
                  >
                    <TovarCard
                      tovarName="Крупа гречана 'Геркулес' 500г"
                      price="50.00"
                      amount="40"
                      unitOfMeasurement="шт."
                    />
                  </div>
                )}
              </div>
            </div>
            <EditOrCreateWindow
              columnNames={storeProductsColumnNamesToPost}
              saveNewRow={setNewRow}
            />
          </div>
        )}
        {whatTableIsVisible === Table.Categories && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginRight: "1rem",
            }}
          >
            <div style={{ width: "30%" }}>
              <TableObject
                columnNames={categoriesColumnNames}
                service={categoriesService}
                updater={updater}
              />
            </div>
            <div
              style={{
                height: "50px",
              }}
            >
              <button
                style={{ marginRight: "15px" }}
                type="button"
                className="btn btn-secondary"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasScrolling"
                aria-controls="offcanvasScrolling"
              >
                Додати категорію
              </button>
              <PrintReportButton
                service={categoriesService}
                tableType={TableType.Category}
              />
              <EditOrCreateWindow
                columnNames={getWithoutId(categoriesColumnNames)}
                saveNewRow={setNewRow}
              />
            </div>
          </div>
        )}
        {whatTableIsVisible === Table.Clients && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ width: "15%" }}>
                <AutocompleteTextField
                  options={clientsPercents}
                  onChange={handleOnChangePercent}
                  label="Відсоток знижки"
                />
              </div>
              <div style={{ marginRight: "25px" }}>
                <button
                  style={{ marginRight: "15px" }}
                  type="button"
                  className="btn btn-secondary"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasScrolling"
                  aria-controls="offcanvasScrolling"
                >
                  Додати клієнт/ку
                </button>
                <PrintReportButton />
              </div>
            </div>

            <TableObject
              columnNames={clientsColumnNames}
              service={clientsService}
              updater={updater}
            />
            <EditOrCreateWindow
              columnNames={clientsColumnNames}
              saveNewRow={setNewRow}
            />
          </>
        )}
        {whatTableIsVisible === Table.Checks && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                gap: "25px",
                marginBottom: "15px",
              }}
            >
              <div style={{ width: "250px" }}>
                <DateInput
                  dateRange={checksDateRangeManager}
                  setDateRange={setChecksDateRangeManager}
                />
              </div>

              <div style={{ width: "15%" }}>
                <AutocompleteTextField
                  options={clientsPercents}
                  onChange={handleOnChangePercent}
                  label="Cashier ID"
                />
              </div>

              <button
                className="btn btn-secondary"
                style={{
                  height: "40px",
                  marginTop: "12px",
                  marginLeft: "40%",
                }}
              >
                Загальна сума
              </button>
              <PrintReportButton
                buttonStyle={{
                  height: "40px",
                  marginTop: "12px",
                }}
              />
            </div>
            <TableObject
              columnNames={checksColumnNames}
              service={checksService}
              updater={updater}
            />
          </>
        )}
        {whatTableIsVisible === Table.Workers && (
          <div
            style={{
              display: "flex",
              width: "90%",
              minHeight: "100vh",
              gap: "15px",
            }}
          >
            <div style={{ minWidth: "200px" }}>
              <AutocompleteTextField
                options={clientSurnames}
                onChange={handleOnChangeClientSurname}
                label="Прізвище"
              />
              {WorkersService.surname !== "" && (
                <div>
                  <h3>{WorkersService.surname}</h3>
                </div>
              )}
            </div>

            <div style={{ width: "1px", backgroundColor: "grey" }} />

            <div className="column-container" style={{ flexGrow: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Лише касир/ки"
                  onChange={handleOnChangeOnlyCashiers}
                />
                <div>
                  <button
                    style={{ marginRight: "15px" }}
                    type="button"
                    className="btn btn-secondary"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasScrolling"
                    aria-controls="offcanvasScrolling"
                  >
                    Додати робітника/цю
                  </button>

                  <PrintReportButton />
                </div>
              </div>
              <div>
                <TableObject
                  columnNames={workersColumnNames}
                  service={workersService}
                  updater={updater}
                />

                <EditOrCreateWindow
                  columnNames={getWithoutId(workersColumnNames)}
                  saveNewRow={setNewRow}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const cashierPage = (
    <div>
      <div className="button-panel">
        <ButtonPanel
          buttonNames={buttonNamesCashier}
          onClickFunctions={onClickFunctionsCashier}
          defaultValue={0}
        />
      </div>
      <div className="full-page">
        {whatTableIsVisible === Table.Main && (
          <div>
            {!showAddCheckForm && (
              <ButtonGrid
                buttonLabels={buttonNamesCashier.slice(1)}
                addCheckButtonLabel={createCheckLabel}
                onClickFunctions={onClickFunctionsCashier.slice(1)}
                onClickAddCheckButton={() => setShowAddCheckForm(true)}
              />
            )}
            {showAddCheckForm && (
              <div className="column-container" style={{ width: "95%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", gap: "100px" }}>
                    <BasicCheckInfo cashierID={cashierID} />

                    <AutocompleteTextField
                      options={сlientCards}
                      onChange={handleOnChangeClientCard}
                      label="Картка клієнтки"
                      style={{ width: "200px" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "30px" }}>
                    <button
                      className="save-check-button"
                      onClick={async () => {
                        await saveCheck();
                      }}
                    >
                      Зберегти чек
                    </button>

                    <button
                      className="print-check-button"
                      onClick={async () => {
                        try {
                          await saveCheck();
                        } catch (error) {
                          console.log(error);
                        }
                        printCheck();
                      }}
                    >
                      Роздрукувати чек
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "30px" }}>
                  <AddProductInCheckForm options={UPCs} onAdd={addCheckRow} />
                  <div style={{ flexGrow: 1 }}>
                    <TableObject
                      columnNames={checkColumnNames}
                      rows={checkRows}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {whatTableIsVisible === Table.Products && (
          <div style={{ display: "flex" }}>
            <div className="column-container" style={{ flexGrow: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "30px",
                }}
              >
                <AutocompleteTextField
                  label="Категорія"
                  options={categories}
                  onChange={handleOnChangeCategory}
                  style={{ width: "200px" }}
                />

                <AutocompleteTextField
                  label="Назва товару"
                  options={productNames}
                  onChange={handleOnChangeProductName}
                  style={{ width: "300px" }}
                />
              </div>
              <div style={{ width: "80%" }}>
                <TableObject
                  columnNames={productsColumnNames}
                  service={productsService}
                  updater={updater}
                  withButtons={false}
                  getFunction={currentGet}
                />
              </div>
            </div>
          </div>
        )}
        {whatTableIsVisible === Table.StoreProducts && (
          <div
            style={{
              display: "flex",
              width: "90%",
              minHeight: "100vh",
              gap: "15px",
            }}
          >
            <div style={{ minWidth: "200px" }}>
              <AutocompleteTextField
                options={UPCs}
                onChange={handleOnChangeUPC}
                label="UPC"
              />
            </div>

            <div style={{ width: "1px", backgroundColor: "grey" }} />

            <div className="column-container" style={{ flexGrow: 1 }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <AutocompleteTextField
                  label="Чи акційний товар"
                  options={isPromotionalOptions}
                  onChange={handleOnChangeIsPromotional}
                  defaultValue={isPromotionalOptions[0]}
                  style={{ width: "200px" }}
                />
                <AutocompleteTextField
                  label="Сортування"
                  options={sortingStoreProductsOptions}
                  onChange={handleOnChangeSortingStoreProducts}
                  defaultValue={sortingStoreProductsOptions[0]}
                  style={{ width: "250px" }}
                />
              </div>
              <div>
                {currentGet !== Get.UPC && (
                  <TableObject
                    columnNames={storeProductsColumnNames}
                    service={storeProductsService}
                    updater={updater}
                    withButtons={false}
                  />
                )}
                {currentGet === Get.UPC && (
                  <div
                    style={{
                      display: "flex",
                      gap: "55px",
                      width: "100vh",
                    }}
                  >
                    <TovarCard
                      tovarName="Крупа гречана 'Геркулес' 500г"
                      price="50.00"
                      amount="40"
                      unitOfMeasurement="шт."
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {whatTableIsVisible === Table.Clients && (
          <div className="column-container" style={{ width: "95%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <AutocompleteTextField
                options={clientSurnames}
                onChange={handleOnChangeClientSurname}
                label="Прізвище"
                style={{ width: "200px" }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasScrolling"
                aria-controls="offcanvasScrolling"
                style={{ height: "45px" }}
              >
                Додати клієнт/ку
              </button>
            </div>

            <TableObject
              columnNames={clientsColumnNames}
              service={currentService}
              updater={updater}
              onlyEditButton={true}
              getFunction={currentGet}
            />

            <EditOrCreateWindow
              columnNames={clientsColumnNames}
              saveNewRow={setNewRow}
            />
          </div>
        )}
        {whatTableIsVisible === Table.Checks && (
          <>
            <div className="column-container" style={{ width: "90%" }}>
              {checksPageView === ShowOnChecksPage.showChecksTable && (
                <div className="column-container">
                  <div style={{ width: "250px" }}>
                    <DateInput
                      dateRange={checksDateRangeCashier}
                      setDateRange={setChecksDateRangeCashier}
                    />
                  </div>

                  <TableObject
                    columnNames={checksColumnNames}
                    service={checksService}
                    updater={updater}
                    withButtons={false}
                    onDoubleClickRow={showCheckInfo}
                  />
                </div>
              )}
              {checksPageView === ShowOnChecksPage.showCheckInfo && (
                <>
                  <button
                    className="btn btn-primary"
                    style={{ width: "200px" }}
                    onClick={() =>
                      setChecksPageView(ShowOnChecksPage.showChecksTable)
                    }
                  >
                    Назад до всіх чеків
                  </button>
                  <CheckInfo
                    check={selectedCheck}
                    checkColumnNames={checkColumnNames}
                  />
                </>
              )}
            </div>
          </>
        )}
        {whatTableIsVisible === Table.Profile && (
          <div style={{ width: "50%" }}>
            <Profile id_employee={id_employee} />
          </div>
        )}
      </div>
    </div>
  );

  //#endregion

  return (
    // Cashier page
    <div>{isCashier ? cashierPage : managerPage}</div>
  );
}

export default App;

{
  /* <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        width: "700px",
                        marginTop: "10px",
                      }}
                    >
                      <label>
                        Кількість проданих одиниць товару: {soldProductsAmount}
                      </label>

                      <DateInput
                        dateRange={tovarDateRange}
                        setDateRange={setTovarDateRange}
                      />
                    </div> */
}
