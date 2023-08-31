import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../shared/pagination/Pagination";

function StoreTable({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeButton, setActiveButton] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [imageUrl, setImageUrl] = useState();
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data?.slice(indexOfFirstRow, indexOfLastRow);
  const navigate = useNavigate();

  const handleNavigate = (store) => {
    navigate("/store-details", {
      state: {
        payload: store,
      },
    });
  };

  return (
    <>
      <div>
        <table className="table w-full">
          <thead className=" p-0">
            <tr className="font-bold text-3xl">
              <th className="bg-primaryMainLightest text-bold normal-case p-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-accent border-fadeHigh text-base  checkbox-sm rounded "
                  name="checkbox"
                />
              </th>

              <th className="bg-primaryMainLightest text-blackHigh text-base normal-case">
                Serial
              </th>
              <th className="bg-primaryMainLightest text-blackHigh text-base normal-case">
                Created
              </th>
              <th className="bg-primaryMainLightest text-blackHigh text-base normal-case">
                Name
              </th>

              <th className="bg-primaryMainLightest text-blackHigh text-base normal-case">
                Location
              </th>

              <th className="bg-primaryMainLightest text-blackHigh text-base normal-case text-center">
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
            <tbody className="">
              {currentRows?.map((store, i) => (
                <tr className="" key={store?._id}>
                  <th className="p-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-accent border-fadeHigh  checkbox-sm rounded "
                      name="checkbox"
                    />
                  </th>
                  <td className="py-3">
                    {currentPage === 1 && i + 1 < 10
                      ? "0" + (rowsPerPage * (currentPage - 1) + i + 1)
                      : rowsPerPage * (currentPage - 1) + i + 1}
                  </td>
                  <td className="py-3">
                    {new Date(store?.timestamp).toLocaleDateString("en-US")}
                  </td>

                  <td className="py-3">{store?.name}</td>
                  <td className="py-3">{store?.location}</td>
                  <td className="py-3 text-center">
                    <button
                      type="button"
                      className="inline-flex bg-successLight px-4 py-3 rounded-xl text-successColor cursor-pointer"
                      onClick={() => handleNavigate(store)}
                    >
                      See Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <div className="pl-6">
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalRows={data?.length}
        ></Pagination>
      </div>
    </>
  );
}

export default StoreTable;
