import React from "react";
import TableRow from "../classes/TableRow";
import { tableRowToWorker, Worker } from "../services/WorkersService";
import { Client, tableRowToClient } from "../services/ClientsService";

interface Props {
  buttonStyle?: React.CSSProperties;
}

const PrintReportButton = ({ buttonStyle = {} }: Props) => {
  const handlePrint = () => {
    const workers = [
      new TableRow(1, [
        "1",
        "Jack",
        "Smith",
        "",
        "Cashier",
        "10000",
        "10.07.1997",
        "10.07.1997",
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
        "10.07.1997",
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
        "10.07.1997",
        "+12984927",
        "London",
        "Main str",
        "86752",
      ]),
    ];

    const clients = [
      new TableRow(1, [
        "1535326",
        "Jack",
        "Smith",
        "",
        "+380957642809",
        "London",
        "Main str",
        "86752",
        "10",
      ]),
      new TableRow(1, [
        "1535326",
        "Dariia",
        "Smith",
        "",
        "+380957642809",
        "London",
        "Main str",
        "12345",
        "40",
      ]),
      new TableRow(1, [
        "1535326",
        "Andrew",
        "Smith",
        "",
        "+380957642809",
        "London",
        "Main str",
        "86752",
        "25",
      ]),
    ];

    let workerss: Worker[] = [];
    for (let i = 0; i < workers.length; i++) {
      workerss.push(tableRowToWorker(workers[i]));
    }

    let clientss: Client[] = [];
    for (let i = 0; i < clients.length; i++) {
      clientss.push(tableRowToClient(clients[i]));
    }

    const categoriesRows = [
      new TableRow(1, ["0", "Напівфабрикати"]),
      new TableRow(1, ["2", "Крупи"]),
      new TableRow(1, ["1", "Напої"]),
    ];

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
      ${clientss
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
      ${workerss
        .map(
          (worker) => `
        <p>ID: ${worker.id_employee}</p>
        <p>П.І.Б.: ${worker.empl_surname} ${worker.empl_name} ${
            worker.empl_patronymic
          }</p>
        <p>Посада: ${worker.empl_role}</p>
        <p>Зарплата: ${worker.salary} грн.</p>
        <p>Дата народження: ${worker.date_of_birth.toLocaleDateString("uk-UA", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}</p>
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
          <th>Category</th>
        </tr>
        ${categoriesRows
          .map(
            (row) => `
          <tr>
            <td>${row.id}</td>
            <td>${row.values[1]}</td>
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

    printReport(workersReport);
  };

  const generateReport = () => {};

  const printReport = (report: string) => {
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
