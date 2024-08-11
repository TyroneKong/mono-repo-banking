import axios from 'axios';

export const axAPI = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

export const getAllTransactions = async () => {
  const response = await axAPI.get('/api/allTransactions');

  return response.data;
};

export const getAllExpenses = async () => {
  const response = await axAPI.get('/api/allexpenses');

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axAPI.get('/api/currentUser');
  return response.data;
};
