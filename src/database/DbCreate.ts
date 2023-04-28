import DbUtils from "./DbUtils";
import emitMetric from "../observability/emitMetric";

export default class DbCreate extends DbUtils {
    public constructor() {
        super();
    }

    public async create(tbl: any): Promise<any> {
        return await this.connection.manager.save(tbl).then(()=>{
            emitMetric('application.database',1,['operation:create','status:ok']);
        }).catch((error)=>{
            emitMetric('application.database',1,['operation:create','status:error',`error:${error}`]);
        });
    }
}