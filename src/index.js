import Config from './config/Config.js';
import Server from "./server/Server.js";
import Database from "./database/Database.js";
import AccountRouter from './routers/Account.router.js';
import AccountController from './controllers/Account.controller.js';
import AccountService from './services/Account.service.js';

Config.load();
const { PORT, HOST, DB_URI } = process.env;

const router = new AccountRouter(new AccountController(new AccountService()))

const server = new Server(PORT, HOST, router);
const database = new Database(DB_URI);

server.start();
database.connect();
