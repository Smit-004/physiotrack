import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

// data = stats.trend => [{ date: "2026-10-01", avgPain: 4, count: 1 }, ...]
export default function PainChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 10]} />
        <Tooltip />
        <Line type="monotone" dataKey="avgPain" stroke="#0f766e" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}