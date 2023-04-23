import {
    Entity as DbEntity,
    Column,
    PrimaryGeneratedColumn
} from 'typeorm';

@DbEntity('person')
export default class sqlPerson {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'boolean', default: false})
    deleted: boolean;

    @Column({type: 'varchar', length: 255, unique: true})
    email: String;

    @Column({type: 'varchar', length: 255})
    firstName: String;

    @Column({type: 'varchar', length: 255})
    lastName: String;

}
