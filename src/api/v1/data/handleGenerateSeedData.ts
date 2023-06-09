import { v4 as uuiv4 } from "uuid";
import {
  randomStringByCharsetAndLength,
  randomIntFromInterval,
} from "../../v1/common";
import { ORDER_TYPE, ORDER_IMPORT_STATUS } from "../../v1/ts/enums/order_enum";
import { CUSTOMER_ACTION } from "../../v1/ts/enums/app_enums";
import {
  AGENCY_BRANCH_ARRAY,
  SHIPPER_ARRAY,
  PAYMENT_ARRAY,
  CUSTOMER_ARRAY,
  STAFF_ARRAY,
  // USER_ARRAY,
  TAG_ARRAY,
  PRODUCT_VARIANT_DETAIL_ARRAY,
  USER_ARRAY,
} from "./seeders";

const randomRangeIDBaseOnArray = (arr: any) => {
  return arr[randomIntFromInterval(0, arr.length - 1)].id;
};

const ORDER_ARRAY: Array<any> = [];
const ORDER_TAG_LIST_ARRAY: Array<any> = [];
let ORDER_PRODUCT_LIST_ARRAY: Array<any> = [];
const DEBT_ARRAY: Array<any> = [];
const _CUSTOMER_ARRAY = USER_ARRAY.reduce((res: any, u: any) => {
  if (u.user_type === "supplier") {
    res.push(CUSTOMER_ARRAY.find((c: any) => c.user_id === u.id));
  }
  return res;
}, []);

for (let index = 0; index < 50; index++) {
  const supplierID = _CUSTOMER_ARRAY[index].id;
  const newOrderRow = {
    id: uuiv4(),
    agency_branch_id: randomRangeIDBaseOnArray(AGENCY_BRANCH_ARRAY),
    shipper_id: randomRangeIDBaseOnArray(SHIPPER_ARRAY),
    payment_id: randomRangeIDBaseOnArray(PAYMENT_ARRAY),
    staff_id: randomRangeIDBaseOnArray(STAFF_ARRAY),
    supplier_id: supplierID,
    order_code: randomStringByCharsetAndLength("alphabet", 5, true),
    order_delivery_date: "2023-05-16T02:43:42.855Z",
    order_note: "Những lưu ý về đơn hàng sẽ được lưu ở cột này",
    order_type: ORDER_TYPE.IMPORT,
    order_status: ORDER_IMPORT_STATUS.GENERATE,
  };

  for (let index = 0; index < 4; index++) {
    const orderTagItem = {
      order_id: newOrderRow.id,
      tag_id: randomRangeIDBaseOnArray(TAG_ARRAY),
    };

    ORDER_TAG_LIST_ARRAY.push(orderTagItem);
  }
  const _ORDER_PRODUCT_LIST_ARRAY: Array<any> = [];
  for (let index = 1; index < 6; index++) {
    const newOrderProdArr = {
      order_id: newOrderRow.id,
      product_variant_id: randomRangeIDBaseOnArray(
        PRODUCT_VARIANT_DETAIL_ARRAY
      ),
      product_amount: randomIntFromInterval(1, 20),
      product_price: randomIntFromInterval(100000, 300000),
      product_discount: randomIntFromInterval(10, 30),
      product_unit: "Cái",
    };

    _ORDER_PRODUCT_LIST_ARRAY.push(newOrderProdArr);
  }
  ORDER_PRODUCT_LIST_ARRAY = [
    ...ORDER_PRODUCT_LIST_ARRAY,
    ..._ORDER_PRODUCT_LIST_ARRAY,
  ];
  const totalDebt: number = _ORDER_PRODUCT_LIST_ARRAY.reduce(
    (total: number, product: any) => {
      total +=
        (product.product_amount *
          product.product_price *
          (100 - product.product_discount)) /
        100;

      return total;
    },
    0
  );
  ORDER_ARRAY.push({ ...newOrderRow, order_total: totalDebt });
  const handleGetUserID = () => {
    const customerIndex = CUSTOMER_ARRAY.findIndex((c) => c.id === supplierID);

    return CUSTOMER_ARRAY[customerIndex].user_id;
  };

  const newDebt = {
    id: uuiv4(),
    user_id: handleGetUserID(),
    source_id: newOrderRow.id,
    debt_amount: `-${totalDebt}`,
    change_debt: `-${totalDebt}`,
    debt_note: "Những lưu ý về công nợ sẽ được lưu ở đây!",
    action: CUSTOMER_ACTION.IMPORT,
  };
  DEBT_ARRAY.push(newDebt);
}

export {
  ORDER_ARRAY,
  ORDER_TAG_LIST_ARRAY,
  ORDER_PRODUCT_LIST_ARRAY,
  DEBT_ARRAY,
};
