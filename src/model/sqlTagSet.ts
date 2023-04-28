import {
    Entity as DbEntity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import sqlTag from './sqlTag';

@DbEntity('tag_set')
export default class sqlTagSet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => sqlTag, {onDelete: null })
    @JoinColumn({name: 'tag_id'})
    tag: sqlTag;
}
