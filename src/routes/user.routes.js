import {Router} from "express";
import { changeCurrentPassword, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/register",upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]),  registerUser)

router.post("/login", loginUser);

//secured Routes
router.post("/logout", verifyJWT, logoutUser);


router.post("/refresh-token", refreshAccessToken);

//password change
router.post("/pc", verifyJWT, changeCurrentPassword);

export default router;