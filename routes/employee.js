const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Employee = require("../models/EmployeeModel");

// GET All Employees: /api/v1/emp/employees
router.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find(
      {},
      "first_name last_name email position salary date_of_joining department"
    );
    return res.status(200).json(
      employees.map((emp) => ({
        employee_id: emp._id,
        first_name: emp.first_name,
        last_name: emp.last_name,
        email: emp.email,
        position: emp.position,
        salary: emp.salary,
        date_of_joining: emp.date_of_joining,
        department: emp.department,
      }))
    );
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server error");
  }
});

// POST - create new employee: /api/v1/emp/employees
router.post(
  "/employees",
  [
    body("first_name").not().isEmpty().withMessage("First name is required"),
    body("last_name").not().isEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("position").not().isEmpty().withMessage("Position is required"),
    body("salary").isNumeric().withMessage("Salary must be a number"),
    body("date_of_joining")
      .isISO8601()
      .withMessage("Please provide a valid date"),
    body("department").not().isEmpty().withMessage("Department is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      first_name,
      last_name,
      email,
      position,
      salary,
      date_of_joining,
      department,
    } = req.body;

    // Create new employee
    try {
      const employee = new Employee({
        first_name,
        last_name,
        email,
        position,
        salary,
        date_of_joining,
        department,
      });

      await employee.save();

      return res.status(201).json({
        message: "Employee created successfully",
        employee_id: employee._id,
      });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send("Server error");
    }
  }
);

// GET - get one employee detail by id: /api/v1/emp/employees/{eid}
router.get("/employees/:eid", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.eid);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({
      employee_id: employee._id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      position: employee.position,
      salary: employee.salary,
      date_of_joining: employee.date_of_joining,
      department: employee.department,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server error");
  }
});

// PUT - update the details of one employee by employee id : /api/v1/emp/employees/{eid}
router.put(
  "/employees/:eid",
  [
    body("position")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Position is required"),
    body("salary")
      .optional()
      .isNumeric()
      .withMessage("Salary must be a number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { position, salary } = req.body;

    try {
      const employee = await Employee.findById(req.params.eid);

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Update employee details
      if (position) employee.position = position;
      if (salary) employee.salary = salary;
      employee.updated_at = Date.now();

      await employee.save();

      return res
        .status(200)
        .json({ message: "Employee details updated successfully" });
    } catch (err) {
      console.log();
      return res.status(500).send("Server error");
    }
  }
);

// DELETE - delete one employee by employee id : /api/v1/emp/employees?eid=xxx
router.delete("/employees", async (req, res) => {
  const { eid } = req.query;

  try {
    const employee = await Employee.findByIdAndDelete(eid);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(204).json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

// Export employee routes
module.exports = router;
