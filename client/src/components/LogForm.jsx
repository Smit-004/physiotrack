import { useState } from "react";
import { getError } from "../utils/getError";
import { todayLocal } from "../utils/date";

const BODY_PARTS = [
  "knee", "shoulder", "lower back", "neck", "ankle", "hip", "elbow", "wrist", "other",
];

// initial: edit ke time purana log aayega (6B me), add ke time undefined
export default function LogForm({ initial, onSubmit, onCancel }) {
  const [date, setDate] = useState(initial?.date ?? todayLocal());
  const [bodyPart, setBodyPart] = useState(initial?.bodyPart ?? "knee");
  const [exercise, setExercise] = useState(initial?.exercise ?? "");
  const [durationMin, setDurationMin] = useState(initial?.durationMin ?? 15);
  const [pain, setPain] = useState(initial?.pain ?? 5);
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({
        date,
        bodyPart,
        exercise,
        durationMin: Number(durationMin), // input se string aati hai, server ko number chahiye
        pain: Number(pain),
        ...(notes.trim() && { notes: notes.trim() }), // khali ho toh bhejna hi nahi
      });
      if (!initial) {
        // naya log add hua, form saaf karo (date aur body part waise hi rehne do)
        setExercise("");
        setNotes("");
      }
    } catch (err) {
      setError(getError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow space-y-3">
      <h2 className="text-lg font-semibold text-teal-700">
        {initial ? "Edit log" : "Add today's log"}
      </h2>

      {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Body part</label>
          <select
            value={bodyPart}
            onChange={(e) => setBodyPart(e.target.value)}
            className="w-full border rounded px-3 py-2 capitalize"
          >
            {BODY_PARTS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Exercise</label>
          <input
            type="text"
            required
            minLength={2}
            maxLength={80}
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="e.g. Squats"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Duration (minutes)</label>
          <input
            type="number"
            required
            min={1}
            max={300}
            value={durationMin}
            onChange={(e) => setDurationMin(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">
          Pain level: <span className="font-bold text-teal-700">{pain}</span> / 10
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={pain}
          onChange={(e) => setPain(e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Notes (optional)</label>
        <textarea
          maxLength={300}
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded bg-teal-600 text-white disabled:opacity-50"
        >
          {submitting ? "Saving..." : initial ? "Update" : "Save log"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}