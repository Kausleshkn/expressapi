import userModel from "../models/userModel.js";
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

const secret_key = process.env.CRYPTOJS_SECRET_KEY;
const jwt_secret_key = process.env.JWT_SECRET_KEY;
let errorMsg;


class webUser {

    static homePage = async (req, res) => {
        res.render('home');
    }

    static loginPage = async (req, res) => {
        res.render('login');
    }

    static userLogin = async (req, res) => {

        try {
            req.session.userId = req.body.pwd;
            const saved_user = await userModel.findOne({ email: req.body.email });

            if (saved_user != null) {
                // Genrating JWT token
                const token = jwt.sign({ userID: saved_user._id }, jwt_secret_key);
                // Set the JWT as a cookie
                res.cookie('token', token, { httpOnly: true });

                const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(req.body), secret_key).toString();
                res.redirect(`/datadashboard?user=${encodeURIComponent(encryptedData)}`);
            } else {
                errorMsg = `!Your email is not found in our database, please`;
                res.render('alertmsg', { nodata: errorMsg });
            }
        } catch (error) {
            errorMsg = `Can't connect with database, Please check your network connection and try again`;
            res.status(401).render('alertmsg', { nodata: errorMsg });
        }
    }

    static dataDsPage = async (req, res) => {

        try {
            const decryptedBytes = CryptoJS.AES.decrypt(req.query.user, secret_key);
            const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
            const { email, pwd } = decryptedData;

            const matchData = await userModel.findOne({ email });

            if (matchData !== null) {

                const decryptedpass = CryptoJS.AES.decrypt(matchData.pwd, secret_key);
                const decryptedUserPass = JSON.parse(decryptedpass.toString(CryptoJS.enc.Utf8));

                if (matchData.email === email && decryptedUserPass === pwd) {
                    res.render('dspage', { matchData })
                } else {
                    errorMsg = "Either email or password is incorrect, Please login with valid Credentials";
                    res.render('alertmsg', { nodata: errorMsg });
                }
            } else {
                errorMsg = `!Your email is not found in our database, please`;
                res.render('alertmsg', { nodata: errorMsg });
            }
        } catch (error) {
            errorMsg = `Can't connect with database, Please check your network connection and try again`;
            res.status(401).render('alertmsg', { nodata: errorMsg });
        }
    }

    static rsPage = async (req, res) => {
        res.render('rs')
    }

    static dsPage = async (req, res) => {
        res.render('dspagemain')
    }

    static submitData = async (req, res) => {

        try {
            const { name, email, pwd, phone, msg } = req.body;

            if (pwd.length >= 5) {

                let regexStr = /^[\p{L}!#-'*+\-/\d=?^-~]+(.[\p{L}!#-'*+\-/\d=?^-~])*@[^@\s]{2,}$/u;
                let phoneStr = /^\d{10}$/;

                if (name.length < 1) {
                    throw new Error("Name is Required,Please Enter it");
                }

                if (regexStr.test(email) === false) {
                    throw new Error("Email is Required,Please Enter Valid Email");
                }

                if (phoneStr.test(phone) === false) {
                    throw new Error("Phone is Required,Please Enter 10 digit Valid Phone number, do not add + or contry code");
                }

                if (msg.length <= 20) {
                    throw new Error("Do not Spam, please enter valid msg, it should be at least 20 charectar long");
                }

                const encryptedPwd = CryptoJS.AES.encrypt(JSON.stringify(pwd), secret_key).toString();
                const userData = new userModel({ name, email, pwd: encryptedPwd, phone, msg })
                await userData.save();
                res.redirect('/login')
            } else {
                throw new Error("Password is required and must be at least five digit");
            }

        } catch (error) {

            if ((error.name === "MongoServerSelectionError") || (error.name === "MongooseError")) {
                errorMsg = `Connection Error, Please check your network connection and try again`;
                res.status(401).render('alertmsg', { nodata: errorMsg });
            } else {
                res.status(401).render('alertmsg', { nodata: error });
            }

        }
    }

    static editUsers = async (req, res) => {
        const referer = req.headers.referer;
        try {
            const userData = await userModel.findById(req.params.id)
            const decryptedBytes = CryptoJS.AES.decrypt(userData.pwd, secret_key);
            const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
            res.render('edit', { userData, decryptedData })
        } catch (error) {
            errorMsg = `Failed to fetch data from database, Please check your network connection and try again`;
            res.status(401).render('alertmsg', { nodata: errorMsg });
        }
    }

    static updateUser = async (req, res) => {

        try {
            if (req.body.signin === 'Update_btn') {
                const { name, email, pwd, phone, msg } = req.body;

                if (pwd.length >= 5) {

                    let regexStr = /^[\p{L}!#-'*+\-/\d=?^-~]+(.[\p{L}!#-'*+\-/\d=?^-~])*@[^@\s]{2,}$/u;
                    let phoneStr = /^\d{10}$/;

                    if (name.length < 1) {
                        throw new Error("Name is Required,Please Enter it");
                    }

                    if (regexStr.test(email) === false) {
                        throw new Error("Email is Required,Please Enter Valid Email");
                    }

                    if (phoneStr.test(phone) === false) {
                        throw new Error("Phone is Required,Please Enter 10 digit Valid Phone number, do not add + or contry code");
                    }

                    if (msg.length <= 20) {
                        throw new Error("Do not Spam, please enter valid msg, it should be at least 20 charectar long");
                    }

                    const encryptedPwd = CryptoJS.AES.encrypt(JSON.stringify(pwd), secret_key).toString();
                    const userData = { name, email, pwd: encryptedPwd, phone, msg };
                    const updateData = await userModel.findByIdAndUpdate(req.params.id, userData);

                    res.cookie('token', '', { expires: new Date(0) });

                    req.session.destroy(err => {
                        if (err) {
                            console.log(err);
                        } else {
                            errorMsg = `*your details are updated, please`;
                            res.render('alertmsg', { nodata: errorMsg });
                        }
                    });
                } else {
                    throw new Error("Password is required and must be at least five digit");
                }
            }
        } catch (error) {

            if ((error.name === "MongoServerSelectionError") || (error.name === "MongooseError")) {
                errorMsg = `Connection Error, Please check your network connection and try again`;
                res.status(401).render('alertmsg', { nodata: errorMsg });
            } else {
                res.status(401).render('alertmsg', { nodata: error });
            }
        }
    }

    static deleteUser = async (req, res) => {


        try {
            await userModel.findByIdAndDelete(req.params.id);
            res.cookie('token', '', { expires: new Date(0) });

            req.session.destroy(err => {
                if (err) {
                    console.log(err);
                } else {
                    res.render('dspagemain');
                }
            });
        } catch (error) {
            errorMsg = `Can't connect with database, Please check your network connection and try again`;
            res.status(401).render('alertmsg', { nodata: errorMsg });
        }
    }

    static logoutUser = async (req, res) => {

        try {

            // Clear the JWT cookie
            res.cookie('token', '', { expires: new Date(0) });

            req.session.destroy(err => {
                if (err) {
                    errorMsg = `Network Error, Please check your network connection and try again`;
                    res.status(401).render('alertmsg', { nodata: errorMsg });
                } else {
                    req.session = null;
                    res.render('dspagemain');
                }
            });

        } catch (error) {
            errorMsg = `Network Error, Please check your network connection and try again`;
            res.status(401).render('alertmsg', { nodata: errorMsg });
        }
    }

}

export default webUser;