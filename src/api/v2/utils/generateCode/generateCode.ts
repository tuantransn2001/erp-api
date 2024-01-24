import { randomStringByCharsetAndLength } from "../../common/helper";

export const handleGenerateRandomCode = () =>
  randomStringByCharsetAndLength("alphabetic", 5, true) +
  randomStringByCharsetAndLength("numeric", 2, true);
