import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { database } from "../../Firebase/Firebase";

const ClientCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const formatAmount = (amount) => {
    if (!amount) return "N/A";
    return `₹ ${new Intl.NumberFormat("en-IN").format(amount)}`;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const docSnap = await getDoc(doc(database, "ClientData", id));
        if (docSnap.exists()) setClient({ id: docSnap.id, ...docSnap.data() });
      } catch (err) {
        console.error("Error fetching client:", err);
      }
    };

    const fetchEmployees = async () => {
      try {
        const snapshot = await getDocs(collection(database, "EmployeeData"));
        setEmployees(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };

    fetchClient();
    fetchEmployees();
  }, [id]);

  useEffect(() => {
    if (!client) return;

    const fetchPayments = async () => {
      try {
        const snapshot = await getDocs(collection(database, "IncomeData"));
        const list = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((p) => p.clientId === client.id || p.clientName === client.name)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        setPayments(list);
      } catch (err) {
        console.error("Error fetching payments:", err);
      }
    };

    const fetchExpenses = async () => {
      try {
        const snapshot = await getDocs(collection(database, "ExpenseData"));
        const list = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((e) => e.clientName === client.name)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        setExpenses(list);
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };

    fetchPayments();
    fetchExpenses();
  }, [client]);

  if (!client)
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Loading client details...
      </div>
    );

  const assignedEmployees = employees.filter((emp) =>
    client.assignedEmployees?.includes(emp.id)
  );

  const totalPayment = client.totalPayment || 0;
  const paidAmount = payments.reduce((acc, p) => acc + Number(p.amount || 0), 0);
  const pendingAmount = totalPayment - paidAmount;

  const handleDeleteClient = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client? All payments and expenses will also be deleted."
    );
    if (!confirmDelete) return;

    try {
      const paymentsSnapshot = await getDocs(collection(database, "IncomeData"));
      const deletePaymentPromises = paymentsSnapshot.docs
        .filter(doc => {
          const data = doc.data();
          return data.clientId === client.id || data.clientName === client.name;
        })
        .map(doc => deleteDoc(doc.ref));

      const expensesSnapshot = await getDocs(collection(database, "ExpenseData"));
      const deleteExpensePromises = expensesSnapshot.docs
        .filter(doc => doc.data().clientName === client.name)
        .map(doc => deleteDoc(doc.ref));

      await Promise.all([...deletePaymentPromises, ...deleteExpensePromises]);
      await deleteDoc(doc(database, "ClientData", client.id));

      alert("Client deleted successfully!");
      navigate("/client");
    } catch (err) {
      console.error("Error deleting client:", err);
      alert("Failed to delete client. Please try again.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 SmallFont">
      {/* Header */}
      <div className="glass-card w-full rounded-[20px] p-6 flex flex-col md:flex-row items-center md:justify-between gap-4 shadow-xl border border-white/20 hover:shadow-2xl transition-all">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1966FF] to-[#00D4FF] flex items-center justify-center text-white text-3xl font-bold">
            {client.name?.charAt(0).toUpperCase() || "C"}
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-medium text-white">{client.name}</h1>
            <span className="px-4 py-1 rounded-full text-sm font-medium text-white bg-purple-500">
              Client
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#1966FF] to-[#00D4FF] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() =>
              navigate("/addincome", { state: { clientId: client.id, clientName: client.name } })
            }
          >
            Add Payment
          </button>
          <button
            className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleDeleteClient}
          >
            Delete Client
          </button>
        </div>
      </div>

      {/* Client Details & Employees */}
      <div className="grid md:grid-cols-2 gap-6">
        {[...[ 
          { label: "Email", value: client.email },
          { label: "Phone", value: client.phone },
          { label: "Address", value: client.address },
          { label: "Main Service", value: client.mainService },
          { label: "Sub Services", value: client.subServices?.join(", ") },
          { label: "Notes", value: client.notes },
          { label: "Date Added", value: formatDate(client.addedDate) },
        ]].map((field, idx) => (
          <div
            key={idx}
            className="glass-card p-4 rounded-[15px] shadow-lg border border-white/10 flex flex-col"
          >
            <span className="text-[#3080ff] font-medium text-[14px] mb-1 drop-shadow-sm">
              {field.label}
            </span>
            <span className="text-white font-medium text-[15px]">
              {field.value || "N/A"}
            </span>
          </div>
        ))}

        <div className="glass-card p-4 rounded-[15px] shadow-lg border border-white/10 flex flex-col">
          <span className="text-[#3080ff] font-medium text-[14px] mb-1 drop-shadow-sm">
            Assigned Employees
          </span>
          {assignedEmployees.length > 0 ? (
            assignedEmployees.map((emp) => (
              <span key={emp.id} className="text-white font-medium text-[15px]">
                {emp.name}
              </span>
            ))
          ) : (
            <span className="text-white/60 font-medium text-[15px]">
              No Employees Assigned
            </span>
          )}
        </div>

        {/* Payment Summary */}
        <div className="glass-card p-4 rounded-[15px] shadow-lg border border-white/10 flex flex-col gap-2">
          <span className="text-[#3080ff] font-medium text-[14px] mb-1 drop-shadow-sm">
            Payment Summary
          </span>
          <span className="text-white font-medium text-[15px]">
            Total Payment: {formatAmount(totalPayment)}
          </span>
          <span className="text-white font-medium text-[15px]">
            Paid Amount: {formatAmount(paidAmount)}
          </span>
          <span className="text-white font-medium text-[15px]">
            Pending Amount: {formatAmount(pendingAmount)}
          </span>
        </div>
      </div>

      {/* Payment History */}
      <div className="glass-card p-4 rounded-[15px] shadow-lg border border-white/10 hover:shadow-xl transition-all">
        <span className="text-[#00FF7F] font-semibold tracking-[0.75px] text-[14px] mb-2 drop-shadow-sm">
          Payment History
        </span>
        <div className="overflow-x-auto rounded-[12.5px] mt-[15px]">
          <table className="w-full border-collapse SmallFont">
            <thead>
              <tr className="bg-gradient-to-r from-green-400 to-green-600 text-white">
                <th className="p-3 text-[13px] font-medium">No</th>
                <th className="p-3 text-[13px] font-medium">Date</th>
                <th className="p-3 text-[13px] font-medium">Amount</th>
                <th className="p-3 text-[13px] font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((payment, index) => (
                  <tr
                    key={payment.id}
                    className={index % 2 === 0 ? "bg-white/1" : "bg-white/3"}
                  >
                    <td className="p-3 text-white font-medium text-[13px] text-center">{index + 1}</td>
                    <td className="p-3 text-white font-medium text-[13px] text-center">{formatDate(payment.date)}</td>
                    <td className="p-3 text-white font-medium text-[13px] text-center">{formatAmount(payment.amount)}</td>
                    <td className="p-3 text-white font-medium text-[13px] text-center">{payment.description || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 text-center text-gray-400 font-medium" colSpan="4">
                    No Payments Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense History */}
      <div className="glass-card p-4 rounded-[15px] shadow-lg border border-white/10 hover:shadow-xl transition-all mt-6">
        <span className="text-[#FF1A1A] font-semibold tracking-[0.75px] text-[14px] mb-2">
          Expense History
        </span>
        <div className="overflow-x-auto rounded-[12.5px] mt-[15px]">
          <table className="w-full border-collapse SmallFont">
            <thead>
              <tr className="bg-gradient-to-r from-red-500 to-red-700 text-white">
                <th className="p-3 text-[13px] font-medium">No</th>
                <th className="p-3 text-[13px] font-medium">Date</th>
                <th className="p-3 text-[13px] font-medium">Amount</th>
                <th className="p-3 text-[13px] font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length > 0 ? (
                expenses.map((expense, index) => (
                  <tr
                    key={expense.id}
                    className={index % 2 === 0 ? "bg-white/1" : "bg-white/3"}
                  >
                    <td className="p-3 text-white font-medium text-[13px] text-center">{index + 1}</td>
                    <td className="p-3 text-white font-medium text-[13px] text-center">{formatDate(expense.date)}</td>
                    <td className="p-3 text-white font-medium text-[13px] text-center">{formatAmount(expense.amount)}</td>
                    <td className="p-3 text-white font-medium text-[13px] text-center">{expense.description || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 text-center text-gray-400 font-medium" colSpan="4">
                    No Expenses Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/client")}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#1966FF] to-[#00D4FF] text-white font-medium"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ClientCard;
