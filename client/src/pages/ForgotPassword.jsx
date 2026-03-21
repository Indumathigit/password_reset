import { useState } from "react";

function ForgotPassword() {
  var [email, setEmail] = useState("");
  var [message, setMessage] = useState("");
  var [loading, setLoading] = useState(false);

  var handleSubmit = async function(e) {
    e.preventDefault();
    setLoading(true);

    var res = await fetch(process.env.REACT_APP_API_URL + "/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email })
    });



    

    var data = await res.json();
    setMessage(data.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h4 className="text-2xl font-semibold mb-6 text-gray-800">Forgot Password</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Enter your email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={function(e) { setEmail(e.target.value); }}
              required
            />
          </div>
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition duration-200"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {message && <p className="mt-4 text-green-600 text-sm">{message}</p>}
        <p className="mt-4 text-sm text-gray-600">
          <a href="/login" className="text-blue-500 hover:underline">Back to Login</a>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;