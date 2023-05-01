import {v4 as uuid} from "uuid";
import {
    Entity as DbEntity,
    Column,
    PrimaryGeneratedColumn,
    Unique, ManyToOne, JoinColumn, PrimaryColumn, Index
} from 'typeorm';

//-\\ //-\\ //-\\ //-\\ //-\\ //-\\ //-\\ //-\\ //-\\ //-\\ //-\\ //-\\ //-\\ //-\\ //-\\

/*
 * Database: SqlTag
 * Purpose:
 *  - A tag is a key-value tag with a description.
 */
@DbEntity('tags')
@Unique(['key', 'value'])
export class SqlTag {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'boolean', default: false})
    deleted: boolean;

    @Column({type: 'varchar', length: 255})
    key: string;

    @Column({type: 'varchar', length: 255})
    value: string;

    @Column({type: 'text', default: '', nullable: false})
    description: string;
}

/*
 * Database: SqlTagSet
 * Purpose:
 *  - Creates a set of one or more tags which can be referenced by another object (e.g. entity)
 */
@DbEntity('tag_set')
export class SqlTagSet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => SqlTag, {onDelete: null})
    @JoinColumn({name: 'tag_id'})
    tag: SqlTag;
}

/*
 * Database: SqlProperties
 * Purpose:
 *  - Create a set of key-value properties
 */
@DbEntity('properties')
export class SqlProperties {
    @PrimaryColumn({type: 'varchar', length: 255, nullable: false, unique: true})
    public key: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    public value: string;
}

/*
 * Database: SqlPerson
 * Purpose:
 *  - Create a table to store "persons"
 */
@DbEntity('person')
export class SqlPerson {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: 'deleted', type: 'boolean', default: false})
    deleted: boolean;

    @Column({name: 'email', type: 'varchar', length: 255, unique: true})
    email: String;

    @Column({name: 'firstName', type: 'varchar', length: 255})
    firstName: String;

    @Column({name: 'lastName', type: 'varchar', length: 255})
    lastName: String;
}

/*
 * Database: SqlTeam
 * Purpose:
 *  - Create the teams which support entities
 */
@DbEntity('team')
export class SqlTeam {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: 'deleted', type: 'boolean', nullable: false, default: false})
    deleted: boolean;

    @ManyToOne(() => SqlPerson, {nullable: false})
    @JoinColumn({name: 'owner'})
    owner: SqlPerson;

    @Column({type: 'varchar', nullable: false, unique: true})
    name: string;

    @Column({name: 'description', type: 'text', nullable: false, default: ''})
    description: string;
}

/*
 * Database: SqlTeamAssociation
 * Purpose:
 *  - Associate persons to teams.  A person could be part of one or more teams.
 */
@DbEntity('team_association')
@Unique(['person','team'])
export class SqlTeamAssociation {
    @ManyToOne(() => SqlPerson, { primary: true, onDelete: null })
    person: SqlPerson;

    @ManyToOne(() => SqlTeam, { primary: true, onDelete: null })
    team: SqlTeam;
}

/*
 * Database: SqlNotes
 * Purpose:
 *  - Create a note object (title, body, createdBy) identified by uuid.
 */
@DbEntity('notes')
export class SqlNotes {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: 'deleted', type: 'boolean', default: false})
    deleted: boolean;

    @ManyToOne(() => SqlPerson)
    @JoinColumn({name: 'created_by'})
    createdBy: SqlPerson;

    @Column({name: 'title', type: 'varchar', length: 255})
    title: string;

    @Column({name: 'body', type: 'text', default: ''})
    body: string;
}

/*
 * Database: SqlNoteSet
 * Purpose:
 *  - Create a set of notes which can be referenced by other objects (e.g. entity records).
 */
@DbEntity('note_set')
@Unique(['id', 'noteId'])
export class SqlNoteSet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'boolean', default: false})
    deleted: boolean;

    @ManyToOne(() => SqlNotes)
    @JoinColumn({name: 'noteId'})
    noteId: SqlNotes;
}

/*
 * Database: SqlReference
 * Purpose:
 *  - Create records that link the service catalog to external references.
 */
