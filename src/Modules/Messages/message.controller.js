

import { Router } from "express";
import { getMessagesService, sendMessageService } from "./Services/message.service.js";
const router=Router();

router.post('/send/:receiverId',sendMessageService)
router.post('/',getMessagesService)
export default router