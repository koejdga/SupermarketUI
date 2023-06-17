import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  setDateRange: (range: [Date | null, Date | null]) => void;
  dateRange: [Date | null, Date | null];
}

const DateRangeInput = ({ setDateRange, dateRange }: Props) => {
  const [startDate, endDate] = dateRange;

  return (
    <DatePicker
      dateFormat="dd/MM/yyyy"
      placeholderText="Виберіть період часу..."
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      selectsRange={true}
      startDate={startDate}
      endDate={endDate}
      onChange={(update) => {
        setDateRange(update as [Date | null, Date | null]);
      }}
      isClearable={true}
      // customInput={<ExampleCustomInput />}
    />
  );
};

export default DateRangeInput;
