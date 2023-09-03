import React, { forwardRef } from "react";

const InvoiceModal = forwardRef(({ data, activeInvoice }, targetRef) => {
  return (
    <section>
      <input type="checkbox" id="invoiceModal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-11/12 max-w-[700px] flex flex-col items-center justify-center gap-4 bg-white relative">
          <div className="absolute top-2 right-2">
            <label
              htmlFor="invoiceModal"
              className="inline-flex items-center justify-center w-7 h-7 bg-blueLight rounded-full cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 32 32"
                id="close"
              >
                <path d="M10.05 23.95a1 1 0 0 0 1.414 0L17 18.414l5.536 5.536a1 1 0 0 0 1.414-1.414L18.414 17l5.536-5.536a1 1 0 0 0-1.414-1.414L17 15.586l-5.536-5.536a1 1 0 0 0-1.414 1.414L15.586 17l-5.536 5.536a1 1 0 0 0 0 1.414z"></path>
              </svg>
            </label>
          </div>
          <div className="w-[612px] max-w-[612px] h-[790px] max-h-[790px]">
            <div
              ref={targetRef}
              className="w-[612px] max-w-[612px] h-[790px] max-h-[790px] mx-auto p-8 bg-whiteHigh"
            >
              <article className="overflow-">
                <div className="">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-2xl font-medium">
                        {data?.storeName}
                      </h2>
                      <p className="text-xs">{data?.storeAddress}</p>
                      <p className="text-xs">{data?.storeEmail}</p>
                    </div>
                    <div className="">
                      <h2 className="text-3xl text-primaryMainDarkest font-bold tracking-tight uppercase">
                        INVOICE
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-start justify-between  mt-11">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-base font-semibold text-primaryMainDarkest">
                        Invoice to:
                      </h2>
                      <p className="text-primaryMainDarkest font-medium">
                        {data?.customerName}
                      </p>
                      <p className="text-xs">{data?.customerId}</p>
                      <p className="text-xs">{data?.customerAddress}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <h2 className="text-xs font-semibold text-primaryMainDarkest flex items-center gap-2">
                        <span className="">Invoice number:</span>
                        <span className="text-fadeColor">{activeInvoice}</span>
                      </h2>
                      <h2 className="text-xs font-semibold text-primaryMainDarkest flex items-center gap-2">
                        <span className="">Date Issued:</span>
                        <span className="text-fadeColor">
                          {new Date(data?.payDate * 1000).toLocaleDateString(
                            "en-US"
                          )}
                        </span>
                      </h2>
                      {/* <h2 className="text-xs font-semibold text-primaryMainDarkest flex items-center gap-2">
                        <span className="inline-block w-28 text-right">
                          Due Date:
                        </span>
                        <span className="text-fadeColor">
                          {data?.storeAddress}
                        </span>
                      </h2> */}
                    </div>
                  </div>
                  <div className="">
                    <div className="flex flex-col mx-0 mt-8">
                      <table className="min-w-full divide-y divide-slate-500tk">
                        <thead>
                          <tr className="text-whiteHigh">
                            <th
                              scope="col"
                              className="py-4 pl-4 pr-3 text-base font-semibold text-left bg-primaryMainDarkest"
                            >
                              Description
                            </th>
                            <th
                              scope="col"
                              className="py-4 px-3 text-base font-semibold text-right table-cell bg-primaryMainDarkest"
                            >
                              Quantity
                            </th>
                            <th
                              scope="col"
                              className=" py-4 px-3 text-base font-semibold text-right table-cell bg-primaryMainDarkest"
                            >
                              Rate
                            </th>
                            <th
                              scope="col"
                              className="py-4 pl-3 pr-3 text-base font-semibold text-right bg-primaryMainDarkest"
                            >
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-whiteLow pb-1">
                            <td className="py-3 pl-4 pr-3 text-sm ">
                              <div className="font-medium ">
                                {data?.productName}
                              </div>
                            </td>
                            <td className="px-3 py-3 text-sm text-right  table-cell">
                              {data?.unitCount}
                            </td>
                            <td className="py-3 pr-3 text-sm text-right  table-cell">
                              {data?.unitPrice}
                            </td>
                            <td className="py-3 pr-3 text-sm text-right  ">
                              {data?.totalAmount}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <th
                              scope="row"
                              colSpan="3"
                              className="py-3 pl-6 pr-3 text-sm font-light text-right  table-cell"
                            >
                              Subtotal
                            </th>

                            <td className="py-3 pl-3 pr-4 text-sm text-right  ">
                              {data?.totalAmount}tk
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              colSpan="3"
                              className=" py-3 pl-6 pr-3 text-sm font-light text-right  table-cell"
                            >
                              Discount
                            </th>

                            <td className="py-3 pl-3 pr-4 text-sm text-right  ">
                              -0tk
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              colSpan="3"
                              className=" py-3 pl-6 pr-3 text-sm font-light text-right  table-cell"
                            >
                              Total
                            </th>

                            <td className="py-3 pl-3 pr-4 text-sm text-right  ">
                              {data?.totalAmount}tk
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              colSpan="3"
                              className="pb-3 pl-6 pr-3 text-sm font-light text-right  table-cell"
                            >
                              Paid Amount
                            </th>

                            <td className="pb-3 pl-3 pr-4 text-sm text-right  ">
                              -{data?.paidAmount}tk
                            </td>
                          </tr>
                          <tr className="">
                            <th></th>
                            <th></th>
                            <th
                              scope="row"
                              className="py-4 pl-3 pr-4 text-sm text-right text-whiteHigh bg-primaryMainDarkest whitespace-nowrap"
                            >
                              Due Amount
                            </th>

                            <td className="py-4 pl-3 pr-4 text-sm text-right text-whiteHigh bg-primaryMainDarkest">
                              {data?.totalAmount - Number(data?.paidAmount)}tk
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                  <div className="mt-16">
                    <div>
                      <h4 className="text-xs font-medium border-t border-primaryMainDarkest inline-block px-4 py-3">
                        Signature
                      </h4>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            {/* <div>
              <button
                className="btn bg-primaryMainDarkest hover:bg-primaryMainDarkest text-whiteHigh"
                onClick={downloadPDF}
              >
                download PDF
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
});

export default InvoiceModal;
