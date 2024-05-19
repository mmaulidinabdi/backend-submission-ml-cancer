const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

const predictClassification = async (model, image) => {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    //   const confidenceScore = Math.max(...score) * 100;

    const classes = ["Non-Cancer", "Cancer"];
    const label = score[0] > 0.5 ? classes[1] : classes[0];

    let suggestion;
    if (label === "Cancer") {
      suggestion = "Segera Kunjungi dokter";
    }

    if (label === "Non-Cancer") {
      suggestion = "Anda Sehat";
    }

    return { label, suggestion };
  } catch (error) {
    throw new InputError(`${error.message}`)
  }
};

module.exports = predictClassification;
