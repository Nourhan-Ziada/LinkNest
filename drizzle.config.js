export default {
  schema: "./src/models/*.js",
  out: "./src/database/migrations",
  dialect: 'sqlite',
  dbCredentials: {
    url: "linknest.db",
  },
};
