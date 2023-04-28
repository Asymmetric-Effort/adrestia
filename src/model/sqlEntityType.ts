import {
    Entity as DbEntity,
    Column,
    PrimaryGeneratedColumn
} from 'typeorm';

@DbEntity('entity_type')
export default class sqlEntityType {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'boolean', nullable: false, default: false })
    deleted: boolean;

    @Column({ type: 'varchar', length:255, nullable: false, unique: true })
    name: string;

    @Column({ type: 'text', nullable: false, default: '' })
    description: string;
}
