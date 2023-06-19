import { formatDate, formatDateToTime } from "../utils/Utils";

interface Props {
  cashierID: string;
  date?: Date;
}

const BasicCheckInfo = ({ cashierID, date }: Props) => {
  return (
    <div>
      <label>ID касир/ки: {cashierID}</label>
      <br />
      <label>Дата: {date ? formatDate(date) : formatDate(new Date())}</label>
      <br />
      <label>
        Час: {date ? formatDateToTime(date) : formatDateToTime(new Date())}
      </label>
    </div>
  );
};

export default BasicCheckInfo;
