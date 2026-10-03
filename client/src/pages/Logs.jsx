import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";
import LogForm from "../components/LogForm";
import { getError } from "../utils/getError";

const FILTERS = ["", "knee", "shoulder", "lower back", "neck", "ankle", "hip", "elbow", "wrist", "other"];

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [bodyPart, setBodyPart] = useState(""); // "" matlab sab dikhao
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // jis log ko edit kar rahe hain, nahi toh null

  const fetchLogs = useCallback(async () => {
    try {
      const { data } = await api.get("/logs", {
        params: bodyPart ? { bodyPart } : {},
      });
      setLogs(data.logs);
      setError("");
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  }, [bodyPart]);

  // filter badle toh list dobara laao
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Error form ko jaane do: wo khud dikhayega
  const addLog = async (payload) => {
    await api.post("/logs", payload);
    await fetchLogs();
  };

  const updateLog = async (payload) => {
    await api.put(`/logs/${editing._id}`, payload);
    setEditing(null); // edit mode band
    await fetchLogs();
  };

  const deleteLog = async (id) => {
    if (!window.confirm("Ye log delete karna hai?")) return;
    try {
      await api.delete(`/logs/${id}`);
      if (editing?._id === id) setEditing(null); // jo log edit ho raha tha wahi delete hua toh edit band
      await fetchLogs();
    } catch (err) {
      setError(getError(err));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {editing ? (
        <LogForm
          key={editing._id}
          initial={{ ...editing, date: editing.date.slice(0, 10) }}
          onSubmit={updateLog}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <LogForm onSubmit={addLog} />
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-teal-700">My logs</h2>
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

      {loading ? (
        <p>Loading...</p>
      ) : logs.length === 0 ? (
        <p className="text-slate-500">Abhi koi log nahi hai. Upar se pehla log add karo.</p>
      ) : (
        <ul className="space-y-3">
          {logs.map((log) => (
            <li key={log._id} className="bg-white p-4 rounded-xl shadow flex justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {log.exercise}{" "}
                  <span className="text-sm font-normal text-slate-500 capitalize">
                    ({log.bodyPart})
                  </span>
                </p>
                <p className="text-sm text-slate-600">
                  {log.date.slice(0, 10)} · {log.durationMin} min · Pain {log.pain}/10
                </p>
                {log.notes && <p className="text-sm mt-1">{log.notes}</p>}
              </div>

              <div className="flex gap-3 self-start">
                <button
                  onClick={() => {
                    setEditing(log);
                    window.scrollTo({ top: 0, behavior: "smooth" }); // form upar hai, wahan le jao
                  }}
                  className="text-sm text-teal-700 underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteLog(log._id)}
                  className="text-sm text-red-600 underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}