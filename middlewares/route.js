import jwt from "jsonwebtoken";
import {getErrorMessage } from "../db/connectUser.js";

const jwt_secret_key = process.env.JWT_SECRET_KEY;

const myLogger = (req, res, next) => {

    if (req.session.userId) {

        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        next()
    } else {
        res.render('backfun');
    }
}


const verifyToken = (req, res, next) => {

    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, jwt_secret_key, (err, decoded) => {
            if (err) {
                res.status(401).render('Unauthorized');
            } else {
                req.userID = decoded;

                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                next();
            }
        });
    } else {
        res.status(401).render('Unauthorized');
    }
};

const myErrorHandler = (req, res, next) => {
    const errorMessage = getErrorMessage();
    if (errorMessage) {
        res.render('servererror', { serverError: errorMessage });
    } else {
        next();
    }
}

export { myLogger, verifyToken, myErrorHandler };