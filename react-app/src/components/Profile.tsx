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
        <strong>Посада:</strong> {props.employeeRole}
      </p>
      <p>
        <strong>Зарплата:</strong> {props.salary}
      </p>
      <p>
        <strong>Дата народження:</strong> {props.dateOfBirth}
      </p>
      <p>
        <strong>Дата початку роботи:</strong> {props.dateOfWorkStart}
      </p>
      <p>
        <strong>Номер телефону:</strong> {props.phoneNumber}
      </p>
      <p>
        <strong>Адреса:</strong>{" "}
        {`${props.city}, ${props.street}, ${props.zipCode}`}
      </p>
    </div>
  );
}

export default Profile;
