import { ReactNode, createContext, useContext, useMemo } from 'react';
import { User } from '@/types/user';
import { useQueryCurrentUser } from '../hooks/requests';

const userContext = createContext({} as User);

type Props = {
  children: ReactNode;
};

export function UserContextProvider({ children }: Props) {
  const { data } = useQueryCurrentUser();

  const value = useMemo(() => {
    return {
      ...data,
    };
  }, [data]) as User;

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
}

export const useUser = () => {
  const context: User = useContext(userContext);

  if (!context) {
    throw Error('Context must be wrapped in a provider');
  }
  return context;
};