@DbEntity('references')
export class SqlReference {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;

    @ManyToOne(() => SqlNoteSet, { nullable: true })
    @JoinColumn({ name: 'notes' })
    notes: SqlNoteSet;

    @Column({ type: 'varchar', length: 255, nullable: false})
    name: string;

    @Column({ type: 'text', nullable: false })
    link: string;
}

/*
 * Database: SqlChangeTag
 * Purpose:
 *  - Associate a tag with a change Log record.
 */
@DbEntity('change_tag')
@Unique(['tag'])
export class SqlChangeTag {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => SqlTag, { onDelete: null })
    tag: SqlTag;
}

/*
 * Database: SqlChangeLog
 * Purpose:
 *  - A log of change events in the wider ecosystem, associated with persons
 *    reporting the change and relevant tags.
 */
@DbEntity('change_log')
export class SqlChangeLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index("ndx_change_timestamp")
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    timestamp: Date;

    @ManyToOne(() => SqlChangeTag, {onDelete: null})
    tagSet: SqlChangeTag;

    @ManyToOne(() => SqlPerson, {onDelete: null})
    changedBy: SqlPerson;

    @Column({type: 'text',nullable: false})
    event: string;
}

/*
 * Database: SqlHistoryLog
 * Purpose:
 *  - Create a history log to record changes in this system.
 */
@DbEntity({name: 'history_log'})
export class SqlHistoryLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'timestamp', default: () => 'now()'})
    timestamp: Date;

    @ManyToOne(() => SqlPerson, {onDelete: null})
    reportedBy: SqlPerson;

    @Column({type: 'text', nullable: false})
    event: string;
}

/*
 * Database: SqlEntityType
 * Purpose:
 *  -
 */
@DbEntity('entity_type')
export class SqlEntityType {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'boolean', nullable: false, default: false })
    deleted: boolean;

    @Column({ type: 'varchar', length:255, nullable: false, unique: true })
    name: string;

    @Column({ type: 'text', nullable: false, default: '' })
    description: string;
}

/*
 * Database: SqlDependencyList
 * Purpose:
 *  - Create a list of dependencies (entity records)
 */
@DbEntity('dependency_list')
export class SqlDependencyList {
    @PrimaryGeneratedColumn("uuid")
    id: string = uuid();

    @ManyToOne(() => SqlEntity)
    @JoinColumn()
    entity: SqlEntity;

    @Column({type: 'boolean', nullable:false, default: false})
    required: boolean;
}

/*
 * Database: SqlEntity
 * Purpose:
 *  - An Entity is the service, product, vendor or other object at the core of the database.
 */
@DbEntity('entity')
export class SqlEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string = uuid();

    @Column({type: 'boolean', default: false})
    deleted: boolean;

    @ManyToOne(() => SqlEntityType)
    @JoinColumn()
    entityType: SqlEntityType;

    @ManyToOne(() => SqlPerson)
    @JoinColumn()
    owner: SqlPerson;

    @ManyToOne(() => SqlTeamAssociation, {nullable: false})
    @JoinColumn()
    onCall: SqlTeamAssociation;

    @ManyToOne(() => SqlNoteSet, {nullable: true})
    @JoinColumn()
    notes: SqlNoteSet;

    @ManyToOne(() => SqlTagSet, {nullable: true})
    @JoinColumn()
    tagSet: SqlTagSet;

    @ManyToOne(() => SqlDependencyList, {nullable: true})
    @JoinColumn()
    dependency: SqlDependencyList;

    @Column({type: 'varchar', nullable: false, unique: true})
    name: string;

    @Column({type: 'text', nullable: false, default: ""})
    description: string;
}

/*
 * Database: SqlEntityReferences
 * Purpose:
 *  -
 */
@DbEntity('entity_references')
export class SqlEntityReferences {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => SqlEntity, {nullable: false})
    @JoinColumn({name: 'id'})
    entityId: string;

    @ManyToOne(() => SqlReference)
    @JoinColumn({name: 'refId'})
    refId: SqlReference;
}
