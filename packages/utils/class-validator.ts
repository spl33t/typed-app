import { validate } from "class-validator";

export async function validateClassByValues(object: Record<any, any>, values: Record<any, any>) {
  for (const key in values) {
    object[key] = values[key]
  }
  return  await validate(object)
}