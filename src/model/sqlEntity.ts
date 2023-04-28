import {
    Entity as DbEntity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import {v4 as uuid} from "uuid";
import sqlEntityTypes from "./sqlEntityType";
import sqlPerson from "./person";
import sqlNoteSet from "./note-set";
import sqlTagSet from "./sqlTagSet";
import sqlDependencyList from "./sqlDependencyList";
import sqlTeamAssociation from "./sqlTeamAssociation";

@DbEntity('entity')
export default class sqlEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string = uuid();

    @Column({type: 'boolean', default: false})
    deleted: boolean;

    @ManyToOne(() => sqlEntityTypes)
    @JoinColumn()
    entityType: sqlEntityTypes;

    @ManyToOne(() => sqlPerson)
    @JoinColumn()
    owner: sqlPerson;

    @ManyToOne(() => sqlTeamAssociation, {nullable: false})
    @JoinColumn()
    onCall: sqlTeamAssociation;

    @ManyToOne(() => sqlNoteSet, {nullable: true})
    @JoinColumn()
    notes: sqlNoteSet;

    @ManyToOne(() => sqlTagSet, {nullable: true})
    @JoinColumn()
    tagSet: sqlTagSet;

    @ManyToOne(() => sqlDependencyList, {nullable: true})
    @JoinColumn()
    dependency: sqlDependencyList;

    @Column({type: 'varchar', nullable: false, unique: true})
    name: string;

    @Column({type: 'text', nullable: false, default: ""})
    description: string;
}
