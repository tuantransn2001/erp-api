import bcrypt from "bcrypt";

class HashStringHandler {
  public static hash(str: string, saltRounds: number): string {
    return bcrypt.hashSync(str, saltRounds);
  }
  public static verify(plainStr: string, hashedStr: string): boolean {
    return bcrypt.compareSync(plainStr, hashedStr);
  }
}

export default HashStringHandler;
