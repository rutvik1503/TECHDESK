import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { database } from "../../Firebase/Firebase";

const ExpenseDataAdd = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode

  const [expenseType, setExpenseType] = useState(""); // Client / Employee / Other
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // default today
  const [errors, setErrors] = useState({});

  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Fetch clients & employees for dropdowns
  useEffect(() => {
    const fetchClients = async () => {
      const snapshot = await getDocs(collection(database, "ClientData"));
      setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    const fetchEmployees = async () => {
      const snapshot = await getDocs(collection(database, "EmployeeData"));
      setEmployees(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchClients();
    fetchEmployees();
  }, []);

  // Fetch existing expense if editing
  useEffect(() => {
    if (!id) return; // Not in edit mode

    const fetchExpense = async () => {
      try {
        const docRef = doc(database, "ExpenseData", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setExpenseType(data.type || "");
          setSelectedClient(data.clientName || "");
          setSelectedEmployee(data.employeeName || "");
          setDescription(data.description || "");
          setAmount(data.amount || "");
          setDate(data.date || new Date().toISOString().split("T")[0]);
        }
      } catch (err) {
        console.error("Error fetching expense:", err);
      }
    };
    fetchExpense();
  }, [id]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!expenseType) newErrors.expenseType = "Select expense type";
    if (expenseType === "Client" && !selectedClient) newErrors.selectedClient = "Select client";
    if (expenseType === "Employee" && !selectedEmployee) newErrors.selectedEmployee = "Select employee";
    if (!description.trim()) newErrors.description = "Description is required";

    // Amount validation
    if (!amount || Number(amount) <= 0) newErrors.amount = "Enter a valid amount";

    // Date validation
    const minDate = new Date("2024-01-01");
    const maxDate = new Date();
    const selectedDate = new Date(date);
    if (!date) {
      newErrors.date = "Date is required";
    } else if (selectedDate < minDate || selectedDate > maxDate) {
      newErrors.date = "Date must be between 01 Jan 2024 and today";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save or update
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      type: expenseType,
      clientName: expenseType === "Client" ? selectedClient : "",
      employeeName: expenseType === "Employee" ? selectedEmployee : "",
      description,
      amount: Number(amount),
      date
    };

    try {
      if (id) {
        // Update existing expense
        await updateDoc(doc(database, "ExpenseData", id), data);
        alert("Expense updated successfully!");
      } else {
        // Add new expense
        await addDoc(collection(database, "ExpenseData"), data);
        alert("Expense added successfully!");
      }
      navigate("/expense");
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };

  return (
    <div className="w-full h-auto rounded-[20px] flex flex-col gap-[15px]">
      <div className="glass-card flex justify-between items-center rounded-[15px] p-5 shadow-lg">
        <h1 className="capitalize SmallFont font-bold tracking-wider text-[22px] bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 drop-shadow-lg">
          {id ? "Edit Expense" : "Add New Expense"}
        </h1>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-2 gap-[15px] SmallFont">
          {/* Expense Type */}
          <div className="glass-card rounded-[15px] flex flex-col gap-[5px] col-span-2">
            <label className="text-[16px] font-[500] tracking-[0.5px]">Expense Type</label>
            <select
              value={expenseType}
              onChange={(e) => {
                setExpenseType(e.target.value);
                setSelectedClient("");
                setSelectedEmployee("");
              }}
              className="w-full rounded-[12px] px-4 py-2 text-[14px] bg-white/10 backdrop-blur-md border border-white/20 text-white appearance-none cursor-pointer transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option className="bg-[rgba(50,50,50,0.9)] text-white hover:bg-blue-500" value="" disabled>Select Type</option>
              <option className="bg-[rgba(50,50,50,0.9)] text-white hover:bg-blue-500" value="Client">Client Expense</option>
              <option className="bg-[rgba(50,50,50,0.9)] text-white hover:bg-blue-500" value="Employee">Employee Expense</option>
              <option className="bg-[rgba(50,50,50,0.9)] text-white hover:bg-blue-500" value="Other">Other</option>
            </select>
            {errors.expenseType && <span className="text-red-500 text-[12px]">{errors.expenseType}</span>}
          </div>

          {/* Client dropdown */}
          {expenseType === "Client" && (
            <div className="glass-card rounded-[15px] flex flex-col gap-[5px] col-span-2">
              <label className="text-[16px] font-[500] tracking-[0.5px]">Select Client</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full rounded-[12px] px-4 py-2 text-[14px] bg-white/10 backdrop-blur-md border border-white/20 text-white appearance-none cursor-pointer transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="" disabled>Select Client</option>
                {clients.map(client => (
                  <option className="bg-[rgba(50,50,50,0.9)] text-white hover:bg-blue-500" key={client.id} value={client.name}>{client.name}</option>
                ))}
              </select>
              {errors.selectedClient && <span className="text-red-500 text-[12px]">{errors.selectedClient}</span>}
            </div>
          )}

          {/* Employee dropdown */}
          {expenseType === "Employee" && (
            <div className="glass-card rounded-[15px] flex flex-col gap-[5px] col-span-2">
              <label className="text-[16px] font-[500] tracking-[0.5px]">Select Employee</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full rounded-[12px] px-4 py-2 text-[14px] bg-white/10 backdrop-blur-md border border-white/20 text-white appearance-none cursor-pointer transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="" disabled>Select Employee</option>
                {employees.map(emp => (
                  <option className="bg-[rgba(50,50,50,0.9)] text-white hover:bg-blue-500" key={emp.id} value={emp.name}>{emp.name}</option>
                ))}
              </select>
              {errors.selectedEmployee && <span className="text-red-500 text-[12px]">{errors.selectedEmployee}</span>}
            </div>
          )}

          {/* Description */}
          <div className="glass-card rounded-[15px] flex flex-col gap-[5px] col-span-2">
            <label className="text-[16px] font-[500] tracking-[0.5px]">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description..."
              className="glass-card no-default rounded-[10px] h-[80px] px-3 py-2 text-[13px]"
            />
            {errors.description && <span className="text-red-500 text-[12px]">{errors.description}</span>}
          </div>

          {/* Amount */}
          <div className="glass-card rounded-[15px] flex flex-col gap-[5px]">
            <label className="text-[17.5px] font-[500] tracking-[1px]">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Amount..."
              className="glass-card no-default rounded-[10px] h-[40px] px-3 text-[13px]"
            />
            {errors.amount && <span className="text-red-500 text-[12px]">{errors.amount}</span>}
          </div>

          {/* Date */}
          <div className="glass-card rounded-[15px] flex flex-col gap-[5px]">
            <label className="text-[17.5px] font-[500] tracking-[1px]">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min="2024-01-01"
              max={new Date().toISOString().split("T")[0]}
              className="glass-card white-date-icon rounded-[10px] h-[40px] px-3 text-[13px]"
            />
            {errors.date && <span className="text-red-500 text-[12px]">{errors.date}</span>}
          </div>

          {/* Save Button */}
          <div className="col-span-2 mt-2">
            <button
              type="submit"
              className="w-[60%] ms-[20%] mx-auto h-[45px] rounded-[12px] bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg transition"
            >
              {id ? "Update Expense" : "Save Expense"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExpenseDataAdd;
