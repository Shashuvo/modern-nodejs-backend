import { IncomingMessage, Server, ServerResponse, createServer } from "http";
import { routeHandler } from "./routes/route";
import config from "./config";


const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
    routeHandler(req, res);
});

server.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}.`);
});