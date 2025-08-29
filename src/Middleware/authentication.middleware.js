import BlackListedTokens from "../DB/Models/black-listed-tokens.model.js"
import User from "../DB/Models/user.model.js"
import { verifyToken } from "../Utils/tokens.utils.js"

export const authenticationMiddleware = async (req, res, next) => {
    const { accesstoken } = req.headers
    if (!accesstoken) return res.status(400).json({ message: "Please provide an access token" })

    const decodedData = verifyToken(accesstoken, process.env.JWT_ACCESS_SECRET)
    if (!decodedData?.jti) {
        return res.status(401).json({ message: "Invalid token" })
    }

    const blackListedToken = await BlackListedTokens.findOne({ tokenId: decodedData.jti })
    if (blackListedToken) {
        return res.status(401).json({ message: "Token is blacklisted" })
    }

    const user = await User.findById(decodedData?._id,'password').lean()
    user.role='admin'
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    req.loggedInUser = {user,token:{tokenId:decodedData.jti,expirationDate:decodedData.exp}}
    next()
}
