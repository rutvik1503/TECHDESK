import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { database } from "../../Firebase/Firebase";

const IncomeDataShow = () => {
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState([]);

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
    const fetchIncomeData = async () => {
      try {
        const incomeCollection = collection(database, "IncomeData");
        const snapshot = await getDocs(incomeCollection);

        const incomeList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setIncomes(incomeList);
      } catch (error) {
        console.error("Error fetching income data:", error);
      }
    };

    fetchIncomeData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this income entry?")) {
      try {
        await deleteDoc(doc(database, "IncomeData", id));
        setIncomes((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting income entry:", error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="glass-card flex justify-between items-center rounded-[15px] p-5 shadow-lg">
        <h1 className="capitalize SmallFont font-bold tracking-wider text-[22px] bg-clip-text text-transparent bg-gradient-to-r from-[#1966FF] to-[#00D4FF] drop-shadow-lg">
          Income Details
        </h1>

        <button
          onClick={() => navigate("/addincome")}
          className="px-6 py-2 SmallFont text-white text-[14px] tracking-[1px] font-medium rounded-[20px] bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-md hover:shadow-xl transition-all duration-300"
        >
          + Add Income
        </button>
      </div>

      <div>
        <table className="glass-card rounded-[10px] shadow-lg overflow-hidden w-full border-collapse SmallFont">
          <thead>
            <tr className="bg-gradient-to-r from-green-400 to-green-600 text-white">
              <th className="p-4 text-center text-[12.5px] tracking-[1px] uppercase font-[500] w-[60px]">No</th>
              <th className="p-4 text-center text-[12.5px] tracking-[1px] uppercase font-[500]">Client Name</th>
              <th className="p-4 text-center text-[12.5px] tracking-[1px] uppercase font-[500]">Amount</th>
              <th className="p-4 text-center text-[12.5px] tracking-[1px] uppercase font-[500]">Date</th>
              <th className="p-4 text-center text-[12.5px] tracking-[1px] uppercase font-[500]">Action</th>
            </tr>
          </thead>
          <tbody>
            {incomes.length > 0 ? (
              incomes.map((inc, index) => (
                <tr
                  key={inc.id}
                  className={`transition ${index % 2 === 0 ? "bg-white/1" : "bg-white/3"} hover:bg-green-900/40`}
                >
                  <td className="p-4 text-center text-white/90 text-[12.5px] font-[400] tracking-[0.75px]">{index + 1}</td>
                  <td className="p-4 text-center text-white/90 text-[12.5px] font-[400] tracking-[0.75px]">{inc.clientName || "N/A"}</td>
                  <td className="p-4 text-center text-white/90 text-[12.5px] font-[400] tracking-[0.75px]">{formatAmount(inc.amount)}</td>
                  <td className="p-4 text-center text-white/90 text-[12.5px] font-[400] tracking-[0.75px]">{formatDate(inc.date)}</td>
                  <td className="p-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => navigate(`/addincome/${inc.id}`)}
                      className="px-3 py-1 rounded-[10px] text-[12px] font-[400] text-yellow-400 shadow-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(inc.id)}
                      className="px-3 py-1 rounded-[10px] text-[12px] font-[400] text-red-500 shadow-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-6 text-center text-gray-400" colSpan="5">No Income Data Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomeDataShow;
