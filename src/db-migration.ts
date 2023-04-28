import Database from "./database";
import {getConnection} from "typeorm";

console.log("Database Migration starting");
const db: Database = new Database();
db.connect().then(() => {
    console.log("Database connected");
    db.disconnect().then(()=>{
        console.log("Database Migrations completed successfully.")
    }).catch((error) => {
        console.log(error);
    });
}).catch((error) => {
    console.log(error);
});
