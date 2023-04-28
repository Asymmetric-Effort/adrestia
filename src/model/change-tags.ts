import {
    Entity as DbEntity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Unique
} from 'typeorm';
import sqlTag from './sqlTag';

@DbEntity('change_tag')
@Unique(['tag'])
export default class sqlChangeTag {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => sqlTag, { onDelete: null })
    tag: sqlTag;
}
