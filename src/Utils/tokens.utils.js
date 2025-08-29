// Generate

import jwt from "jsonwebtoken";

export const generateToken = (payload, secret, options) => {
    return jwt.sign(payload, secret, options);
}

// Verify
export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
}
