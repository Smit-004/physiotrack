// Axios error se user ko dikhane layak message nikalta hai
export function getError(err) {
  const data = err.response?.data;
  if (!data) return "Cannot reach the server. Is the backend running?";
  return data.message || "Something went wrong. Please try again later.";
}