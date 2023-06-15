enum ORDER_TYPE {
  IMPORT = "Đơn nhập",
  SALE = "Đơn bán",
}
enum ORDER_SALE_STATUS {
  CANCEL = "Hủy",
  GENERATE = "Đặt hàng",
  APPROVE = "Duyệt",
  PACKAGE = "Đóng gói",
  DELIVERY = "Xuất kho",
  DONE = "Hoàn thành",
  RETURN = "Hoàn trả",
}
enum ORDER_IMPORT_STATUS {
  CANCEL = "Hủy",
  GENERATE = "Tạo đơn",
  TRADING = "Nhập hàng",
  DONE = "Hoàn thành",
  RETURN = "Hoàn trả",
}
enum ORDER_RESULT_STATUS {
  SUCCESS = "Đã nhập",
  FAIL = "Chưa nhập",
}

export {
  ORDER_TYPE,
  ORDER_SALE_STATUS,
  ORDER_RESULT_STATUS,
  ORDER_IMPORT_STATUS,
};
