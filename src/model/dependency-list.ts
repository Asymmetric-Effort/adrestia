import {
    Entity as DbEntity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import {v4 as uuid} from "uuid";
import sqlEntity from './entity';


@DbEntity('dependency_list')
export default class sqlDependencyList {
    @PrimaryGeneratedColumn("uuid")
    id: string = uuid();

    @ManyToOne(() => sqlEntity)
    @JoinColumn()
    entity: sqlEntity;

    @Column({type: 'boolean', nullable:false, default: false})
    required: boolean;
}