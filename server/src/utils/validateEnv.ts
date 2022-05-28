import { cleanEnv, str, port } from "envalid";

const ROOT_URL = "http://localhost:3333";

function validateEnv(): void {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ["development", "production", "test"],
    }),
    PORT: port({ default: 3333 }),
    ROOT_URL: str({ default: ROOT_URL }),
    JWT_SECRET_KEY: str(),
    Db_PORT: port({ default: 5432 }),
    DB_HOST: str(),
    DB_NAME: str(),
    DB_USERNAME: str(),
    DB_PASSWORD: str(),
  });
}

export default validateEnv;
