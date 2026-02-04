"use client";

import { useState } from "react";
import { api } from "../../lib/api";

interface ConvertResponse {
  USD: number;
  INR: number;
}

export default function Convert() {
  const [result, setResult] = useState<ConvertResponse | null>(null);

  const convert = async (): Promise<void> => {
    const res = await api.get<ConvertResponse>("/convert?amount=100");
    setResult(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Currency Converter</h1>

      <button onClick={convert}>Convert 100 USD</button>

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
