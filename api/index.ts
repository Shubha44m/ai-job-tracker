import app from '../server/src/app';

export default async (req: any, res: any) => {
    await app.ready();
    app(req, res);
};
