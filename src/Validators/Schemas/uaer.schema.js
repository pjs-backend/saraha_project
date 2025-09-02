import Joi from "joi";
import { isValidObjectId } from "mongoose";
import { GenderEnum } from "../../Common/enums/user.enum.js";

// enum محلي لمستوى المهارات
const SkillLevelEnum = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced"
};

// skills names
const Names = ["js", "python", "cpp", "ML"];

export const SignUpSchema = {
  body: Joi.object({
    firstName: Joi.string().alphanum().required().messages({
      "string.base": "first name must be a string",
      "any.required": "first name is required",
      "string.alphanum": "first name must contain only letters and numbers",
    }),
    lastName: Joi.string().min(3).max(20).required(),
    email: Joi.string()
      .email({
        tlds: { allow: false }, // أي TLD
        minDomainSegments: 2,
      })
      .required(),
    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/)
      .required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")),
    gender: Joi.string().valid(...Object.values(GenderEnum)).optional(),
    phoneNumber: Joi.string().required(),

    minAge: Joi.number().greater(18).required(),
    maxAge: Joi.number().less(100).required(),
    age: Joi.number().greater(Joi.ref("minAge")).less(Joi.ref("maxAge")).required(),

    isConfirmed: Joi.boolean().truthy("yes").falsy("no").sensitive(),

    testArray: Joi.array().ordered(Joi.string(), Joi.number()).required(),

    skills: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().valid(...Names).required(),
          level: Joi.string().valid(...Object.values(SkillLevelEnum)).required(),
        })
      )
      .length(2)
      .required(),
  }),
};
