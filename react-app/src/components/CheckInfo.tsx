import { useEffect, useState } from "react";
import { Check } from "../services/ChecksService";
import BasicCheckInfo from "./BasicCheckInfo";
import "./CheckInfo.css";
import TableObject from "./TableObject";
import SalesService from "../services/SalesService";
import TableRow from "../classes/TableRow";

interface Props {
  check: Check;
  checkColumnNames: string[];
}

const CheckInfo = ({ check, checkColumnNames }: Props) => {
  const [checkRows, setCheckRows] = useState<TableRow[]>();

  useEffect(() => {
    const fetchCheckRows = async () => {
      console.log(check.check_number);
      const salesService = new SalesService(check.check_number);
      const result = await salesService.getRows();
      setCheckRows(result);
    };

    fetchCheckRows();
  }, [check]);

  return (
    <>
      <div className="check-info">
        <h3>Чек №{check.check_number}</h3>
        <div style={{ display: "flex", gap: "50px", marginBottom: "15px" }}>
          <div>
            <BasicCheckInfo
              cashierID={check.id_employee}
              date={check.print_date}
            />
            {check.card_number && (
              <label>Картка клієнт/ки: {check.card_number}</label>
            )}
          </div>

          <div>
            <label>Загальна сума: {check.sum_total}</label>
            <br />
            <label>ПДВ: {check.vat}</label>
          </div>
        </div>
        <TableObject
          columnNames={checkColumnNames}
          rows={checkRows}
          withButtons={false}
        />
      </div>
    </>
  );
};

export default CheckInfo;
