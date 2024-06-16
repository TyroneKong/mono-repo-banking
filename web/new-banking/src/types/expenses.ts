type Expense = {
  ID?: string;
  user_id: string;
  name: string;
  amount: string;
  total?: number;
  type: string;
  created_at: string;
};

export default Expense;
