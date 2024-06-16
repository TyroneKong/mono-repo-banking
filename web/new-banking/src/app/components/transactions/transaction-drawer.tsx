import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useUser } from '@/app/contexts/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axAPI, transactionKeys } from '@/app/hooks/requests';
// import { toast } from '@/components/ui/use-toast';
import Transaction from '@/types/transactions';

const schema = z.object({
  userId: z.string().optional(),
  name: z.string(),
  amount: z.string(),
  currency: z.string(),
  type: z.string(),
});

type Inputs = z.infer<typeof schema>;

// this mimics the SubmitHandler type
type submitType<T extends Record<string, any>> = (
  values: T,
  event?: React.BaseSyntheticEvent
) => unknown | Promise<unknown>;

function TransactionDrawer() {
  const { name, id } = useUser();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      userId: id,
      name: name,
      amount: '',
      currency: '',
      type: '',
    },
  });

  const queryClient = useQueryClient();

  const createOnSuccess = async (newTransaction: Inputs) => {
    const previoudData = queryClient.getQueryData(transactionKeys.all);

    await queryClient.setQueryData(
      transactionKeys.all,
      (oldData: Transaction[]) => [...oldData, newTransaction]
    );
    return { previoudData };
  };

  const createTransaction = useMutation({
    mutationFn: (body: Inputs) => axAPI.post('/api/createTransaction', body),
    onSuccess: ({ data }) => {
      createOnSuccess(data);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: transactionKeys.all }),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createTransaction.mutate(data);
  };

  return (
    <Drawer>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create new Transaction</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='userId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-2'>User Id</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-2'>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-2'>Amount</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='currency'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-2'>Currency</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-2'>Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DrawerFooter>
              <DrawerClose>
                <Button type='submit'>Submit</Button>
              </DrawerClose>
              <DrawerClose>
                <Button variant='outline'>Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}

export default TransactionDrawer;
