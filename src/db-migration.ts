import Database from "./database";

console.log("Database Migration starting");
const db: Database = new Database();
db.connect().then(() => {
    console.log("Database connected");
}).catch((error) => {
    console.log(error);
});