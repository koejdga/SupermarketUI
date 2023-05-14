// import Table from "react-bootstrap/Table";
// import TableRow from "../classes/TableRow";

// interface Props {
//   columnNames: string[];
//   rows: TableRow[];
// }

// function TableObject({ columnNames, rows }: Props) {
//   if (columnNames.length !== rows[0].values.length) return <div>Mistake</div>;

//   return (
//     <Table striped bordered hover>
//       <thead>
//         <tr>
//           {columnNames.map((columnName) => (
//             <th>{columnName}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {rows.map((row) => (
//           <tr>
//             {row.values.map((rowData) => (
//               <td>{rowData}</td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </Table>
//   );
// }

// export default TableObject;

// import { useState } from "react";
// import Table from "react-bootstrap/Table";
// import TableRow from "../classes/TableRow";

// interface Props {
//   columnNames: string[];
//   rows: TableRow[];
// }

// interface RowActionsProps {
//   rowIndex: number;
//   onEdit: (rowIndex: number) => void;
//   onDelete: (rowIndex: number) => void;
// }

// function RowActions({ rowIndex, onEdit, onDelete }: RowActionsProps) {
//   const [showActions, setShowActions] = useState(false);

//   const handleSelect = () => {
//     setShowActions(true);
//   };

//   const handleCancel = () => {
//     setShowActions(false);
//   };

//   const handleEdit = () => {
//     setShowActions(false);
//     onEdit(rowIndex);
//   };

//   const handleDelete = () => {
//     setShowActions(false);
//     onDelete(rowIndex);
//   };

//   return (
//     <td>
//       <button onClick={handleSelect}>Select</button>
//       {showActions && (
//         <div>
//           <button onClick={handleEdit}>Edit</button>
//           <button onClick={handleDelete}>Delete</button>
//           <button onClick={handleCancel}>Cancel</button>
//         </div>
//       )}
//     </td>
//   );
// }

// function TableObject({ columnNames, rows }: Props) {
//   const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

//   const handleEditRow = (rowIndex: number) => {
//     // Perform edit operation on the row with the given index
//     console.log("Edit row:", rowIndex);
//   };

//   const handleDeleteRow = (rowIndex: number) => {
//     // Perform delete operation on the row with the given index
//     console.log("Delete row:", rowIndex);
//   };

//   if (columnNames.length !== rows[0].values.length) return <div>Mistake</div>;

//   return (
//     <Table striped bordered hover>
//       <thead>
//         <tr>
//           <th></th>
//           {columnNames.map((columnName) => (
//             <th>{columnName}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {rows.map((row, rowIndex) => (
//           <tr>
//             <RowActions
//               rowIndex={rowIndex}
//               onEdit={handleEditRow}
//               onDelete={handleDeleteRow}
//             />
//             {row.values.map((rowData) => (
//               <td>{rowData}</td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </Table>
//   );
// }

// export default TableObject;

import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import TableRow from "../classes/TableRow";

interface Props {
  columnNames: string[];
  rows: TableRow[];
}

interface RowActionsProps {
  rowIndex: number;
  onEdit: (rowIndex: number) => void;
  onDelete: (rowIndex: number) => void;
}

function RowActions({ rowIndex, onEdit, onDelete }: RowActionsProps) {
  const [showActions, setShowActions] = useState(false);

  const handleSelect = () => {
    setShowActions(true);
  };

  const handleCancel = () => {
    setShowActions(false);
  };

  const handleEdit = () => {
    setShowActions(false);
    onEdit(rowIndex);
  };

  const handleDelete = () => {
    setShowActions(false);
    onDelete(rowIndex);
  };

  return (
    <td>
      <button onClick={handleSelect}>Select</button>
      {showActions && (
        <div>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
    </td>
  );
}

function TableObject({ columnNames, rows: initialRows }: Props) {
  const [rows, setRows] = useState(initialRows);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

  const handleEditRow = (rowIndex: number) => {
    // Perform edit operation on the row with the given index
    console.log("Edit row:", rowIndex);
  };

  const handleDeleteRow = (rowIndex: number) => {
    // Perform delete operation on the row with the given index
    console.log("Delete row:", rowIndex);
  };

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  if (rows.length > 0 && columnNames.length !== rows[0].values.length)
    return <div>Mistake</div>;

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th></th>
          {columnNames.map((columnName) => (
            <th key={columnName}>{columnName}</th>
          ))}
        </tr>
      </thead>
      {
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <RowActions
                rowIndex={rowIndex}
                onEdit={handleEditRow}
                onDelete={handleDeleteRow}
              />
              {row.values.map((rowData, index) => (
                <td key={`${rowIndex}-${index}`}>{rowData}</td>
              ))}
            </tr>
          ))}
        </tbody>
      }
    </Table>
  );
}

export default TableObject;

{
  /* Render a message if rows is empty */
}
