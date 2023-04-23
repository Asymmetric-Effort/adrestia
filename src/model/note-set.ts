import {
    Entity as DbEntity,
    Unique,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn, Column
} from 'typeorm';
import sqlNotes from './notes';

/*
 * Requirements:
 *  - Any entity or other object can have only one note_set.
 *  - Any note_set can reference one or more notes by (noteId)
 */
@DbEntity('note_set')
@Unique(['id', 'noteId'])
export default class sqlNoteSet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'boolean', default: false})
    deleted: boolean;

    @ManyToOne(() => sqlNotes)
    @JoinColumn({name: 'noteId'})
    noteId: sqlNotes;
}
