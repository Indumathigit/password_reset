import { useState } from "react";

function Login() {
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [message, setMessage] = useState("");
  var [loading, setLoading] = useState(false);

  var handleSubmit = async function(e) {
    e.preventDefault();
    setLoading(true);

    var res = await fetch(process.env.REACT_APP_API_URL + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password })
    });

    var data = await res.json();
    setMessage(data.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h4 className="text-2xl font-semibold mb-6 text-gray-800">Login</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={function(e) { setEmail(e.target.value); }}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={function(e) { setPassword(e.target.value); }}
              required
            />
          </div>
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition duration-200"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
        <p className="mt-4 text-sm text-gray-600">
          <a href="/forgot-password" className="text-red-500 hover:underline">Forgot Password?</a>
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;