import { useEffect, useState } from "react";
import "./Profile.css";
import ProfileService from "../services/ProfileService";
import { Worker } from "../services/WorkersService";
import { formatDate } from "../utils/Utils";

interface Props {
  id_employee: string;
}

function Profile({ id_employee }: Props) {
  const [worker, setWorker] = useState<Worker>();

  useEffect(() => {
    let profileService = new ProfileService(id_employee);
    profileService.getRow().then((responce: Worker) => {
      setWorker(responce);
    });
  }, []);

  return (
    <div className="profile">
      {worker ? (
        <div>
          <h2>
            {worker.empl_surname} {worker.empl_name} {worker.empl_patronymic}
          </h2>
          <p>ID: {worker.id_employee}</p>
          <p>Посада: {worker.empl_role}</p>
          <p>Зарплата: {worker.salary} грн.</p>
          <p>Дата народження: {formatDate(worker.date_of_birth)}</p>
          <p>Дата початку роботи: {formatDate(worker.date_of_start)}</p>
          <p>Номер телефону: {worker.phone_number}</p>
          <p>
            Адреса: вул. {worker.street}, м. {worker.city} {worker.zip_code}
          </p>
        </div>
      ) : (
        <div>Помилка: Профіль не знайдено</div>
      )}
    </div>
  );
}

export default Profile;
