import express from 'express';
import webUser from '../controllers/userConrtollers.js';
import portfolioData from "../controllers/portfolioDataControllers.js";
import {displayUserdata} from "../controllers/portfolioDataControllers.js";
import{ myLogger,verifyToken,myErrorHandler} from '../middlewares/route.js';
const router = express.Router();

// protected route
router.get('/datadashboard', myLogger, verifyToken);
router.get('/',myErrorHandler);

// authentication site route

router.get('/',webUser.homePage);
router.get('/login',webUser.loginPage);
router.post('/login',webUser.userLogin);
router.get('/ragistration',webUser.rsPage);
router.post('/ragistration',webUser.submitData);
router.get('/dashboard',webUser.dsPage);
router.get('/datadashboard',webUser.dataDsPage);
router.get('/edit/:id',webUser.editUsers);
router.post('/update/:id',webUser.updateUser);
router.post('/delete/:id',webUser.deleteUser);
router.get('/logout/:id',webUser.logoutUser);

// Portfolio site route

router.post("/submitform",portfolioData);
router.get("/hiddenroute",displayUserdata);


export default router;