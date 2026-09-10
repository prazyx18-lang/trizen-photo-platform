import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TeamDashboard from "./pages/TeamDashboard";
import Events from "./pages/Events";
import TeamMembers from "./pages/TeamMembers";
import Photos from "./pages/Photos";
import Galleries from "./pages/Galleries";
import PublicGallery from "./pages/PublicGallery";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/team"
          element={<TeamDashboard />}
        />

        <Route
          path="/admin/events"
          element={<Events />}
        />

        <Route
          path="/admin/team"
          element={<TeamMembers />}
        />

        <Route
          path="/admin/photos"
          element={<Photos />}
        />

        <Route
          path="/admin/galleries"
          element={<Galleries />}
        />

        {/* PUBLIC CUSTOMER GALLERY */}
        <Route
          path="/gallery/:slug"
          element={<PublicGallery />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;