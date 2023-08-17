import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import HomeTopCard from "../../Components/Cards/HomeTopCard";
import Charts from "../../components/Charts/Charts";
import SearchLoader from "../../components/loaders/SearchLoader";
import NoData from "../../components/shared/ui/NoData";
import SomethingWrong from "../../components/shared/ui/SomethingWrong";
import { useGetDashboardResultQuery } from "../../features/dashboard/dashboardApi";

const Dashboard = () => {
  const { store } = useSelector((state) => state.auth);
  const { data, isLoading, isError } = useGetDashboardResultQuery(store?.name);
  const [dashboardData, setDashboardData] = useState([]);

  const { salesData, totalSales, costsData, totalCosts, totalDues } =
    data || {};

  let content = null;

  if (isLoading) {
    content = <SearchLoader></SearchLoader>;
  } else if (!isLoading && isError) {
    content = <SomethingWrong></SomethingWrong>;
  } else if (!isLoading && !isError && !totalSales) {
    content = <NoData></NoData>;
  } else if (!isLoading && !isError && totalSales) {
    content = (
      <>
        <section className="flex justify-between gap-8 px-4">
          {dashboardData.map((dashboardData, index) => (
            <HomeTopCard data={dashboardData} key={index}></HomeTopCard>
          ))}
        </section>
        <Charts salesData={salesData} costsData={costsData}></Charts>
      </>
    );
  }

  useEffect(() => {
    if (!isLoading && !isError && totalSales) {
      setDashboardData((prev) => [
        ...prev,
        {
          title: "Total Sales",
          number: totalSales,
          color: "bg-successColor",
        },
        {
          title: "Total Costs",
          number: totalCosts,
          color: "bg-secondaryMainLight",
        },
        {
          title: "Total Revenue",
          number: totalSales - totalDues,
          color: "bg-infoColor",
        },
        {
          title: "Total Dues",
          number: totalDues,
          color: "bg-errorMidColor",
        },
      ]);
    }
  }, [isLoading, isError, totalSales]);

  return (
    <div className="w-full overflow-auto pt-10 pb-6 pr-10">
      <div className="flex flex-col justify-around pty-10 gap-4 w-full">
        {/* 4 top cards */}
        {content}
      </div>
    </div>
  );
};

export default Dashboard;
