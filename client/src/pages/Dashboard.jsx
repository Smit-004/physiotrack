import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StatCard from "../components/StatCard";
import PainChart from "../components/PainChart";
import { getError } from "../utils/getError";
import { todayLocal } from "../utils/date";

const FILTERS = ["", "knee", "shoulder", "lower back", "neck", "ankle", "hip", "elbow", "wrist", "other"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [bodyPart, setBodyPart] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Page khulte hi aur filter badalte hi stats laao
  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await api.get("/stats", {
          params: { today: todayLocal(), ...(bodyPart && { bodyPart }) },
        });
        setStats(data);
        setError("");
      } catch (err) {
        setError(getError(err));
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [bodyPart]);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-teal-700">Dashboard</h1>
        <select
          value={bodyPart}
          onChange={(e) => setBodyPart(e.target.value)}
          className="border rounded px-3 py-1 capitalize"
        >
          {FILTERS.map((p) => (
            <option key={p} value={p}>{p || "All body parts"}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

      {stats && (
        <>
          {stats.redFlag && (
            <div className="bg-amber-50 border border-amber-300 text-amber-800 p-3 rounded-lg text-sm">
              ⚠️ {stats.redFlag}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Current streak"
              value={`${stats.streak} ${stats.streak === 1 ? "day" : "days"}`}
            />
            <StatCard
              label="Recovery score"
              value={`${stats.recoveryScore}/100`}
              hint="Consistency + pain level + improvement"
            />
            <StatCard
              label="Avg pain (last 7 days)"
              value={stats.avgPainLast7 ?? "–"}
              hint={`${stats.daysLoggedLast7} of 7 days logged`}
            />
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-teal-700 mb-3">Pain trend</h2>
            {stats.trend.length === 0 ? (
              <p className="text-slate-500">
                Abhi data nahi hai.{" "}
                <Link to="/logs" className="text-teal-700 underline">
                  Pehla log add karo
                </Link>
              </p>
            ) : (
              <PainChart data={stats.trend} />
            )}
          </div>
        </>
      )}
    </div>
  );
}