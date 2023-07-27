import axios, { AxiosError } from "axios";
import request from "supertest";
import { appTest } from "../../helpers/app/";
describe("The root route", () => {
  it("should get response status 200", (done) => {
    request(appTest)
      .get("/api")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      })
      .catch((err: Error | AxiosError) => {
        if (axios.isAxiosError(err)) {
          expect(err.response?.status).toEqual(500);
        }
      });
  });
});
