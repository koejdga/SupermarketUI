import { Fragment } from "react";

interface Props {
  buttonNames: string[];
  onClickFunctions: (() => void)[];
}

const ButtonGroup = ({ buttonNames, onClickFunctions }: Props) => {
  if (buttonNames.length !== onClickFunctions.length) return <div>Error</div>;

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
              onClick={onClickFunctions[index]}
            ></input>
            <label
              className="btn btn-outline-primary"
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

export default ButtonGroup;
