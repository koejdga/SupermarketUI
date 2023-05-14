import "./TovarCard.css";

interface Props {
  tovarName: string;
  price: string;
  amount: string;
  unitOfMeasurement: string;
}

const TovarCard = ({ tovarName, price, amount, unitOfMeasurement }: Props) => {
  return (
    <div className="tovar-card">
      <h1>{tovarName}</h1>
      <p className="tovar-card price">Ціна: {price} грн.</p>
      <p className="tovar-card amount">
        Кількість наявних одиниць товару: {amount}
      </p>
      <p className="tovar-card unit">Одиниця виміру: {unitOfMeasurement}</p>
    </div>
  );
};

export default TovarCard;
