const { postPredictHandler } = require("../server/handler");
const { getAllHistories } = require("../services/storeData");

const routes = [
  {
    path: "/predict",
    method: "POST",
    handler: postPredictHandler,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        maxBytes: 1048576, // Batas ukuran payload 1MB
        failAction: (request, h, err) => {
          // Jika ukuran payload melebihi batas
          if (err.output.statusCode === 413) {
            // Mengembalikan respon khusus
            return h
              .response({
                status: "fail",
                message:
                  "Payload content length greater than maximum allowed: 1000000",
              })
              .code(413)
              .takeover();
          }

          // Mengembalikan error lainnya
          throw err;
        },
      },
    },
  },
    {
      path: "/predict/histories",
      method: "GET",
      handler: getAllHistories,
    },
];

module.exports = routes;
