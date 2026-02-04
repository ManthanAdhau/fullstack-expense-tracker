"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [data, setData] = useState<Record<string, number>>({});

  useEffect(() => {
    api
      .get<Record<string, number>>("/dashboard")
      .then((res) => setData(res.data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <Pie
        data={{
          labels: Object.keys(data),
          datasets: [
            {
              data: Object.values(data),
            },
          ],
        }}
      />
    </div>
  );
}
