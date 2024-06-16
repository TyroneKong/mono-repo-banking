import axios from 'axios';
import { UseQueryResult, useQuery, queryOptions } from '@tanstack/react-query';
import Transaction from '@/types/transactions';
import Expense from '@/types/expenses';
import { User } from '@/types/user';

export const axAPI = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

export const transactionKeys = {
  all: ['transactions'],
};

export const useGetTransactions = () => {
  return useQuery<Transaction[]>({
    queryKey: transactionKeys.all,
    queryFn: async () => {
      const response = await axAPI.get('/api/allTransactions');

      return response.data;
    },
  });
};

export const useGetExpenses = () => {
  return useQuery<Expense[]>({
    queryKey: ['expenses'],
    queryFn: async () => {
      const response = await axAPI.get('/api/allExpenses');
      return response.data;
    },
  });
};

const currentUserKeys = {
  current: ['me'],
};

export const useQueryCurrentUser = () => {
  return useQuery<User>({
    queryKey: currentUserKeys.current,
    queryFn: async () => {
      const response = await axAPI.get('/api/currentUser');

      return response.data;
    },
  });
};
