enum ORDER_TYPE {
  IMPORT = "Đơn nhập",
  PURCHASE = "Đơn bán",
}
enum ORDER_PURCHASE_STATUS {
  GENERATE = "Tạo đơn hàng",
  CANCEL = "Hủy",
  TRADING = "Đang giao dịch",
  DONE = "Hoàn thành",
}
enum ORDER_IMPORT_STATUS {
  CANCEL = "Hủy",
  GENERATE = "Tạo đơn hàng",
  TRADING = "Đang giao dịch",
  DONE = "Hoàn thành",
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
