import express from "express";
import cors from "cors";

export default class Server {
    #app;
    #host;
    #port;
    #router;
    #server;
    
    getApp () {
        return this.#app;
    }
    
    constructor(port, host, router) {
        this.#app = express();
        this.#port = port;
        this.#host = host;
        this.#server = null;
        this.#router = router;
    }
    
    start() {
        this.#server = this.#app.listen(this.#port, this.#host, () => {
            console.log(`Server is listening on http://${this.#host}:${this.#port}`);
        });
        
        this.#app.use(cors());
        this.#app.use(express.json())
        this.#app.use(this.#router.getPathRoot(), this.#router.getRouter());
    }
    
    close() {
        this.#server?.close();
    }
}
