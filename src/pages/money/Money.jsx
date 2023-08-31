import React, { useState } from "react";
import { useSelector } from "react-redux";
import SearchLoader from "../../components/loaders/SearchLoader";
import SearchBar from "../../components/shared/searchbar/SearchBar";
import NoData from "../../components/shared/ui/NoData";
import MoneyOwedTable from "../../components/tables/moneyOwed/MoneyOwedTable";
import { useGetAllOwesQuery } from "../../features/owes/owesApi";

function Expenses() {
  const { store } = useSelector((state) => state.auth);
  const { data, isLoading, isError } = useGetAllOwesQuery(store?._id);
  const [searchValue, setSearchValue] = useState("");

  const onChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const sortByTime = (a, b) => {
    return b.payDate - a.payDate;
  };

  const filterByDue = (data) => {
    return parseInt(data?.dueAmount) !== 0;
  };

  const filterBySearch = (data) => {
    if (searchValue.trim().length > 0) {
      return data?.customerId
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
    content = <div>Something went wrong</div>;
  } else if (!isLoading && !isError && data?.length === 0) {
    content = <NoData></NoData>;
  } else if (!isLoading && !isError && data?.length > 0) {
    const newData = [...data]
      ?.filter(filterByDue)
      ?.sort(sortByTime)
      ?.filter(filterBySearch);
    content = <MoneyOwedTable data={newData}></MoneyOwedTable>;
  }
  return (
    <section className="h-full w-full overflow-auto px-4 md:px-6 py-6 ">
      <div className="shadow-sm w-full h-full rounded-2xl overflow-hidden bg-whiteHigh">
        <SearchBar
          title="tableTitle.owes"
          path="/moneyOwed-add"
          value={searchValue}
          onChange={onChange}
          isNotAddable={true}
        ></SearchBar>
        <div className="h-[calc(100%-104px)] sm:h-[calc(100%-80px)] w-full flex flex-col justify-between">
          {content}
        </div>
      </div>
    </section>
  );
}

export default Expenses;
