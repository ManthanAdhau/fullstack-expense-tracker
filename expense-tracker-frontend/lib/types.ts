export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  created_at: string;
}

export interface ExpenseForm {
  title: string;
  amount: number | "";
  category: string;
}
