import * as expressValidator from "express-validator";
import jwt from "jsonwebtoken";

export default class AccountMiddleware {
    static authenticateToken = (req, res, next) => {
        let token = req.headers["x-access-token"];

        if (!token) {
            return res.status(401).send({ message: "No token provided" });
        }
        
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err)
                return res.status(401).send({ message: "Token not recognized" });
            console.log(decoded);
            req.userId = decoded.id;
            next();
        });
    }
    
    static validateRegDetails = () => {
        try {
            return [
                expressValidator
                    .body("email")
                    .notEmpty()
                    .isString()
                    .matches(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g)
                    .escape(),
                expressValidator
                    .body("password")
                    .notEmpty()
                    .isString()
                    .escape(),
                AccountMiddleware.handleValidationErrors,
            ];
        } catch (e) {
            console.log(e);
            return [];
        }
    };

    static handleValidationErrors = (req, res, next) => {
        const errors = expressValidator.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    };
}