import "./ButtonGrid.css";

interface Props {
  buttonLabels: string[];
  addCheckButtonLabel: string;
  onClickFunctions: (() => void)[];
  onClickAddCheckButton: () => void;
}

const ButtonGrid = ({
  buttonLabels,
  addCheckButtonLabel,
  onClickFunctions,
  onClickAddCheckButton,
}: Props) => {
  if (buttonLabels.length != 6) return <div>Error</div>;
  return (
    <div className="container">
      <h2>Супермаркет "ZLAGODA"</h2>
      <button onClick={onClickAddCheckButton} className="add-check-button">
        {addCheckButtonLabel}
      </button>
      <div className="button-container">
        <div className="button-group">
          <button onClick={onClickFunctions[0]} className="button">
            {buttonLabels[0]}
          </button>
          <button onClick={onClickFunctions[1]} className="button">
            {buttonLabels[1]}
          </button>
          <button onClick={onClickFunctions[2]} className="button">
            {buttonLabels[2]}
          </button>
        </div>
        <div className="button-group">
          <button onClick={onClickFunctions[3]} className="button">
            {buttonLabels[3]}
          </button>
          <button onClick={onClickFunctions[4]} className="button">
            {buttonLabels[4]}
          </button>
          <button onClick={onClickFunctions[5]} className="button">
            {buttonLabels[5]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ButtonGrid;
