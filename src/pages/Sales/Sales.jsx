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

  const filterBySearch = (data) => {
    if (searchValue.trim().length > 0) {
      return data?.productName
        ?.toLowerCase()
        .includes(searchValue?.toLowerCase());
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
    const newData = data?.filter(filterBySearch);
    content = <SalesTable data={newData}></SalesTable>;
  }

  return (
    <section className="h-full w-full overflow-auto px-4 md:px-6 py-6">
      <div className="bg-whiteHigh shadow-sm w-full h-full rounded-2xl overflow-hidden">
        <SearchBar
          title="Sales"
          path="/sales-add"
          value={searchValue}
          onChange={onChange}
        ></SearchBar>

        <div className="h-[calc(100%-80px)] overflow-auto flex flex-col justify-between flex-wrap pb-4">
          {content}
        </div>
      </div>
    </section>
  );
}

export default Sales;
