import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (

    <div className="dashboard">

      {/* Sidebar */}

      <div className="sidebar">

        <h1>TRIZEN</h1>

        <p>Photo Platform</p>

        <div className="menu">

          <button>📊 Dashboard</button>

         <button onClick={() => navigate("/admin/events")}>
  📅 Events
</button>

          <button onClick={() => navigate("/admin/team")}>
  👥 Team Members
</button>

          <button onClick={() => navigate("/admin/photos")}>
  📸 Photos
</button>

         <button onClick={() => navigate("/admin/galleries")}>
  🖼️ Galleries
</button>

        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>


      {/* Main Content */}

      <div className="main-content">

        <h1>Admin Dashboard 👋</h1>

        <p>
          Manage your events, team members, photos and galleries.
        </p>


        <div className="cards">

          <div className="card">

            <h2>📅</h2>

            <h3>Events</h3>

            <p>Manage photography events</p>

          </div>


          <div className="card">

            <h2>👥</h2>

            <h3>Team</h3>

            <p>Manage photographers</p>

          </div>


          <div className="card">

            <h2>📸</h2>

            <h3>Photos</h3>

            <p>View uploaded photos</p>

          </div>


          <div className="card">

            <h2>🖼️</h2>

            <h3>Galleries</h3>

            <p>Create customer galleries</p>

          </div>

        </div>

      </div>

    </div>

  );
}

export default AdminDashboard;