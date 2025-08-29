import Messages from "../../../DB/Models/messages.model.js"

import User from "../../../DB/Models/user.model.js";
export const sendMessageService=async(req,res)=>{
    const {content}=req.body
    const {receiverId}=req.params

    const user = await User.findById(receiverId)
    if(!user){
        return res.this.status(404).json({message:"User not found"})
    }

    const message=new Messages({
        content,
        receiverId
    })
    await message.save()
    return res.status(200).json({message:"message sent successfully",message})

}


export const getMessagesService = async(req,res)=>{
    const messages = await Messages.find().populate([
        {
        path:"receiverId",
        select:"firstName lastName"
        // كده مش ايجيب غير الاتنين دول بس 
        }
    ])
    return res.status(200).json({messages})
}