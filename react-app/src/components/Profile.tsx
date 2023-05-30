import { useEffect, useState } from "react";
import "./Profile.css";
import ProfileService from "../services/ProfileService";
import { Worker } from "../services/WorkersService";

interface Props {
  id_employee: string;
}

function Profile({ id_employee }: Props) {
  const [worker, setWorker] = useState<Worker>();

  useEffect(() => {
    let profileService = new ProfileService(id_employee);
    profileService.getRow().then((responce: Worker) => {
      setWorker(worker);
    });
  }, []);

  return (
    <div className="profile">
      {worker ? (
        <div>
          <p>ID: ${worker.id_employee}</p>
          <p>
            П.І.Б.: ${worker.empl_surname} ${worker.empl_name} $
            {worker.empl_patronymic}
          </p>
          <p>Посада: ${worker.empl_role}</p>
          <p>Зарплата: ${worker.salary} грн.</p>
          <p>
            Дата народження: $
            {worker.date_of_birth.toLocaleDateString("uk-UA", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p>
            Дата початку роботи: $
            {worker.date_of_start.toLocaleDateString("uk-UA", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p>Номер телефону: ${worker.phone_number}</p>
          <p>
            Адреса: вул. ${worker.street}, м. ${worker.city} ${worker.zip_code}
          </p>
        </div>
      ) : (
        <div>Error: Profile is not found</div>
      )}
    </div>
  );
}

export default Profile;
