import randomstring from "randomstring";
import { MODIFY_STATUS } from "../ts/enums/app_enums";
import { Falsy, ObjectType } from "../ts/types/common";

export const isEmpty = (target: ObjectType<any> | any[]): boolean => {
  return target instanceof Array
    ? target.length === 0
    : target === undefined || target === null
    ? true
    : Object.keys(target).length === 0;
};

export const handleFormatUpdateDataByValidValue = (
  targetObj: ObjectType<any>,
  defaultValue: any
) => {
  return Object.keys(targetObj).reduce(
    (result, key) => {
      if (defaultValue.hasOwnProperty(key) && targetObj[key] !== undefined) {
        result = { ...result, [key]: targetObj[key] };
      }

      return result;
    },
    { ...defaultValue, updatedAt: new Date() }
  );
};

export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const randomStringByCharsetAndLength = (
  charset: string,
  length: number,
  isUppercase: boolean
): string => {
  return randomstring.generate({
    charset: charset,
    length: length,
    capitalization: isUppercase ? "uppercase" : "lowercase",
  });
};

export const checkMissPropertyInObjectBaseOnValueCondition = (
  baseObject: ObjectType<any>,
  valueCondition: Falsy[]
) => {
  const arrMissArray: string[] = Object.keys(baseObject).reduce(
    (res: any, key: string) => {
      if (
        baseObject.hasOwnProperty(key) &&
        valueCondition.includes(baseObject[key])
      ) {
        res.push(key);
      }
      return res;
    },
    []
  );

  return arrMissArray;
};

export const removeItem = <T>(arr: Array<T>, values: Array<T>): Array<T> => {
  values.forEach((value) => {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
  });

  return arr;
};

export const handleValidateClientRequestBeforeModify = <
  P extends ObjectType<any>
>(
  payload: P,
  checkConditions: Falsy[]
) => {
  const argMissArr = checkMissPropertyInObjectBaseOnValueCondition(
    payload,
    checkConditions
  );

  const isOk = isEmpty(argMissArr);

  if (isOk) {
    return {
      status: MODIFY_STATUS.ACCEPT,
    };
  } else {
    return {
      status: MODIFY_STATUS.DENY,
      message: argMissArr.join(",") + " is required!",
    };
  }
};

export const isNullOrFalse = false ?? null;
