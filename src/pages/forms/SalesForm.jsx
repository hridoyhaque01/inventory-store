import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RequestLoader from "../../components/loaders/RequestLoader";
import CustomerModal from "../../components/modals/CustomerModal";
import CustomerSuggestions from "../../components/shared/autosuggestions/CustomerSuggestions";
import ProductSuggestions from "../../components/shared/autosuggestions/ProductSuggestions";
import {
  useAddCustomersMutation,
  useGetCustomersQuery,
} from "../../features/customers/customerApi";
import {
  inventoryApi,
  useGetInventoriesQuery,
} from "../../features/inventory/inventoryApi";
import { useAddSalesMutation } from "../../features/sales/salesApi";

function SalesForm() {
  const { store } = useSelector((state) => state.auth);
  const [addCustomers, { isLoading: customerAddLoading }] =
    useAddCustomersMutation();
  const {
    data: customers,
    isLoading: customerLoading,
    isError: customerError,
  } = useGetCustomersQuery(store?._id);
  const { t } = useTranslation();

  const {
    data,
    isLoading: productsLoading,
    isError: productsError,
  } = useGetInventoriesQuery(store?._id);

  const navigate = useNavigate();

  const [addSales, { isLoading }] = useAddSalesMutation();

  const dispatch = useDispatch();
  const [isFullPaid, setIsFullPaid] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [productValue, setProductValue] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [customerValue, setCustomerValue] = useState("");
  const [paidAmount, setPaidAmount] = useState("0");
  const [sellingPrice, setSellingPrice] = useState(0);
  let totalPrice =
    sellingPrice && quantity
      ? sellingPrice === 0
        ? 0
        : parseInt(sellingPrice) * parseInt(quantity)
      : "";

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

  const infoNotify = (message) =>
    toast.info(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const handlePaid = (event) => {
    const value = event.target.value;
    if (parseInt(totalPrice) - parseInt(value) < 0) {
      return;
    } else {
      setPaidAmount(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const dueAmount = event.target?.dueAmount?.value;
    const data = {
      productId: selectedProduct?.productId,
      productName: selectedProduct?.productName,
      productCategory: selectedProduct?.productCategory,
      storeId: selectedProduct?.storeId,
      storeName: selectedProduct?.storeName,
      storeAddress: store?.location,
      storeEmail: store?.email,
      unit: selectedProduct?.unit,
      unitPrice: sellingPrice,
      buyingPrice: selectedProduct?.buyingPrice,
      unitCount: quantity,
      totalAmount: totalPrice,
      paidAmount: isFullPaid
        ? totalPrice?.toString()
        : paidAmount
        ? paidAmount?.toString()
        : "0",
      customerId: customerValue,
      customerAddress: selectedCustomer?.customerAddress,
      customerName: selectedCustomer?.customerName,
      dueAmount: dueAmount ? dueAmount?.toString() : "0",
    };

    if (
      parseInt(quantity) < 0 ||
      parseInt(selectedProduct?.buyingPrice) < 0 ||
      parseInt(totalPrice) < 0 ||
      parseInt(paidAmount) < 0 ||
      parseInt(dueAmount) < 0
    ) {
      errorNotify("Negative values are not accepted");
      return;
    }
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    addSales(formData)
      .unwrap()
      .then((res) => {
        const unitLeft = selectedProduct?.unitLeft - parseInt(quantity);
        const data = {
          unitLeft,
          productId: selectedProduct?.productId,
        };
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        dispatch(
          inventoryApi.endpoints.updateProducts.initiate({
            data: formData,
            storeId: store?._id,
          })
        )
          .unwrap()
          .then((res) => {
            setSelectedCustomer({});
            setSelectedProduct({});
            setProductValue("");
            setCustomerValue("");
            setPaidAmount("");
            setQuantity(1);
            setSellingPrice(0);
            totalPrice = 0;
            navigate("/sales");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
        errorNotify("New sales add failed");
      });
  };

  const handleQuantity = (event) => {
    const value = event.target.value;
    if (parseInt(value) > selectedProduct?.unitLeft) {
      return;
    } else {
      setQuantity(value);
    }
  };

  useEffect(() => {
    if (selectedProduct?.productId) {
      setSellingPrice(selectedProduct?.sellingPrice);
    }
  }, [selectedProduct?.productId, selectedProduct?.sellingPrice]);

  return customerLoading || productsLoading ? (
    <div>{t("loading")}...</div>
  ) : customerError || productsError ? (
    <div>{t("somethingWrong")}</div>
  ) : (
    <section className="h-full w-full overflow-auto px-6 py-6">
      <div className="shadow-sm w-full rounded-2xl">
        <div className="bg-primaryMainDarkest p-4 rounded-t-2xl">
          <h4 className=" text-whiteHigh text-lg md:text-2xl font-bold">
            {t("tableTitle.sales")}
          </h4>
        </div>
        <div className="bg-whiteHigh w-full px-4 rounded-b-2xl">
          <div className=" w-full max-w-[620px] mx-auto py-6">
            <form action="" onSubmit={handleSubmit}>
              <div className="flex flex-col justify-start gap-6">
                {/* productId */}
                <div className="flex flex-col md:flex-row md:items-center gap-3 relative">
                  <span className="inline-block w-[140px] shrink-0 whitespace-nowrap text-sm sm:text-base text-left md:text-right">
                    {t("tables.productId")} :
                  </span>
                  <div className="w-full relative">
                    <ProductSuggestions
                      suggestions={data}
                      setSelectedProduct={setSelectedProduct}
                      setValue={setProductValue}
                      value={productValue}
                    ></ProductSuggestions>
                  </div>
                </div>

                {/* Product Name */}
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <span className="inline-block w-[140px] shrink-0 whitespace-nowrap text-sm sm:text-base text-left md:text-right">
                    {t("tables.productName")} :
                  </span>
                  <input
                    type="text"
                    placeholder={t("tables.productName")}
                    name="productName"
                    className="w-full py-3 px-4 border border-whiteLow outline-none rounded text-blackLow text-sm bg-whiteMid"
                    readOnly
                    defaultValue={selectedProduct?.productName}
                  />
                </div>

                {/* Product Category */}
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <span className="inline-block w-[140px] shrink-0 whitespace-nowrap text-sm sm:text-base text-left md:text-right">
                    {t("tables.category")} :
                  </span>
                  <input
                    type="text"
                    placeholder={t("tables.category")}
                    name="productCategory"
                    className="w-full py-3 px-4 border border-whiteLow outline-none rounded text-blackLow text-sm bg-whiteMid"
                    readOnly
                    defaultValue={selectedProduct?.productCategory}
                  />
                </div>

                {/* Shop Name: */}
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <span className="inline-block w-[140px] shrink-0 whitespace-nowrap text-sm sm:text-base text-left md:text-right">
                    {t("tables.shopName")} :
                  </span>
                  <input
                    type="text"
                    placeholder={t("tables.shopName")}
                    name="shopName"
                    className="w-full py-3 px-4 border border-whiteLow outline-none rounded text-blackLow text-sm"
                    readOnly
                    defaultValue={selectedProduct?.storeName}
                  />
                </div>

                {/* Selling Price/Unit: */}
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <span className="inline-block w-[140px] shrink-0 whitespace-nowrap text-sm sm:text-base text-left md:text-right">
                    {t("tables.sellingPrice")} :
                  </span>
                  <input
                    type="parseInt"
                    name="sellingPrice"
                    placeholder={t("placeholders.enterSellingPrice")}
                    className="w-full py-3 px-4 border border-whiteLow outline-none rounded text-blackLow text-sm"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    readOnly={selectedProduct?.productId ? false : true}
                  />
                </div>

                {/* Quantity */}
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <span className="inline-block w-[140px] shrink-0 whitespace-nowrap text-sm sm:text-base text-left md:text-right">
                    {t("tables.quantity")} :
                  </span>
                  <div className="w-full py-3 px-4 flex items-center border border-whiteLow outline-none rounded text-blackLow text-sm">
                    <input
                      type="parseInt"
                      name="quantity"
                      className="w-20 border-none outline-none"
                      placeholder={t("tables.quantity")}
                      step="any"
                      value={`${quantity}`}
                      onChange={(e) => handleQuantity(e)}
                      readOnly={selectedProduct?.productId ? false : true}
                    />

                    <div className="relative w-full max-w-max">
                      <select
                        className="appearance-none outline-none  w-16"
                        name="quantityAction"
                        defaultValue=""
                        disabled
                      >
                        <option value="">{selectedProduct?.unit}</option>
                      </select>
                      <label
                        htmlFor="customerModal"
                        className="absolute inset-y-0 right-1 flex items-center text-secondaryColor pointer-events-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="16"
                          viewBox="0 0 17 16"
                          fill="none"
                        >
                          <path
                            d="M12.0561 5.53003L8.99609 8.58336L5.93609 5.53003L4.99609 6.47003L8.99609 10.47L12.9961 6.47003L12.0561 5.53003Z"
                            fill="#808080"
                          />
                        </svg>
                      </label>
                    </div>
                  </div>
                  {/* <input
                    type="parseInt"
                    name="buyingPrice"
                    placeholder="Buying price"
                    className="w-full py-3 px-4 border border-whiteLow outline-none rounded text-blackLow text-sm"
                  /> */}
                </div>

                {/* Total Price: */}
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <span className="inline-block w-[140px] shrink-0 whitespace-nowrap text-sm sm:text-base text-left md:text-right">
                    {t("tables.totalPrice")} :
                  </span>
                  <input
                    type="text"
                    placeholder={t("tables.totalPrice")}
                    name="totalPrice"
                    className="w-full py-3 px-4 border border-whiteLow outline-none rounded text-blackLow text-sm"
                    readOnly
                    value={totalPrice}
                  />
                </div>

                {/* checkbox   */}

                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <span className="inline-block w-[140px] shrink-0 whitespace-nowrap text-sm sm:text-base text-left md:text-right"></span>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-accent border-fadeHigh  checkbox-sm rounded "
                    name="checkbox"
                    checked={isFullPaid}
                    onChange={() => setIsFullPaid((prev) => !prev)}
                    disabled={selectedProduct?.productId ? false : true}
                    id="fullPaid"
                  />
                  <label htmlFor="fullPaid">{t("forms.fullPaid")}</label>
                </div>

                {/* pay and due  */}
                {!isFullPaid && (
                  <div className="w-full flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      <span className="inline-block w-[140px] shrink-0 whitespace-nowrap text-sm sm:text-base text-left md:text-right">
                        {t("forms.pay")} :
                      </span>
                      <input
                        type="parseInt"
                        placeholder={t("placeholders.enterPay")}
                        name="payAmount"
                        step="any"
                        className="w-full py-3 px-4 border border-whiteLow outline-none rounded text-blackLow text-sm"
                        value={paidAmount}
                        onChange={(e) => handlePaid(e)}
                      />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      <span className="inline-block w-[140px] shrink-0 whitespace-nowrap text-sm sm:text-base text-left md:text-right">
                        {t("forms.due")} :
                      </span>

                      <input
                        type="parseInt"
                        placeholder={t("tables.dueAmount")}
                        name="dueAmount"
                        step="any"
                        className="w-full py-3 px-4 border border-whiteLow outline-none rounded text-blackLow text-sm bg-whiteMid"
                        readOnly
                        value={
                          isFullPaid
                            ? "0"
                            : paidAmount
                            ? parseInt(totalPrice) - parseInt(paidAmount)
                            : totalPrice
                        }
                      />
                    </div>
                  </div>
                )}
                {/* customer */}

                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <span className="inline-block w-[140px] shrink-0 whitespace-nowrap text-sm sm:text-base text-left md:text-right">
                    {t("tableTitle.customer")} :
                  </span>
                  <div className="w-full border border-whiteLow  rounded text-blackLow text-sm flex items-center gap-1 relative">
                    <div className="w-full relative customer">
                      <CustomerSuggestions
                        suggestions={customers}
                        setSelectedCustomer={setSelectedCustomer}
                        setValue={setCustomerValue}
                        value={customerValue}
                      ></CustomerSuggestions>
                    </div>
                    <label
                      htmlFor="customerModal"
                      className="cursor-pointer absolute top-1/2 right-4 -translate-y-1/2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M10.0003 1.66666C5.40033 1.66666 1.66699 5.39999 1.66699 9.99999C1.66699 14.6 5.40033 18.3333 10.0003 18.3333C14.6003 18.3333 18.3337 14.6 18.3337 9.99999C18.3337 5.39999 14.6003 1.66666 10.0003 1.66666ZM14.167 10.8333H10.8337V14.1667H9.16699V10.8333H5.83366V9.16666H9.16699V5.83332H10.8337V9.16666H14.167V10.8333Z"
                          fill="#797979"
                        />
                      </svg>
                    </label>
                  </div>
                </div>

                {/* edit button */}
                <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4">
                  <span className="w-[140px]"></span>
                  <div className="flex items-center gap-3">
                    <Link
                      to="/sales"
                      className="w-[140px] sm:w-[160px] p-3 sm:p-4 rounded-full border border-errorLightColor text-errorLightColor font-medium text-center"
                    >
                      {t("buttons.cancel")}
                    </Link>
                    <button
                      type="submit"
                      className="w-[140px] sm:w-[160px] p-3 sm:p-4 rounded-full border bg-primaryMainLight text-whiteHigh font-medium text-center"
                      disabled={selectedCustomer?.customerPhone ? false : true}
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

        {(customerAddLoading || isLoading) && <RequestLoader></RequestLoader>}
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

        <CustomerModal
          handler={addCustomers}
          infoNotify={infoNotify}
          errorNotify={errorNotify}
          setSelectedCustomer={setSelectedCustomer}
          setCustomerValue={setCustomerValue}
          storeId={store?._id}
          storeName={store?.name}
        ></CustomerModal>
      </div>
    </section>
  );
}

export default SalesForm;
