import {
    Entity as DbEntity,
    Column,
    Index,
    PrimaryGeneratedColumn,
    ManyToOne
} from 'typeorm';
import sqlChangeTags from './change-tags';
import sqlPersons from './person';

@DbEntity('change_log')
export default class sqlChangeLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index("ndx_change_timestamp")
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    timestamp: Date;

    @ManyToOne(() => sqlChangeTags, {onDelete: null})
    tagSet: sqlChangeTags;

    @ManyToOne(() => sqlPersons, {onDelete: null})
    changedBy: sqlPersons;

    @Column({type: 'text',nullable: false})
    event: string;
}
