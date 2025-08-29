import express from "express";
import userRouter from "./src/Modules/User/user.controller.js";
import messageRouter from "./src/Modules/Messages/message.controller.js";
import dbConnection from "./src/DB/db.connection.js";
import "dotenv/config";

const app = express();

// Parsing middleware
app.use(express.json());
const whitelist =process.env.WHITE_LISTED_ORIGINS
const corsOptions = {
    origin: function (origin, callback) {
        console.log("The current origin is ", origin);

        if (whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
};
app.use(cors(corsOptions));


 dbConnection();

app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.cause || 500)
    .json({ message: "something broke!!", err: err.message, stack: err.stack });
});

app.use((req, res) => {
  res.status(404).send("Not Found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
