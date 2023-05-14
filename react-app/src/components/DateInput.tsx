import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// TODO: зробити Custom header
// TODO: зробити аргументом onChange
const DateInput = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  return (
    <DatePicker
      dateFormat="dd/MM/yyyy"
      placeholderText="Choose date range.."
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      selectsRange={true}
      startDate={startDate}
      endDate={endDate}
      onChange={(update) => {
        setDateRange(update);
      }}
      isClearable={true}
    />
  );
};

export default DateInput;
