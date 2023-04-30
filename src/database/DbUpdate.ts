import DbRead from "./DbRead";
import emitMetric from "../observability/emitMetric";
import {getRepository, Repository} from "typeorm";

export default class DbUpdate extends DbRead {
    public constructor() {
        super();
    }

    public async update(tbl: any, criteria: any, newRecord: any): Promise<any> {
        const repo: Repository<typeof tbl> = getRepository(tbl);
        const record = await repo.findOne(criteria).then((r: (typeof tbl)) => {
            return r
        }).catch((e) => {
            emitMetric('application.database', 0, ['operation:update', 'status:error', `error:'${e}'`]);
            throw Error(e);
        }).finally();

        console.log("initial state")
        console.log(`original: ${JSON.stringify(record)}`)
        console.log(`     new: ${JSON.stringify(newRecord)}`)

        Object.keys(record).forEach((key) => {
            record[key] = newRecord[key];
        });
        console.log("final state")
        console.log(`original: ${JSON.stringify(record)}`)
        console.log(`     new: ${JSON.stringify(newRecord)}`)
        repo.save(record).then(()=>{
            console.log("record allegedly saved.")
            this.invalidateCache();
            emitMetric('application.database', 1, ['operation:update', 'status:ok']);
        }).catch((e)=>{
            throw e;
        });
    }
}
