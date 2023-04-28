import express, {Request, Response} from "express";
import Database from './database/database';
import apiHealthCheck from './api/apiHealthCheck';
import apiProperties from './api/apiProperties';


const api_prefix: string = "/api/v1";
const api_port: number = 3000;

class ServiceCatalog {
    public constructor() {

        const db: Database = new Database();
        db.connect().then(() => {
            console.log("Database connected");
            const app = express();
            app.use(express.json());

            console.log("Create API routes");
            {
                const uri: string = `${api_prefix}/health`;
                const api = new apiHealthCheck(db);
                app.get(uri, api.fetch);
                app.put(uri, api.create);
                app.post(uri, api.update);
                app.delete(uri, api.delete);
            }
            {
                const uri: string = `${api_prefix}/properties`;
                const api = new apiProperties(db);
                app.get(uri, api.fetch);
                app.put(uri, api.create);
                app.post(uri, api.update);
                app.delete(uri, api.delete);
            }
            // {
            //     const uri: string = `${api_prefix}/reference/attach`;
            //     app.get(uri, (new ApiEntityReference()).fetch);
            //     app.put(uri, (new ApiEntityReference()).create);
            //     app.post(uri, (new ApiEntityReference()).update);
            //     app.delete(uri, (new ApiEntityReference()).delete);
            // }

            console.log("Application Starting.")
            app.listen(api_port, () => {
                console.log(`Server listening on port ${api_port}`);
            });
        }).catch((error) => {
            console.log(error);
        });
    }
}

/*
 * Run the app
 */
const app: ServiceCatalog = new ServiceCatalog();






