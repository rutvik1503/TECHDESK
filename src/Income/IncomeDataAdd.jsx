import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { database } from "../../Firebase/Firebase";

const IncomeDataAdd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [incomeDate, setIncomeDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [clients, setClients] = useState([]);

  // Fetch clients for dropdown
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientSnapshot = await getDocs(collection(database, "ClientData"));
        setClients(clientSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  // Prefill client if redirected from ClientCard
  useEffect(() => {
    if (location.state?.clientName) {
      setSelectedClient(location.state.clientName);
    }
  }, [location]);

  // Fetch existing income data if editing
  useEffect(() => {
    if (!id) return;

    const fetchIncome = async () => {
      try {
        const docRef = doc(database, "IncomeData", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setIncomeDate(data.date || new Date().toISOString().split("T")[0]);
          setAmount(data.amount || "");
          setSelectedClient(data.clientName || "");
          setDescription(data.description || "");
        }
      } catch (error) {
        console.error("Error fetching income:", error);
      }
    };

    fetchIncome();
  }, [id]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Date validation
    const minDate = new Date("2024-01-01");
    const maxDate = new Date();
    const selectedDate = new Date(incomeDate);
    if (!incomeDate) {
      newErrors.incomeDate = "Date is required";
    } else if (selectedDate < minDate || selectedDate > maxDate) {
      newErrors.incomeDate = "Date must be between 01 Jan 2024 and today";
    }

    // Amount validation
    if (!amount || Number(amount) <= 0) newErrors.amount = "Enter a valid amount";

    if (!selectedClient) newErrors.selectedClient = "Select a client";
    if (!description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save or update income
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const incomeData = {
      date: incomeDate,
      amount: Number(amount),
      clientName: selectedClient,
      description,
    };

    try {
      if (id) {
        await updateDoc(doc(database, "IncomeData", id), incomeData);
        alert("Income updated successfully!");
      } else {
        const docRef = await addDoc(collection(database, "IncomeData"), incomeData);
        alert("Income added successfully! ID: " + docRef.id);
      }
      navigate("/income");
    } catch (error) {
      console.error("Error saving income:", error);
      alert("Error saving income");
    }
  };

  return (
    <div className="w-full h-auto rounded-[20px] flex flex-col gap-[15px]">
      <div className="glass-card flex justify-between items-center rounded-[15px] p-5 shadow-lg">
        <h1 className="capitalize SmallFont font-bold tracking-wider text-[22px] bg-clip-text text-transparent bg-gradient-to-r from-[#1966FF] to-[#00D4FF] drop-shadow-lg">
          {id ? "Edit Income" : "Add New Income"}
        </h1>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-2 gap-[15px] SmallFont">
          {/* Date */}
          <div className="glass-card rounded-[15px] flex flex-col gap-[5px]">
            <label className="text-[17.5px] font-[500] tracking-[1px]">Date</label>
            <input
              type="date"
              value={incomeDate}
              onChange={(e) => setIncomeDate(e.target.value)}
              min="2024-01-01"
              max={new Date().toISOString().split("T")[0]}
              className="glass-card white-date-icon rounded-[10px] h-[40px] px-3 text-[13px]"
            />
            {errors.incomeDate && (
              <span className="text-red-500 text-[12px]">{errors.incomeDate}</span>
            )}
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
            {errors.amount && (
              <span className="text-red-500 text-[12px]">{errors.amount}</span>
            )}
          </div>

          {/* Client */}
          <div className="glass-card rounded-[15px] flex flex-col gap-[5px] col-span-2">
            <label className="text-[16px] font-[500] tracking-[0.5px]">Client</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full rounded-[12px] px-4 py-2 text-[14px] bg-white/10 backdrop-blur-md border border-white/20 text-white appearance-none cursor-pointer transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>Select Client</option>
              {clients.map((client) => (
                <option className="bg-[#0a0a0a]/70 text-white backdrop-blur-lg hover:bg-[#1a1a1a]/70 focus:bg-gradient-to-r focus:from-[#1966FF] focus:to-[#00D4FF]" key={client.id} value={client.name}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.selectedClient && (
              <span className="text-red-500 text-[12px]">{errors.selectedClient}</span>
            )}
          </div>

          {/* Description */}
          <div className="glass-card rounded-[15px] flex flex-col gap-[5px] col-span-2">
            <label className="text-[16px] font-[500] tracking-[0.5px]">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description..."
              className="glass-card no-default rounded-[10px] h-[80px] px-3 py-2 text-[13px]"
            />
            {errors.description && (
              <span className="text-red-500 text-[12px]">{errors.description}</span>
            )}
          </div>

          {/* Save Button */}
          <div className="col-span-2 mt-2 flex justify-center">
            <button
              type="submit"
              className="w-[60%] h-[45px] rounded-[12px] bg-gradient-to-r from-[#0b4ccd] to-[#03a8c9] hover:from-[#0198b6] hover:to-[#0445c6] text-white shadow-lg transition"
            >
              {id ? "Update Income" : "Save Income"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default IncomeDataAdd;
