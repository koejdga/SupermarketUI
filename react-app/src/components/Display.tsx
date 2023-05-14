interface Props {
  data: string[];
}

const Display = ({ data }: Props) => {
  return (
    <>
      <h2>Total Records {data.length}</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Device_ID</th>
            <th>ProjectName</th>
            <th>ProjectAPI</th>
          </tr>
        </thead>
        <tbody>
          {data.length &&
            data.map((units, index) => {
              return (
                <tr key={index}>
                  <td>{units + "1"}</td>
                  <td>{units + "2"}</td>
                  <td>{units + "3"}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

export default Display;
