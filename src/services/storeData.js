const { Firestore } = require("@google-cloud/firestore");

const db = new Firestore();

async function storeData(id, data) {
  const predictCollection = db.collection("Prediction");
  return predictCollection.doc(id).set(data);
}

const getAllHistories = async (request, h) => {
  const predictCollection = db.collection("Prediction");

  try {
    const snapshot = await predictCollection.get();
    const histories = snapshot.docs.map((doc) => {
      const historyData = doc.data();
      return {
        id: doc.id,
        history: {
          result: historyData.result,
          createdAt: historyData.createdAt,
          suggestion: historyData.suggestion,
          id: doc.id,
        },
      };
    });
    return h
      .response({
        status: "success",
        data: histories,
      })
      .code(200);
  } catch (error) {
    console.error("Error fetching histories:", error);
    return h
      .response({
        status: "error",
        message: "Failed to fetch histories",
      })
      .code(500);
  }
};

module.exports = { storeData, getAllHistories };
