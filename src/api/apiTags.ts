import {
    Request,
    Response
} from "express";
import authenticated from "../security/authenticated";
import httpMetrics from "../observability/httpMetrics";
import {userRole} from "../security/userRoles";
import {
    Api,
} from "./Api";
import {Connection as DbConnection} from "typeorm";

export default class apiTags extends Api {

    constructor(db: DbConnection) {
        super(db);
    }

    @httpMetrics('apiTags.create')
    @authenticated(userRole.CreateTags)
    create(req: Request, res: Response) {
        // const property = new sqlTag()
        // try {
        //     property.key = req.body.key?.toString().trim() ?? null;
        //     property.value = req.body.value?.toString().trim() ?? null;
        //     property.deleted = req.body.deleted;
        //     if (isNull(property.key)) {
        //         throw new BadRequest('missing key')
        //     }
        //     if (isNull(property.value)) {
        //         throw new BadRequest('missing value')
        //     }
        //     this.db.create(property).then(() => {
        //         res.send(200).json();
        //     }).catch((error) => {
        //         throw new InternalError(`create failed: ${error}`);
        //     });
        // } catch (error) {
        //     this.handleError(res, error);
        // }
    }

    @httpMetrics('apiTags.read')
    @authenticated(userRole.Any)
    async read(req: Request, res: Response) {
        // /*
        //  * return a list of tags (where not marked 'deleted')
        //  */
        // const result = await this.db.read(sqlTag, req)
        //     .then((r: object[]): object[] => r)
        //     .catch((e) => {
        //         console.log(e);
        //         return {}
        //     })
        // res.json(result);
        // console.log(`returning tags...`)
    }

    @httpMetrics('apiTags.update')
    @authenticated(userRole.CreateTags)
    update(req: Request, res: Response) {
        // try {
        //     const tag = new sqlTag();
        //     tag.value = req.body.value?.toString().trim() ?? null;
        //     tag.key = req.body.key?.toString().trim() ?? null;
        //     if (isNull(tag.value)) {
        //         throw new BadRequest('missing value')
        //     }
        //     if (isNull(tag.key)) {
        //         throw new BadRequest('missing key')
        //     }
        //     console.log("data validated")
        //     this.db.update(tag).then(() => {
        //         console.log(`created property ${tag.key}`)
        //         res.send(200).json();
        //     }).catch((error) => {
        //         throw new InternalError(`create failed: ${error}`);
        //     });
        // } catch (error) {
        //     this.handleError(res, error);
        // }
    }

    @httpMetrics('apiTags.delete')
    @authenticated(userRole.Admin)
    delete(req: Request, res: Response) {
        // const result = this.db.delete(sqlTag, 'key', req);
        // if (result) {
        //     res.send(200).json();
        // } else {
        //     res.send(404).json();
        // }
    }
}