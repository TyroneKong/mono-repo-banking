import {
  getAllExpenses,
  getAllTransactions,
  getCurrentUser,
} from '@/infrastructure/api';
import { useQuery, queryOptions } from '@tanstack/react-query';

export const transactionKeys = {
  all: ['transactions'],
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

export const useQueryCurrentUser = () => {
  return useQuery({
    queryKey: currentUserKeys.current,
    queryFn: () => getCurrentUser(),
  });
};
