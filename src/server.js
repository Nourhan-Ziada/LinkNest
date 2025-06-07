import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on ${BASE_URL}:${PORT}`);
});
