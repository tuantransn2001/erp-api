import axios, { AxiosError } from "axios";
import request from "supertest";
import { app } from "../../../app";
import env from "../../../constants/env";
import { STATUS_CODE } from "../../../ts/enums/api_enums";
describe("Test login route", () => {
  test.each([
    [
      "phone and password is correct should return status code 200",
      {
        phone: env.account.admin.phone,
        password: env.account.admin.password,
      },
      STATUS_CODE.STATUS_CODE_200,
    ],
    [
      "phone does not exist before should return status code 404",
      {
        phone: "in correct phone",
        password: env.account.admin.password,
      },
      STATUS_CODE.STATUS_CODE_404,
    ],
    [
      "correct phone and password in-correct should return status code 401",
      {
        phone: env.account.admin.phone,
        password: "in correct password",
      },
      STATUS_CODE.STATUS_CODE_401,
    ],
  ])("%s", async (_, input, result) => {
    const received = input;

    const expected = result;

    await request(app)
      .post("/api/auth/login")
      .send(received)
      .then((res) => {
        expect(res.status).toEqual(expected);
      })
      .catch((err: Error | AxiosError) => {
        if (axios.isAxiosError(err)) {
          expect(err.response?.status).toEqual(STATUS_CODE.STATUS_CODE_500);
        }
      });
  });
});
