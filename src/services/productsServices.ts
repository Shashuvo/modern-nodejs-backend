import * as path from "path";
import fs from "fs";


const filePath = path.join(process.cwd(), "src/database/db.json")

export const readProduct = () => {
    const products = fs.readFileSync(filePath, "utf-8"); //utf-8 will convert buffer into human readable
    console.log(products);
    return JSON.parse(products);
}