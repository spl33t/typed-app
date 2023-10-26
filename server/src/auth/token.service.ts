import { HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { HttpException } from "@nestjs/common"

const secretJwtToken = "ABCDEFGHIJKLMNOPQRSTUVWXYZabc"

type JwtUserDataPayload = {
  login: string
}

@Injectable()
export class TokenService {
  constructor() {}

  sign(payload: JwtUserDataPayload): { token: string } {
    const token = jwt.sign(
      payload,
      secretJwtToken,
      {
        expiresIn: 300, // 5 minutes
      },
    );

    return { token };
  }

  async verify(token: string): Promise<jwt.JwtPayload | string> {
    return new Promise((res, rej) => {
      jwt.verify(
        token,
        secretJwtToken,
        (error, decoded) => {
          if (error) {
            rej(new HttpException(error.message, HttpStatus.UNAUTHORIZED));
          }
          res(decoded);
        });
    });
  }

  decode(token: string): jwt.JwtPayload | string {
    return jwt.decode(token);
  }
}