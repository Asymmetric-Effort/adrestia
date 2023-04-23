import express, {Request, Response} from "express";
import Database from './database';

class HealthCheck {
    fetch(req: Request, res: Response): void {
        res.send(200);
    }
}

class ApiReference {
    fetch(req: Request, res: Response): void {
        res.send(200);
    }

    create(req: Request, res: Response): void {
        res.send(200);
    }

    update(req: Request, res: Response): void {
        res.send(200);
    }

    delete(req: Request, res: Response): void {
        res.send(200);
    }
}

class ApiEntityReference {
    fetch(req: Request, res: Response): void {
        res.send(200);
    }

    create(req: Request, res: Response): void {
        res.send(200);
    }

    update(req: Request, res: Response): void {
        res.send(200);
    }

    delete(req: Request, res: Response): void {
        res.send(200);
    }
}


const api_prefix: string = "/api/v1/";
const api_port: number = 3000;

class ServiceCatalog {
    public constructor() {

        const db: Database = new Database();
        db.connect().then(() => {
            console.log("Database connected");
            const app = express();

            console.log("Create API routes");
            {
                app.get(`${api_prefix}/health`, (new HealthCheck()).fetch);
            }
            {
                const uri: string = `${api_prefix}/reference`;
                app.get(uri, (new ApiReference()).fetch);
                app.put(uri, (new ApiReference()).create);
                app.post(uri, (new ApiReference()).update);
                app.delete(uri, (new ApiReference()).delete);
            }

            {
                const uri: string = `${api_prefix}/reference/attach`;
                app.get(uri, (new ApiEntityReference()).fetch);
                app.put(uri, (new ApiEntityReference()).create);
                app.post(uri, (new ApiEntityReference()).update);
                app.delete(uri, (new ApiEntityReference()).delete);
            }

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






