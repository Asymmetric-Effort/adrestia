import request from 'supertest';

describe('Test API HealthCheck', () => {
    beforeAll(async () => {
    });

    afterAll(() => {
    });

    it('should check the healthcheckURL and get ok', async () => {
        const apiServer: string = 'http://127.0.0.1:3000';
        const url: string = `/api/v1/health`;

        await request(apiServer)
            .get(url)
            .then((r)=>{
              expect(r.status).toBe(200);
            }).catch((e)=>{
                throw e;
            });
    });
});
