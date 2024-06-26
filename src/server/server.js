require("dotenv").config();
const routes = require("../server/routes");

const Hapi = require("@hapi/hapi");
const loadModel = require("../services/loadModel");
const InputError = require("../exceptions/InputError");


(async () => {
  const server = Hapi.server({
    port: 3000,
    host: "0.0.0.0", //nanti ganti jadi 0.0.0.0 kalau mau ke production
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  const model = await loadModel();
  server.app.model = model;

  server.route(routes);

  server.ext("onPreResponse", function (request, h) {
    const response = request.response;

    if (response instanceof InputError) {
      const newResponse = h.response({
        status: "fail",
        message: `Terjadi kesalahan dalam melakukan prediksi`, //error salah prediksi
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    if (response.isBoom) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.output.statusCode); //disini error payload content lebih dari 1 mb
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
})();
