import {Connection, createConnection} from "typeorm";
import sqlChangeLog from "../model/sqlChangeLog";
import sqlChangeLogTag from "../model/change-tags";
import sqlDependencyList from "../model/sqlDependencyList";
import sqlEntity from "../model/sqlEntity";
import sqlEntityReferences from "../model/sqlEntityReferences";
import sqlEntityType from "../model/sqlEntityType";
import sqlHistoryLog from "../model/sqlHistoryLog";
import sqlNotes from "../model/notes";
import sqlNoteSet from "../model/note-set";
import sqlPerson from "../model/person";
import sqlProperties from "../model/sqlProperties";
import sqlReference from "../model/reference";
import sqlTag from "../model/sqlTag";
import sqlTagSet from "../model/sqlTagSet";
import sqlTeam from "../model/sqlTeam";
import sqlTeamAssociation from "../model/sqlTeamAssociation";

export default class DbBase {
    //
    protected connection: Connection;

    public constructor() {
        console.log("Database class initializing")
    }

    public async connect() {
        console.log("creating connection...")
        this.connection = await createConnection({
            type: "postgres",
            host: "192.168.3.190",
            port: 5432,
            username: "adrestia",
            password: "password",
            database: "postgres",
            entities: [
                sqlChangeLog,
                sqlChangeLogTag,
                sqlDependencyList,
                sqlEntity,
                sqlEntityReferences,
                sqlEntityType,
                sqlHistoryLog,
                sqlNotes,
                sqlNoteSet,
                sqlPerson,
                sqlProperties,
                sqlReference,
                sqlTag,
                sqlTagSet,
                sqlTeam,
                sqlTeamAssociation
            ],
            synchronize: true,
        });
        console.log("database connection ok.")
    }

    async disconnect() {
        await this.connection.close();
    }
}