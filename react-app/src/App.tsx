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
import SelectVariants from "./components/SelectVariants";
import TextField from "@mui/material/TextField";
import LoginForm from "./components/LoginForm";
import axios from "axios";
import EditOrCreateWindow from "./components/EditOrCreateWindow";
import { Upc } from "react-bootstrap-icons";
import CategoriesService from "./services/CategoriesService";

function App() {
  //#region Axios things

  const updateSmthInTestData = (id: string, name: string) => {
    return new Promise<void>((resolve, reject) => {
      const url = "http://26.133.25.6:8080/api/categories/" + id;
      axios
        .put(url, {
          category_name: name,
        })
        .then((responce) => {
          console.log("update data function");
          console.log(responce);
          resolve();
        })
        .catch((error) => {
          console.log(error);
          reject("Update failed");
        });
    });
  };

  const categoriesService = new CategoriesService();

  // const createNewRowInTestData = () => {
  //   const url = "http://26.133.25.6:8080/api/categories";
  //   axios
  //     .post(url, {
  //       category_name: "davyd",
  //     })
  //     .then((responce) => {
  //       console.log("Created new row in test data");
  //       console.log(responce);
  //       getTestData()
  //         .then((result: TableRow[]) => {
  //           console.log(result);
  //           setTestData(result);
  //           console.log("test data");
  //           console.log(result);
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     })
  //     .catch((error) => console.log(error));
  // };

  const createNewRowInTestData = () => {
    const url = "http://26.133.25.6:8080/api/categories";
    axios
      .post(url, {
        category_name: "gggggg",
      })
      .then((response) => {
        console.log("Created new row in test data");
        console.log(response);
        // return getTestData(); // Return the promise from getTestData
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //#endregion

  //#region Constants
  const isPromotionalOptions = ["Всі", "Акційні", "Не акційні"];

  enum Table {
    Main = 0,
    Tovary,
    Categories,
    Clients,
    Checks,
    Workers,
    Profile,
  }

  const buttonNamesCashier = [
    "Головна",
    "Товари",
    "Клієнтки",
    "Чеки",
    "Профіль",
  ];
  const buttonNamesManager = [
    "Головна",
    "Товари",
    "Категорії",
    "Клієнтки",
    "Чеки",
    "Працівники",
    "Профіль",
  ];
  const onClickFunctionsCashier = [
    () => setTableVisible(Table.Main),
    () => setTableVisible(Table.Tovary),
    () => setTableVisible(Table.Clients),
    () => setTableVisible(Table.Checks),
    () => setTableVisible(Table.Profile),
  ];
  const onClickFunctionsManager = [
    () => setTableVisible(Table.Main),
    () => setTableVisible(Table.Tovary),
    () => setTableVisible(Table.Categories),
    () => setTableVisible(Table.Clients),
    () => setTableVisible(Table.Checks),
    () => setTableVisible(Table.Workers),
    () => setTableVisible(Table.Profile),
  ];

  const checkColumnNames = ["UPC", "Назва", "Кількість", "Ціна", "Вартість"];
  //#endregion

  //#region Variables
  const [whatTableIsVisible, setTableVisible] = useState(-1);

  const [isPromotional, setIsPromotional] = useState("");

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

  const [showAddCategory, setShowAddCategory] = useState(false);
  //#endregion

  //#region HandleOnChange functions
  const handleOnChangeIsPromotional = (event: SelectChangeEvent) => {
    setIsPromotional(event.target.value);
  };

  const handleOnChangeCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
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

  const handleOnChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTovarName(event.target.value);
  };

  //#endregion

  //#region Variables that will be from the database but now are hard coded

  let categoriesColumnNames = ["Категорії"];
  const [categoriesRows, setCategoriesRows] = useState([
    new TableRow(1, ["Напівфабрикати"]),
    new TableRow(1, ["Крупи"]),
    new TableRow(1, ["Напої"]),
  ]);

  let categories = [];
  for (let i = 0; i < categoriesRows.length; i++) {
    categories.push(categoriesRows[i].values[0]);
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

  let customersColumnNames = ["Number", "FN", "LN", "UN"];
  let customersRows = [
    new TableRow(1, ["1", "Sonya", "Budilova", "avolidub"]),
    new TableRow(1, ["2", "Dariia", "Khomenko", "dariia"]),
    new TableRow(1, ["3", "Dana", "Isaieva", "dana"]),
  ];

  let tovaryColumnNames = ["Number", "Tovar name", "Price"];
  let tovaryRows = [
    new TableRow(1, ["1", "Cheese", "100"]),
    new TableRow(1, ["2", "Water", "500"]),
    new TableRow(1, ["3", "Cake", "1020"]),
    new TableRow(1, ["4", "Meat", "1300"]),
  ];

  let checksColumnNames = ["Number", "Cashier name", "Client name"];
  let checksRows = [
    new TableRow(1, ["1", "123", "321"]),
    new TableRow(1, ["2", "4563", "6336"]),
    new TableRow(1, ["3", "45643", "32424"]),
    new TableRow(1, ["4", "34525", "3452"]),
  ];

  let workersColumnNames = [
    "ID",
    "Name",
    "Surname",
    "Patronymic",
    "Role",
    "Salary",
    "Date of birth",
    "Date of start",
    "Phone number",
    "City",
    "Street",
    "Zip code",
  ];

  const [workersRows, setWorkerRows] = useState([
    new TableRow(1, [
      "1",
      "Jack",
      "Smith",
      "",
      "Cashier",
      "10000",
      "10.07.1997",
      "30.08.2021",
      "+12984927",
      "London",
      "Main str",
      "86752",
    ]),
    new TableRow(1, [
      "1",
      "Dariia",
      "Smith",
      "",
      "Manager",
      "30000",
      "10.07.1997",
      "30.08.2021",
      "+12984927",
      "London",
      "Main str",
      "12345",
    ]),
    new TableRow(1, [
      "1",
      "Andrew",
      "Smith",
      "",
      "Cashier",
      "20000",
      "10.07.1997",
      "30.08.2021",
      "+12984927",
      "London",
      "Main str",
      "86752",
    ]),
  ]);

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

  const handleAddCategory = (newCategory: TableRow) => {
    if (categoriesRows.length === 0) {
      setCategoriesRows([newCategory]);
    } else {
      setCategoriesRows([...categoriesRows, newCategory]);
    }
  };

  //#endregion

  const [newWorker, setNewWorker] = useState<TableRow>();
  const addNewWorker = (newWorker: TableRow) => {
    setNewWorker(newWorker);
  };

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
      <SelectVariants
        label="Категорія"
        options={categories}
        onChange={handleOnChangeCategory}
        width={150}
      />
      <SelectVariants
        label="Чи акційний товар"
        options={isPromotionalOptions}
        onChange={handleOnChangeIsPromotional}
        width={200}
      />
      <TextField
        className="text-field"
        label="Пошук за назвою"
        onChange={handleOnChangeName}
        variant="outlined"
        value={tovarName}
        sx={{ m: 1, width: 180 }}
      />

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

  const cashierPage = (
    <div>
      <ButtonGroup
        buttonNames={buttonNamesCashier}
        onClickFunctions={onClickFunctionsCashier}
      />
      <div style={{ marginLeft: "15px", marginTop: "15px" }}>
        {whatTableIsVisible === Table.Clients && (
          <>
            <TextField
              label="Прізвище"
              value={tovarName}
              onChange={handleOnChangeName}
            ></TextField>
            <br />
            <TableObject
              columnNames={customersColumnNames}
              rows={customersRows}
            />
          </>
        )}
        {whatTableIsVisible === Table.Tovary && (
          <>
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
                }}
              >
                {searchFields}
                <div
                  style={{
                    width: "80%",
                  }}
                >
                  {selectedUPC !== "" && (
                    <TovarCard
                      tovarName="Крупа гречана 'Геркулес' 500г"
                      price="50.00"
                      amount="40"
                      unitOfMeasurement="шт."
                    />
                  )}

                  {selectedUPC === "" && (
                    <TableObject
                      columnNames={tovaryColumnNames}
                      rows={tovaryRows}
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {whatTableIsVisible === Table.Checks && (
          <>
            <DateInput
              dateRange={checksDateRangeCashier}
              setDateRange={setChecksDateRangeCashier}
            />
            <TableObject columnNames={checksColumnNames} rows={checksRows} />
          </>
        )}
        {whatTableIsVisible === Table.Profile && (
          <Profile
            name="John"
            surname="Doe"
            patronymic="Smith"
            employeeRole="Software Engineer"
            salary="$120,000"
            dateOfBirth="January 1, 1980"
            dateOfWorkStart="June 1, 2015"
            phoneNumber="(123) 456-7890"
            city="San Francisco"
            street="123 Main St"
            zipCode="12345"
          />
        )}
        {whatTableIsVisible === -1 && (
          <button
            className={"btn"}
            style={{
              width: "100%",
              height: "100vh",
              backgroundColor: "#4CAF50",
              fontSize: 40,
            }}
          >
            Створити чек
          </button>
        )}
      </div>
    </div>
  );
  //#endregion

  return (
    // Manager Page
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
        />
      </div>
      <div style={{ marginLeft: "15px", marginTop: "55px", width: "100%" }}>
        {whatTableIsVisible === Table.Main && (
          <div>
            {!showAddCheckForm && (
              <button
                className={"btn"}
                style={{
                  width: "20%",
                  height: "20%",
                  backgroundColor: "#4CAF50",
                  fontSize: 40,
                }}
                onClick={() => setShowAddCheckForm(true)}
              >
                Створити чек
              </button>
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
            <TableObject
              columnNames={["id", "категорія"]}
              service={categoriesService}
            />
            <button onClick={createNewRowInTestData}>
              Додати тестову категорію
            </button>
          </div>
        )}
        {whatTableIsVisible === Table.Tovary && (
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
                    columnNames={tovaryColumnNames}
                    rows={tovaryRows}
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
                rows={categoriesRows}
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
                onClick={() => setShowAddCategory(true)}
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasScrolling"
                aria-controls="offcanvasScrolling"
              >
                Додати категорію
              </button>
              <PrintReportButton />
              <EditOrCreateWindow
                columnNames={categoriesColumnNames}
                onSave={handleAddCategory}
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
                  label="Promotion percent"
                />
              </div>
              <div style={{ marginRight: "25px" }}>
                <PrintReportButton />
              </div>
            </div>
            <br />
            <TableObject
              columnNames={customersColumnNames}
              rows={customersRows}
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
            <TableObject columnNames={checksColumnNames} rows={checksRows} />
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
                      >
                        Додати людину
                      </button>

                      <PrintReportButton />
                    </div>
                  </div>
                  <TableObject
                    columnNames={workersColumnNames}
                    rows={workersRows}
                  />
                </>
              )}

              {selectedSurname !== "" && (
                <div style={{ width: "50%" }}>
                  <Profile
                    name="John"
                    surname="Doe"
                    patronymic="Smith"
                    employeeRole="Software Engineer"
                    salary="$120,000"
                    dateOfBirth="January 1, 1980"
                    dateOfWorkStart="June 1, 2015"
                    phoneNumber="(123) 456-7890"
                    city="San Francisco"
                    street="123 Main St"
                    zipCode="12345"
                  />
                </div>
              )}
            </div>
          </div>
        )}
        {whatTableIsVisible === Table.Profile && (
          <div style={{ width: "50%" }}>
            <Profile
              name="John"
              surname="Doe"
              patronymic="Smith"
              employeeRole="Software Engineer"
              salary="$120,000"
              dateOfBirth="January 1, 1980"
              dateOfWorkStart="June 1, 2015"
              phoneNumber="(123) 456-7890"
              city="San Francisco"
              street="123 Main St"
              zipCode="12345"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
