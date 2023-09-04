import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RequestLoader from "../../components/loaders/RequestLoader";
import { useUpdateOwesMutation } from "../../features/owes/owesApi";
import dateFormater from "../../utils/dateFormater";
import getIsoDateString from "../../utils/getIsoDateString";

function MoneyOwedForm() {
  const [updateOwes, { isLoading }] = useUpdateOwesMutation();
  const { state } = useLocation();
  const { payload, type } = state || {};
  const [paidAmount, setPaidAmount] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const errorNotify = (message) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const handleSubmit = (event) => {
    event.preventDefault();
    const dueAmount = event.target.remainingAmount.value;
    const payAmount = parseInt(payload?.paidAmount) + parseInt(paidAmount);
    const payDate = event.target.payDate.value;
    const data = {
      dueAmount: parseInt(dueAmount),
      paidAmount: parseInt(payAmount),
      payDate: dateFormater(payDate),
    };

    if (parseInt(dueAmount) < 0 || parseInt(paidAmount) < 0) {
      errorNotify("Negative values are not accepted");
      return;
    }
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    updateOwes({ data: formData, id: payload?._id, storeId: payload?.storeId })
      .unwrap()
      .then((res) => {
        setPaidAmount(0);
        navigate("/moneyOwed");
      })
      .catch((error) => {
        errorNotify("Update customer owes failed");
      });
  };

  const handlePaid = (event) => {
    const value = event.target.value;
    if (parseInt(payload?.dueAmount) - parseInt(value) < 0) {
      return;
    } else {
      setPaidAmount(value);
    }
  };

  return (
    <section className="h-full w-full overflow-auto px-6 py-6">
      <div className="shadow-sm w-full rounded-2xl overflow-hidden">
        <div className="bg-primaryMainDarkest p-4">
          <h4 className=" text-whiteHigh text-lg md:text-2xl font-bold">
            {t("tableTitle.owes")}
          </h4>
        </div>
        <div className="bg-whiteHigh w-full px-4">
          <div className=" w-full max-w-[620px] mx-auto py-6">
            <form action="" onSubmit={handleSubmit}>
              <div className="flex flex-col justify-start gap-6">
                {/* productId */}
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <span className="inline-block w-[140px] shrink-0 whitespace-nowrap text-sm sm:text-base text-left md:text-right">
                    {t("tables.customerId")} :
                  </span>
                  <input
                    type="text"
                    placeholder={t("tables.customerId")}
                    name="customerId"
                    className={`w-full py-3 px-4 border border-whiteLow outline-none rounded ${
                      type === "edit" ? "text-fadeColor" : "text-blackLow"
                    } text-sm bg-whiteMid`}
                    readOnly={type === "edit" ? true : false}
                    defaultValue={payload?.customerId}
                  />
                </div>

                {/* Product Name */}
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <span className="inline-block w-[140px] shrink-0 whitespace-nowrap text-sm sm:text-base text-left md:text-right">
                    {t("tables.dueAmount")} :
                  </span>
                  <input
                    type="number"
                    placeholder={t("tables.dueAmount")}
                    name="dueAmount"
                    className="w-full py-3 px-4 border border-whiteLow outline-none rounded text-blackLow text-sm bg-whiteMid"
                    defaultValue={payload?.dueAmount}
                    readOnly
                  />
                </div>

                {/* Pay Date: */}
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <span className="inline-block w-[140px] shrink-0 whitespace-nowrap text-sm sm:text-base text-left md:text-right">
                    {t("tables.payDate")} :
                  </span>
                  <input
                    type="date"
                    placeholder={t("tables.payDate")}
                    name="payDate"
                    className="w-full py-3 px-4 border border-whiteLow outline-none rounded text-blackLow text-sm"
                    defaultValue={getIsoDateString(payload?.payDate)}
                  />
                </div>

                {/* Paid */}
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <span className="inline-block w-[140px] shrink-0 whitespace-nowrap text-sm sm:text-base text-left md:text-right">
                    {t("forms.paid")} :
                  </span>
                  <input
                    type="number"
                    placeholder={t("placeholders.enterPaid")}
                    name="due"
                    step="any"
                    value={paidAmount}
                    onChange={(e) => handlePaid(e)}
                    required
                    className="w-full py-3 px-4 border border-whiteLow outline-none rounded text-blackLow text-sm"
                  />
                </div>

                {/* Paid */}
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <span className="inline-block w-[140px] shrink-0 whitespace-nowrap text-sm sm:text-base text-left md:text-right">
                    {t("forms.remaining")} :
                  </span>
                  <input
                    type="number"
                    placeholder={t("placeholders.remainingAmount")}
                    name="remainingAmount"
                    className="w-full py-3 px-4 border border-whiteLow outline-none rounded text-blackLow text-sm bg-whiteMid"
                    readOnly
                    value={parseInt(payload?.dueAmount) - parseInt(paidAmount)}
                  />
                </div>

                {/* submit buttons  */}

                <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4">
                  <span className="w-[140px]"></span>
                  <div className="flex items-center gap-3">
                    <Link
                      to="/moneyOwed"
                      className="w-[140px] sm:w-[160px] p-3 sm:p-4 rounded-full border border-errorLightColor text-errorLightColor font-medium text-center"
                    >
                      {t("buttons.cancel")}
                    </Link>
                    <button
                      type="submit"
                      className="w-[140px] sm:w-[160px] p-3 sm:p-4 rounded-full border bg-primaryMainLight text-whiteHigh font-medium text-center"
                    >
                      {t("buttons.save")}
                    </button>
                    {/* <button
                      type="submit"
                      className="w-[160px] p-4 rounded-full bg-primaryMainLight font-medium text-whiteHigh text-center"
                    >
                      Save
                    </button> */}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        {isLoading && <RequestLoader></RequestLoader>}
        <div>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          ></ToastContainer>
        </div>
      </div>
    </section>
  );
}

export default MoneyOwedForm;
