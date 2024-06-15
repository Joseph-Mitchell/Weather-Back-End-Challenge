import Config from './config/Config.js';
import Server from "./server/Server.js";
import Database from "./database/Database.js";

Config.load();
const { PORT, HOST, DB_URI } = process.env;

const server = new Server(PORT, HOST, todoRouter);
const database = new Database(DB_URI);

server.start();
database.connect();
