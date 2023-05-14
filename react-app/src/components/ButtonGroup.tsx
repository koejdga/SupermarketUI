interface Props {
  buttonNames: string[];
  onClickFunctions: (() => void)[];
}

const ButtonGroup = ({ buttonNames, onClickFunctions }: Props) => {
  if (buttonNames.length !== onClickFunctions.length) return <div>Error</div>;
  let nums = [];
  for (let i = 0; i < buttonNames.length; i++) {
    nums[i] = i;
  }

  return (
    <>
      <div
        className="btn-group"
        role="group"
        aria-label="Basic radio toggle button group"
      >
        {nums.map((num) => (
          <>
            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id={"btnradios" + num}
              key={"btnradios" + num}
              autoComplete="off"
              onClick={onClickFunctions[num]}
            ></input>
            <label
              className="btn btn-outline-primary"
              htmlFor={"btnradios" + num}
              key={"btnradioss" + num}
            >
              {buttonNames[num]}
            </label>
          </>
        ))}
      </div>
    </>
  );
};

export default ButtonGroup;
