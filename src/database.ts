import "reflect-metadata";
import {Connection, createConnection} from "typeorm";

import sqlPerson from './model/person';
import sqlTeam from './model/team';
import sqlTag from './model/tag';
import sqlTagSet from './model/tag-set';
import sqlChangeLog from './model/change-log';
import sqlChangeLogTag from './model/change-tags';
import sqlDependencyList from "./model/dependency-list";
import sqlEntityType from "./model/entity-type";
import sqlEntity from "./model/entity";
import sqlEntityReferences from "./model/entity-reference";
import {sqlRole} from "./model/roles";
import sqlReference from "./model/reference";
import {sqlTeamAssociation} from "./model/team_association";
import sqlHistoryLog from "./model/history-log";
import sqlNotes from "./model/notes";
import sqlNoteSet from "./model/note-set";
import sqlProperties from "./model/properties";


export default class Database {
    private connection: Connection;

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
                sqlRole,
                sqlTag,
                sqlTagSet,
                sqlTeam,
                sqlTeamAssociation,
            ],
            synchronize: true,
        });
    }

    async disconnect() {
        await this.connection.close();
    }
}
