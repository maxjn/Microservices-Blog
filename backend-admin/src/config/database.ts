import { Sequelize, Dialect } from "sequelize";

// Type
interface DbConfig {
  name: string;
  user: string;
  pass: string;
  options: {
    port: number;
    host: string;
    dialect: Dialect;
  };
}

const db: DbConfig = {
  name: process.env.DB_NAME || "",
  user: process.env.DB_USER || "",
  pass: process.env.DB_PASS || "",
  options: {
    port: Number(process.env.DB_PORT) || 3306,
    host: process.env.DB_HOST || "",
    dialect: "mysql",
  },
};

const sequelize = new Sequelize(db.name, db.user, db.pass, db.options);

export default sequelize;
