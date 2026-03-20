import { useState } from "react";
import { useParams } from "react-router-dom";

function ResetPassword() {
  var [password, setPassword] = useState("");
  var [message, setMessage] = useState("");
  var [loading, setLoading] = useState(false);

  var { token } = useParams();

  var handleSubmit = async function(e) {
    e.preventDefault();
    setLoading(true);

    var res = await fetch(process.env.REACT_APP_API_URL + "/api/auth/reset-password/" + token, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: password })
    });

    var data = await res.json();
    setMessage(data.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h4 className="text-2xl font-semibold mb-6 text-gray-800">Reset Password</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">New Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={function(e) { setPassword(e.target.value); }}
              required
            />
          </div>
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition duration-200"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;