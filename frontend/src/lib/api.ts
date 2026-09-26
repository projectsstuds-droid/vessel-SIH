import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const login = (email: string, password: string) => 
  api.post('/auth/login', { email, password }).then(res => res.data);
export const register = (email: string, password: string) => 
  api.post('/auth/register', { email, password }).then(res => res.data);

export const getPorts = () => api.get('/ports').then(res => res.data);
export const getVessels = () => api.get('/vessels').then(res => res.data);
export const getForecast = (routeId: string) => api.get(`/forecast?routeId=${routeId}`).then(res => res.data);
export const checkCompatibility = (portId: string, vesselId: string) => 
  api.post('/ports/compatibility', { portId, vesselId }).then(res => res.data);

export default api;
