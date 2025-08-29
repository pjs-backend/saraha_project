
import Joi from "joi";
import { isValidObjectId } from "mongoose";


// function objectidValidation (value,hlper){
//   return isValidObjectId(value)?value:hlper.message('invalid object id')
// }
export const SignUpSchema = {
  body: Joi.object({
    firstName: Joi.string().alphanum().required().messages({
      'string.base':'first name must be a string',
      'any.required':'first name is required',
      'string.alphanum':'first name must contain only letters and numbers',
    }),
    lastName: Joi.string().min(3).max(20).required(),
     email: Joi.string()
      .email({
        // تقدر تحدد ال TLDs اللي مسموح أو ممنوع استخدامها
        tlds: {
          // allow: ["com", "net", "org"],
          // deny: ["com", "net", "org"],
        },
        minDomainSegments: 2, // يعني لازم يبقى فيه حاجة زي name@domain.com
        // multiple: true,       // يقبل أكتر من إيميل مفصول بـ ","
        // separator: "#",       // لو multiple true، الإيميلات تتفصل بـ #
      })
      .required(),
    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/)
      .required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")),
    gender: Joi.string().valid(...Object.values(GenderEnum)).optional(),
    // age: Joi.number().required(),
    phoneNumber: Joi.string().required(),
     minAge: Joi.number().greater(18).required(), // لازم > 18
    maxAge: Joi.number().less(100).required(),   // لازم < 100
    age: Joi.number().greater(Joi.ref("minAge")).less(Joi.ref("maxAge")).required(),

    // Boolean بقيمة truthy أو falsy
    isConfirmed: Joi.boolean().truthy("yes").falsy("no").sensitive(),
        testArray: Joi.array().ordered(Joi.string(), Joi.number()).required(),

    skills: Joi.array().items(
      Joi.object({
        name: Joi.string().valid(...Names).required(),
        level: Joi.string().valid(...Object.values(SkillLevelEnum)).required()
      })
    ).length(2).required(),
    //   userId:Joi.custom(objectidValidation).required(),

    // couponType: Joi.string().valid('fixed', 'percentage'),

    // couponAmount: Joi.when('couponType', {
    //   is: Joi.string().valid('percentage'),
    //   then: Joi.number().max(100),
    //   otherwise: Joi.number().positive(),
    // })

  })
}


const Names = [
  'js',
  'python',
  'cpp',
  'ML',
]

const skills=[
  {
    name:"js",
    level:sj
  }
]
