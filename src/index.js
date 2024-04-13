import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/connection.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("server started");
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed!!!", error);
  });
