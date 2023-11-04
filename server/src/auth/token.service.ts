import { Injectable } from '@nestjs/common';
import * as jwt from "jsonwebtoken";

class JwtPayload {
  id: number
  login: string

  constructor(id: number, login: string) {
    this.id = id
    this.login = login
  }
}

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "qwe"
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "1d"

@Injectable()
export class TokenService {

  sign(payload: JwtPayload): string {
    return jwt.sign(
      { ...payload },
      JWT_ACCESS_SECRET,
      {
        expiresIn: JWT_ACCESS_EXPIRES_IN,
      },
    )
  }

  async verify(token: string): Promise<JwtPayload | undefined> {
    try {
      return await jwt.verify(token, JWT_ACCESS_SECRET)  as JwtPayload
    } catch (err) {
      console.log(err)
    }
  }
}
