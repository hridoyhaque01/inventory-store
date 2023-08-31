import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import HomeTopCard from "../../Components/Cards/HomeTopCard";
import Charts from "../../components/Charts/Charts";
import SearchLoader from "../../components/loaders/SearchLoader";
import NoData from "../../components/shared/ui/NoData";
import SomethingWrong from "../../components/shared/ui/SomethingWrong";
import { useGetSingleStoreChartDataQuery } from "../../features/dashboard/dashboardApi";

const Dashboard = () => {
  const { store } = useSelector((state) => state.auth);

  const [dashboardData, setDashboardData] = useState([
    {
      title: "cards.totalSales",
      color: "bg-successColor",
      number: 0,
    },
    {
      title: "cards.totalRevenue",
      color: "bg-secondaryMainLight",
      number: 0,
    },
    {
      title: "cards.totalDue",
      color: "bg-infoColor",
      number: 0,
    },
    {
      title: "cards.totalProducts",
      color: "bg-errorMidColor",
      number: 0,
    },
    {
      title: "cards.totalPaidOwner",
      color: "bg-secondaryMain",
      number: 0,
    },
  ]);

  const { data, isLoading, isError } = useGetSingleStoreChartDataQuery(
    store?._id
  );

  const { chartData, cardData } = data || {};

  console.log(cardData);

  let content = null;
  if (isLoading) {
    content = <SearchLoader></SearchLoader>;
  } else if (!isLoading && isError) {
    content = <SomethingWrong></SomethingWrong>;
  } else if (!isLoading && !isError && !chartData?.revenueAndSalesData) {
    content = <NoData></NoData>;
  } else if (!isLoading && !isError && chartData?.revenueAndSalesData) {
    content = <Charts data={chartData}></Charts>;
  }

  useEffect(() => {
    if (!isLoading && !isError) {
      const updatedData = [...dashboardData];
      updatedData[0].number = cardData?.sales || 0;
      updatedData[1].number = cardData?.revenue || 0;
      updatedData[2].number = cardData?.due || 0;
      updatedData[3].number = cardData?.products || 0;
      updatedData[4].number = cardData?.paidToOwner || 0;
      setDashboardData(updatedData);
    }
  }, [isLoading, isError, data]);

  return (
    <div className="w-full overflow-auto pt-6 pb-6 px-4 md:px-6">
      <div className="flex flex-col justify-around gap-8 w-full">
        {/* 4 top cards */}
        <section className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 xl:gap-6">
          {dashboardData.map((dashboardData, index) => (
            <HomeTopCard data={dashboardData} key={index}></HomeTopCard>
          ))}
        </section>
        {content}
      </div>
    </div>
  );
};

export default Dashboard;
