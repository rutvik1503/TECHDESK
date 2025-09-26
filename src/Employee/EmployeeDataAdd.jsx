import React, { useState, useEffect } from "react";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { database } from "../../Firebase/Firebase";

const EmployeeDataAdd = () => {
  const services = {
    "Web Development": [
      "Frontend Development",
      "Backend Development",
      "Fullstack Development",
      "E-commerce Development",
      "CMS Development",
    ],
    "Software Development": [
      "Desktop Applications",
      "Custom Software (ERP/CRM)",
      "API & Integrations",
    ],
  };

  const { id } = useParams();
  const navigate = useNavigate();

  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeePhone, setEmployeePhone] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState([]);
  const [salary, setSalary] = useState("");
  const [errors, setErrors] = useState({});

  // Fetch existing employee data if editing
  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      try {
        const docRef = doc(database, "EmployeeData", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEmployeeName(data.name || "");
          setEmployeeEmail(data.email || "");
          setEmployeePhone(data.phone || "");
          setJoinDate(data.dateOfJoin || "");
          setDepartment(data.department || "");
          setRole(data.role || []);
          setSalary(data.salary || "");
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    fetchEmployee();
  }, [id]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!employeeName.trim()) newErrors.employeeName = "Name is required";

    if (!employeeEmail.trim()) newErrors.employeeEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeEmail))
      newErrors.employeeEmail = "Invalid email format";

    if (!employeePhone.trim()) newErrors.employeePhone = "Phone is required";
    else if (!/^\d{10}$/.test(employeePhone))
      newErrors.employeePhone = "Phone number must be 10 digits";

    if (!joinDate) newErrors.joinDate = "Joining date is required";
    else {
      const selectedDate = new Date(joinDate);
      const minDate = new Date("2024-01-01");
      const maxDate = new Date();
      if (selectedDate < minDate)
        newErrors.joinDate = "Joining date cannot be before 01 January 2024";
      else if (selectedDate > maxDate)
        newErrors.joinDate = "Joining date cannot be in the future";
    }

    if (!department) newErrors.department = "Department is required";
    if (role.length === 0) newErrors.role = "Select at least one role";

    if (!salary) newErrors.salary = "Salary is required";
    else if (Number(salary) <= 0) newErrors.salary = "Salary must be positive";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Save
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const employeeData = {
      name: employeeName,
      email: employeeEmail,
      phone: employeePhone,
      dateOfJoin: joinDate,
      department,
      role,
      salary,
    };

    try {
      if (id) {
        // Edit mode → update existing document
        await updateDoc(doc(database, "EmployeeData", id), employeeData);
        alert("Employee updated successfully!");
      } else {
        // Add new employee
        const docRef = await addDoc(
          collection(database, "EmployeeData"),
          employeeData
        );
        alert("Employee added successfully! ID: " + docRef.id);
      }

      // Navigate back to employee list after save
      navigate("/employee");
    } catch (error) {
      console.error("Error saving employee:", error);
      alert("Error saving employee details");
    }
  };

  return (
    <div className="w-full h-auto rounded-[20px] flex flex-col gap-[15px]">
      <div className="glass-card flex justify-between items-center rounded-[15px] p-5 shadow-lg">
        <h1 className="capitalize SmallFont font-bold tracking-wider text-[22px] bg-clip-text text-transparent bg-gradient-to-r from-[#1966FF] to-[#00D4FF] drop-shadow-lg">
          {id ? "Edit Employee" : "Add New Employee"}
        </h1>
      </div>
      <form onSubmit={handleSave}>
        <div className="grid grid-cols-2 gap-[15px] SmallFont">
          {/* Name */}
          <div className="glass-card rounded-[15px] flex flex-col gap-[5px]">
            <label className="text-[17.5px] font-[500] tracking-[1px]">
              Name
            </label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="Enter Employee Name..."
              className="glass-card no-default rounded-[10px] h-[40px] px-3 text-[13px]"
            />
            {errors.employeeName && (
              <span className="text-red-500 text-[12px]">
                {errors.employeeName}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="glass-card rounded-[15px] flex flex-col gap-[5px]">
            <label className="text-[17.5px] font-[500] tracking-[1px]">
              Email Address
            </label>
            <input
              type="text"
              value={employeeEmail}
              onChange={(e) => setEmployeeEmail(e.target.value)}
              placeholder="Enter Employee Email Address..."
              className="glass-card no-default rounded-[10px] h-[40px] px-3 text-[13px]"
            />
            {errors.employeeEmail && (
              <span className="text-red-500 text-[12px]">
                {errors.employeeEmail}
              </span>
            )}
          </div>

          {/* Phone */}
          <div className="glass-card rounded-[15px] flex flex-col gap-[5px]">
            <label className="text-[17.5px] font-[500] tracking-[1px]">
              Phone Number
            </label>
            <input
              type="number"
              value={employeePhone}
              onChange={(e) => setEmployeePhone(e.target.value)}
              placeholder="Enter Employee Phone Number..."
              className="glass-card no-default rounded-[10px] h-[40px] px-3 text-[13px]"
            />
            {errors.employeePhone && (
              <span className="text-red-500 text-[12px]">
                {errors.employeePhone}
              </span>
            )}
          </div>

          {/* Join Date */}
          <div className="glass-card rounded-[15px] flex flex-col gap-[5px]">
            <label className="text-[17.5px] font-[500] tracking-[1px]">
              Date Of Joining
            </label>
            <input
              type="date"
              value={joinDate}
              onChange={(e) => setJoinDate(e.target.value)}
              min="2024-01-01"
              max={new Date().toISOString().split("T")[0]}
              className="glass-card rounded-[10px] white-date-icon h-[40px] px-3 text-[13px]"
            />
            {errors.joinDate && (
              <span className="text-red-500 text-[12px]">
                {errors.joinDate}
              </span>
            )}
          </div>

          {/* Department */}
          <div className="glass-card rounded-[15px] flex flex-col gap-[5px] col-span-2">
            <label className="text-[16px] font-[500] tracking-[0.5px]">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setRole([]);
              }}
              className="w-full rounded-[12px] px-4 py-2 text-[14px] bg-white/10 backdrop-blur-md border border-white/20 text-white appearance-none cursor-pointer transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>
                Select Department
              </option>
              {Object.keys(services).map((dept) => (
                <option
                  key={dept}
                  value={dept}
                  className="bg-[rgba(50,50,50,0.9)] text-white hover:bg-blue-500"
                >
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <span className="text-red-500 text-[12px]">
                {errors.department}
              </span>
            )}
          </div>

          {/* Role */}
          {department && (
            <div className="glass-card rounded-[15px] flex flex-col gap-[5px] col-span-2 p-4">
              <label className="text-[16px] font-[500] tracking-[0.75px]">
                Select Role(s)
              </label>
              <div className="flex flex-wrap gap-2">
                {services[department].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() =>
                      role.includes(r)
                        ? setRole(role.filter((item) => item !== r))
                        : setRole([...role, r])
                    }
                    className={`px-3 h-[40px] rounded-[8px] text-[12px] transition ${
                      role.includes(r)
                        ? "bg-gradient-to-r from-[#1966FF] to-[#00D4FF] text-white"
                        : "glass-card text-white/80 hover:text-white"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              {errors.role && (
                <span className="text-red-500 text-[12px]">{errors.role}</span>
              )}
            </div>
          )}

          {/* Salary */}
          <div className="glass-card rounded-[15px] flex flex-col gap-[5px] col-span-2">
            <label className="text-[16px] font-[500] tracking-[0.5px]">
              Salary
            </label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Enter Employee Salary..."
              className="glass-card no-default rounded-[10px] h-[40px] px-3 text-[13px]"
            />
            {errors.salary && (
              <span className="text-red-500 text-[12px]">{errors.salary}</span>
            )}
          </div>

          {/* Save Button */}
          <div className="col-span-2 mt-2">
            <button
              type="submit"
              className="w-[60%] ms-[20%] mx-auto h-[45px] rounded-[12px] bg-gradient-to-r from-[#0b4ccd] to-[#03a8c9] hover:from-[#0198b6] hover:to-[#0445c6] text-white shadow-lg transition"
            >
              {id ? "Update Employee" : "Save Employee"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmployeeDataAdd;
