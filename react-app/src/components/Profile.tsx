// import { useEffect } from "react";
// import "./Profile.css";
// import ProfileService from "../services/ProfileService";

function Profile() {
  return <div>Профіль на стадії розробки</div>;
  //   let worker: Worker;
  //   useEffect(() => {
  //     let profileService = new ProfileService();
  //     profileService.getRow().then((responce: Worker) => {
  //       console.log("ggg");
  //     });
  //   }, []);
  //   return (
  //     <div className="profile">
  //       <p>ID: ${worker.id_employee}</p>
  //       <p>
  //         П.І.Б.: ${worker.empl_surname} ${worker.empl_name} $
  //         {worker.empl_patronymic}
  //       </p>
  //       <p>Посада: ${worker.empl_role}</p>
  //       <p>Зарплата: ${worker.salary} грн.</p>
  //       <p>
  //         Дата народження: $
  //         {worker.date_of_birth.toLocaleDateString("uk-UA", {
  //           day: "numeric",
  //           month: "long",
  //           year: "numeric",
  //         })}
  //       </p>
  //       <p>
  //         Дата початку роботи: $
  //         {worker.date_of_start.toLocaleDateString("uk-UA", {
  //           day: "numeric",
  //           month: "long",
  //           year: "numeric",
  //         })}
  //       </p>
  //       <p>Номер телефону: ${worker.phone_number}</p>
  //       <p>
  //         Адреса: вул. ${worker.street}, м. ${worker.city} ${worker.zip_code}
  //       </p>
  //     </div>
  //   );
}

export default Profile;
