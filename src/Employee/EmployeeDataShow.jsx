import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { database } from "../../Firebase/Firebase";

const EmployeeDataShow = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const employeeCollection = collection(database, "EmployeeData");
        const snapshot = await getDocs(employeeCollection);

        let employeeList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort employees by name A-Z
        employeeList.sort((a, b) => {
          const nameA = (a.name || "").toLowerCase();
          const nameB = (b.name || "").toLowerCase();
          return nameA.localeCompare(nameB);
        });

        setEmployees(employeeList);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, []);

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="glass-card flex justify-between items-center rounded-[15px] p-5 shadow-lg">
        <h1 className="capitalize SmallFont font-bold tracking-wider text-[22px] bg-clip-text text-transparent bg-gradient-to-r from-[#1966FF] to-[#00D4FF] drop-shadow-lg">
          Employee Details
        </h1>

        <button
          onClick={() => navigate("/addemployee")}
          className="px-6 py-2 SmallFont text-white text-[14px] tracking-[1px] font-medium rounded-[20px] bg-gradient-to-r from-[#0b4ccd] to-[#03a8c9] hover:from-[#0198b6] hover:to-[#0445c6] shadow-md hover:shadow-xl transition-all duration-300"
        >
          + Add Employee
        </button>
      </div>

      <div className="">
        <table className="glass-card rounded-[10px] shadow-lg overflow-hidden w-full border-collapse SmallFont">
          <thead>
            <tr className="bg-gradient-to-r from-[#1966FF] to-[#01a8c9] text-white">
              <th className="p-4 text-center text-[12.5px] tracking-[1px] uppercase font-[500] w-[60px]">
                No
              </th>
              <th className="p-4 text-center text-[12.5px] tracking-[1px] uppercase font-[500]">
                Name
              </th>
              <th className="p-4 text-center text-[12.5px] tracking-[1px] uppercase font-[500]">
                Email
              </th>
              <th className="p-4 text-center text-[12.5px] tracking-[1px] uppercase font-[500]">
                Department
              </th>
              <th className="p-4 text-center text-[12.5px] tracking-[1px] uppercase font-[500]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp, index) => (
                <tr
                  key={emp.id}
                  className={`transition ${
                    index % 2 === 0 ? "bg-white/1" : "bg-white/3"
                  } hover:bg-[#1a2533]/60`}
                >
                  <td className="p-4 text-center text-white/90 text-[12.5px] font-[400] tracking-[0.75px]">
                    {index + 1}
                  </td>
                  <td className="p-4 text-center text-white/90 text-[12.5px] font-[400] tracking-[0.75px]">
                    {emp.name || "N/A"}
                  </td>
                  <td className="p-4 text-center text-white/90 text-[12.5px] font-[400] tracking-[0.75px]">
                    {emp.email || "N/A"}
                  </td>
                  <td className="p-4 text-center text-white/90 text-[12.5px] font-[400] tracking-[0.75px]">
                    {emp.department || "N/A"}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => navigate(`/employeecard/${emp.id}`)}
                      className="px-5 py-1 rounded-[15px] text-[12.5px] font-[400] tracking-[0.75px] cursor-pointer text-sm shadow-md text-[#1966FF]"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-6 text-center text-gray-400" colSpan="5">
                  No Employees Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeDataShow;
