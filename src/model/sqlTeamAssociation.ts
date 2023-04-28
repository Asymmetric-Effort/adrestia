import {
    Entity as DbEntity,
    ManyToOne,
    Unique
} from 'typeorm';
import sqlPersons from './person';
import sqlTeam from './sqlTeam';

@DbEntity('team_association')
@Unique(['person','team'])
export default class sqlTeamAssociation {
    @ManyToOne(() => sqlPersons, { primary: true, onDelete: null })
    person: sqlPersons;

    @ManyToOne(() => sqlTeam, { primary: true, onDelete: null })
    team: sqlTeam;
}
