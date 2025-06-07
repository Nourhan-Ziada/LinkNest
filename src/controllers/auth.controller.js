import {
  registerUserService,
  loginUserService,
} from "../services/auth.service.js";

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    await registerUserService(email, password);
    res.status(204).send();
  } catch (error) {
   //  console.error("Registration error:", error);
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await loginUserService(email, password);
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    //console.error("Login error:", error);
    res.status(401).json({ error: error.message });
  }
};
