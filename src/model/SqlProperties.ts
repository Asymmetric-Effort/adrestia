import {
    Entity as DbEntity,
    Column,
    PrimaryColumn,
} from "typeorm";

@DbEntity('properties')
export default class SqlProperties {
    @PrimaryColumn({ type: 'varchar', length: 255, nullable: false, unique: true })
    public key: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    public value: string;

    @Column({type: 'boolean', default: false, nullable: false})
    public readonly: boolean;
}
