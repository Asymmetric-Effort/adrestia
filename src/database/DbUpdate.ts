import DbRead from "./DbRead";
import emitMetric from "../observability/emitMetric";

export default class DbUpdate extends DbRead {
    public constructor() {
        super();
    }

    public async update(tbl: any): Promise<any> {
        return await this.connection.manager.save(tbl).then(()=>{
            emitMetric('application.database',1,['operation:update','status:ok']);
        }).catch((error)=>{
            emitMetric('application.database',1,['operation:update','status:error',`error:${error}`]);
        });;
    }
}
