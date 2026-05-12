import type { IncomingMessage, ServerResponse } from "http";
import { readProduct } from "../services/productsServices";

export const productsController = async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method;
    if (url === "/products" && method === "GET") {
        const products = readProduct();
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({
            message: "This is Products Route",
            data: products
        }));
    }
}