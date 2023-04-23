import {
    Entity as DbEntity,
    Column,
    PrimaryGeneratedColumn,
} from "typeorm";

@DbEntity('properties')
export default class sqlProperties {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    key: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    value: string;

    @Column({type: 'boolean', default: false, nullable: false})
    readonly: boolean;
}
