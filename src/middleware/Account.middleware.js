import * as expressValidator from "express-validator";

export default class AccountMiddleware {
    static validateRegDetails = () => {
        try {
            return [
                expressValidator
                    .body("email")
                    .notEmpty()
                    .isString()
                    .matches(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g)
                    .withMessage("An email is required"),
                expressValidator
                    .body("password")
                    .notEmpty()
                    .isString()
                    .withMessage("A password is required"),
                AccountValidator.handleValidationErrors,
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