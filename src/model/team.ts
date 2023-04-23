import {
    Entity as DbEntity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import sqlPerson from './person';

@DbEntity('team')
export default class sqlTeam {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'boolean', nullable: false, default: false})
    deleted: boolean;

    @ManyToOne(() => sqlPerson, {nullable: false})
    @JoinColumn({name: 'owner'})
    owner: sqlPerson;

    @Column({type: 'varchar', nullable: false, unique: true})
    name: string;

    @Column({type: 'text', nullable: false, default: ''})
    description: string;
}
