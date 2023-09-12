import { Request, Response, NextFunction } from "express";
import { AuthenticateMiddleware } from "../middlewares";

class APIGateWay {
  private static getFullURL(req: Request) {
    return req.protocol + "://" + req.get("host") + req.originalUrl;
  }
  public static handleUseGlobalMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // ? Handle Use Global Middleware
    // * ==============================
    // * Case exclude auth
    // * ==============================
    const isLoginRequest = APIGateWay.getFullURL(req)
      .split("/")
      .some((r) => [""].indexOf(r) >= 0);

    if (!isLoginRequest) {
      return AuthenticateMiddleware(req, res, next);
    }
    return next();
  }
}
export default APIGateWay;
