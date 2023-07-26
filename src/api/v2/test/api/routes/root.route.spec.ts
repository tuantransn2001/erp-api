import axios, { AxiosError } from "axios";
import request from "supertest";
import { app } from "../../../app";
describe("The root route", () => {
  it("should get response status 200", (done) => {
    request(app)
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
