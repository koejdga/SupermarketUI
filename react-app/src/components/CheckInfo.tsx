import { useEffect, useState } from "react";
import ChecksService, { Check } from "../services/ChecksService";
import BasicCheckInfo from "./BasicCheckInfo";
import "./CheckInfo.css";
import TableObject from "./TableObject";
import SalesService from "../services/SalesService";
import TableRow from "../classes/TableRow";

interface Props {
  checkNumber: string | number;
  checkColumnNames: string[];
}

const CheckInfo = ({ checkNumber, checkColumnNames }: Props) => {
  const [checkRows, setCheckRows] = useState<TableRow[]>();
  const [check, setCheck] = useState<Check>();

  useEffect(() => {
    if (!check) {
      const fetchCheck = async (checkNumber: string | number) => {
        const checksService = new ChecksService(false);
        const response = await checksService.getCheckByNumber(checkNumber);
        console.log(response);
        setCheck(response);
      };

      fetchCheck(checkNumber);
    }
  }, [check]);

  useEffect(() => {
    const fetchCheckRows = async (check: Check) => {
      if (check) {
        console.log(check.check_number);
        const salesService = new SalesService(check.check_number);
        const result = await salesService.getRows();
        setCheckRows(result);
      }
    };

    if (check) fetchCheckRows(check);
  }, [check]);

  return (
    <>
      {check && (
        <div className="check-info">
          <h3>Чек № {check.check_number}</h3>
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
              <label>Загальна сума: {check.sum_total} грн.</label>
              <br />
              <label>ПДВ: {check.vat} грн.</label>
            </div>
          </div>
          <TableObject
            columnNames={checkColumnNames}
            rows={checkRows}
            withButtons={false}
          />
        </div>
      )}
    </>
  );
};

export default CheckInfo;
