import axios from "axios";
import { TodosApi, Configuration } from "@/generated";

const config = new Configuration();
const axiosInstance = axios.create();

const api = new TodosApi(config, "http://localhost:8000", axiosInstance);

export { api };
