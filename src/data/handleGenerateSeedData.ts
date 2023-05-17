import { v4 as uuidv4 } from "uuid";
import {
  randomIntFromInterval,
  randomStringByCharsetAndLength,
  handleGenerateVariantBaseOnProperties,
} from "../common";
import { BRAND_ARRAY, STAFF_ARRAY, TAG_ARRAY, TYPE_ARRAY } from "./seeders";
const properties = [
  {
    key: "Height",
    values: ["1.2 feet", "2 feet"],
  },
  {
    key: "Size",
    values: ["Big", "Medium", "Small"],
  },
];
const product_variant_prices = [
  {
    price_id: "b1071b31-cbf3-43b2-b302-cf18bcd7a3a8",
    price_value: "25000",
  },
  {
    price_id: "211ea80c-6049-4d1e-b78b-ff7c16a65bdd",
    price_value: "30000",
  },
  {
    price_id: "5410f420-7c9c-4460-8e7f-4c28772f5fb1",
    price_value: "35000",
  },
  {
    price_id: "a024047c-6f3c-4274-b2e9-7384de9ceac5",
    price_value: "40000",
  },
  {
    price_id: "32169e6f-4d08-4673-ab22-3bb3b261929f",
    price_value: "45000",
  },
  {
    price_id: "8ca7b243-865b-43bb-8320-ac67ebee9d52",
    price_value: "50000",
  },
  {
    price_id: "7dd753aa-0860-46c5-bc7e-5a50701f38c1",
    price_value: "55000",
  },
  {
    price_id: "ec750adb-df12-46ea-a89b-a0e879e994ab",
    price_value: "60000",
  },
  {
    price_id: "35535127-9507-44dd-a3da-6bf61a9ddfb2",
    price_value: "65000",
  },
  {
    price_id: "f033caa9-aa61-4805-bc02-47ae25a12990",
    price_value: "70000",
  },
];
const PRODUCT_ARRAY: Array<any> = [];
const ADDITIONAL_PRODUCT_INFORMATION: Array<any> = [];
const PRODUCT_TAG_LIST_ARRAY: Array<any> = [];
let PRODUCT_VARIANT_DETAIL_ARRAY: Array<any> = [];
let PRODUCT_VARIANT_PRICE_ARRAY: Array<any> = [];
let PRODUCT_VARIANT_PROPERTY_ARRAY: Array<any> = [];
for (let index = 0; index <= 50; index++) {
  const newProduct = {
    id: uuidv4(),
    product_classify: "Sản phẩm thường",
    product_name: `Sản phẩm ${randomStringByCharsetAndLength(
      "alphabetic",
      4,
      "uppercase"
    )}`,
    product_SKU: randomStringByCharsetAndLength("alphabetic", 5, "uppercase"),
  };
  PRODUCT_ARRAY.push(newProduct);
  const newAdditionalProductInformation = {
    id: uuidv4(),
    product_id: newProduct.id,
    type_id: TYPE_ARRAY[randomIntFromInterval(0, TYPE_ARRAY.length - 1)].id,
    brand_id: BRAND_ARRAY[randomIntFromInterval(0, BRAND_ARRAY.length - 1)].id,
  };
  ADDITIONAL_PRODUCT_INFORMATION.push(newAdditionalProductInformation);
  const randomNumberFrom1To5 = randomIntFromInterval(1, 6);

  for (let _index = 0; _index <= randomNumberFrom1To5; _index++) {
    const newProductTagItem = {
      tag_id: TAG_ARRAY[randomIntFromInterval(0, TAG_ARRAY.length - 1)].id,
      addition_product_information_id: newAdditionalProductInformation.id,
    };
    PRODUCT_TAG_LIST_ARRAY.push(newProductTagItem);
  }

  // ? ==============================================================================
  const { keys, productVariants } =
    handleGenerateVariantBaseOnProperties(properties);
  const {
    productVariantDetailRowArr,
    productVariantPriceRowArr,
    productVariantPropertyArr,
  } = productVariants.reduce(
    (res: any, p_variant_properties: Array<any> | string) => {
      let product_variant_code: string = newProduct.product_SKU;
      let product_special_variant_name: string = newProduct.product_name;
      if (Array.isArray(p_variant_properties)) {
        product_variant_code =
          product_variant_code +
          p_variant_properties
            .map((p_variant_property: string) => p_variant_property[0])
            .join("");
        product_special_variant_name =
          product_special_variant_name +
          " " +
          p_variant_properties
            .map((p_variant_property: string) => p_variant_property)
            .join("-");
      } else {
        product_variant_code = product_variant_code + p_variant_properties[0];
        product_special_variant_name =
          product_special_variant_name + " " + p_variant_properties;
      }
      // * ==========================================
      //   Product Variants Detail Row Arr
      // * ==========================================

      const newProductVariantDetailRow = {
        id: uuidv4(),
        product_id: newProduct.id,
        product_variant_name: product_special_variant_name,
        product_variant_SKU: product_variant_code,
        product_variant_barcode: product_variant_code,
        product_weight: randomIntFromInterval(10, 50),
        product_weight_calculator_unit: "g",
      };
      res.productVariantDetailRowArr.push(newProductVariantDetailRow);
      // * ==========================================
      //   Product Variants Price Row Arr
      // * ==========================================
      const newProductPriceRow = product_variant_prices.map(
        ({ price_id, price_value }: any) => ({
          product_variant_id: newProductVariantDetailRow.id,
          price_id,
          price_value,
        })
      );
      res.productVariantPriceRowArr = [
        ...res.productVariantPriceRowArr,
        ...newProductPriceRow,
      ];
      // * ==========================================
      //   Product Variants Property Row Arr
      // * ==========================================
      const newProductVariantProperty = keys.map(
        (key: string, index: number) => ({
          product_variant_id: newProductVariantDetailRow.id,
          product_variant_property_key: key,
          product_variant_property_value: p_variant_properties[index],
        })
      );
      res.productVariantPropertyArr = [
        ...res.productVariantPropertyArr,
        ...newProductVariantProperty,
      ];
      return res;
    },
    {
      productVariantDetailRowArr: [],
      productVariantPriceRowArr: [],
      productVariantPropertyArr: [],
    }
  );

  PRODUCT_VARIANT_DETAIL_ARRAY = PRODUCT_VARIANT_DETAIL_ARRAY.concat(
    productVariantDetailRowArr
  );
  PRODUCT_VARIANT_PRICE_ARRAY = PRODUCT_VARIANT_PRICE_ARRAY.concat(
    productVariantPriceRowArr
  );
  PRODUCT_VARIANT_PROPERTY_ARRAY = PRODUCT_VARIANT_PROPERTY_ARRAY.concat(
    productVariantPropertyArr
  );
}
const SHIPPER_ARRAY: Array<any> = [];

