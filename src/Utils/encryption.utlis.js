import crypto from 'node:crypto'

const IV_LENGTH = parseInt(process.env.IV_LENGTH) || 16;
const ENCRYPTION_SECRET_KEY = Buffer.from(process.env.ENCRYPTION_SECRET_KEY);

export const encrypt = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    console.log('IV Generation: ', iv);

    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_SECRET_KEY, iv);
    console.log('Cipher creation result: ', cipher);

    let encryptedData = cipher.update(text, 'utf-8', 'hex');
    console.log('Update cipher result: ', encryptedData);

    encryptedData += cipher.final('hex');
    console.log('Final cipher result: ', encryptedData);

    return `${iv.toString('hex')}:${encryptedData}`; 
}

export const decrypt = (encryptedData) => {
    const [iv, encryptedText] = encryptedData.split(":"); 

    console.log({
        iv,
        encryptedText
    });

    const binaryLikeIv = Buffer.from(iv, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_SECRET_KEY, binaryLikeIv);

    let decryptedData = decipher.update(encryptedText, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');

    return decryptedData;
}
