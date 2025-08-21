const ACTION = {
  CREATE: { path: "/", operationId: "create", method: "post" },
  GET_LIST: { path: "/", operationId: "getList", method: "get" },
  GET_BY_ID: { path: "/:id", operationId: "getById", method: "get" },
  UPDATE: { path: "/:id", operationId: "updateById", method: "put" },
  DELETE: { path: "/:id", operationId: "deleteById", method: "delete" },
};
const API_LIST = {
  CRUD: [
    ACTION.CREATE,
    ACTION.GET_LIST,
    ACTION.GET_BY_ID,
    ACTION.UPDATE,
    ACTION.DELETE,
  ],
  CRD: [ACTION.CREATE, ACTION.GET_LIST, ACTION.GET_BY_ID, ACTION.DELETE],
  R: [ACTION.GET_LIST, ACTION.GET_BY_ID],
};

module.exports = { ACTION, API_LIST };
