import axios from "axios";

const API = axios.create({baseURL:"http://localhost:5000"});

export const fetchData = async () => {
    try {
        const { data } = await API.get("/");
        return data;
    }
    catch(error) {
        console.error("Error fetching data:", error);
    }
}

export default fetchData;