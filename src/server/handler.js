const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const {storeData} = require("../services/storeData");

const postPredictHandler = async (req, h) => {
  const { image } = req.payload;
  const { model } = req.server.app;

  const { label, suggestion } = await predictClassification(model, image);

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id: id,
    result: label,
    suggestion: suggestion,
    createdAt: createdAt,
  };

  await storeData(id, data)

  const response = h.response({
    status: "success",
    message: "Model is predicted successfully",
    data,
  });
  response.code(201);
  return response;
};

module.exports = { postPredictHandler };
