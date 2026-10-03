export default function StatCard({ label, value, hint }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-teal-700">{value}</p>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}