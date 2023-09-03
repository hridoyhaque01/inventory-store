import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import SearchLoader from "../../components/loaders/SearchLoader";
import SearchBar from "../../components/shared/searchbar/SearchBar";
import NoData from "../../components/shared/ui/NoData";
import SomethingWrong from "../../components/shared/ui/SomethingWrong";
import CustomerTable from "../../components/tables/customer/CustomerTable";
import { useGetCustomersQuery } from "../../features/customers/customerApi";

function Customer() {
  const { store } = useSelector((state) => state.auth);
  const { data, isLoading, isError } = useGetCustomersQuery(store?._id);
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");

  const onChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const sortByTime = (a, b) => {
    return b.timestamp - a.timestamp;
  };

  const filterBySearch = (data) => {
    if (searchValue.trim().length > 0) {
      return data?.customerPhone
        ?.toLowerCase()
        .startsWith(searchValue?.toLowerCase());
    } else {
      return true;
    }
  };

  let content = null;

  if (isLoading) {
    content = <SearchLoader></SearchLoader>;
  } else if (!isLoading && isError) {
    content = <SomethingWrong></SomethingWrong>;
  } else if (!isLoading && !isError && data?.length === 0) {
    content = <NoData></NoData>;
  } else if (!isLoading && !isError && data?.length > 0) {
    const newData = [...data]?.sort(sortByTime)?.filter(filterBySearch);
    content = <CustomerTable data={newData}></CustomerTable>;
  }

  return (
    <section className="h-full w-full overflow-auto px-4 md:px-6 py-6">
      <div className="shadow-sm bg-whiteHigh w-full h-full rounded-2xl overflow-hidden">
        <SearchBar
          title="tableTitle.customers"
          path="/customer-add"
          value={searchValue}
          onChange={onChange}
        ></SearchBar>

        <div className="h-[calc(100%-104px)] sm:h-[calc(100%-80px)] w-full flex flex-col justify-between">
          {content}
        </div>
      </div>
    </section>
  );
}

export default Customer;
