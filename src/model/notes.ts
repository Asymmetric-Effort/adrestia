import {
    Entity as DbEntity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import sqlPerson from './person';

@DbEntity('notes')
export default class sqlNotes {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'boolean', default: false})
    deleted: boolean;

    @ManyToOne(() => sqlPerson)
    @JoinColumn({name: 'created_by'})
    createdBy: sqlPerson;

    @Column({type: 'varchar', length: 255})
    title: string;

    @Column({type: 'text', default: ''})
    body: string;
}
