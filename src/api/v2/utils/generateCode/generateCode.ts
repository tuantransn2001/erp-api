import { randomStringByCharsetAndLength } from "../../common";

export const handleGenerateRandomCode = () =>
  randomStringByCharsetAndLength("alphabetic", 5, true) +
  randomStringByCharsetAndLength("numeric", 2, true);
