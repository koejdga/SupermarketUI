interface Props {
  cashierID: string;
  date?: Date;
}

const BasicCheckInfo = ({ cashierID, date }: Props) => {
  return (
    <div>
      <label>ID касир/ки: {cashierID}</label>
      <br />
      <label>
        Дата:{" "}
        {date
          ? date.toLocaleDateString("uk-ua")
          : new Date().toLocaleDateString("uk-ua")}
      </label>
      <br />
      <label>
        Час:{" "}
        {date
          ? date.toLocaleTimeString("uk-ua")
          : new Date().toLocaleTimeString("uk-ua")}
      </label>
    </div>
  );
};

export default BasicCheckInfo;
