const mongoose = require("./sharedMongoose");

const connectToDB = (document) => {
  return mongoose
    .connect(`mongodb://localhost:27017/${document}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`Connected to MongoDB database: ${document}`);
      console.log(
        "Mongoose state after connect:",
        mongoose.connection.readyState
      );
    })
    .catch((err) => console.error("Mongoose error:", err));
};

module.exports = connectToDB;
