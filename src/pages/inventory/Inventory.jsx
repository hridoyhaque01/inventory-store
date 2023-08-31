import React, { useState } from "react";
import { useSelector } from "react-redux";
import SearchLoader from "../../components/loaders/SearchLoader";
import SearchBar from "../../components/shared/searchbar/SearchBar";
import NoData from "../../components/shared/ui/NoData";
import SomethingWrong from "../../components/shared/ui/SomethingWrong";
import InventoryTable from "../../components/tables/inventory/InventoryTable";
import { useGetInventoriesQuery } from "../../features/inventory/inventoryApi";

function Inventory() {
  // const { data, isLoading, isError } = useGetSalesQuery();
  const { store } = useSelector((state) => state.auth);
  const { data, isLoading, isError } = useGetInventoriesQuery(store?._id);

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
    const newData = [...data]?.sort(sortByTime)?.filter(filterBySearch);
    content = <InventoryTable data={newData}></InventoryTable>;
  }

  return (
    <section className="h-full w-full overflow-auto px-4 md:px-6 py-6">
      <div className="bg-whiteHigh shadow-sm w-full h-full rounded-2xl overflow-hidden">
        <SearchBar
          title="tableTitle.inventory"
          path="/sales-add"
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

export default Inventory;
