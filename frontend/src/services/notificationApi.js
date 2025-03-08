import axios from "axios";

const API = axios.create({baseURL:"http://localhost:5000"});

const sendNotification = async (rollNumber) => {
  
  fetch("http://localhost:5000/api/student/update_token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rollNumber: rollNumber,
           deviceToken: "eaSy9uiXaLpONLkbHx9guf:APA91bHQDtGJDp1rDaLivkNLLlp1QON4E1RWk4YnNKo7KGh9cRFEw9UHZsqBThCj6BKet1HQMFJ0ILq34YhYKxtT6AGPV-W8Cz6KgQnoRGSR00W01HvGpv8"
          }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error("Error:", err));

};

export default sendNotification;
