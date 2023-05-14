import React from "react";

interface Props {
  buttonStyle?: React.CSSProperties;
}

const PrintReportButton = ({ buttonStyle }: Props) => {
  return buttonStyle ? (
    <button type="button" className="btn btn-secondary" style={buttonStyle}>
      Надрукувати звіт
    </button>
  ) : (
    <button type="button" className="btn btn-secondary">
      Надрукувати звіт
    </button>
  );
};

export default PrintReportButton;
