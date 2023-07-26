export enum CUSTSUPP_ACTION {
  IMPORT = "Nhập hàng",
  PURCHASE = "Mua hàng",
  BILL_ADD = "Thêm phiếu chi",
}

export enum USER_TYPE {
  ADMIN = "admin",
  SUPPLIER = "supplier",
  CUSTOMER = "customer",
  STAFF = "staff",
}

export enum CUSTSUPP_STATUS {
  TRADING = "Đang giao dịch",
}

export enum STAFF_STATUS {
  WORKING = "Đang làm việc",
}

export enum MODIFY_STATUS {
  ACCEPT = "accept",
  DENY = "deny",
}

export enum ENTITIES_FORMAT_TYPE {
  P_LIST = "p_array",
  P_ITEM = "p_object",
  P_V_LIST = "p_v_object",
  B_P_V_LIST = "b_p_v_array",
}
