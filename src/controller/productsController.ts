
import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../services/productsServices";
import type { Products } from "../types/productsType";
import { parseBody } from "../utility/parseBody";
import { sendResponse } from "../utility/sendResponse";

export const productsController = async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method;

    const urlParts = url?.split("/");
    const id = urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null;
    // GET all products
    if (url === "/products" && method === "GET") {
        try {
            const products = readProduct();
            sendResponse(res, 200, true, "All products retrieved successfully!", products);
        } catch (error) {
            sendResponse(res, 500, false, "Something went wrong!", error);
        }
    }
    // GET single product
    else if (method === "GET" && id !== null) {
        try {
            const products = readProduct();
            const product = products.find((p: Products) => p.id === id);
            if (!product) {
                sendResponse(res, 404, false, "No product found!", product);
            };
            sendResponse(res, 200, true, "Product retrieved successfully!", product);
        } catch (error) {
            sendResponse(res, 500, false, "Something went wrong!", error);
        }
    }
    // POST product
    else if (method === "POST" && url === "/products") {
        try {
            const body = await parseBody(req);
            const products = readProduct();
            const newProduct = {
                id: Date.now(),
                ...body,
            }
            products.push(newProduct);
            insertProduct(products);
            sendResponse(res, 200, true, "Product posted successfully.", newProduct);
        } catch (error) {
            sendResponse(res, 500, false, "Something went wrong!", error);
        }
    }
    // PUT method
    else if (method === "PUT" && id !== null) {
        try {
            const body = await parseBody(req);
            const products = readProduct();
            const index = products.findIndex((p: Products) => p.id === id);
            if (index < 0) {
                sendResponse(res, 404, false, "Product not found.", "not available")
            }
            products[index] = { id: products[index].id, ...body };
            insertProduct(products);
            sendResponse(res, 200, true, "Product updated successfully.", products[index]);
        } catch (error) {
            sendResponse(res, 500, false, "Something went wrong!", error);
        }
    }
    // DELETE method
    else if (method === "DELETE" && id !== null) {
        try {
            const body = await parseBody(req);
            const products = readProduct();
            const index = products.findIndex((p: Products) => p.id === id);
            if (index < 0) {
                sendResponse(res, 404, false, "Product not found.", "not available")
            }
            products.splice(index, 1);
            insertProduct(products);
            sendResponse(res, 200, true, "Product deleted successfully.", products);
        } catch (error) {
            sendResponse(res, 500, false, "Something went wrong!", error);
        }
    }
}