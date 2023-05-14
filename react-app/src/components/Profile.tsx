import "./Profile.css";

interface Props {
  name: string;
  surname: string;
  patronymic: string;
  employeeRole: string;
  salary: string;
  dateOfBirth: string;
  dateOfWorkStart: string;
  phoneNumber: string;
  city: string;
  street: string;
  zipCode: string;
}

function Profile(props: Props) {
  return (
    <div className="profile">
      <h2>{`${props.surname} ${props.name} ${props.patronymic}`}</h2>
      <p>
        <strong>Employee Role:</strong> {props.employeeRole}
      </p>
      <p>
        <strong>Salary:</strong> {props.salary}
      </p>
      <p>
        <strong>Date of Birth:</strong> {props.dateOfBirth}
      </p>
      <p>
        <strong>Date of Work Start:</strong> {props.dateOfWorkStart}
      </p>
      <p>
        <strong>Phone Number:</strong> {props.phoneNumber}
      </p>
      <p>
        <strong>Address:</strong>{" "}
        {`${props.city}, ${props.street}, ${props.zipCode}`}
      </p>
    </div>
  );
}

export default Profile;
