import { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Reports() {
  const [data, setData] = useState({});

  useEffect(() => {
    API.get("/api/reports/dashboard")
      .then(res => setData(res.data.data));
  }, []);

  const chartData = [
    { name: "Books", value: data.totalBooks || 0 },
    { name: "Users", value: data.totalUsers || 0 },
    { name: "Issued", value: data.totalIssued || 0 },
    { name: "Returned", value: data.totalReturned || 0 }
  ];

  return (
    <div className="glass">
      <h2>📊 Reports</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}