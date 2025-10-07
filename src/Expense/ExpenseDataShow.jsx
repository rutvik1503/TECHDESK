import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { database } from "../../Firebase/Firebase";

const ExpenseDataShow = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);

  // Utility functions
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
    const fetchExpenseData = async () => {
      try {
        const expenseCollection = collection(database, "ExpenseData");
        const snapshot = await getDocs(expenseCollection);

        const expenseList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort by date descending (latest first)
        const sortedList = expenseList.sort((a, b) => {
          const dateA = a.date ? new Date(a.date) : new Date(0);
          const dateB = b.date ? new Date(b.date) : new Date(0);
          return dateB - dateA;
        });

        setExpenses(sortedList);
      } catch (error) {
        console.error("Error fetching expense data:", error);
      }
    };

    fetchExpenseData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense entry?")) {
      try {
        await deleteDoc(doc(database, "ExpenseData", id));
        setExpenses((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting expense entry:", error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="glass-card flex justify-between items-center rounded-[15px] p-5 shadow-lg">
        <h1 className="capitalize SmallFont font-bold tracking-wider text-[22px] bg-clip-text text-transparent bg-gradient-to-r from-[#1966FF] to-[#00D4FF] drop-shadow-lg">
          Expense Details
        </h1>

        <button
          onClick={() => navigate("/addexpense")}
          className="px-6 py-2 SmallFont text-white text-[14px] tracking-[1px] font-medium rounded-[20px] bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 shadow-md hover:shadow-xl transition-all duration-300"
        >
          + Add Expense
        </button>
      </div>

      <div>
        <table className="glass-card rounded-[10px] shadow-lg overflow-hidden w-full border-collapse SmallFont">
          <thead>
            <tr className="bg-gradient-to-r from-red-400 to-red-600 text-white">
              <th className="p-4 text-center text-[12.5px] tracking-[1px] uppercase font-[500] w-[60px]">No</th>
              <th className="p-4 text-center text-[12.5px] tracking-[1px] uppercase font-[500]">Expense Name</th>
              <th className="p-4 text-center text-[12.5px] tracking-[1px] uppercase font-[500]">Amount</th>
              <th className="p-4 text-center text-[12.5px] tracking-[1px] uppercase font-[500]">Date</th>
              <th className="p-4 text-center text-[12.5px] tracking-[1px] uppercase font-[500]">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((exp, index) => (
                <tr
                  key={exp.id}
                  className={`transition ${index % 2 === 0 ? "bg-white/1" : "bg-white/3"} hover:bg-red-900/40`}
                >
                  <td className="p-4 text-center text-white/90 text-[12.5px] font-[400] tracking-[0.75px]">{index + 1}</td>
                  <td className="p-4 text-center capitalize text-white/90 text-[12.5px] font-[400] tracking-[0.75px]">
                    {exp.clientName || exp.employeeName || exp.description || "N/A"}
                  </td>
                  <td className="p-4 text-center text-white/90 text-[12.5px] font-[400] tracking-[0.75px]">{formatAmount(exp.amount)}</td>
                  <td className="p-4 text-center text-white/90 text-[12.5px] font-[400] tracking-[0.75px]">{formatDate(exp.date)}</td>
                  <td className="p-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => navigate(`/addexpense/${exp.id}`)}
                      className="px-3 py-1 rounded-[10px] text-[12px] font-[400] text-yellow-400 shadow-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="px-3 py-1 rounded-[10px] text-[12px] font-[400] text-red-500 shadow-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-6 text-center text-gray-400" colSpan="5">No Expense Data Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseDataShow;