for (let index = 0; index <= 4; index++) {
  SHIPPER_ARRAY.push({
    id: uuidv4(),
  });
}

const USER_ARRAY: Array<any> = [];
const SUPPLIER_ARRAY: Array<any> = [];
const ADDRESS_ARRAY: Array<any> = [];
const TAG_LIST_ARRAY: Array<any> = [];
for (let index = 0; index < 50; index++) {
  const newUser = {
    id: uuidv4(),
    user_code: randomStringByCharsetAndLength("alphabetic", 4, "uppercase"),
    user_phone: randomStringByCharsetAndLength("numeric", 10, "lowercase"),
    user_email: `${randomStringByCharsetAndLength(
      "alphabetic",
      8,
      "uppercase"
    )}@gmail.com`,
    user_password: null,
    user_name: `Nhà cung cấp ${randomStringByCharsetAndLength(
      "alphabetic",
      4,
      "uppercase"
    )}`,
    user_type: "supplier",
    isDelete: null,
  };
  USER_ARRAY.push(newUser);
  const newSupplier = {
    id: uuidv4(),
    user_id: newUser.id,
    staff_id: STAFF_ARRAY[randomIntFromInterval(0, STAFF_ARRAY.length - 1)].id,
    customer_status: "Đang giao dịch",
    staff_in_charge_note: "Lưu ý về nhà cung cấp sẽ được lưu vào cột này",
  };

  for (let index = 1; index <= 3; index++) {
    const newAddress = {
      user_id: newUser.id,
      user_province: "Thành phố Hồ Chí Minh",
      user_district: `Quận ${randomStringByCharsetAndLength(
        "alphabetic",
        10,
        "uppercase"
      )}`,
      user_specific_address: `Số nhà ... ${randomStringByCharsetAndLength(
        "alphabetic",
        10,
        "uppercase"
      )}`,
    };
    ADDRESS_ARRAY.push(newAddress);
    const newTagItem = {
      customer_id: newSupplier.id,
      tag_id: TAG_ARRAY[randomIntFromInterval(0, TAG_ARRAY.length - 1)].id,
    };
    TAG_LIST_ARRAY.push(newTagItem);
  }

  SUPPLIER_ARRAY.push(newSupplier);
}

export {
  PRODUCT_ARRAY,
  PRODUCT_TAG_LIST_ARRAY,
  ADDITIONAL_PRODUCT_INFORMATION,
  PRODUCT_VARIANT_DETAIL_ARRAY,
  PRODUCT_VARIANT_PRICE_ARRAY,
  PRODUCT_VARIANT_PROPERTY_ARRAY,
  SHIPPER_ARRAY,
  USER_ARRAY,
  SUPPLIER_ARRAY,
  ADDRESS_ARRAY,
  TAG_LIST_ARRAY,
};
