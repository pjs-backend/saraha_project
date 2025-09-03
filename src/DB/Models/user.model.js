
import mongoose from "mongoose";
import { GenderEnum, ProvidersEnum, RolesEnum } from "../../Common/enums/user.enum.js";
// import { GoogleAuth } from "google-auth-library";
// import { Profiler } from "react";

const userScema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,
        lowercase: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,
        lowercase: true,
        trim: true
    },
    age: {
  type: Number,
  required: true,
  min: 1,
  max: 120,
  index: true
},
    gender: {
        type: String,
        // enum: ['male', 'female'],
         enum:Object.values(GenderEnum),
        default: GenderEnum.MALE

    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true,
            name: 'idx_email_unique'
        }
    },
    // password: {
    //     type: String,
    //     unique: true,
    //     set(value) {
    //         const randomValue = Math.random()
    //         return value + randomValue

    //     }
    // },
    password: {
      type: String,
      required: true, 
    },
    phoneNumber: {
        type: String,
        required: true
    },
    otps: {
        confirmation: String,
        resetPassword: String
    },
    isConfirmed:{
        type:Boolean,  
        default:false
    },
    role:{
        type:String,
        // enum:["user","admin"],
          enum:Object.values(RolesEnum),
        default:RolesEnum.USER

    },
     provider: {
    type: String,
    enum: Object.values(ProvidersEnum),
    default: ProvidersEnum.LOCAL
  },
  GoogleSub:String,
  ProfilePicture:String,

},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        virtuals: {
            fullName: {
                get() {
                    return `${this.firstName} ${this.lastName}`
                }
            }
        },
        methods: {
            getFullName() {
                return `${this.firstName} ${this.lastName}`
            },
            getDouleAge() {
                return this.age * 2
            }
        }
    })


userScema.index({ firstName: 1, lastName: 1 }, { name: 'idx_first_last_unique', unique: true })
userScema.virtual("Message",{
    ref:"Messages",
    localField:"_id",
    foreignField:"receiverId"
})
const user = mongoose.model("user", userScema)
export default user