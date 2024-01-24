import { Request, Response, NextFunction } from "express";
import { isEmpty } from "../common/helper";
import { AuthenticateMiddleware, ErrorCatcher } from "../middlewares";
import HttpException from "../utils/exceptions/http.exception";

class APIGateWay {
  private static excludeRoute: string[] = ["login", "health"];

  public static getFullURL(req: Request) {
    return req.protocol + "://" + req.get("host") + req.originalUrl;
  }
  public static handleUseGlobalMiddleware(
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const middlewares: any[] = [];
      // ? Handle Use Global Middleware
      // * ==============================
      // * error catcher
      // * ==============================
      middlewares.push(ErrorCatcher(error, req, res));

      // * ==============================
      // * Case authenticate exclude auth
      // * ==============================
      const isLoginRequest = APIGateWay.getFullURL(req)
        .split("/")
        .some((r) => APIGateWay.excludeRoute.indexOf(r) >= 0);

      if (!isLoginRequest) {
        middlewares.push(AuthenticateMiddleware(req, res, next));
      }

      const shouldSendRequestToServer = isEmpty(middlewares);

      return shouldSendRequestToServer ? next() : middlewares;
    } catch (err) {
      return next(err);
    }
  }
}
export default APIGateWay;
