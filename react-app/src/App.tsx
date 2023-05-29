import ButtonGroup from "./components/ButtonGroup";
import TableObject from "./components/TableObject";
import TableRow from "./classes/TableRow";
import Profile from "./components/Profile";
import { useState, ChangeEvent, useEffect } from "react";
import DateInput from "./components/DateInput";
import TovarCard from "./components/TovarCard";
import AutocompleteTextField from "./components/AutocompleteTextField";
import { Checkbox, FormControlLabel, SelectChangeEvent } from "@mui/material";
import PrintReportButton from "./components/PrintReportButton";
import AddProductForm from "./components/AddProductForm";
import type { Option } from "./components/AutocompleteTextField";
import AlertComponent from "./components/AlertComponent";
import TextField from "@mui/material/TextField";
import LoginForm from "./components/LoginForm";
import EditOrCreateWindow from "./components/EditOrCreateWindow";
import { Upc } from "react-bootstrap-icons";
import CategoriesService from "./services/CategoriesService";
import ClientsService from "./services/ClientsService";
import WorkersService from "./services/WorkersService";
import ButtonGrid from "./components/ButtonGrid";
import "./App.css";
import ProductsService from "./services/ProductsService";
import ChecksService from "./services/ChecksService";
import StoreProductsService from "./services/StoreProductsService";
import ProfileService from "./services/ProfileService";

