import ButtonPanel from "./components/ButtonGroup";
import TableObject, { Get } from "./components/TableObject";
import TableRow from "./classes/TableRow";
import Profile from "./components/Profile";
import { useState, ChangeEvent, useEffect } from "react";
import DateRangeInput from "./components/DateRangeInput";
import TovarCard from "./components/TovarCard";
import AutocompleteTextField from "./components/AutocompleteTextField";
import {
  Checkbox,
  FormControlLabel,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
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
import ChecksService, {
  Check,
  tableRowToCheck,
} from "./services/ChecksService";
import StoreProductsService, {
  PromoNotPromo,
} from "./services/StoreProductsService";
import ProfileService from "./services/ProfileService";
import CheckInfo from "./components/CheckInfo";
import BasicCheckInfo from "./components/BasicCheckInfo";
import Service from "./services/Service";
import { Sale, saleToSaleForDb, saleToTableRow } from "./services/SalesService";
import { Worker } from "./services/WorkersService";
import ReactDOMServer from "react-dom/server";
import UserService, { User } from "./services/UserService";
import { AxiosError } from "axios";
import { formatDate } from "./utils/Utils";

function App() {
  //#region Services
  const categoriesService = new CategoriesService();
  const clientsService = new ClientsService();
  const workersService = new WorkersService();
  const productsService = new ProductsService();
  const [checksService, setChecksService] = useState<ChecksService>();
  const storeProductsService = new StoreProductsService();
  const [currentService, setCurrentService] =
    useState<Service>(categoriesService);

  //#endregion

  //#region Constants

  const isPromotionalOptions = [
    { value: "Всі", label: "Всі" },
    { value: "Акційні", label: "Акційні" },
    { value: "Не акційні", label: "Не акційні" },
  ];

  const sortingStoreProductsOptions = [
    { value: "За кількістю товару", label: "За кількістю товару" },
    { value: "За назвою", label: "За назвою" },
  ];

  const cashierRole = "Касирка";

  enum Table {
    Main = 0,
    Products,
    StoreProducts,
    Categories,
    Clients,
    Checks,
    Workers,
    Profile,
    ChangePassword,
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
  const onClickFunctionsCashier = [
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
      if (checksService) setCurrentService(checksService);
    },
    () => setTableVisible(Table.Profile),
  ];

  const onClickFunctionsManager = [
    () => setTableVisible(Table.Main),
    () => {
      setTableVisible(Table.Products);
      setCurrentService(productsService);
    },
    () => {
      StoreProductsService.promo = StoreProductsService.defaultPromo;
      StoreProductsService.sortByName = StoreProductsService.defaultSortByName;
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
      if (checksService) setCurrentService(checksService);
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
    "Категорія",
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

  const [isCashier, setIsCashier] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [idEmployee, setIdEmployee] = useState<string>();

  const [checksPageView, setChecksPageView] = useState(
    ShowOnChecksPage.showChecksTable
  );

  const [whatTableIsVisible, setTableVisible] = useState(-1);

  const [soldProductsAmount, setSoldProductsAmount] = useState(300);

  const [onlyCashiers, setOnlyCashiers] = useState(false);

  const [onlyAllClients, setonlyAllClients] = useState(false);

  const [showAddCheckForm, setShowAddCheckForm] = useState(false);

  const [checkRows, setCheckRows] = useState<TableRow[]>([]);

  const [selectedCheckRow, setSelectedCheckRow] = useState<TableRow>();

  const [selectedCheckNumber, setSelectedCheckNumber] = useState<
    string | number
  >();

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

  const [categoryIsEmpty, setCategoryIsEmpty] = useState<boolean>();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [editing, setEditing] = useState(false);

  const [statisticsRows, setStatisticsRows] = useState<TableRow[]>();

  const [theMostPopularCategories, setTheMostPopularCategories] =
    useState<TableRow[]>();

  const [totalSum, setTotalSum] = useState<number>();

  const [valueForMinCost, setValueForMinCost] = useState("");

  //#endregion

  //#region useEffect

  useEffect(() => {
    if (selectedCheckRow) console.log(tableRowToCheck(selectedCheckRow));
    if (selectedCheckRow) setSelectedCheckNumber(selectedCheckRow.id);
  }, [selectedCheckRow]);

  const [updater, setUpdater] = useState(true);
  useEffect(() => {
    if (newRow) {
      if (!editing) {
        console.log("creating");
        currentService.createRow(newRow).then(() => {
          setUpdater(!updater);
        });
      } else {
        console.log("updating row, row id = " + newRow.id);
        currentService.updateRow(newRow.id, newRow).then(() => {
          setUpdater(!updater);
        });
      }
    }
  }, [newRow]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchCategories = async () => {
      const options = await categoriesService.getCategoriesOptions();
      setCategories(options);
    };

    const fetchProductNames = async () => {
      const options = await productsService.getProductNamesOptions();
      setProductNames(options);
    };

    const fetchUPCs = async () => {
      const options = await getUPCsOptions();
      setUPCs(options);
    };

    const fetchClientSurnames = async () => {
      const options = await getClientSurnamesOptions();
      setClientSurnames(options);
    };

    const fetchClientCards = async () => {
      const options = await getClientCardsOptions();
      setClientCards(options);
    };

    const fetchWorkerSurnames = async () => {
      if (!isCashier) {
        const options = await getWorkerSurnamesOptions();
        setWorkerSurnames(options);
      }
    };

    const fetchCashierIds = async () => {
      const options = await getCashierIDsOptions();
      setCashierIDs(options);
    };

    const fetchPercents = async () => {
      const options = await getPercentOptions();
      setClientsPercents(options);
    };

    const fetchCategoriesStatistics = async () => {
      const rows = await categoriesService.getStatistics();
      setStatisticsRows(rows);
    };

    const fetchTheMostPopularCategories = async () => {
      const rows = await categoriesService.getTheMostPopularCategories();
      setTheMostPopularCategories(rows);
    };

    fetchCategories();
    fetchProductNames();
    fetchUPCs();
    fetchClientSurnames();
    fetchClientCards();
    fetchWorkerSurnames();
    fetchPercents();
    fetchTheMostPopularCategories();

    if (!isCashier) {
      fetchCashierIds();
      fetchCategoriesStatistics();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (
      checksDateRangeCashier[0] !== null &&
      checksDateRangeCashier[1] !== null
    ) {
      console.log(checksDateRangeCashier[0]);
      ChecksService.left_date = checksDateRangeCashier[0];
      ChecksService.right_date = checksDateRangeCashier[1];
      setCurrentGet(Get.ChecksDateRange);
    } else {
      ChecksService.left_date = new Date();
      ChecksService.right_date = new Date();
      setCurrentGet(Get.Default);
    }
  }, [checksDateRangeCashier]);

  useEffect(() => {
    if (
      checksDateRangeManager[0] !== null &&
      checksDateRangeManager[1] !== null
    ) {
      ChecksService.left_date = checksDateRangeManager[0];
      ChecksService.right_date = checksDateRangeManager[1];
      setCurrentGet(Get.ChecksDateRange);
    } else {
      ChecksService.left_date = new Date();
      ChecksService.right_date = new Date();
      setCurrentGet(Get.Default);
    }
  }, [checksDateRangeManager]);

  const fetchAmountOfSoldProduct = async () => {
    const response = await productsService.getAmountOfSoldProduct();
    console.log(response);
    setSoldProductsAmount(response);
  };

  useEffect(() => {
    console.log("tovar date is changed");

    if (tovarDateRange[0] !== null && tovarDateRange[1] !== null) {
      ProductsService.left_date = tovarDateRange[0];
      ProductsService.right_date = tovarDateRange[1];
    } else {
      ProductsService.left_date = new Date();
      ProductsService.right_date = new Date();
    }
    fetchAmountOfSoldProduct();
  }, [tovarDateRange]);

  useEffect(() => {
    const fetchIdEmployee = async (user: User) => {
      const userService = new UserService(user);
      const response = await userService.logIn();
      setIdEmployee(response);
    };

    const username = localStorage.getItem("username");
    const encryptedPassword = localStorage.getItem("password");
    let password;
    try {
      if (encryptedPassword !== null) password = atob(encryptedPassword);
    } catch (error) {
      console.log("atob error");
      throw new Error();
    }
    if (username && password) {
      const user = {
        username: username,
        password: password,
      };

      fetchIdEmployee(user);
    }
  }, []);

  useEffect(() => {
    if (idEmployee) {
      const username = localStorage.getItem("username");
      const encryptedPassword = localStorage.getItem("password");
      let password;
      try {
        if (encryptedPassword !== null) password = atob(encryptedPassword);
      } catch (error) {
        console.log("atob error");
        throw new Error();
      }
      if (username && password) {
        const user = {
          username: username,
          password: password,
        };
        handleLogIn(idEmployee, user);
      }
    }
  }, [idEmployee]);

  //#endregion

  //#region HandleOnChange functions

  const handleOnChangeForMinCost = (event: ChangeEvent<HTMLInputElement>) => {
    setValueForMinCost(event.target.value);
    console.log(valueForMinCost);
  };

  const handleOnChangeIsPromotional = (value: string) => {
    if (value === "Акційні") {
      StoreProductsService.promo = PromoNotPromo.Promo;
    } else if (value === "Не акційні") {
      StoreProductsService.promo = PromoNotPromo.NotPromo;
    } else {
      StoreProductsService.promo = PromoNotPromo.All;
    }
    setUpdater(!updater);
  };

  const handleOnChangeSortingStoreProducts = (value: string) => {
    if (value === "За кількістю товару") {
      StoreProductsService.sortByName = false;
    } else if (value === "За назвою") {
      StoreProductsService.sortByName = true;
    }
    setUpdater(!updater);
  };

  const handleOnChangeCategory = (value: string) => {
    ProductsService.category = value;
    if (value !== "") {
      setCurrentGet(Get.Category);
    } else setCurrentGet(Get.Default);
  };

  const handleOnChangeIsEmptyCategory = async (value: string) => {
    // CategoriesService.categoryWithSoldProducts = value;
    if (value !== "") {
      console.log("hello");
      const response = await categoriesService.getCategoryIsEmpty(value);
      console.log(response);
      setCategoryIsEmpty(response);
    } else setCategoryIsEmpty(undefined);
  };

  const handleOnChangeProductName = (value: string) => {
    ProductsService.productName = value;
    if (value !== "") {
      setCurrentGet(Get.ProductName);
    } else setCurrentGet(Get.Default);
  };

  const handleOnChangeUPC = async (value: string) => {
    StoreProductsService.UPC = value;

    if (value !== "") {
      const response = await storeProductsService.getRowByUPC(
        StoreProductsService.UPC
      );
      if (response.id_product) ProductsService.id = response.id_product;
      setCurrentGet(Get.UPC);
    } else setCurrentGet(Get.Default);
    await fetchAmountOfSoldProduct();
  };

  const handleOnChangeClientSurname = (value: string) => {
    ClientsService.surname = value;
    if (value !== "") {
      setCurrentGet(Get.ClientSurname);
    } else setCurrentGet(Get.Default);
  };

  const [workersData, setWorkersData] = useState<Worker[]>([]);

  const handleOnChangeWorkerSurname = async (value: string) => {
    WorkersService.surname = value;
    if (value !== "") {
      const result = await workersService.getRowsBySurname(
        WorkersService.surname
      );
      setWorkersData(result);
    } else {
      setWorkersData([]);
    }
  };

  const [selectedClientCard, setSelectedClientCard] = useState("");

  const handleOnChangeClientCard = (value: string) => {
    setSelectedClientCard(value);
  };

  const handleOnChangeCashierID = (value: string) => {
    WorkersService.ID = value;
    if (value !== "") {
      setCurrentGet(Get.CertainCashierChecks);
    } else setCurrentGet(Get.Default);
  };

  const handleOnChangePercent = (value: string) => {
    ClientsService.percent = value;
    if (value !== "") {
      setCurrentGet(Get.ClientsWithPercent);
    } else setCurrentGet(Get.Default);
  };

  const handleOnChangeOnlyCashiers = (
    _event: React.SyntheticEvent<Element, Event>,
    checked: boolean
  ) => {
    if (checked) {
      setCurrentGet(Get.OnlyCashiers);
    } else {
      setCurrentGet(Get.Default);
    }
    setOnlyCashiers(!onlyCashiers);
  };

  const handleOnServeOnlyAllClients = (
    _event: React.SyntheticEvent<Element, Event>,
    checked: boolean
  ) => {
    if (checked) {
      setCurrentGet(Get.onlyAllClients);
    } else {
      setCurrentGet(Get.Default);
    }
    setonlyAllClients(!onlyAllClients);
  };

  //#endregion

  //#region Variables that are taken from the database

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
      console.error("Failed to fetch clients surnames options:", error);
      return [];
    }
  };

  const [clientSurnames, setClientSurnames] = useState<Option[]>([]);

  const getWorkerSurnamesOptions = async () => {
    try {
      let result = await workersService.getSurnames();
      return result.map((surname) => ({
        value: surname,
        label: surname,
      }));
    } catch (error) {
      console.error("Failed to fetch workers surnames options:", error);
      return [];
    }
  };

  const [workerSurnames, setWorkerSurnames] = useState<Option[]>([]);

  const getClientCardsOptions = async () => {
    try {
      let result = await clientsService.getClientCards();
      return result.map((clientCard) => ({
        value: clientCard,
        label: clientCard,
      }));
    } catch (error) {
      console.error("Failed to fetch client cards:", error);
      return [];
    }
  };

  const [сlientCards, setClientCards] = useState<Option[]>([]);

  const [cashierIDs, setCashierIDs] = useState<Option[]>([]);
  const getCashierIDsOptions = async () => {
    try {
      let result = await workersService.getCashiersObjects();
      return result.map((cashier) => ({
        value: cashier.id_employee,
        label:
          cashier.id_employee +
          " " +
          cashier.empl_surname +
          " " +
          cashier.empl_name,
      }));
    } catch (error) {
      console.error("Failed to fetch cashier IDs:", error);
      return [];
    }
  };

  const [clientsPercents, setClientsPercents] = useState<Option[]>([]);
  const getPercentOptions = async () => {
    try {
      let result = await clientsService.getPercents();
      return result.map((percent) => ({
        value: percent,
        label: percent,
      }));
    } catch (error) {
      console.error("Failed to fetch percent options:", error);
      return [];
    }
  };

  //#endregion

  //#region Functions

  const handleLogIn = async (idEmployee: string, user: User) => {
    saveUserData(user);
    setIdEmployee(idEmployee);
    Service.user = user;
    let profileService = new ProfileService(idEmployee);
    const response = await profileService.getRow();
    if (response.empl_role === cashierRole) {
      setIsCashier(true);
      setChecksService(new ChecksService(true, idEmployee));
    } else {
      setIsCashier(false);
      setChecksService(new ChecksService(false));
    }

    setIsLoggedIn(true);
  };

  const saveUserData = (user: User) => {
    localStorage.setItem("username", user.username);
    try {
      localStorage.setItem("password", btoa(user.password));
    } catch (error) {
      console.log("btoa error");
      throw new Error();
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    setIsLoggedIn(false);
  };

  const changePassword = async () => {
    const user = { username: Service.user.username, password: oldPassword };
    const userService = new UserService(user);

    try {
      await userService.logIn();
    } catch (error) {
      if ((error as AxiosError).message === "Network Error") {
        console.log("Network Error");
        showErrorFunction("Сервер не підключений");
        return;
      } else {
        showErrorFunction("Неправильний нікнейм або пароль");
        return;
      }
    }

    user.password = newPassword;
    try {
      await userService.changePassword(user, oldPassword);
      try {
        localStorage.setItem("password", btoa(user.password));
      } catch (error) {
        console.log("btoa error");
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
    showErrorFunction("Пароль змінено");
  };

  const showErrorFunction = (errorMessage?: string) => {
    if (errorMessage) {
      setErrorMessage(errorMessage);
    }
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
    }, 3000);
  };

  const addCheckRowToUITable = (newRow: TableRow) => {
    if (checkRows.length === 0) {
      setCheckRows([newRow]);
    } else {
      setCheckRows([...checkRows, newRow]);
    }
  };

  const updateCheckRowInUITable = (newRow: TableRow, i: number) => {
    const rows = [...checkRows];
    rows[i] = newRow;
    setCheckRows(rows);
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

    if (amount > result.products_number) {
      throw new Error("Кількість товару більша, ніж є в наявності");
    }

    for (let i = 0; i < sales.length; i++) {
      if (sales[i].upc === result.upc) {
        const newSales = [...sales];
        newSales[i].products_number += amount;
        newSales[i].total += amount * sales[i].selling_price;
        setSales(newSales);
        updateCheckRowInUITable(saleToTableRow(newSales[i]), i);
        return;
      }
    }

    const newSale = {
      upc: upc,
      product_name: result.product_name.toString(),
      products_number: amount,
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

  const createCheck = (): Check | null => {
    const sum_total = countSumTotal();
    console.log("created check and sum_total = " + sum_total);

    if (!idEmployee) return null;

    return {
      check_number: "-1",
      id_employee: idEmployee,
      card_number: selectedClientCard,
      print_date: new Date(),
      sum_total: sum_total,
      vat: sum_total * 0.2,
    };
  };

  const saveCheck = async () => {
    const checksService = new ChecksService(isCashier, idEmployee);
    const check = createCheck();
    if (check) setCurrentCheck(check);

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
          <label>ID касир/ки: ${idEmployee}</label>
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
                <label>${sale.selling_price} х ${sale.products_number}</label>
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

  const setTotalSumLabel = () => {
    if (checksDateRangeManager[0] === checksDateRangeManager[1]) {
      return `${
        checksDateRangeManager[0] !== null
          ? formatDate(checksDateRangeManager[0])
          : formatDate(new Date())
      } продано товарів на ${totalSum} гривень`;
    } else
      return `З ${
        checksDateRangeManager[0] !== null
          ? formatDate(checksDateRangeManager[0])
          : formatDate(new Date())
      }
    до
    ${
      checksDateRangeManager[1] !== null
        ? formatDate(checksDateRangeManager[1])
        : formatDate(new Date())
    }
    продано товарів на ${totalSum} гривень`;
  };

  //#endregion

  //#region Parts of return

  const logOutAndChangePasswordButtons = (
    <div style={{ display: "flex", gap: "1rem" }}>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => setTableVisible(Table.ChangePassword)}
      >
        Змінити пароль
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={handleLogOut}
      >
        Вийти
      </button>
    </div>
  );

  const changePasswordPage = (
    <div className="column-container" style={{ width: "20%" }}>
      {Service.user && (
        <label style={{ fontSize: 18 }}>Нікнейм: {Service.user.username}</label>
      )}
      <TextField
        type="password"
        className="text-field"
        key={"old_password"}
        label={"Старий пароль"}
        onChange={(event) => setOldPassword(event.target.value)}
        variant="outlined"
      />
      <TextField
        type="password"
        className="text-field"
        key={"new_password"}
        label={"Новий пароль"}
        onChange={(event) => setNewPassword(event.target.value)}
        variant="outlined"
      />
      <button
        type="button"
        className="btn btn-success"
        onClick={changePassword}
      >
        Змінити пароль
      </button>
    </div>
  );

  const managerPage = (
    <div>
      <div className="button-panel">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginRight: "3rem",
          }}
        >
          <ButtonPanel
            buttonNames={buttonNamesManager}
            onClickFunctions={onClickFunctionsManager}
            defaultValue={0}
          />
          {logOutAndChangePasswordButtons}
        </div>
      </div>
      <div className="full-page">
        {whatTableIsVisible === Table.ChangePassword && (
          <div>{changePasswordPage} </div>
        )}
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
                  tableType={TableType.Products}
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
                setEditing={setEditing}
                saveNewRow={setNewRow}
                tableType={TableType.Products}
                getFunction={currentGet}
              />

              <EditOrCreateWindow
                columnNames={getWithoutId(productsColumnNames)}
                saveNewRow={setNewRow}
                tableType={TableType.Products}
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
                  <PrintReportButton
                    service={storeProductsService}
                    tableType={TableType.StoreProducts}
                  />
                </div>
              </div>
              <div>
                {currentGet !== Get.UPC && (
                  <TableObject
                    columnNames={storeProductsColumnNames}
                    service={storeProductsService}
                    updater={updater}
                    setEditing={setEditing}
                    saveNewRow={setNewRow}
                    tableType={TableType.StoreProducts}
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
                    <TovarCard />
                    <div
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

                      <DateRangeInput
                        dateRange={tovarDateRange}
                        setDateRange={setTovarDateRange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <EditOrCreateWindow
              columnNames={storeProductsColumnNames}
              saveNewRow={setNewRow}
              tableType={TableType.StoreProducts}
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
                setEditing={setEditing}
                saveNewRow={setNewRow}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <label className="btn btn-info">Статистика за категоріями</label>
              <TableObject
                columnNames={[
                  "ID категорії",
                  "Назва категорії",
                  "Група товарів",
                  "Продано",
                ]}
                withButtons={false}
                rows={statisticsRows}
              />
              <label>
                Знайти, скільки товарів куплено в різних групах в кожній
                категорії. Якщо товарів певної групи не продається в магазині,
                не відображати цю групу Групи товарів: • перша (товари з ціною
                більшою, ніж 75% від найдорожчого товару в цій категорії) •
                друга (товари з ціною більшою, ніж 25%, та меншою, ніж 75% від
                найдорожчого товару в цій категорії) • третя (товари з ціною
                меншою, ніж 25% від найдорожчого товару в цій категорії)
              </label>
            </div>
            <div
              className="column-container"
              style={{ alignItems: "center", height: "50px" }}
            >
              <div>
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
                  tableType={TableType.Categories}
                />
              </div>
              <label className="btn btn-info" style={{ width: "12rem" }}>
                Категорії дня
              </label>
              <TableObject
                columnNames={["ID категорії", "Назва категорії", "Продано"]}
                withButtons={false}
                rows={theMostPopularCategories}
              />
              <label className="btn btn-info">Чи пуста категорія?</label>
              <AutocompleteTextField
                label="Категорія"
                options={categories}
                onChange={handleOnChangeIsEmptyCategory}
                style={{ width: "200px" }}
              />
              {categoryIsEmpty !== undefined && (
                <label>Ця категорія{categoryIsEmpty ? "" : " не"} пуста</label>
              )}

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
              <div
                style={{
                  flexGrow: 1,
                  display: "flex",
                  gap: "2rem",
                  width: "550px",
                }}
              >
                <AutocompleteTextField
                  options={clientsPercents}
                  onChange={handleOnChangePercent}
                  label="Відсоток знижки"
                  style={{ width: "180px" }}
                />
                <Tooltip title="Клієнт/ки, що купували хоч раз товари з кожної категорії у магазині">
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Активні"
                    key={"prom"}
                    onChange={() => {
                      if (currentGet === Get.Default) {
                        if (ClientsService.city === "") {
                          showErrorFunction("Введіть місто");
                        } else {
                          setCurrentGet(Get.ActiveClients);
                        }
                      } else if (currentGet === Get.ActiveClients) {
                        setCurrentGet(Get.Default);
                      }
                    }}
                  />
                </Tooltip>
                <TextField
                  className="text-field"
                  key={"product_name"}
                  label={"Місто"}
                  onChange={(event) =>
                    (ClientsService.city = event.target.value)
                  }
                  variant="outlined"
                  // value={editedRow?.values[1] || ""}
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
                <PrintReportButton
                  service={clientsService}
                  tableType={TableType.Clients}
                />
              </div>
            </div>

            <TableObject
              columnNames={clientsColumnNames}
              service={clientsService}
              updater={updater}
              setEditing={setEditing}
              saveNewRow={setNewRow}
              getFunction={currentGet}
            />
            <EditOrCreateWindow
              columnNames={getWithoutId(clientsColumnNames)}
              saveNewRow={setNewRow}
            />
          </>
        )}
        {whatTableIsVisible === Table.Checks && (
          <>
            {checksPageView === ShowOnChecksPage.showChecksTable && (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "25px",
                    marginBottom: "15px",
                    marginRight: "2rem",
                  }}
                >
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ width: "250px" }}>
                      <DateRangeInput
                        dateRange={checksDateRangeManager}
                        setDateRange={setChecksDateRangeManager}
                      />
                    </div>

                    <div style={{ width: "10rem" }}>
                      <AutocompleteTextField
                        options={cashierIDs}
                        onChange={handleOnChangeCashierID}
                        label="Касирка"
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem" }}>
                    {totalSum && (
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{
                            height: "40px",
                            marginTop: "12px",
                          }}
                          onClick={() => {
                            setTotalSum(undefined);
                          }}
                        >
                          Сховати
                        </button>
                        <div
                          style={{
                            borderRadius: "10px",
                            padding: "5px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                            backgroundColor: "InfoBackground",
                            width: "18rem",
                          }}
                        >
                          {setTotalSumLabel()}
                        </div>
                      </div>
                    )}
                    <button
                      className="btn btn-secondary"
                      style={{
                        height: "40px",
                        marginTop: "12px",
                      }}
                      onClick={async () => {
                        console.log("get total price");
                        const response = await checksService?.getTotalSum();
                        setTotalSum(response);
                        // make upper div visible
                      }}
                    >
                      Загальна сума
                    </button>
                    <PrintReportButton
                      service={checksService}
                      tableType={TableType.Checks}
                      buttonStyle={{
                        height: "40px",
                        marginTop: "12px",
                      }}
                    />
                  </div>
                </div>
                {checksService && (
                  <TableObject
                    columnNames={checksColumnNames}
                    service={checksService}
                    updater={updater}
                    withButtons={false}
                    onDoubleClickRow={showCheckInfo}
                    selectRow={setSelectedCheckRow}
                    getFunction={currentGet}
                  />
                )}
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
                {selectedCheckNumber && (
                  <CheckInfo
                    checkNumber={selectedCheckNumber}
                    checkColumnNames={checkColumnNames}
                  />
                )}
              </>
            )}
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
                options={workerSurnames}
                onChange={handleOnChangeWorkerSurname}
                label="Прізвище"
              />
              {WorkersService.surname !== "" && (
                <div>
                  <br />
                  {workersData &&
                    workersData.map((data) => (
                      <div key={data.id_employee}>
                        <div
                          style={{
                            borderRadius: "10px",
                            padding: "10px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
                            backgroundColor: "InfoBackground",
                          }}
                        >
                          <div>ID: {data.id_employee}</div>
                          <div>Прізвище: {data.empl_surname}</div>
                          <div>Ім'я: {data.empl_name}</div>
                          <div>Номер телефону: {data.phone_number}</div>
                          <div>
                            Адреса: вул. {data.street}, м. {data.city}{" "}
                            {data.zip_code}
                          </div>
                        </div>
                        <br />
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div style={{ width: "1px", backgroundColor: "grey" }} />

            <div className="column-container" style={{ flexGrow: 1 }}>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <FormControlLabel
                  control={<Checkbox />}
                  label="Лише касир/ки"
                  onChange={handleOnChangeOnlyCashiers}
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Лише працівники, що обслуговували усіх клієнтів"
                  onChange={handleOnServeOnlyAllClients}
                />
                <div style={{ marginLeft: "10%" }}>
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

                  <PrintReportButton
                    service={workersService}
                    tableType={TableType.Workers}
                  />
                </div>
              </div>
              <div>
                <TableObject
                  columnNames={workersColumnNames}
                  service={workersService}
                  updater={updater}
                  getFunction={currentGet}
                  setEditing={setEditing}
                  saveNewRow={setNewRow}
                  tableType={TableType.Workers}
                />

                <EditOrCreateWindow
                  columnNames={getWithoutId(workersColumnNames)}
                  saveNewRow={setNewRow}
                  selectedRow={newRow}
                  tableType={TableType.Workers}
                  onCancel={() => setEditing(false)}
                />
              </div>
            </div>
          </div>
        )}
        {showError && <AlertComponent errorMessage={errorMessage} />}
      </div>
    </div>
  );

  const cashierPage = (
    <div>
      <div className="button-panel">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginRight: "3rem",
          }}
        >
          <ButtonPanel
            buttonNames={buttonNamesCashier}
            onClickFunctions={onClickFunctionsCashier}
            defaultValue={0}
          />
          {logOutAndChangePasswordButtons}
        </div>
      </div>
      <div className="full-page">
        {whatTableIsVisible === Table.ChangePassword && (
          <div>{changePasswordPage} </div>
        )}
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
                    {idEmployee && <BasicCheckInfo cashierID={idEmployee} />}

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
                defaultValue={{
                  label: StoreProductsService.UPC,
                  value: StoreProductsService.UPC,
                }}
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
                  <div style={{ width: "50%" }}>
                    <TovarCard />
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
                  <div style={{ display: "flex", width: "1000px" }}>
                    <div style={{ width: "250px" }}>
                      <DateRangeInput
                        dateRange={checksDateRangeCashier}
                        setDateRange={setChecksDateRangeCashier}
                      />
                    </div>
                    <div style={{ width: "200px", marginLeft: "500px" }}>
                      <TextField
                        label={"Мінімальна ціна"}
                        onChange={handleOnChangeForMinCost}
                      />
                    </div>
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
                  {selectedCheckNumber && (
                    <CheckInfo
                      checkNumber={selectedCheckNumber}
                      checkColumnNames={checkColumnNames}
                    />
                  )}
                </>
              )}
            </div>
          </>
        )}

        {whatTableIsVisible === Table.Profile && (
          <div style={{ width: "50%" }}>
            {idEmployee && <Profile id_employee={idEmployee} />}
          </div>
        )}
      </div>
    </div>
  );

  //#endregion

  return (
    <div>
      {!isLoggedIn && <LoginForm handleLogIn={handleLogIn} />}
      {isLoggedIn && <div>{isCashier ? cashierPage : managerPage}</div>}
    </div>
  );
}

export default App;
