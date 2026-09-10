import { useEffect, useState } from "react";

function TeamMembers() {

  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  // GET TEAM MEMBERS
  const fetchTeamMembers = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/users/team",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {

        setTeamMembers(data);

      } else {

        console.error(data.message);

      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchTeamMembers();

  }, []);


  // CREATE TEAM MEMBER
  const handleCreateTeamMember = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/users/team",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.json();


      if (!response.ok) {

        alert(data.message);

        return;

      }


      alert("Team member created successfully 🎉");


      // Clear form
      setName("");
      setEmail("");
      setPassword("");


      // Refresh team list
      fetchTeamMembers();


    } catch (error) {

      console.error(error);

      alert("Something went wrong");

    }

  };


  return (

    <div style={{ padding: "40px" }}>

      <h1>👥 Team Members Management</h1>

      <p>Create and manage your photography team.</p>


      {/* CREATE TEAM MEMBER */}

      <form
        onSubmit={handleCreateTeamMember}
        style={{
          marginTop: "30px",
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          maxWidth: "500px"
        }}
      >

        <h2>Add Team Member</h2>


        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            marginTop: "15px"
          }}
        />


        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            marginTop: "15px"
          }}
        />


        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            marginTop: "15px"
          }}
        />


        <button
          type="submit"
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            cursor: "pointer"
          }}
        >
          ➕ Add Team Member
        </button>

      </form>


      <hr style={{ margin: "40px 0" }} />


      {/* TEAM MEMBERS LIST */}

      <h2>All Team Members</h2>


      {loading ? (

        <p>Loading team members...</p>

      ) : teamMembers.length === 0 ? (

        <p>No team members found.</p>

      ) : (

        teamMembers.map((member) => (

          <div
            key={member.id}
            style={{
              background: "white",
              padding: "20px",
              marginTop: "15px",
              borderRadius: "10px",
              maxWidth: "500px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
            }}
          >

            <h3>👤 {member.name}</h3>

            <p>📧 {member.email}</p>

            <p>Role: {member.role}</p>

          </div>

        ))

      )}

    </div>

  );

}

export default TeamMembers;