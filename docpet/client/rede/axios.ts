import axios from "axios";

// cria uma instância do axios para realizar requisições à API
export const makeRequest = axios.create({
    baseURL: 'http://localhost:8001/api', // url base da API
    withCredentials: true // inclui as credenciais ao fazer requisições (por exemplo, cookies)
});
