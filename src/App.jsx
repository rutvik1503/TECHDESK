import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import AdminImage from "/public/AdminImage.png";
import RevenueImg from "/public/Icons/Revenue.png";
import IncomeImg from "/public/Icons/IncomeImg.png";
import ExpenseImg from "/public/Icons/Expense.png";
import ProfitImg from "/public/Icons/Profit.png";
import PendigImg from "/public/Icons/Pending.png";

import { collection, getDocs } from "firebase/firestore";
import { database } from "../Firebase/Firebase";

const App = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const [clientNotes, setClientNotes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsSnapshot = await getDocs(
          collection(database, "ClientData")
        );

        let revenue = 0;
        let clients = [];

        clientsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.totalPayment) revenue += Number(data.totalPayment);

          // agar client ke pass notes hain to array mein dal do
          clients.push({
            id: doc.id,
            name: data.name || "Unknown",
            notes: data.notes || "No notes available",
          });
        });

        setTotalRevenue(revenue);
        setClientNotes(clients);

        const incomeSnapshot = await getDocs(
          collection(database, "IncomeData")
        );
        let incomeTotal = 0;
        incomeSnapshot.forEach((doc) => {
          if (doc.data().amount) incomeTotal += Number(doc.data().amount);
        });
        setTotalIncome(incomeTotal);

        const expenseSnapshot = await getDocs(
          collection(database, "ExpenseData")
        );
        let expenseTotal = 0;
        expenseSnapshot.forEach((doc) => {
          if (doc.data().amount) expenseTotal += Number(doc.data().amount);
        });
        setTotalExpense(expenseTotal);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const formattedAmount = Number(payload[0].value).toLocaleString("en-IN"); // Indian format
      return (
        <span style={{ color: "white", fontWeight: "bold" }}>
          ₹ {formattedAmount}
        </span>
      );
    }
    return null;
  };

  const formatINR = (num) => num.toLocaleString("en-IN");

  const graphData = [
    { name: "Revenue", amount: totalRevenue, color: "#3080ff" },
    { name: "Income", amount: totalIncome, color: "#ebb102" },
    { name: "Expense", amount: totalExpense, color: "#f5313b" },
    { name: "Profit", amount: totalIncome - totalExpense, color: "#00ca51" },
    { name: "Pending", amount: totalRevenue - totalIncome, color: "#f5349a" },
  ];

  return (
    <div className="grid grid-cols-3 gap-[15px] SmallFont">
      {/* Cards */}
      {/* Admin Card */}
      <div className="glass-card w-full rounded-[15px] flex justify-start gap-[25px] items-center">
        <img
          src={AdminImage}
          alt="Admin"
          className="w-30 h-30 object-cover rounded-full border-2 border-[#1966FF] hover:scale-110 transition-transform duration-300"
        />
        <div className="w-auto h-full flex flex-col gap-[7.5px]">
          <h1 className="capitalize SmallFont font-bold tracking-wider text-[25px] text-purple-500 drop-shadow-lg">
            welcome, Rutvik !
          </h1>
          <div className="w-fit h-auto px-5 py-1.5 text-[12px] tracking-[1px] rounded-full text-sm font-[500] text-white bg-purple-500">
            Admin
          </div>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="glass-card w-full rounded-[15px] flex justify-start gap-[25px] items-center">
        <img
          src={RevenueImg}
          alt="Revenue"
          className="w-30 h-30 object-cover rounded-full hover:scale-110 transition-transform duration-300"
        />
        <div className="w-auto h-full flex flex-col gap-[7.5px] tems-start justify-center">
          <h1 className="capitalize SmallFont font-bold tracking-wider text-[25px] text-[#3080ff] drop-shadow-lg">
            ₹ {formatINR(totalRevenue)}
          </h1>
          <div className="w-fit h-auto px-5 py-1.5 text-[12px] tracking-[1px] rounded-full text-sm font-[500] text-white bg-[#3080ff]">
            Total Revenue
          </div>
        </div>
      </div>

      {/* Total Profit */}
      <div className="glass-card w-full rounded-[15px] flex justify-start gap-[25px] items-center">
        <img
          src={ProfitImg}
          alt="Profit"
          className="w-30 h-30 object-cover rounded-full hover:scale-110 transition-transform duration-300"
        />
        <div className="w-auto h-full flex flex-col gap-[7.5px] tems-start justify-center">
          <h1 className="capitalize SmallFont font-bold tracking-wider text-[25px] text-[#00ca51] drop-shadow-lg">
            ₹ {formatINR(totalIncome - totalExpense)}
          </h1>
          <div className="w-fit h-auto px-5 py-1.5 text-[12px] tracking-[1px] rounded-full text-sm font-[500] text-white bg-[#00ca51]">
            Total Profit
          </div>
        </div>
      </div>

      {/* Total Income */}
      <div className="glass-card w-full rounded-[15px] flex justify-start gap-[25px] items-center">
        <img
          src={IncomeImg}
          alt="Income"
          className="w-30 h-30 object-cover rounded-full hover:scale-110 transition-transform duration-300"
        />
        <div className="w-auto h-full flex flex-col gap-[7.5px] tems-start justify-center">
          <h1 className="capitalize SmallFont font-bold tracking-wider text-[25px] text-[#ebb102] drop-shadow-lg">
            ₹ {formatINR(totalIncome)}
          </h1>
          <div className="w-fit h-auto px-5 py-1.5 text-[12px] tracking-[1px] rounded-full text-sm font-[500] text-white bg-[#ebb102]">
            Total Income
          </div>
        </div>
      </div>

      {/* Total Expense */}
      <div className="glass-card w-full rounded-[15px] flex justify-start gap-[25px] items-center">
        <img
          src={ExpenseImg}
          alt="Expense"
          className="w-30 h-30 object-cover rounded-full hover:scale-110 transition-transform duration-300"
        />
        <div className="w-auto h-full flex flex-col gap-[7.5px] tems-start justify-center">
          <h1 className="capitalize SmallFont font-bold tracking-wider text-[25px] text-[#f5313b] drop-shadow-lg">
            ₹ {formatINR(totalExpense)}
          </h1>
          <div className="w-fit h-auto px-5 py-1.5 text-[12px] tracking-[1px] rounded-full text-sm font-[500] text-white bg-[#f5313b]">
            Total Expense
          </div>
        </div>
      </div>

      {/* Pending Amount */}
      <div className="glass-card w-full rounded-[15px] flex justify-start gap-[25px] items-center">
        <img
          src={PendigImg}
          alt="Pending"
          className="w-25 h-25 object-cover rounded-full hover:scale-110 transition-transform duration-300"
        />
        <div className="w-auto h-full flex flex-col gap-[7.5px] tems-start justify-center">
          <h1 className="capitalize SmallFont font-bold tracking-wider text-[25px] text-[#f5349a] drop-shadow-lg">
            ₹ {formatINR(totalRevenue - totalIncome)}
          </h1>
          <div className="w-fit h-auto px-5 py-1.5 text-[12px] tracking-[1px] rounded-full text-sm font-[500] text-white bg-[#f5349a]">
            Pending Amount
          </div>
        </div>
      </div>

      {/* Graph (col-span-2) */}
      <div className="h-[350px] flex items-center justify-center col-span-2 glass-card p-5 rounded-[15px]">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={graphData}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <YAxis />

            {/* Custom Tooltip */}
            <Tooltip content={<CustomTooltip />} cursor={false} />

            <Bar
              dataKey="amount"
              radius={[10, 10, 0, 0]}
              barSize={75} // Bar ki width
              isAnimationActive={true} // Animation
            >
              {graphData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="max-h-[350px] glass-card rounded-[15px] p-4 overflow-y-auto flex flex-col gap-[15px] client-notes">
        <h2 className="capitalize SmallFont font-bold tracking-wider text-[22px] bg-clip-text text-transparent bg-gradient-to-r from-[#1966FF] to-[#00D4FF] drop-shadow-lg">
          Client Notes
        </h2>
        <ul className="flex flex-col gap-[15px]">
          {clientNotes.length > 0 ? (
            clientNotes.map((client) => (
              <li
                key={client.id}
                className="p-4 rounded-lg bg-white/5 backdrop-blur-md shadow-sm"
              >
                <p className="font-medium text-blue-400 text-[16px] break-words">
                  {client.name}
                </p>
                <p className="text-[14px] text-gray-200 mt-2 font-medium tracking-normal break-words whitespace-normal">
                  {client.notes}
                </p>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No client notes available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default App;
