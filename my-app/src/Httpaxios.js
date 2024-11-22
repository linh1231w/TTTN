import axios from "axios";

const Httpaxios = axios.create({
    baseURL: 'http://localhost:5011/api/',
    timeout:70000,
    headers:{'X-Custom-Header':'foobar'},
   
})
export default Httpaxios;