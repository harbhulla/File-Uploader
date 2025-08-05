import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function LoginForm() {
    const navigate = useNavigate();
  const [users, setUsers] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formBody = new URLSearchParams({
          email: users.email,
          password: users.password,
        });
    try {
    const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
            "Content-Type":  "application/x-www-form-urlencoded"
            },
            credentials:"include",
            body: formBody,
        });

        if (!response.ok) {
            const errorText = await response.text(); 
            throw new Error(`Server error: ${response.status} ${errorText}`);
        }
        navigate("/");
        } catch (error) {
        console.log("❌ fk it", error);
        }
    setUsers("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-base-200 p-6 rounded-box shadow-md border border-base-300 flex flex-col gap-5"
      >
        <h2 className="text-2xl font-semibold text-base-content mb-2">File Uploader</h2>

        {[
          { label: "Email", name: "email", placeholder: "you@example.com", type: "email" },
          { label: "Password", name: "password", placeholder: "••••••••", type: "password" },
        ].map(({ label, name, placeholder, type }) => (
          <div key={name} >
            <label htmlFor={name} className="block text-sm font-medium text-base-content mb-1">
              {label}
            </label>
            <input
              type={type}
              name={name}
              placeholder={placeholder}
              value={users[name] || ""}
              onChange={(e) => setUsers((prev) => ({ ...prev, [name]: e.target.value }))}
              className="input input-bordered w-full text-sm p-1 text-base-content border border-base-300"
            />
          </div>
        ))}

        <button type="submit" className="btn btn-primary mt-4 border border-base-300">
          Login
        </button>
        <p className="text-sm text-black">
  Don't have an account?{" "}
  <a href="signup" className="link text-black underline-offset-2 hover:underline">
    Sign Up
  </a>
  </p>
      </form>
    </div>
  );
}
