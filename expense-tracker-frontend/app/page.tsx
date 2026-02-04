"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Expense, ExpenseForm } from "../lib/types";

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [form, setForm] = useState<ExpenseForm>({
    title: "",
    amount: "",
    category: "",
  });

  const loadExpenses = async (): Promise<void> => {
    const res = await api.get<Expense[]>("/expenses");
    setExpenses(res.data);
  };

  useEffect(() => {
    loadExpenses();
  }, []);
  // console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

  const addExpense = async (): Promise<void> => {
    if (!form.title || !form.amount || !form.category) return;

    await api.post("/expenses", {
      ...form,
      amount: Number(form.amount),
    });

    setForm({ title: "", amount: "", category: "" });
    loadExpenses();
  };

  const deleteExpense = async (id: number): Promise<void> => {
    await api.delete(`/expenses/${id}`);
    loadExpenses();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Expense Tracker</h1>

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
      />

      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <button onClick={addExpense}>Add Expense</button>

      <hr />

      {expenses.map((e) => (
        <div key={e.id}>
          {e.title} — ₹{e.amount} ({e.category})
          <button onClick={() => deleteExpense(e.id)}> x </button>
        </div>
      ))}
    </div>
  );
}
