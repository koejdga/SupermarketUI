// import { forwardRef } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// interface Props {
//   setDateRange: (range: [Date | null, Date | null]) => void;
//   dateRange: [Date | null, Date | null];
// }

// // TODO: зробити Custom header
// const DateInput = ({ setDateRange, dateRange }: Props) => {
//   const [startDate, endDate] = dateRange;

//   const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
//     <button className="example-custom-input" onClick={onClick} ref={ref}>
//       {value}
//     </button>
//   ));

//   return (
//     <DatePicker
//       dateFormat="dd/MM/yyyy"
//       placeholderText="Виберіть період часу..."
//       showMonthDropdown
//       showYearDropdown
//       dropdownMode="select"
//       selectsRange={true}
//       startDate={startDate}
//       endDate={endDate}
//       onChange={(update) => {
//         setDateRange(update);
//       }}
//       isClearable={true}
//       customInput={<ExampleCustomInput />}
//     />
//   );
// };

// export default DateInput;

import { forwardRef, Ref, MouseEvent } from "react";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  setDateRange: (range: [Date | null, Date | null]) => void;
  dateRange: [Date | null, Date | null];
}

const ExampleCustomInput = forwardRef(
  (
    {
      value,
      onClick,
    }: { value: string; onClick: (e: MouseEvent<HTMLButtonElement>) => void },
    ref: Ref<HTMLButtonElement>
  ) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
      {value}
    </button>
  )
);

const DateInput = ({ setDateRange, dateRange }: Props) => {
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

export default DateInput;
