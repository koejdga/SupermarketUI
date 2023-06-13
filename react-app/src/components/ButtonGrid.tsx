import "./ButtonGrid.css";

interface Props {
  buttonLabels: string[];
  addCheckButtonLabel?: string;
  onClickFunctions: (() => void)[];
  onClickAddCheckButton?: () => void;
}

const ButtonGrid = ({
  buttonLabels,
  addCheckButtonLabel,
  onClickFunctions,
  onClickAddCheckButton,
}: Props) => {
  if (buttonLabels.length != onClickFunctions.length)
    return (
      <div>
        Error: кількість назв кнопок та функцій для кнопок не однакова
        (ButtonGrid)
      </div>
    );
  return (
    <div className="container">
      <h2>Супермаркет "ZLAGODA"</h2>
      {addCheckButtonLabel && onClickAddCheckButton ? (
        <button onClick={onClickAddCheckButton} className="add-check-button">
          {addCheckButtonLabel}
        </button>
      ) : (
        <br />
      )}
      <div className="button-container">
        {buttonLabels.map((buttonLabel, index) => (
          <button
            onClick={onClickFunctions[index]}
            className="button"
            key={index}
          >
            {buttonLabel}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ButtonGrid;
