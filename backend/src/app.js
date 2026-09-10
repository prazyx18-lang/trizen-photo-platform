const express = require("express");
const cors = require("cors");

const galleryRoutes = require("./routes/galleryRoutes");
const photoRoutes = require("./routes/photoRoutes");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/users", userRoutes);

app.use("/api", photoRoutes);

app.use("/api", galleryRoutes);

// Test Route
app.get("/", (req, res) => {
    res.json({
        message: "Trizen Photo Platform API is running"
    });
});



module.exports = app;