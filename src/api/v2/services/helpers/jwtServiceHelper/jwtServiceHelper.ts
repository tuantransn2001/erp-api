import * as jwt from "jsonwebtoken";
import env from "../../../constants/env";
import { Falsy, JwtPayload, ObjectType } from "../../../common/types/common";
export class JwtServiceHelper {
  private static secretKey: string = `${env.jwtSecretKey}`;

  public static generateToken(payload: ObjectType<any>) {
    const tokenData = jwt.sign(payload, JwtServiceHelper.secretKey, {
      expiresIn: env.tokenExp,
    });

    return { expiredIn: env.tokenExp, access_token: tokenData };
  }
  public static verifyToken(access_token: string): JwtPayload | Falsy {
    const verifyResult = jwt.verify(
      access_token,
      JwtServiceHelper.secretKey
    ) as JwtPayload;

    return verifyResult ? verifyResult : false;
  }
}
