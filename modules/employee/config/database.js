const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/employees", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Mongoose error:", err));
