import { IncomingMessage, Server, ServerResponse, createServer } from "http";


const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method;

    if (url === "/" && method === "GET") {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "This is Root Route" }));
    }
    else if (url?.startsWith("/products")) {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "This is Products Route" }));
    }
    else {
        res.writeHead(404, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(5000, () => {
    console.log("Server is running on port 5000.");
});