import { nanoid } from "nanoid";

export const generateRandomSlug = () => {
  return nanoid(8);
};

