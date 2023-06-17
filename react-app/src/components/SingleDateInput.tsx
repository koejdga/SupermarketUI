import { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";

interface Props {
  handleDateChange: (date: Date | null) => void;
  date: Date | null;
}

const SingleDateInput = ({ handleDateChange, date: defaultDate }: Props) => {
  const [date, setDate] = useState(defaultDate);
  const ExampleCustomInput = forwardRef<
    HTMLButtonElement,
    { value?: string; onClick?: () => void }
  >(({ value, onClick }, ref) => (
    <button
      className="edit-or-create-button-window"
      onClick={onClick}
      ref={ref}
    >
      {value}
    </button>
  ));

  return (
    <DatePicker
      dateFormat="dd/MM/yyyy"
      placeholderText="Виберіть період часу..."
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      selected={date}
      onChange={(date) => {
        setDate(date);
        handleDateChange(date);
      }}
      customInput={<ExampleCustomInput />}
    />
  );
};

export default SingleDateInput;
