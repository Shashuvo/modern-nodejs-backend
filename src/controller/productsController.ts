import type { IncomingMessage, ServerResponse } from "http";
import { readProduct } from "../services/productsServices";
import type { Products } from "../types/productsType";

export const productsController = async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method;

    const urlParts = url?.split("/");
    const id = urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null;


    // GET all products
    if (url === "/products" && method === "GET") {
        const products = readProduct();
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({
            message: "This is Products Route",
            data: products
        }));
    }
    // GET single product
    else if(method==="GET" && id !== null){
        const products = readProduct();
        const product = products.find((p : Products)=>p.id === id);
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({
            message: "This is Product Route",
            data: product
        }));
    }
}