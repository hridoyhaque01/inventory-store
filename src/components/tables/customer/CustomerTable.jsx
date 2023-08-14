import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../shared/pagination/Pagination";

function CustomerTable({ data }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeButton, setActiveButton] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [imageUrl, setImageUrl] = useState();
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data?.slice(indexOfFirstRow, indexOfLastRow);

  const handleNavigate = (item) => {
    navigate("/customer-edit", {
      state: {
        payload: item,
        type: "edit",
      },
    });
  };

  return (
    <div className="h-full overflow-auto flex flex-col items-end justify-between pb-4 gap-4">
      <table className="table w-full">
        <thead className=" p-0">
          <tr className="font-bold text-center text-3xl">
            <th className="bg-primaryMainLightest text-blackHigh text-base normal-case">
              Serial
            </th>
            <th className="bg-primaryMainLightest text-blackHigh text-base normal-case p-2">
              Name
            </th>

            <th className="bg-primaryMainLightest text-blackHigh text-base normal-case">
              Phone Number
            </th>

            <th className="bg-primaryMainLightest text-blackHigh text-base normal-case">
              Address
            </th>

            <th className="bg-primaryMainLightest text-blackHigh text-base normal-case">
              Action
            </th>
          </tr>
        </thead>
        {currentRows?.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan="6" className="">
                No data found
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody className="text-center">
            {currentRows?.map((customer, i) => (
              <tr className="text-center" key={i}>
                <td className="py-3">
                  {currentPage === 1 && i + 1 < 10
                    ? "0" + (rowsPerPage * (currentPage - 1) + i + 1)
                    : rowsPerPage * (currentPage - 1) + i + 1}
                </td>
                <td className="py-3">{customer?.customerName}</td>

                <td className="py-3">{customer?.customerPhone}</td>
                <td className="py-3">{customer?.customerAddress}</td>
                <td className="py-3">
                  <button
                    type="button"
                    onClick={() => handleNavigate(customer)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M3.64355 16.3148L12.0605 7.89792M3.64355 16.3148L12.0605 7.89792M3.64355 16.3148C3.55625 16.4021 3.5 16.5354 3.5 16.6613V19.0013C3.5 19.2751 3.72614 19.5013 4 19.5013H6.34C6.46935 19.5013 6.59727 19.4496 6.70192 19.3523M3.64355 16.3148L6.70192 19.3523M12.0605 7.89792L15.1124 10.9418L6.70192 19.3523M12.0605 7.89792L6.70192 19.3523M19 19.5013H12.2071L15.2071 16.5013H19C19.8239 16.5013 20.5 17.1774 20.5 18.0013C20.5 18.8251 19.8239 19.5013 19 19.5013ZM18.3564 6.98483C18.5512 7.17957 18.5512 7.49299 18.3564 7.68773L16.88 9.16417L13.8371 6.12128L15.3136 4.64483C15.5083 4.45009 15.8217 4.45009 16.0164 4.64483L18.3564 6.98483Z"
                        fill="#F4A100"
                        stroke="#F4A100"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalRows={data?.length}
      ></Pagination>
    </div>
  );
}

export default CustomerTable;
