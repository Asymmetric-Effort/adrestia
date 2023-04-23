import {
    Entity as DbEntity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import sqlNoteSet from './note-set';

@DbEntity('references')
export default class sqlReference {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;

    @ManyToOne(() => sqlNoteSet, { nullable: true })
    @JoinColumn({ name: 'notes' })
    notes: sqlNoteSet;

    @Column({ type: 'varchar', length: 255, nullable: false})
    name: string;

    @Column({ type: 'text', nullable: false })
    link: string;
}