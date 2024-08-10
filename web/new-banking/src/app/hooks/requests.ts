import axios from 'axios';
import { useQuery, queryOptions } from '@tanstack/react-query';

export const axAPI = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

export const transactionKeys = {
  all: ['transactions'],
};

const getAllTransactions = async () => {
  const response = await axAPI.get('/api/allTransactions');

  return response.data;
};

const Transactions = {
  all: () => transactionKeys.all,
  list: () =>
    queryOptions({
      queryKey: [...Transactions.all()],
      queryFn: () => getAllTransactions(),
    }),
};

export const useGetTransactions = () => {
  return useQuery(Transactions.list());
};

export const getAllExpenses = async () => {
  const response = await axAPI.get('/api/allexpenses');

  return response.data;
};

const Expenses = {
  all: () => ['expenses'],
  list: () =>
    queryOptions({
      queryKey: [...Expenses.all()],
      queryFn: () => getAllExpenses(),
    }),
};

export const useGetExpenses = () => {
  return useQuery(Expenses.list());
};

const currentUserKeys = {
  current: ['me'],
};

const getCurrentUser = async () => {
  const response = await axAPI.get('/api/currentUser');
  return response.data;
};

export const useQueryCurrentUser = () => {
  return useQuery({
    queryKey: currentUserKeys.current,
    queryFn: () => getCurrentUser(),
  });
};
