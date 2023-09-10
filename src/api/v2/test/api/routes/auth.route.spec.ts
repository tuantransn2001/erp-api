import axios, { AxiosError } from "axios";
import request from "supertest";
import { appTest } from "../../helpers/app";
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
      STATUS_CODE.OK,
    ],
    [
      "phone does not exist before should return status code 404",
      {
        phone: "in correct phone",
        password: env.account.admin.password,
      },
      STATUS_CODE.NOT_FOUND,
    ],
    [
      "correct phone and password in-correct should return status code 401",
      {
        phone: env.account.admin.phone,
        password: "in correct password",
      },
      STATUS_CODE.UNAUTHORIZED,
    ],
  ])("%s", async (_, input, result) => {
    const received = input;

    const expected = result;

    await request(appTest)
      .post("/api/auth/login")
      .send(received)
      .then((res) => {
        expect(res.status).toEqual(expected);
      })
      .catch((err: Error | AxiosError) => {
        if (axios.isAxiosError(err)) {
          expect(err.response?.status).toEqual(
            STATUS_CODE.INTERNAL_SERVER_ERROR
          );
        }
      });
  });
});
