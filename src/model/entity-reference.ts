import {
    Entity as DbEntity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import sqlReference from './reference';
import sqlEntity from "./entity";

@DbEntity('entity_references')
export default class sqlEntityReferences {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => sqlEntity, {nullable: false})
    @JoinColumn({name: 'id'})
    entityId: string;

    @ManyToOne(() => sqlReference)
    @JoinColumn({name: 'refId'})
    refId: sqlReference;
}
