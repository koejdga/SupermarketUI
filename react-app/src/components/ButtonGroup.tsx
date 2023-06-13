import { Fragment, useEffect, useState } from "react";

interface Props {
  buttonNames: string[];
  onClickFunctions: (() => void)[];
  defaultValue?: number;
}

const ButtonPanel = ({
  buttonNames,
  onClickFunctions,
  defaultValue,
}: Props) => {
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  if (buttonNames.length !== onClickFunctions.length) return <div>Error</div>;

  useEffect(() => {
    if (defaultValue !== undefined && defaultValue !== selectedButton) {
      setSelectedButton(defaultValue);
      onClickFunctions[defaultValue]();
    }
  }, [defaultValue, selectedButton, onClickFunctions]);

  const handleButtonClick = (index: number) => {
    onClickFunctions[index]();
    // setSelectedButton(index);
  };

  return (
    <>
      <div
        className="btn-group"
        role="group"
        aria-label="Basic radio toggle button group"
      >
        {buttonNames.map((buttonName, index) => (
          <Fragment key={index}>
            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id={index.toString()}
              autoComplete="off"
              onClick={() => handleButtonClick(index)}
              // checked={index === selectedButton}
              // onChange={() => {}}
            ></input>
            <label
              className="btn btn-outline-primary"
              // className={`btn ${
              //   index === selectedButton ? "btn-primary" : "btn-outline-primary"
              // }`}
              htmlFor={index.toString()}
            >
              {buttonName}
            </label>
          </Fragment>
        ))}
      </div>
    </>
  );
};

export default ButtonPanel;
