

import { Router } from "express";
import { ConfirmEmailService, DeleteAccountService, ListUsersService, LogoutService, RefreshTokenService, SignInService, SignUpService, SignUpServiceGmail, UpdateAccountService, UploadProfileService } from "./Services/user.service.js";
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js";
import { authorizationMiddleware } from "../../Middleware/authorization.middleware.js";
import { Privillages } from "../../Common/enums/user.enum.js";
import { sign } from "node:crypto";
import { SignUpSchema } from "../../Validators/Schemas/uaer.schema.js";
import { validationMiddleware } from "../../Middleware/validation.middleware.js";
import multer from "multer";
import { localUpload } from "../../Middleware/multer.middlewre.js";

const router=Router();

router.post('/register',validationMiddleware(SignUpSchema),SignUpService)
router.post('/login',SignInService)
router.put('/update',authenticationMiddleware,UpdateAccountService)
router.delete('/delete',authenticationMiddleware,DeleteAccountService)
router.post('/refresh-token',RefreshTokenService);
router.put('/Confirm',ConfirmEmailService)
router.post('/Logout',LogoutService)
router.post('/upload-profile',localUpload().single('profile'),UploadProfileService);

router.get('/list',
    authenticationMiddleware,
    authorizationMiddleware(Privillages.ADMINS),ListUsersService
);
router.post('/signup-gmail',
    validationMiddleware(SignUpSchema),SignUpServiceGmail
);


export default router