import bcrypt, { compareSync } from 'bcrypt';
import userModel from '../../../DB/Models/user.model.js';
import { emitter } from '../../../Utils/send-email.ulils.js';
import { nanoid } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';
import { generateToken, verifyToken } from '../../../Utils/tokens.utils.js';
import BlackListedTokens from '../../../DB/Models/black-listed-tokens.model.js';
// import { use } from 'react';


export const SignUpService = async (req, res, next) => {

  const { firstName, lastName, email, password, age, gender, phoneNumber } = req.body;

  const isEmailExist = await userModel.findOne({ email });
  if (isEmailExist) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const confirmationOtp = nanoid(6);

  const newUser = await userModel.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    age,
    gender,
    phoneNumber,
    otps: { confirmation: confirmationOtp }
  });

  emitter.emit('sendEmail', {
    to: email,
    subject: 'Email Confirmation',
    content: `<h2>Welcome ${firstName}!</h2>
                <p>Your confirmation code is: <b>${confirmationOtp}</b></p>`
  });

  return res.status(201).json({ message: 'User registered successfully, check your email for confirmation code', userId: newUser });
};

export const SignInService = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  console.log("All users in DB:", user);
  if (!user) {
    return res.status(404).json({ message: "Invalid email or password" });
  }

  const isPasswordMatch = compareSync(password, user.password);
  if (!isPasswordMatch) {
    return res.status(404).json({ message: "Invalid email or password" });
  }

  const accessToken = generateToken(
    { _id: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "1h",
      jwtid: uuidv4()
    }
  )

  const refreshToken = generateToken(
  { _id: user._id, email: user.email },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN, jwtid: uuidv4() }
);

  const userData = user.toObject();
  delete userData.password;

  return res.status(200).json({
    message: "User signed in successfully",
    user: userData,
    accessToken
  });
};

export const ConfirmEmailService = async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await userModel.findOne({ email, isConfirmed: false });
  if (!user) {
    return next(new Error('User not found or already confirmed', { cause: 400 }))
  }

  const isOtpMatched = otp === user.otps?.confirmation;
  if (!isOtpMatched) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  user.isConfirmed = true;
  user.otps.confirmation = undefined;

  await user.save();

  res.status(200).json({ message: "Confirmed" });
}

export const DeleteAccountService = async (req, res) => {
  

  
    const { _id } = req.loggedInUser

    const deletedUser = await userModel.findByIdAndDelete(_id)
    if (!deletedUser) {
        return res.status(404).json({ message: "User not found" })
    }

    await Messages.deleteMany({receiverId:_id})

    return res.status(200).json({ message: "User deleted successfully", deletedUser })
}

// export const DeleteAccountService = async (req, res) => {
//   // start session
//   const session = await mongoose.startSession();
//   try {
//     const { _id } = req.loggedInUser;

//     // start transaction
//     session.startTransaction();

//     const deletedUser = await User.findByIdAndDelete(_id, { session });
//     if (!deletedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     await Messages.deleteMany({ receiverId: _id }, { session });

//     // commit transaction
//     await session.commitTransaction();
//     session.endSession();
//     console.log("The transaction is commited");

//     return res
//       .status(200)
//       .json({ message: "User deleted successfully", deletedUser });
//   } catch (error) {
//     // abort transaction
//     await session.abortTransaction();
//     session.endSession();
//     console.log("The transaction is aborted");

//     return res.status(500).json({ message: "User not deleted" });
//   }
// };


export const UpdateAccountService = async (req, res) => {
  const {_id} = req.loggedInUser
  const { firstName, lastName, email, age, gender } = req.body;

  const updatedUser = await userModel.findByIdAndUpdate(
    _id,
    { firstName, lastName, email, age, gender },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ message: "User updated successfully", user: updatedUser });
};

// list

// export const userData = async (req, res, next) => {
//   try {
//     const { userId } = req.token; 

//     const user = await userModel.findById(userId); 

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const userData = user.toObject();
//     delete userData.password;

//     return res.status(200).json({ user: userData });
//   } catch (error) {
//     next(error); 
//   }
// };


export const LogoutService = async (req, res) => {
  // const { accesstoken } = req.headers;

  // const decodedData = verifyToken(accesstoken, process.env.JWT_ACCESS_SECRET);

  const {token:{tokenId,expirationDate},user:{_id}}=req.loggedInUser

  // const expirationDate = new Date(decodedData.exp * 1000);

  await BlackListedTokens.create({
    tokenId,
    expirationDate : new Date(decodedData.exp * 1000),
   userId:  _id
  });

  return res.status(200).json({ message: "User logged out successfully" });
};


export const RefreshTokenService = async (req,res)=>{

  const {refreshToken} = req.headers;

  const decodedData = verifyToken(refreshToken,process.env.JWT_REFRESH_SECRET)

  const accessToken = generateToken(
    {
      _id:decodedData._id , 
      email:decodedData.email
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
      jwtid:uuidv4() 
    }
  )

  return res.status(200).json({message:"User token is refreshed successfully" , accessToken})
}
