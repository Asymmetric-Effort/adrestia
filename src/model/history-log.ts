import {
    Entity as DbEntity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne
} from 'typeorm';
import sqlPersons from './person';

@DbEntity({name: 'history_log'})
export default class sqlHistoryLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'timestamp', default: () => 'now()'})
    timestamp: Date;

    @ManyToOne(() => sqlPersons, {onDelete: null})
    reportedBy: sqlPersons;

    @Column({type: 'text', nullable: false})
    event: string;
}
