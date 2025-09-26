import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Layout from "./Layout.jsx";
import App from "./App.jsx";
import ClientDataShow from "./Client/ClientDataShow.jsx";
import ClientDataAdd from "./Client/ClientDataAdd.jsx";
import EmployeeDataShow from "./Employee/EmployeeDataShow.jsx";
import EmployeeDataAdd from "./Employee/EmployeeDataAdd.jsx";
import ExpenseDataShow from "./Expense/ExpenseDataShow.jsx";
import ExpenseDataAdd from "./Expense/ExpenseDataAdd.jsx";
import IncomeDataShow from "./Income/IncomeDataShow.jsx";
import IncomeDataAdd from "./Income/IncomeDataAdd.jsx";
import EmployeeCard from "./Employee/EmoployeeCard.jsx";
import ClientCard from "./Client/ClientcARD.JSX";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />

          {/* Client */}
          <Route path="client" element={<ClientDataShow />} />
          <Route path="addclient" element={<ClientDataAdd />} />
          <Route path="addclient/:id" element={<ClientDataAdd />} />
          <Route path="clientcard/:id" element={<ClientCard />} />

          {/* Employee */}
          <Route path="employee" element={<EmployeeDataShow />} />
          <Route path="addemployee" element={<EmployeeDataAdd />} />
          <Route path="addemployee/:id" element={<EmployeeDataAdd />} />
          <Route path="employeecard/:id" element={<EmployeeCard />} />

          {/* Expense */}
          <Route path="expense" element={<ExpenseDataShow />} />
          <Route path="addexpense" element={<ExpenseDataAdd />} />
          <Route path="addexpense/:id" element={<ExpenseDataAdd />} />

          {/* Income */}
          <Route path="income" element={<IncomeDataShow />} />
          <Route path="addincome" element={<IncomeDataAdd />} />
          <Route path="addincome/:id" element={<IncomeDataAdd />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
