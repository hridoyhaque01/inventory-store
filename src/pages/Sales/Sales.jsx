import React, { useState } from "react";
import { useSelector } from "react-redux";
import SearchLoader from "../../components/loaders/SearchLoader";
import SearchBar from "../../components/shared/searchbar/SearchBar";
import NoData from "../../components/shared/ui/NoData";
import SomethingWrong from "../../components/shared/ui/SomethingWrong";
import SalesTable from "../../components/tables/sales/SalesTable";
import { useGetSalesQuery } from "../../features/sales/salesApi";
function Sales() {
  const { store } = useSelector((state) => state.auth);
  const { data, isLoading, isError } = useGetSalesQuery(store?._id);
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
      return data?.productId
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
    content = <SalesTable data={newData}></SalesTable>;
  }

  return (
    <section className="h-full w-full overflow-auto px-4 md:px-6 py-6">
      <div className="bg-whiteHigh shadow-sm w-full h-full rounded-2xl overflow-hidden">
        <SearchBar
          title="tableTitle.sales"
          path="/sales-add"
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

export default Sales;
