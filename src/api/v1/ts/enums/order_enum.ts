<<<<<<< HEAD
enum ORDER_TYPE {
  IMPORT = "Đơn nhập",
  PURCHASE = "Đơn bán",
}
enum ORDER_PURCHASE_STATUS {
  CANCEL = "Hủy",
  GENERATE = "Tạo đơn hàng",
  TRADING = "Đang giao dịch",
  DONE = "Hoàn thành",
}
enum ORDER_IMPORT_STATUS {
  CANCEL = "Hủy",
  GENERATE = "Tạo đơn hàng",
  TRADING = "Đang giao dịch",
  DONE = "Hoàn thành",
  RETURN = "Hoàn trả",
}
enum ORDER_RESULT_STATUS {
  SUCCESS = "Đã nhập",
  FAIL = "Chưa nhập",
}

export {
  ORDER_TYPE,
  ORDER_PURCHASE_STATUS,
  ORDER_RESULT_STATUS,
  ORDER_IMPORT_STATUS,
};
=======
export enum ORDER_TYPE {
  IMPORT = "Đơn nhập",
  SALE = "Đơn bán",
}
export enum ORDER_SALE_STATUS {
  CANCEL = "Hủy",
  GENERATE = "Đặt hàng",
  APPROVE = "Duyệt",
  PACKAGE = "Đóng gói",
  DELIVERY = "Xuất kho",
  DONE = "Hoàn thành",
  RETURN = "Hoàn trả",
}
export enum ORDER_IMPORT_STATUS {
  CANCEL = "Hủy",
  GENERATE = "Tạo đơn",
  TRADING = "Nhập hàng",
  DONE = "Hoàn thành",
  RETURN = "Hoàn trả",
}
export enum ORDER_RESULT_STATUS {
  SUCCESS = "Đã nhập",
  FAIL = "Chưa nhập",
}
>>>>>>> dev/api-v2
