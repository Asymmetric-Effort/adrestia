import {
    Entity as DbEntity,
    ManyToOne,
    Unique
} from 'typeorm';
import sqlPersons from './person';
import sqlTeam from './team';

@DbEntity('team_association')
@Unique(['person','team'])
export class sqlTeamAssociation {
    @ManyToOne(() => sqlPersons, { primary: true, onDelete: null })
    person: sqlPersons;

    @ManyToOne(() => sqlTeam, { primary: true, onDelete: null })
    team: sqlTeam;
}

// class TeamAssociationApiHandler {
//     private router = express.Router();
//     private db: Database;
//
//     constructor(db: Database) {
//         this.db = db;
//         this.setupRoutes();
//     }
//
//     private setupRoutes() {
//         this.router.get('/', this.getAllTeamAssociations);
//         this.router.post('/', this.createTeamAssociation);
//     }
//
//     getAllTeamAssociations = async (req: Request, res: Response) => {
//         const teamAssociations = await this.db.teamAssociationRepository.find();
//         res.json(teamAssociations);
//     }
//
//     createTeamAssociation = async (req: Request, res: Response) => {
//         const teamAssociation = this.db.teamAssociationRepository.create(req.body);
//         await this.db.teamAssociationRepository.save(teamAssociation);
//         res.json(teamAssociation);
//     }
//
//     getRouter() {
//         return this.router;
//     }
// }
