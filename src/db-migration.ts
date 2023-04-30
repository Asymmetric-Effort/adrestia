import Database from "./database/database";
import {getConnection} from "typeorm";
import {getEnvNumber, getEnvString} from "./environment/getEnv";

console.log("Database Migration starting");
const db: Database = new Database();

db.connect(
    getEnvString('DB_SERVER'),
    getEnvNumber('DB_PORT'),
    getEnvString('DB_USER'),
    getEnvString('DB_PASS'),
    getEnvString('DB_NAME')
).then(() => {
    console.log("Database connected");
    db.disconnect().then(()=>{
        console.log("Database Migrations completed successfully.")
    }).catch((error) => {
        console.log(error);
    });
}).catch((error) => {
    console.log(error);
});
