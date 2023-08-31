import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import InvoiceModal from "../../modals/InvoiceModal";
import { Pagination } from "../../shared/pagination/Pagination";

function SalesTable({ data }) {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data?.slice(indexOfFirstRow, indexOfLastRow);
  const [activeData, setActiveData] = useState({});
  const [activeInvoice, setActiveInvoice] = useState("");
  const targetRef = useRef();
  const { t } = useTranslation();

  const handleNavigate = (data) => {
    navigate("/sales-edit", {
      state: {
        payload: data,
      },
    });
  };

  const generatePDF = useReactToPrint({
    content: () => targetRef.current,
    documentTitle: "reciept",
  });

  const handlePdf = (data, index) => {
    setActiveData(data);
    setActiveInvoice(index);
    setTimeout(() => {
      generatePDF();
    }, 1000);
  };

  return (
    <>
      <div className="overflow-auto w-full flex flex-col items-start justify-between pb-4 gap-4 ">
        <table className="table w-full overflow-auto ">
          <thead className=" p-0">
            <tr className="font-bold text-center text-3xl">
              <th className="bg-primaryMainLightest text-blackHigh text-base normal-case p-2">
                {t("tables.serial")}
              </th>

              <th className="bg-primaryMainLightest text-blackHigh text-base normal-case">
                {t("tables.productId")}
              </th>

              <th className="bg-primaryMainLightest text-blackHigh text-base normal-case">
                {t("tables.productName")}
              </th>

              <th className="bg-primaryMainLightest text-blackHigh text-base normal-case">
                {t("cards.totalSales")}
              </th>

              <th className="bg-primaryMainLightest text-blackHigh text-base normal-case">
                {t("tables.shopName")}
              </th>

              <th className="bg-primaryMainLightest text-blackHigh text-base normal-case">
                {t("tables.quantity")}
              </th>

              <th className="bg-primaryMainLightest text-blackHigh text-base normal-case">
                {t("tables.sellingPrice")}
              </th>

              <th className="bg-primaryMainLightest text-blackHigh text-base normal-case">
                {t("tables.action")}
              </th>
            </tr>
          </thead>
          {currentRows?.length === 0 ? (
            <tbody>
              <tr className="border-none">
                <td colSpan="10" className="py-6">
                  <h2 className="text-center text-lg text-blackRgb font-medium">
                    {t("noData")}
                  </h2>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="text-center">
              {currentRows?.map((item, i) => (
                <tr className="text-center" key={item?._id}>
                  <td className="py-3">
                    {currentPage === 1 && i + 1 < 10
                      ? "0" + (rowsPerPage * (currentPage - 1) + i + 1)
                      : rowsPerPage * (currentPage - 1) + i + 1}
                  </td>
                  <td className="py-3">{item?.productId}</td>

                  <td className="py-3">{item?.productName}</td>
                  <td className="py-3">
                    {parseInt(item?.unitCount) * parseInt(item?.unitPrice)}
                  </td>
                  <td className="py-3">{item?.storeName}</td>
                  <td className="py-3">{item?.unitCount}</td>
                  <td className="py-3">{item?.unitPrice}</td>
                  <td className="py-3 flex items-center justify-center gap-2">
                    <label
                      type="button"
                      className="cursor-pointer"
                      onClick={() => handlePdf(item, i)}
                      // htmlFor="invoiceModal"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 128 128"
                        id="pdf-file"
                        className="w-6 h-6"
                      >
                        <path
                          fill="#ff402f"
                          d="M95.21 80.32c-.07-.51-.48-1.15-.92-1.58-1.26-1.24-4.03-1.89-8.25-1.95-2.86-.03-6.3.22-9.92.73-1.62-.93-3.29-1.95-4.6-3.18-3.53-3.29-6.47-7.86-8.31-12.89.12-.47.22-.88.32-1.3 0 0 1.98-11.28 1.46-15.1-.07-.52-.12-.67-.26-1.08l-.17-.44c-.54-1.25-1.6-2.57-3.26-2.5l-.98-.03h-.02c-1.86 0-3.36.95-3.76 2.36-1.2 4.44.04 11.09 2.29 19.69l-.58 1.4c-1.61 3.94-3.63 7.9-5.41 11.39l-.23.45c-1.88 3.67-3.58 6.79-5.13 9.43l-1.59.84c-.12.06-2.85 1.51-3.49 1.89-5.43 3.25-9.03 6.93-9.63 9.85-.19.94-.05 2.13.92 2.68l1.54.78c.67.33 1.38.5 2.1.5 3.87 0 8.36-4.82 14.55-15.62 7.14-2.32 15.28-4.26 22.41-5.32 5.43 3.05 12.11 5.18 16.33 5.18.75 0 1.4-.07 1.92-.21.81-.22 1.49-.68 1.91-1.3.82-1.23.98-2.93.76-4.67zM36.49 99.33c.7-1.93 3.5-5.75 7.63-9.13.26-.21.9-.81 1.48-1.37-4.32 6.89-7.21 9.63-9.11 10.5zM60.95 43c1.24 0 1.95 3.13 2.01 6.07.06 2.94-.63 5-1.48 6.53-.71-2.26-1.05-5.82-1.05-8.15 0 0-.05-4.45.52-4.45zm-7.3 40.14c.87-1.55 1.77-3.19 2.69-4.92 2.25-4.25 3.67-7.57 4.72-10.3 2.1 3.82 4.72 7.07 7.79 9.67.39.32.8.65 1.22.98-6.25 1.23-11.66 2.74-16.42 4.57zm39.43-.35c-.38.23-1.47.37-2.17.37-2.26 0-5.07-1.03-9-2.72 1.51-.11 2.9-.17 4.14-.17 2.27 0 2.94-.01 5.17.56 2.22.57 2.25 1.72 1.86 1.96z"
                        ></path>
                        <path
                          fill="#ff402f"
                          d="M104 80c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm10.882 16.988-.113.176-8.232 11.438c-.548.866-1.508 1.398-2.537 1.398s-1.989-.532-2.536-1.397l-8.346-11.614a3.01 3.01 0 0 1 .01-2.994 3.01 3.01 0 0 1 2.596-1.494H100V86c0-1.654 1.346-3 3-3h2c1.654 0 3 1.346 3 3v6.5h4.276c1.065 0 2.061.572 2.596 1.494a3.01 3.01 0 0 1 .01 2.994z"
                        ></path>
                        <path
                          fill="#ff9a30"
                          d="m84 125.95-.05.05H84zM114 77v-.05l-.05.05z"
                        ></path>
                        <path
                          fill="#ff402f"
                          d="M111.071 44.243 71.757 4.929A9.936 9.936 0 0 0 64.687 2H24c-5.514 0-10 4.486-10 10v104c0 5.514 4.486 10 10 10h59.95l-4-4H24c-3.309 0-6-2.691-6-6V12c0-3.309 2.691-6 6-6h40.687c1.603 0 3.109.624 4.242 1.757l39.314 39.314A6.044 6.044 0 0 1 110 51.313V72.95l4 4V51.313c0-2.67-1.04-5.181-2.929-7.07z"
                        ></path>
                        <path fill="#fff" d="m113.95 77 .05-.05-4-4"></path>
                      </svg>
                    </label>
                    <button type="button" onClick={() => handleNavigate(item)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M2.9416 12.2289L2.94163 12.2289L2.93686 12.2243C2.65588 11.9507 2.49805 11.5709 2.49805 11.1725V4.0025C2.49805 3.17864 3.17419 2.5025 3.99805 2.5025H11.168C11.5671 2.5025 11.9495 2.66102 12.2245 2.93606L21.0545 11.7661C21.6509 12.3624 21.6476 13.3058 21.0645 13.8889L13.8945 21.0589C13.3098 21.6437 12.3563 21.6437 11.7716 21.0589L2.9416 12.2289ZM4.49805 6.5025C4.49805 7.60864 5.3919 8.5025 6.49805 8.5025C7.60419 8.5025 8.49805 7.60864 8.49805 6.5025C8.49805 5.39636 7.60419 4.5025 6.49805 4.5025C5.3919 4.5025 4.49805 5.39636 4.49805 6.5025Z"
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
      </div>
      <div className="pl-6">
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalRows={data?.length}
        ></Pagination>
        <div>
          <InvoiceModal
            data={activeData}
            activeInvoice={activeInvoice}
            ref={targetRef}
          ></InvoiceModal>
        </div>
      </div>
    </>
  );
}

export default SalesTable;
