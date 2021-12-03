let express = require("express");
let mongoose = require("mongoose");
let EmployeeModel = require("./models/Employee");

let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

let connection_string =
  "mongodb+srv://justin:comp3123@comp3123.iohhl.mongodb.net/101246661_assignment2?retryWrites=true&w=majority";

mongoose.connect(connection_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//retrieve all employees
app.get("/api/v1/employees", async (req, res) => {
  const employees = await EmployeeModel.find(
    {},
    { _id: 0, id: 1, firstName: 1, lastName: 1, emailId: 1 }
  );
  try {
    res.set("Access-Control-Allow-Origin", "*");
    res.status(200).send(employees);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//add new employee
app.post("/api/v1/employees", async (req, res) => {
  try {
    let e = req.body;
    let new_employee = await EmployeeModel(e);
    let max = await EmployeeModel.find(
      {},
      { _id: 0, id: 1, firstName: 1, lastName: 1, emailId: 1 }
    )
      .sort({ id: -1 })
      .limit(1);

    if (max.length == 0) {
      new_employee.id = 1;
    } else {
      new_employee.id = max[0].id + 1;
    }

    await new_employee.save(e);
    res.set("Access-Control-Allow-Origin", "*");
    res.status(201).send("Employee added.");
  } catch (err) {
    if ((err.name = "ValidationError")) {
      res.status(400).send(err);
    } else {
      res.status(500).send(err);
    }
  }
});

//find employee by id
app.get("/api/v1/employees/:id", async (req, res) => {
  try {
    let employee = await EmployeeModel.find(
      { id: req.params.id },
      { _id: 0, id: 1, firstName: 1, lastName: 1, emailId: 1 }
    );
    res.set("Access-Control-Allow-Origin", "*");
    res.send(employee);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//update employee by id
app.put("/api/v1/employees/:id", async (req, res) => {
  req.body.id = req.params.id;
  try {
    let employee = await EmployeeModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    res.set("Access-Control-Allow-Origin", "*");
    res.status(200).send(employee);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//delete employee by id
app.delete("/api/v1/employees/:id", async (req, res) => {
  try {
    let employee = await EmployeeModel.findOneAndDelete({ id: req.params.id });
    res.set("Access-Control-Allow-Origin", "*");
    if (!employee) {
      res.status(404).send("Employee not found.");
    }
    res.status(204).send("Employee deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(9090, () => {
  console.log("server running on port 9090");
});
