import React from "react";
import TableRow from "../classes/TableRow";
import WorkersService, {
  tableRowToWorker,
  Worker,
} from "../services/WorkersService";
import { Client, tableRowToClient } from "../services/ClientsService";
import Service from "../services/Service";
import { Category, tableRowToCategory } from "../services/CategoriesService";
import ProductsService, {
  Product,
  tableRowToProduct,
} from "../services/ProductsService";
import { convertStringToDate, formatDate } from "../utils/Utils";
import ChecksService from "../services/ChecksService";

interface Props {
  service?: Service;
  tableType?: TableType;
  buttonStyle?: React.CSSProperties;
}

export enum TableType {
  Categories = 0,
  Products,
  StoreProducts,
  Workers,
  Clients,
  Checks,
}

export const printReport = (report: string) => {
  const printWindow = window.open("", "_blank", "width=800,height=600");

  if (printWindow) {
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Report</title>
      </head>
      <body>
        ${report}
        <script>
          // Automatically trigger print dialog when the window finishes loading
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
  }
};

const PrintReportButton = ({ service, tableType, buttonStyle = {} }: Props) => {
  const handlePrint = async () => {
    let report = await generateReport();
    printReport(report);
  };

  const generateReport = async () => {
    const rows = await service?.getRows().catch((error) => {
      console.log(error);
    });
    console.log(rows);
    if (!rows) return "";

    switch (tableType) {
      case TableType.Categories: {
        let categories: Category[] = [];
        for (let i = 0; i < rows.length; i++) {
          categories.push(tableRowToCategory(rows[i]));
        }

        const categoriesReport = `<!DOCTYPE html>
        <html>
          <head>
            <title>Categories Report</title>
            <style>
              h1 {
                text-align: center;
              }
              table {
                border-collapse: collapse;
                width: 100%;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
              }
            </style>
          </head>
          <body>
            <h1>Супермаркет “ZLAGODA”</h1>
            <h2>Категорії</h2>
            <table>
              <tr>
                <th>ID</th>
                <th>Категорія</th>
              </tr>
              ${categories
                .map(
                  (row) => `
                <tr>
                  <td>${row.category_number}</td>
                  <td>${row.category_name}</td>
                </tr>
              `
                )
                .join("")}
            </table>
            <p>Дата: <span id="date"></span></p>
          
            <script>
              const dateElement = document.getElementById("date");
              const today = new Date();
              const options = { year: 'numeric', month: 'long', day: 'numeric' };
              dateElement.textContent = today.toLocaleDateString(undefined, options);
            </script>
          </body>
        </html>`;

        return categoriesReport;
      }
      case TableType.Products: {
        const productsService = new ProductsService();
        const products = await productsService.getProducts();

        const productsReport = `<!DOCTYPE html>
        <html>
          <head>
            <title>Products Report</title>
            <style>
              h1 {
                text-align: center;
              }
              table {
                border-collapse: collapse;
                width: 100%;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
              }
            </style>
          </head>
          <body>
            <h1>Супермаркет “ZLAGODA”</h1>
            <h2>Товари</h2>
            <table>
              <tr>
                <th>ID</th>
                <th>Категорія</th>
                <th>Назва товару</th>
                <th>Характеристики</th>
              </tr>
              ${products
                .map(
                  (row) => `
                <tr>
                  <td>${row.id_product}</td>
                  <td>${row.category_name}</td>
                  <td>${row.product_name}</td>
                  <td>${row.characteristics}</td>
                </tr>
              `
                )
                .join("")}
            </table>
            <p>Дата: <span id="date"></span></p>
          
            <script>
              const dateElement = document.getElementById("date");
              const today = new Date();
              const options = { year: 'numeric', month: 'long', day: 'numeric' };
              dateElement.textContent = today.toLocaleDateString(undefined, options);
            </script>
          </body>
        </html>`;

        return productsReport;
      }
      case TableType.StoreProducts: {
        const storeProductsReport = `<!DOCTYPE html>
        <html>
          <head>
            <title>Products Report</title>
            <style>
              h1 {
                text-align: center;
              }
              table {
                border-collapse: collapse;
                width: 100%;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
              }
            </style>
          </head>
          <body>
            <h1>Супермаркет “ZLAGODA”</h1>
            <h2>Товари</h2>
            <table>
              <tr>
                <th>UPC</th>
                <th>Акційне UPC</th>
                <th>Назва товару</th>
                <th>Ціна</th>
                <th>Кількість</th>
                <th>Акційний</th>
              </tr>
              ${rows
                .map(
                  (row) => `
                <tr>
                  <td>${row.values[0]}</td>
                  <td>${row.values[1] !== null ? row.values[1] : ""}</td>
                  <td>${row.values[2]}</td>
                  <td>${row.values[3]}</td>
                  <td>${row.values[4]}</td>
                  <td>${row.values[5]}</td>
                </tr>
              `
                )
                .join("")}
            </table>
            <p>Дата: <span id="date"></span></p>
          
            <script>
              const dateElement = document.getElementById("date");
              const today = new Date();
              const options = { year: 'numeric', month: 'long', day: 'numeric' };
              dateElement.textContent = today.toLocaleDateString(undefined, options);
            </script>
          </body>
        </html>`;

        return storeProductsReport;
      }
      case TableType.Checks: {
        const checksService = new ChecksService(false);
        const rows = await checksService.getAllRows().catch((error) => {
          console.log(error);
        });
        if (!rows) return "";

        const storeProductsReport = `<!DOCTYPE html>
        <html>
          <head>
            <title>Products Report</title>
            <style>
              h1 {
                text-align: center;
              }
              table {
                border-collapse: collapse;
                width: 100%;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
              }
            </style>
          </head>
          <body>
            <h1>Супермаркет “ZLAGODA”</h1>
            <h2>Чеки</h2>
            <table>
              <tr>
                <th>Номер чека</th>
                <th>ID працівника/ці</th>
                <th>Номер карти клієнт/ки</th>
                <th>Дата</th>
                <th>Сума</th>
                <th>ПДВ</th>
              </tr>
              ${rows
                .map(
                  (row) => `
                <tr>
                  <td>${row.values[0]}</td>
                  <td>${row.values[1]}</td>
                  <td>${row.values[2] !== null ? row.values[2] : ""}</td>
                  <td>${row.values[3]}</td>
                  <td>${row.values[4]}</td>
                  <td>${row.values[5]}</td>
                </tr>
              `
                )
                .join("")}
            </table>
            <p>Дата: <span id="date"></span></p>
          
            <script>
              const dateElement = document.getElementById("date");
              const today = new Date();
              const options = { year: 'numeric', month: 'long', day: 'numeric' };
              dateElement.textContent = today.toLocaleDateString(undefined, options);
            </script>
          </body>
        </html>`;

        return storeProductsReport;
      }
      case TableType.Workers: {
        let workers: Worker[] = [];
        for (let i = 0; i < rows.length; i++) {
          workers.push(tableRowToWorker(rows[i]));
        }

        const workersReport = `<!DOCTYPE html>
    <html>
      <head>
        <title>Workers Report</title>
        <style>
          h1 {
            text-align: center;
          }
          p {
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <h1>Супермаркет “ZLAGODA”</h1>
        <h2>Звіт про працівників</h2>
        ${workers
          .map(
            (worker) => `
          <p>ID: ${worker.id_employee}</p>
          <p>П.І.Б.: ${worker.empl_surname} ${worker.empl_name} ${
              worker.empl_patronymic
            }</p>
          <p>Посада: ${worker.empl_role}</p>
          <p>Зарплата: ${worker.salary} грн.</p>
          <p>Дата народження: ${formatDate(worker.date_of_birth)}</p>
          <p>Дата початку роботи: ${worker.date_of_start.toLocaleDateString(
            "uk-UA",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          )}</p>
          <p>Номер телефону: ${worker.phone_number}</p>
          <p>Адреса: вул. ${worker.street}, м. ${worker.city} ${
              worker.zip_code
            }</p>
          <hr>
        `
          )
          .join("")}
      
        <p>Дата: <span id="date"></span></p>
      
        <script>
          const dateElement = document.getElementById("date");
          const today = new Date();
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          dateElement.textContent = today.toLocaleDateString(undefined, options);
        </script>
      </body>
        </html>`;

        return workersReport;
      }
      case TableType.Clients: {
        let clients: Client[] = [];
        for (let i = 0; i < rows.length; i++) {
          clients.push(tableRowToClient(rows[i]));
        }

        const clientsReport = `<!DOCTYPE html>
    <html>
      <head>
        <title>Clients Report</title>
        <style>
          h1 {
            text-align: center;
          }
          p {
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <h1>Супермаркет “ZLAGODA”</h1>
        <h2>Звіт про клієнток</h2>
        ${clients
          .map(
            (client) => `
          <p>Номер картки: ${client.card_number}</p>
          <p>Знижка: ${client.percent}%</p>
          <p>П.І.Б.: ${client.cust_surname} ${client.cust_name} ${client.cust_patronymic}</p>
          <p>Номер телефону: ${client.phone_number}</p>
          <p>Адреса: вул. ${client.street}, м. ${client.city} ${client.zip_code}</p>
          <hr>
        `
          )
          .join("")}
      
        <p>Дата: <span id="date"></span></p>
      
        <script>
          const dateElement = document.getElementById("date");
          const today = new Date();
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          dateElement.textContent = today.toLocaleDateString(undefined, options);
        </script>
      </body>
        </html>`;
        return clientsReport;
      }
    }

    return "";
  };

  return (
    <button
      onClick={handlePrint}
      type="button"
      className="btn btn-secondary"
      style={buttonStyle}
    >
      Надрукувати звіт
    </button>
  );
};

export default PrintReportButton;
