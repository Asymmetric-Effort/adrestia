import {
    Entity as DbEntity,
    Column,
    PrimaryGeneratedColumn,
    Unique
} from 'typeorm';

@DbEntity('tags')
@Unique(['key', 'value'])
export default class sqlTag {
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
