let mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  id: { type: Number, required: true, index: true, unique: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  emailId: {
    type: String,
    required: true,
    trim: true,
    validate: [
      (e) => {
        let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return pattern.test(e);
      },
      "Please enter a valid email address.",
    ],
  },
});

const Employee = mongoose.model("employee", EmployeeSchema);
module.exports = Employee;
