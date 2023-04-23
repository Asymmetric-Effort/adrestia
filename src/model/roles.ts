import {
    Entity as DbEntity,
    Column,
    PrimaryGeneratedColumn
} from 'typeorm';

@DbEntity('roles')
export class sqlRole {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 255, nullable: false, unique: true})
    name: string;

    @Column({type: 'boolean', nullable: false, default: false})
    admin: boolean;

    @Column({type: 'boolean', nullable: false, name: 'create_entity', default: false})
    createEntity: boolean;

    @Column({type: 'boolean', nullable: false, name: 'delete_entity', default: false})
    deleteEntity: boolean;

    @Column({type: 'boolean', nullable: false, name: 'view_entity', default: false})
    viewEntity: boolean;

    @Column({type: 'boolean', nullable: false, name: 'create_dependency', default: false})
    createDependency: boolean;

    @Column({type: 'boolean', nullable: false, name: 'delete_dependency', default: false})
    deleteDependency: boolean;

    @Column({type: 'boolean', nullable: false, name: 'view_dependency', default: false})
    viewDependency: boolean;

    @Column({type: 'boolean', nullable: false, name: 'create_entity_type', default: false})
    createEntityType: boolean;

    @Column({type: 'boolean', nullable: false, name: 'delete_entity_type', default: false})
    deleteEntityType: boolean;

    @Column({type: 'boolean', nullable: false, name: 'view_entity_type', default: false})
    viewEntityType: boolean;

    @Column({type: 'boolean', nullable: false, name: 'attach_reference', default: false})
    attachReference: boolean;

    @Column({type: 'boolean', nullable: false, name: 'create_reference', default: false})
    createReference: boolean;

    @Column({type: 'boolean', nullable: false, name: 'delete_reference', default: false})
    deleteReference: boolean;

    @Column({type: 'boolean', nullable: false, name: 'view_reference', default: false})
    viewReference: boolean;

    @Column({type: 'boolean', nullable: false, name: 'view_history', default: false})
    viewHistory: boolean;

    @Column({type: 'boolean', nullable: false, name: 'create_change', default: false})
    createChange: boolean;

    @Column({type: 'boolean', nullable: false, name: 'view_change', default: false})
    viewChange: boolean;

    @Column({type: 'boolean', nullable: false, name: 'attach_entity_tag', default: false})
    attachEntityTag: boolean;

    @Column({type: 'boolean', nullable: false, name: 'create_tag', default: false})
    createTag: boolean;

    @Column({type: 'boolean', nullable: false, name: 'delete_tag', default: false})
    deleteTag: boolean;

    @Column({type: 'boolean', nullable: false, name: 'view_tag', default: false})
    viewTag: boolean;
}