function App() {
  // TODO зробити друкування (типу щоб кнопка надрукувати звіт працювала)
  // TODO спробувати зробити, щоб кнопка надрукувати звіт була в одному місці
  // TODO заповнити таблиці даними
  // TODO зробити щоб кнопка додавання й редагування приймала аргументи
  // TODO розібратися з таблицею Товари

  //#region Services
  const categoriesService = new CategoriesService();
  const clientsService = new ClientsService();
  const workersService = new WorkersService();
  const productsService = new ProductsService();
  const checksService = new ChecksService();
  const storeProductsService = new StoreProductsService();
  const [currentService, setCurrentService] = useState(categoriesService);

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
      setCurrentService(checksService);
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

  // TODO можливо ініціали теж не варто розділяти на окремі колонки, типу навіщо це (і адресу)
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
  const [whatTableIsVisible, setTableVisible] = useState(-1);

  const [isPromotional, setIsPromotional] = useState("");

  const [sortingStoreProducts, setSortingStoreProducts] = useState("");

  const [selectedUPC, setSelectedUPC] = useState<string>("");

  const [selectedSurname, setSelectedSurname] = useState("");

  const [selectedPercent, setSelectedPercent] = useState("");

  const [soldProductsAmount, setSoldProductsAmount] = useState(300);

  const [category, setCategory] = useState<string>("");

  const [tovarName, setTovarName] = useState<string>("");

  const [surname, setSurname] = useState<string>("");

  const [onlyCashiers, setOnlyCashiers] = useState(false);

  const [showAddCheckForm, setShowAddCheckForm] = useState(false);

  const [checkRows, setCheckRows] = useState<TableRow[]>([]);

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

  //#endregion

  //#region HandleOnChange functions
  const handleOnChangeIsPromotional = (value: string) => {
    setIsPromotional(value);
  };

  const handleOnChangeSortingStoreProducts = (value: string) => {
    setSortingStoreProducts(value);
  };

  const handleOnChangeCategory = (value: string) => {
    setCategory(value);
  };

  const handleOnChangeProductName = (value: string) => {
    setTovarName(value);
  };

  const handleOnChangeUPC = (value: string) => {
    setSelectedUPC(value);
  };

  const handleOnChangeSurname = (value: string) => {
    setSelectedSurname(value);
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

  //#region Variables that will be from the database but now are hard coded

  const [categoriesRows, setCategoriesRows] = useState([
    new TableRow(1, ["0", "Напівфабрикати"]),
    new TableRow(1, ["2", "Крупи"]),
    new TableRow(1, ["1", "Напої"]),
  ]);

  let categories = [];
  for (let i = 0; i < categoriesRows.length; i++) {
    categories.push({
      value: categoriesRows[i].values[1],
      label: categoriesRows[i].values[1],
    });
  }

  const [productNamesRows, setProductNamesRows] = useState([
    new TableRow(1, ["0", "Гречка"]),
    new TableRow(1, ["2", "Живчик"]),
    new TableRow(1, ["1", "Вода"]),
  ]);

  let productNames = [];
  for (let i = 0; i < productNamesRows.length; i++) {
    productNames.push({
      value: productNamesRows[i].values[1],
      label: categoriesRows[i].values[1],
    });
  }

  const upcFromDb = [123, 1230, 3423, 5343];
  const UPCs: Option[] = [];
  for (let i = 0; i < upcFromDb.length; i++) {
    UPCs.push({
      value: upcFromDb[i].toString(),
      label: upcFromDb[i].toString(),
    });
  }

  const clientsPercents = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "25", label: "25" },
  ];

  //#endregion

  //#region Functions
  const addCheckRow = (newRow: TableRow) => {
    if (checkRows.length === 0) {
      setCheckRows([newRow]);
    } else {
      setCheckRows([...checkRows, newRow]);
    }
  };

  const saveCheck = () => {
    console.log("Check is saved");
    setShowAddCheckForm(false);
  };

  const handleAddRow = async () => {};

  //#endregion

  //#region Parts of return that should be separate components maybe (maybe not)
  const searchFields = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
        height: "80px",
        gap: "30px",
      }}
    >
      <AutocompleteTextField
        label="Категорія"
        options={categories}
        onChange={handleOnChangeCategory}
        style={{ width: "150px" }}
      />
      <AutocompleteTextField
        label="Чи акційний товар"
        options={isPromotionalOptions}
        onChange={handleOnChangeIsPromotional}
        style={{ width: "200px" }}
      />
      {/* <TextField
        className="text-field"
        label="Пошук за назвою"
        onChange={handleOnChangeProductName}
        variant="outlined"
        value={tovarName}
        sx={{ m: 1, width: 180 }}
      /> */}

      <button
        type="button"
        className={"btn btn-primary"}
        onClick={() =>
          console.log(
            "Searching " + category + " category and name " + tovarName
          )
        }
        // style={{ marginRight: "50px" }}
      >
        Search
      </button>
      <div style={{ marginLeft: "100px" }}>
        <PrintReportButton />
      </div>
    </div>
  );

  // const cashierPage = (
  //   <div>
  //     <ButtonGroup
  //       buttonNames={buttonNamesCashier}
  //       onClickFunctions={onClickFunctionsCashier}
  //     />
  //     <div style={{ marginLeft: "15px", marginTop: "15px" }}>
  //       {whatTableIsVisible === Table.Clients && (
  //         <>
  //           <TextField
  //             label="Прізвище"
  //             value={tovarName}
  //             onChange={handleOnChangeName}
  //           ></TextField>
  //           <br />
  //           <TableObject
  //             columnNames={clientsColumnNames}
  //             service={clientsService}
  //           />
  //         </>
  //       )}
  //       {whatTableIsVisible === Table.Products && (
  //         <>
  //           <div
  //             style={{
  //               display: "flex",
  //               justifyContent: "start",
  //               gap: "15px",
  //             }}
  //           >
  //             <div style={{ width: "15%" }}>
  //               <AutocompleteTextField
  //                 options={UPCs}
  //                 onChange={handleOnChangeUPC}
  //                 label="UPC"
  //               />
  //             </div>

  //             <div
  //               style={{
  //                 height: "100vh",
  //                 overflow: "hidden",
  //                 display: "inline-block",
  //                 width: "50%",
  //                 borderLeft: "1px solid grey",
  //                 paddingLeft: "15px",
  //               }}
  //             >
  //               {searchFields}
  //               <div
  //                 style={{
  //                   width: "80%",
  //                 }}
  //               >
  //                 {selectedUPC !== "" && (
  //                   <TovarCard
  //                     tovarName="Крупа гречана 'Геркулес' 500г"
  //                     price="50.00"
  //                     amount="40"
  //                     unitOfMeasurement="шт."
  //                   />
  //                 )}

  //                 {selectedUPC === "" && (
  //                   <TableObject
  //                     columnNames={productsColumnNames}
  //                     rows={tovaryRows}
  //                   />
  //                 )}
  //               </div>
  //             </div>
  //           </div>
  //         </>
  //       )}
  //       {whatTableIsVisible === Table.Checks && (
  //         <>
  //           <DateInput
  //             dateRange={checksDateRangeCashier}
  //             setDateRange={setChecksDateRangeCashier}
  //           />
  //           <TableObject columnNames={checksColumnNames} rows={checksRows} />
  //         </>
  //       )}
  //       {whatTableIsVisible === Table.Profile && (
  //         <div style={{ width: "50%" }}>
  //           <Profile
  //             name="John"
  //             surname="Doe"
  //             patronymic="Smith"
  //             employeeRole="Software Engineer"
  //             salary="$120,000"
  //             dateOfBirth="January 1, 1980"
  //             dateOfWorkStart="June 1, 2015"
  //             phoneNumber="(123) 456-7890"
  //             city="San Francisco"
  //             street="123 Main St"
  //             zipCode="12345"
  //           />
  //         </div>
  //       )}
  //       {whatTableIsVisible === -1 && (
  //         <button
  //           className={"btn"}
  //           style={{
  //             width: "100%",
  //             height: "100vh",
  //             backgroundColor: "#4CAF50",
  //             fontSize: 40,
  //           }}
  //         >
  //           Створити чек
  //         </button>
  //       )}
  //     </div>
  //   </div>
  // );

  const managerPage = (
    <div>
      <div
        style={{
          backgroundColor: "#ffee99",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 999,
          width: "100%",
        }}
      >
        <ButtonGroup
          buttonNames={buttonNamesManager}
          onClickFunctions={onClickFunctionsManager}
          defaultValue={0}
        />
      </div>
      <div className="page">
        {whatTableIsVisible === Table.Main && (
          <div>
            {!showAddCheckForm && (
              <ButtonGrid
                buttonLabels={buttonNamesManager.slice(1)}
                addCheckButtonLabel={createCheckLabel}
                onClickFunctions={onClickFunctionsManager.slice(1)}
                onClickAddCheckButton={() => setShowAddCheckForm(true)}
              />
            )}
            {showAddCheckForm && (
              <div>
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <div>
                    <label>Каса: 1</label>
                    <br />
                    <label>Дата: 12.05.2023</label>
                    <br />
                    <label>Час: 13:46</label>
                  </div>

                  <div style={{ width: "200px", marginLeft: "150px" }}>
                    <AutocompleteTextField
                      options={UPCs}
                      onChange={handleOnChangeUPC}
                      label="Картка клієнтки"
                    />
                  </div>

                  <button
                    style={{ marginLeft: "480px", height: "40px" }}
                    className="btn btn-secondary"
                    onClick={saveCheck}
                  >
                    Зберегти чек
                  </button>

                  <button
                    style={{ marginLeft: "20px", height: "40px" }}
                    className="btn btn-secondary"
                    // onClick = saveCheck + printCheck
                  >
                    Роздрукувати чек
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "25px",
                    marginTop: "20px",
                  }}
                >
                  <AddProductForm
                    options={UPCs}
                    onAdd={function (upc: string, amount: number): void {
                      addCheckRow(
                        new TableRow(1, [
                          upc,
                          "Персик",
                          amount.toString(),
                          "2",
                          "40",
                        ])
                      );
                    }}
                  />

                  <div style={{ width: "50%" }}>
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
          <div
            style={{
              display: "flex",
              gap: "15px",
            }}
          >
            <div style={{ width: "15%" }}>
              <AutocompleteTextField
                options={UPCs}
                onChange={handleOnChangeUPC}
                label="UPC"
              />
            </div>

            <div
              style={{
                height: "100vh",
                overflow: "hidden",
                display: "inline-block",
                width: "50%",
                borderLeft: "1px solid grey",
                paddingLeft: "15px",
                flexGrow: 1,
              }}
            >
              {searchFields}

              <button
                style={{ marginRight: "15px" }}
                type="button"
                className="btn btn-secondary"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasScrolling"
                aria-controls="offcanvasScrolling"
              >
                Додати товар
              </button>
              <div
                style={{
                  width: "80%",
                }}
              >
                {selectedUPC !== "" && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "start",
                      gap: "15px",
                      width: "100vh",
                    }}
                  >
                    <TovarCard
                      tovarName="Крупа гречана 'Геркулес' 500г"
                      price="50.00"
                      amount="40"
                      unitOfMeasurement="шт."
                    />
                    <div
                      style={{
                        width: "700px",
                        marginTop: "10px",
                        marginLeft: "40px",
                      }}
                    >
                      <label style={{ marginBottom: "10px" }}>
                        Кількість проданих одиниць товару: {soldProductsAmount}
                      </label>

                      <DateInput
                        dateRange={tovarDateRange}
                        setDateRange={setTovarDateRange}
                      />
                    </div>
                  </div>
                )}

                {selectedUPC === "" && (
                  <TableObject
                    columnNames={productsColumnNames}
                    service={productsService}
                    updater={updater}
                  />
                )}

                <EditOrCreateWindow
                  columnNames={productsColumnNames}
                  saveNewRow={setNewRow}
                  onSave={handleAddRow}
                />
              </div>
            </div>
          </div>
        )}
        {whatTableIsVisible === Table.StoreProducts && (
          <div
            style={{
              display: "flex",
              gap: "15px",
            }}
          >
            <div style={{ width: "15%" }}>
              <AutocompleteTextField
                options={UPCs}
                onChange={handleOnChangeUPC}
                label="UPC"
              />
            </div>

            <div
              style={{
                height: "100vh",
                overflow: "hidden",
                display: "inline-block",
                width: "50%",
                borderLeft: "1px solid grey",
                paddingLeft: "15px",
                flexGrow: 1,
              }}
            >
              {searchFields}

              <button
                style={{ marginRight: "15px" }}
                type="button"
                className="btn btn-secondary"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasScrolling"
                aria-controls="offcanvasScrolling"
              >
                Додати товар у магазині
              </button>
              <div
                style={{
                  width: "80%",
                }}
              >
                {selectedUPC !== "" && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "start",
                      gap: "15px",
                      width: "100vh",
                    }}
                  >
                    <TovarCard
                      tovarName="Крупа гречана 'Геркулес' 500г"
                      price="50.00"
                      amount="40"
                      unitOfMeasurement="шт."
                    />
                    <div
                      style={{
                        width: "700px",
                        marginTop: "10px",
                        marginLeft: "40px",
                      }}
                    >
                      <label style={{ marginBottom: "10px" }}>
                        Кількість проданих одиниць товару: {soldProductsAmount}
                      </label>

                      <DateInput
                        dateRange={tovarDateRange}
                        setDateRange={setTovarDateRange}
                      />
                    </div>
                  </div>
                )}

                {selectedUPC === "" && (
                  <TableObject
                    columnNames={storeProductsColumnNames}
                    service={storeProductsService}
                    updater={updater}
                  />
                )}

                <EditOrCreateWindow
                  columnNames={storeProductsColumnNames}
                  saveNewRow={setNewRow}
                  onSave={handleAddRow}
                />
              </div>
            </div>
          </div>
        )}
        {whatTableIsVisible === Table.Categories && (
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              gap: "15px",
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
                position: "relative",
                left: "42%",
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
              <PrintReportButton />
              <EditOrCreateWindow
                columnNames={categoriesColumnNames}
                saveNewRow={setNewRow}
                onSave={handleAddRow}
              />
            </div>
          </div>
        )}
        {whatTableIsVisible === Table.Clients && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "15%" }}>
                <AutocompleteTextField
                  options={clientsPercents}
                  onChange={handleOnChangePercent}
                  label="Відсоток знижки"
                />
              </div>
              <div style={{ marginRight: "25px" }}>
                <PrintReportButton />
              </div>
            </div>
            <br />
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

            <TableObject
              columnNames={clientsColumnNames}
              service={clientsService}
              updater={updater}
            />
            <EditOrCreateWindow
              columnNames={clientsColumnNames}
              saveNewRow={setNewRow}
              onSave={handleAddRow}
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
                style={{ marginRight: "15px" }}
                type="button"
                className="btn btn-secondary"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasScrolling"
                aria-controls="offcanvasScrolling"
              >
                Додати чек
              </button>

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

            <EditOrCreateWindow
              columnNames={checksColumnNames}
              saveNewRow={setNewRow}
              onSave={handleAddRow}
            />
          </>
        )}
        {whatTableIsVisible === Table.Workers && (
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              gap: "15px",
            }}
          >
            <div style={{ width: "15%" }}>
              <AutocompleteTextField
                options={UPCs}
                onChange={handleOnChangeSurname}
                label="Прізвище"
              />
            </div>

            <div
              style={{
                height: "100vh",
                overflow: "hidden",
                display: "inline-block",
                borderLeft: "1px solid grey",
                paddingLeft: "15px",
                width: "80%",
              }}
            >
              {selectedSurname === "" && (
                <>
                  <div
                    style={{
                      height: "40px",
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
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
                  <TableObject
                    columnNames={workersColumnNames}
                    service={workersService}
                    updater={updater}
                  />
                  <EditOrCreateWindow
                    columnNames={workersColumnNames}
                    saveNewRow={setNewRow}
                    onSave={handleAddRow}
                  />
                </>
              )}

              {selectedSurname !== "" && (
                <div style={{ width: "50%" }}>
                  <Profile />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
  //#endregion

  return (
    // Cashier page
    <div>
      <div
        style={{
          backgroundColor: "#ffee99",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 999,
          width: "100%",
        }}
      >
        <ButtonGroup
          buttonNames={buttonNamesCashier}
          onClickFunctions={onClickFunctionsCashier}
          defaultValue={0}
        />
      </div>
      <div className="page">
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
              <div>
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <div>
                    <label>Каса: 1</label>
                    <br />
                    <label>Дата: 12.05.2023</label>
                    <br />
                    <label>Час: 13:46</label>
                  </div>

                  <div style={{ width: "200px", marginLeft: "150px" }}>
                    <AutocompleteTextField
                      options={UPCs}
                      onChange={handleOnChangeUPC}
                      label="Картка клієнтки"
                    />
                  </div>

                  <button
                    style={{ marginLeft: "480px", height: "40px" }}
                    className="btn btn-secondary"
                    onClick={saveCheck}
                  >
                    Зберегти чек
                  </button>

                  <button
                    style={{ marginLeft: "20px", height: "40px" }}
                    className="btn btn-secondary"
                    // onClick = saveCheck + printCheck
                  >
                    Роздрукувати чек
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "25px",
                    marginTop: "20px",
                  }}
                >
                  <AddProductForm
                    options={UPCs}
                    onAdd={function (upc: string, amount: number): void {
                      addCheckRow(
                        new TableRow(1, [
                          upc,
                          "Персик",
                          amount.toString(),
                          "2",
                          "40",
                        ])
                      );
                    }}
                  />

                  <div style={{ width: "50%" }}>
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
          <div style={{ display: "flex", paddingTop: "10px" }}>
            <div style={{ flexGrow: 1 }}>
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
                />
              </div>
            </div>
          </div>
        )}
        {whatTableIsVisible === Table.StoreProducts && (
          <div
            style={{
              display: "flex",
              gap: "15px",
            }}
          >
            <div style={{ width: "15%" }}>
              <AutocompleteTextField
                options={UPCs}
                onChange={handleOnChangeUPC}
                label="UPC"
              />
            </div>

            <div
              style={{
                height: "100vh",
                overflow: "hidden",
                display: "inline-block",
                width: "50%",
                borderLeft: "1px solid grey",
                paddingLeft: "15px",
                flexGrow: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  height: "80px",
                  gap: "30px",
                }}
              >
                <AutocompleteTextField
                  label="Чи акційний товар"
                  options={isPromotionalOptions}
                  onChange={handleOnChangeIsPromotional}
                  style={{ width: "200px" }}
                />
                <AutocompleteTextField
                  label="Сортування"
                  options={sortingStoreProductsOptions}
                  onChange={handleOnChangeSortingStoreProducts}
                  style={{ width: "250px" }}
                />
              </div>

              <div
                style={{
                  width: "80%",
                }}
              >
                {selectedUPC !== "" && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "start",
                      gap: "15px",
                      width: "100vh",
                    }}
                  >
                    <TovarCard
                      tovarName="Крупа гречана 'Геркулес' 500г"
                      price="50.00"
                      amount="40"
                      unitOfMeasurement="шт."
                    />
                    <div
                      style={{
                        width: "700px",
                        marginTop: "10px",
                        marginLeft: "40px",
                      }}
                    >
                      <label style={{ marginBottom: "10px" }}>
                        Кількість проданих одиниць товару: {soldProductsAmount}
                      </label>

                      <DateInput
                        dateRange={tovarDateRange}
                        setDateRange={setTovarDateRange}
                      />
                    </div>
                  </div>
                )}

                {selectedUPC === "" && (
                  <TableObject
                    columnNames={storeProductsColumnNames}
                    service={storeProductsService}
                    updater={updater}
                  />
                )}
              </div>
            </div>
          </div>
        )}
        {whatTableIsVisible === Table.Categories && (
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              gap: "15px",
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
                position: "relative",
                left: "42%",
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
              <PrintReportButton />
              <EditOrCreateWindow
                columnNames={categoriesColumnNames}
                saveNewRow={setNewRow}
                onSave={handleAddRow}
              />
            </div>
          </div>
        )}
        {whatTableIsVisible === Table.Clients && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "15%" }}>
                <AutocompleteTextField
                  options={clientsPercents}
                  onChange={handleOnChangePercent}
                  label="Відсоток знижки"
                />
              </div>
              <div style={{ marginRight: "25px" }}>
                <PrintReportButton />
              </div>
            </div>
            <br />
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

            <TableObject
              columnNames={clientsColumnNames}
              service={clientsService}
              updater={updater}
            />
            <EditOrCreateWindow
              columnNames={clientsColumnNames}
              saveNewRow={setNewRow}
              onSave={handleAddRow}
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
                style={{ marginRight: "15px" }}
                type="button"
                className="btn btn-secondary"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasScrolling"
                aria-controls="offcanvasScrolling"
              >
                Додати чек
              </button>

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

            <EditOrCreateWindow
              columnNames={checksColumnNames}
              saveNewRow={setNewRow}
              onSave={handleAddRow}
            />
          </>
        )}
        {whatTableIsVisible === Table.Profile && (
          <div style={{ width: "50%" }}>
            <Profile />
          </div>
        )}
      </div>
      {/* <div style={{ display: "flex", paddingTop: "10px" }}>
        <div style={{ flexGrow: 1 }}>
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
            />
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default App;

// name="John"
//               surname="Doe"
//               patronymic="Smith"
//               employeeRole="Software Engineer"
//               salary="$120,000"
//               dateOfBirth="January 1, 1980"
//               dateOfWorkStart="June 1, 2015"
//               phoneNumber="(123) 456-7890"
//               city="San Francisco"
//               street="123 Main St"
//               zipCode="12345"
