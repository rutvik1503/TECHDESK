import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { database } from "../../Firebase/Firebase";

const ClientDataAdd = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientMainService, setClientMainService] = useState("");
  const [clientService, setClientService] = useState([]);
  const [assignedEmployee, setAssignedEmployee] = useState([]);
  const [clientNote, setClientNote] = useState("");
  const [clientTotalPayment, setClientTotalPayment] = useState("");
  const [clientPaidAmount, setClientPaidAmount] = useState("");
  const [clientDate, setClientDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [employees, setEmployees] = useState([]);

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const snapshot = await getDocs(collection(database, "EmployeeData"));
        setEmployees(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch client data if editing
  useEffect(() => {
    if (!id) return;
    const fetchClient = async () => {
      const docSnap = await getDoc(doc(database, "ClientData", id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setClientName(data.name || "");
        setClientEmail(data.email || "");
        setClientPhone(data.phone || "");
        setClientAddress(data.address || "");
        setClientMainService(data.mainService || "");
        setClientService(data.subServices || []);
        setAssignedEmployee(data.assignedEmployees || []);
        setClientNote(data.notes || "");
        setClientTotalPayment(data.totalPayment || "");
        setClientPaidAmount(data.paidAmount || "");
        setClientDate(data.addedDate || new Date().toISOString().split("T")[0]);
      }
    };
    fetchClient();
  }, [id]);

  // Filter employees based on selected sub-services
  const filteredEmployees =
    clientService.length > 0
      ? employees.filter((emp) =>
          emp.role?.some((r) => clientService.includes(r))
        )
      : [];

  // Handle form save
  const handleSave = async (e) => {
    e.preventDefault();

    // Date validation
    const minDate = new Date("2024-01-01");
    const maxDate = new Date();
    const selectedDate = new Date(clientDate);

    if (selectedDate < minDate || selectedDate > maxDate) {
      alert("Date must be between 01 Jan 2024 and today!");
      return;
    }

    // Required fields validation
    if (
      !clientName ||
      !clientEmail ||
      !clientMainService ||
      clientService.length === 0
    ) {
      alert(
        "Please fill all required fields (Name, Email, Main Service, Sub Services)"
      );
      return;
    }

    const clientData = {
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
      address: clientAddress,
      mainService: clientMainService,
      subServices: clientService,
      assignedEmployees: assignedEmployee,
      notes: clientNote,
      totalPayment: clientTotalPayment ? Number(clientTotalPayment) : 0,
      paidAmount: clientPaidAmount ? Number(clientPaidAmount) : 0,
      addedDate: clientDate,
    };

    try {
      let clientRef;
      if (id) {
        clientRef = doc(database, "ClientData", id);
        await updateDoc(clientRef, clientData);
      } else {
        clientRef = await addDoc(
          collection(database, "ClientData"),
          clientData
        );

        if (clientPaidAmount > 0) {
          await addDoc(collection(database, "IncomeData"), {
            clientId: clientRef.id,
            clientName,
            amount: Number(clientPaidAmount),
            description: "Initial Payment",
            date: clientDate,
          });
        }
      }

      alert(id ? "Client updated successfully!" : "Client added successfully!");
      navigate("/client");
    } catch (err) {
      console.error(err);
      alert("Failed to save client. Check console for details.");
    }
  };

  return (
    <div className="flex flex-col gap-[15px]">
      <div className="glass-card rounded-[15px]">
        <h1 className="capitalize SmallFont font-bold tracking-wider text-[22px] bg-clip-text text-transparent bg-gradient-to-r from-[#1966FF] to-[#00D4FF] drop-shadow-lg">
          {id ? "Edit Client" : "Add New Client"}
        </h1>
      </div>

      <form
        onSubmit={handleSave}
        className="grid grid-cols-2 gap-[15px] SmallFont"
      >
        {/* Client Name */}
        <div className="glass-card rounded-[15px] flex flex-col gap-[5px]">
          <label className="text-[17.5px] font-[500] tracking-[1px]">
            Client Name*
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Enter client name..."
            className="glass-card no-default rounded-[10px] h-[40px] px-3 text-[13px]"
          />
        </div>

        {/* Email */}
        <div className="glass-card rounded-[15px] flex flex-col gap-[5px]">
          <label className="text-[17.5px] font-[500] tracking-[1px]">
            Email*
          </label>
          <input
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            placeholder="Enter client email..."
            className="glass-card no-default rounded-[10px] h-[40px] px-3 text-[13px]"
          />
        </div>

        {/* Phone */}
        <div className="glass-card rounded-[15px] flex flex-col gap-[5px]">
          <label className="text-[17.5px] font-[500] tracking-[1px]">
            Phone
          </label>
          <input
            type="tel"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            placeholder="Enter client phone..."
            className="glass-card no-default rounded-[10px] h-[40px] px-3 text-[13px]"
          />
        </div>

        {/* Date */}
        <div className="glass-card rounded-[15px] flex flex-col gap-[5px]">
          <label className="text-[17.5px] font-[500] tracking-[1px]">
            Date of Adding*
          </label>
          <input
            type="date"
            value={clientDate}
            onChange={(e) => setClientDate(e.target.value)}
            min="2024-01-01"
            max={new Date().toISOString().split("T")[0]}
            className="glass-card no-default white-date-icon rounded-[10px] h-[40px] px-3 text-[13px]"
          />
        </div>

        {/* Address */}
        <div className="glass-card rounded-[15px] flex flex-col gap-[5px] col-span-2">
          <label className="text-[17.5px] font-[500] tracking-[1px]">
            Address
          </label>
          <textarea
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
            placeholder="Enter client address..."
            className="glass-card no-default rounded-[10px] px-3 py-2 text-[13px]"
          />
        </div>

        {/* Main Service */}
        <div className="glass-card rounded-[15px] flex flex-col gap-[5px] col-span-2">
          <label className="text-[16px] font-[500] tracking-[0.5px]">
            Main Service*
          </label>
          <select
            value={clientMainService}
            onChange={(e) => {
              setClientMainService(e.target.value);
              setClientService([]);
              setAssignedEmployee([]);
            }}
            className="w-full rounded-[12px] px-4 py-2 text-[14px] bg-white/10 backdrop-blur-md border border-white/20 text-white appearance-none cursor-pointer transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="" disabled>
              Select main service
            </option>
            {Object.keys(services).map((s) => (
              <option
                className="bg-[#0a0a0a]/70 text-white backdrop-blur-lg hover:bg-[#1a1a1a]/70 focus:bg-gradient-to-r focus:from-[#1966FF] focus:to-[#00D4FF]"
                key={s}
                value={s}
              >
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Sub Services */}
        {clientMainService && (
          <div className="glass-card rounded-[15px] flex flex-col gap-[5px] col-span-2 p-4">
            <label className="text-[16px] font-[500] tracking-[0.75px]">
              Sub Services*
            </label>
            <div className="flex flex-wrap gap-2 mt-1">
              {services[clientMainService].map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() =>
                    clientService.includes(sub)
                      ? setClientService(clientService.filter((s) => s !== sub))
                      : setClientService([...clientService, sub])
                  }
                  className={`px-3 h-[40px] rounded-[8px] text-[12px] transition ${
                    clientService.includes(sub)
                      ? "bg-gradient-to-r from-[#1966FF] to-[#00D4FF] text-white"
                      : "glass-card text-white/80 hover:text-white"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Assigned Employees */}
        {clientService.length > 0 && (
          <div className="glass-card rounded-[15px] flex flex-col gap-[5px] col-span-2 p-4">
            <label className="text-[16px] font-[500] tracking-[0.75px]">
              Assign Employees
            </label>
            {filteredEmployees.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {filteredEmployees.map((emp) => (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() =>
                      assignedEmployee.includes(emp.id)
                        ? setAssignedEmployee(
                            assignedEmployee.filter((e) => e !== emp.id)
                          )
                        : setAssignedEmployee([...assignedEmployee, emp.id])
                    }
                    className={`px-3 h-[40px] rounded-[8px] text-[12px] transition ${
                      assignedEmployee.includes(emp.id)
                        ? "bg-gradient-to-r from-[#1966FF] to-[#00D4FF] text-white"
                        : "glass-card text-white/80 hover:text-white"
                    }`}
                  >
                    {emp.name} ({emp.department})
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-white/60 mt-1">
                No employees available for selected sub-services
              </p>
            )}
          </div>
        )}

        {/* Total Payment */}
        <div className="glass-card rounded-[15px] flex flex-col gap-[5px]">
          <label className="text-[16px] font-[500] tracking-[0.5px]">
            Total Payment
          </label>
          <input
            type="number"
            value={clientTotalPayment}
            onChange={(e) => setClientTotalPayment(e.target.value)}
            placeholder="Enter Total Payment..."
            className="glass-card no-default rounded-[10px] h-[40px] px-3 text-[13px]"
          />
        </div>

        {/* Paid Amount */}
        <div className="glass-card rounded-[15px] flex flex-col gap-[5px]">
          <label className="text-[16px] font-[500] tracking-[0.5px]">
            Paid Amount
          </label>
          <input
            type="number"
            value={clientPaidAmount}
            onChange={(e) => setClientPaidAmount(e.target.value)}
            placeholder="Enter Paid Amount..."
            className="glass-card no-default rounded-[10px] h-[40px] px-3 text-[13px]"
          />
        </div>

        {/* Notes */}
        <div className="glass-card rounded-[15px] flex flex-col gap-[5px] col-span-2">
          <label className="text-[16px] font-[500] tracking-[0.5px]">
            Notes
          </label>
          <textarea
            value={clientNote}
            onChange={(e) => setClientNote(e.target.value)}
            placeholder="Enter any notes..."
            className="glass-card no-default rounded-[10px] px-3 py-2 text-[13px]"
          />
        </div>

        {/* Save Button */}
        <div className="col-span-2 mt-4 flex justify-center">
          <button
            type="submit"
            className="w-[60%] h-[45px] rounded-[12px] bg-gradient-to-r from-[#0b4ccd] to-[#03a8c9] hover:from-[#0198b6] hover:to-[#0445c6] text-white shadow-lg transition"
          >
            {id ? "Update Client" : "Save Client"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientDataAdd;
