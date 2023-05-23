enum STATUS_MESSAGE {
  SUCCESS = "Success",
  CONFLICT = "Conflict",
  NOT_FOUND = "Not Found",
  SERVER_ERROR = "Server Error",
  NO_CONTENT = "No Content",
  UN_AUTHORIZE = "Unauthorize",
  NOT_ACCEPTABLE = "Not Acceptable",
}

enum STATUS_CODE {
  STATUS_CODE_200 = 200, // * Get / Modify
  STATUS_CODE_201 = 201, // * Create
  STATUS_CODE_202 = 202, // * Delete
  STATUS_CODE_204 = 204, // ! No Content
  STATUS_CODE_401 = 401, // ! Un Authorize
  STATUS_CODE_404 = 404, // ! Not Found
  STATUS_CODE_406 = 406, // ! Not Acceptable
  STATUS_CODE_409 = 409, // ! Conflict
  STATUS_CODE_500 = 500, // ! Server Error
}

export { STATUS_MESSAGE, STATUS_CODE };
