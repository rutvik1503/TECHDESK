import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { database } from "../../Firebase/Firebase";

const EmployeeCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [clients, setClients] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Utility functions
  const formatSalary = (amount) => (amount ? `₹ ${new Intl.NumberFormat("en-IN").format(amount)}` : "N/A");
  const formatDate = (date) => (date ? new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "N/A");

  // Fetch employee and assigned clients
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const docSnap = await getDoc(doc(database, "EmployeeData", id));
        if (docSnap.exists()) setEmployee({ id: docSnap.id, ...docSnap.data() });
      } catch (err) {
        console.error("Error fetching employee:", err);
      }
    };

    const fetchClients = async () => {
      try {
        const snapshot = await getDocs(collection(database, "ClientData"));
        const assignedClients = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((client) => client.assignedEmployees?.includes(id));
        setClients(assignedClients);
      } catch (err) {
        console.error("Error fetching clients:", err);
      }
    };

    fetchEmployee();
    fetchClients();
  }, [id]);

  // Fetch expenses
  useEffect(() => {
    if (!employee) return;
    const fetchExpenses = async () => {
      try {
        const snapshot = await getDocs(collection(database, "ExpenseData"));
        const filteredExpenses = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((e) => e.employeeName === employee.name)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        setExpenses(filteredExpenses);
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };
    fetchExpenses();
  }, [employee]);

  if (!employee) {
    return <div className="flex justify-center items-center h-screen text-gray-400">Loading employee details...</div>;
  }

  const departmentColor = (dept) => {
    switch (dept?.toLowerCase()) {
      case "web development":
        return "bg-gradient-to-r from-blue-400 to-blue-600";
      case "software development":
        return "bg-gradient-to-r from-green-400 to-green-600";
      case "marketing":
        return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black";
      default:
        return "bg-gray-500";
    }
  };

  // Delete employee function
  const handleDeleteEmployee = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee? All related expenses will also be deleted."
    );
    if (!confirmDelete) return;

    try {
      // Delete related expenses
      const expensesSnapshot = await getDocs(collection(database, "ExpenseData"));
      const deleteExpensePromises = expensesSnapshot.docs
        .filter((doc) => doc.data().employeeName === employee.name)
        .map((doc) => deleteDoc(doc.ref));

      // Remove employee from clients
      const clientsSnapshot = await getDocs(collection(database, "ClientData"));
      const updateClientsPromises = clientsSnapshot.docs
        .filter(doc => doc.data().assignedEmployees?.includes(employee.id))
        .map(doc => {
          const clientRef = doc.ref;
          const updatedEmployees = doc.data().assignedEmployees.filter(eId => eId !== employee.id);
          return updateDoc(clientRef, { assignedEmployees: updatedEmployees });
        });

      // Delete employee
      await Promise.all([...deleteExpensePromises, ...updateClientsPromises]);
      await deleteDoc(doc(database, "EmployeeData", employee.id));

      alert("Employee deleted successfully!");
      navigate("/employee");
    } catch (err) {
      console.error("Error deleting employee:", err);
      alert("Failed to delete employee. Please try again.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 SmallFont">
      {/* Header */}
      <div className="glass-card w-full rounded-[20px] p-6 flex flex-col md:flex-row items-center md:justify-between gap-4 shadow-xl border border-white/20 hover:shadow-2xl transition-all">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1966FF] to-[#00D4FF] flex items-center justify-center text-white text-3xl font-bold">
            {employee.name?.charAt(0).toUpperCase() || "E"}
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-[500] text-white">{employee.name}</h1>
            <span
              className={`px-4 py-1 rounded-full text-sm font-[500] text-white ${departmentColor(employee.department)}`}
            >
              {employee.department || "N/A"}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/addemployee/${id}`)}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#1966FF] to-[#00D4FF] text-white font-[500] shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteEmployee}
            className="px-6 py-2 rounded-lg bg-red-600 text-white font-[500] shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Employee Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {[ 
          { label: "Email", value: employee.email },
          { label: "Phone", value: employee.phone },
          { label: "Role", value: employee.role?.join(", ") },
          { label: "Salary", value: formatSalary(employee.salary) },
          { label: "Joining Date", value: formatDate(employee.dateOfJoin) },
        ].map((field, idx) => (
          <div key={idx} className="glass-card p-4 rounded-[15px] shadow-lg border border-white/10 hover:shadow-xl transition-all flex flex-col">
            <span className="text-[#3080ff] font-medium text-[14px] mb-1 drop-shadow-sm">{field.label}</span>
            <span className="text-white text-[15px] font-[500]">{field.value || "N/A"}</span>
          </div>
        ))}

        {/* Assigned Clients */}
        <div className="glass-card p-4 rounded-[15px] shadow-lg border border-white/10 hover:shadow-xl transition-all flex flex-col">
          <span className="text-[#3080ff] font-medium text-[14px] mb-1 drop-shadow-sm">Assigned Clients</span>
          {clients.length > 0 ? (
            clients.map((client) => (
              <span key={client.id} className="text-white text-[15px] font-[500]">{client.name}</span>
            ))
          ) : (
            <span className="text-white/60 text-[15px] font-[500]">No Clients</span>
          )}
        </div>
      </div>

      {/* Expense History */}
      <div className="glass-card p-4 rounded-[15px] shadow-lg border border-white/10 hover:shadow-xl transition-all mt-4">
        <span className="text-[#FF1A1A] font-semibold tracking-[0.75px] text-[14px] mb-2">Expense History</span>
        <div className="overflow-x-auto rounded-[12.5px] mt-[15px]">
          <table className="w-full border-collapse SmallFont">
            <thead>
              <tr className="bg-gradient-to-r from-red-500 to-red-700 text-white">
                <th className="p-3 text-[13px] font-[500]">No</th>
                <th className="p-3 text-[13px] font-[500]">Date</th>
                <th className="p-3 text-[13px] font-[500]">Amount</th>
                <th className="p-3 text-[13px] font-[500]">Description</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length > 0 ? (
                expenses.map((expense, index) => (
                  <tr key={expense.id} className={index % 2 === 0 ? "bg-white/1" : "bg-white/3"}>
                    <td className="p-3 text-white text-[13px] text-center">{index + 1}</td>
                    <td className="p-3 text-white text-[13px] text-center">{formatDate(expense.date)}</td>
                    <td className="p-3 text-white text-[13px] text-center">{expense.amount ? `₹ ${new Intl.NumberFormat("en-IN").format(expense.amount)}` : "₹ 0"}</td>
                    <td className="p-3 text-white text-[13px] text-center">{expense.description || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-400">No Expenses Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => navigate("/employee")}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#1966FF] to-[#00D4FF] text-white font-[500]"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
