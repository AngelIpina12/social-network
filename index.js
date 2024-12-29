const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

console.log("API REST started correctly!");
connection();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UserRoutes = require("./routes/user");
const PublicationRoutes = require("./routes/publication");
const FollowRoutes = require("./routes/follow");

app.use("/api", UserRoutes);
app.use("/api", PublicationRoutes); 
app.use("/api", FollowRoutes);


app.get("/test-user", (req, res) => {
    return res.status(200).json({
        "id": 1,
        "name": "John Doe"
    })
})

app.listen(port, () => {
    console.log("Server is running on port " + port);
})