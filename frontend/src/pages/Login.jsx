import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();


  const handleLogin = async (e) => {

    e.preventDefault();

    try {
      console.log("EMAIL BEING SENT:", email);

      const response = await fetch(
       "http://localhost:3000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      console.log("LOGIN STATUS:", response.status);
console.log("LOGIN RESPONSE:", data);


      if (!response.ok) {

        alert(data.message);

        return;

      }


      // Save token and user
      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );


      // Redirect based on role
      if (data.user.role === "ADMIN") {

        navigate("/admin");

      } else if (data.user.role === "TEAM") {

        navigate("/team");

      }


    } catch (error) {

      console.error(error);

      alert("Something went wrong");

    }

  };


  return (

    <div className="login-container">

      <div className="login-box">

        <h1>TRIZEN</h1>

        <p className="subtitle">
          Photo Management Platform
        </p>


        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />


          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />


          <button type="submit">
            Login
          </button>

        </form>

      </div>

    </div>

  );

}

export default Login;