import { apiSlice } from "../api/apiSlice";

const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStoreResult: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        // get a random user
        const { data } = await fetchWithBQ(`/stores/find/${_arg}`);

        const groupedPayments = {};

        let totalSales = 0;
        let totalRevenue = 0;
        let totalCustomers = data?.customers?.length;
        let totalProducts = 0;
        let totalPaidToOwner = 0;

        totalProducts = data?.products?.reduce(
          (acc, item) => acc + parseInt(item?.productQuantity),
          0
        );

        totalRevenue = data?.invoices?.reduce(
          (acc, invoice) => acc + parseInt(invoice?.paidAmount),
          0
        );

        totalSales = data?.invoices?.reduce(
          (acc, item) => acc + parseInt(item?.totalAmount),
          0
        );

        const cardData = {
          totalSales,
          totalRevenue,
          totalCustomers,
          totalProducts,
        };

        data?.paidToOwner?.forEach((payment) => {
          const date = new Date(payment.timestamp * 1000).toLocaleDateString(
            "en-US"
          );
          if (!groupedPayments[date]) {
            groupedPayments[date] = 0; // Initialize totalPaid for the date
          }
          groupedPayments[date] += parseInt(payment.payment);
        });

        // Group invoices by date
        const groupedInvoices = {};
        data?.invoices?.forEach((invoice) => {
          const date = new Date(invoice?.timestamp * 1000).toLocaleDateString(
            "en-US"
          );
          if (!groupedInvoices[date]) {
            groupedInvoices[date] = [];
          }
          groupedInvoices[date].push(invoice);
        });

        // Calculate required values for each date
        const storeDetails = [];
        for (const date in groupedInvoices) {
          const invoiceGroup = groupedInvoices[date];
          const totalDue = invoiceGroup?.reduce(
            (acc, invoice) => acc + parseInt(invoice?.dueAmount),
            0
          );
          const totalSales = invoiceGroup?.reduce(
            (acc, invoice) => acc + parseInt(invoice?.totalAmount),
            0
          );
          const totalCost = invoiceGroup?.reduce(
            (acc, invoice) =>
              acc +
              parseInt(invoice?.buyingPrice) * parseInt(invoice?.unitCount),
            0
          );

          const totalPaidToOwner = groupedPayments[date] || 0;
          const invoiceRevenue = invoiceGroup?.reduce(
            (acc, invoice) => acc + parseInt(invoice?.paidAmount),
            0
          );
          const paymentRevenue = totalPaidToOwner;
          const revenue = invoiceRevenue;
          const remaining = revenue - totalPaidToOwner;

          const storeDetailsEntry = {
            totalDue: totalDue,
            Revenue: revenue,
            totalCost: totalCost,
            totalSales: totalSales,
            Date: date,
            totalPaidToOwner: totalPaidToOwner,
            remaining: remaining,
            storeName: data?.name,
          };
          storeDetails.push(storeDetailsEntry);
        }

        storeDetails.sort((a, b) => new Date(b.date) - new Date(a.date));

        return {
          data: { storeDetails, cardData },
        };
      },
      providesTags: ["stores"],
    }),
    getSingleStoreChartData: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        // get a random user
        const { data: storeData } = await fetchWithBQ(`/stores/find/${_arg}`);

        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const revenueData = [];
        const paidToOwnerData = [];
        const salesData = [];
        const dueData = [];
        const profitData = [];
        const dates = [];
        const results = [];
        const cardData = {};
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        for (let day = 1; day <= 31; day++) {
          const dateString = `${currentYear}-${currentMonth + 1}-${day}`;

          // configue cardData

          // Calculate revenue for lift time

          const storeRevenue = storeData?.invoices?.reduce(
            (storeTotal, invoice) => {
              return storeTotal + parseInt(invoice?.paidAmount);
            },
            0
          );

          // Calculate due for lift time

          const storeDue = storeData?.invoices?.reduce(
            (storeTotal, invoice) => {
              return storeTotal + parseInt(invoice?.dueAmount);
            },
            0
          );

          // Calculate sales for lift time

          const storeSales = storeData?.invoices?.reduce(
            (storeTotal, invoice) => {
              return storeTotal + parseInt(invoice?.totalAmount);
            },
            0
          );

          // Calculate recieve for lift time

          const productQuantity = storeData?.products?.reduce(
            (storeTotal, product) => {
              return storeTotal + parseInt(product?.productQuantity);
            },
            0
          );

          const totalPaidToOwner = storeData?.paidToOwner?.reduce(
            (acc, item) => acc + parseInt(item?.payment),
            0
          );

          cardData.revenue = storeRevenue;
          cardData.sales = storeSales;
          cardData.products = productQuantity;
          cardData.due = storeDue;
          cardData.paidToOwner = totalPaidToOwner;

          // Calculate revenue for the day
          const dailyRevenue = storeData?.invoices?.reduce(
            (totalRevenue, invoice) => {
              const invoiceDate = new Date(invoice?.payDate * 1000);
              if (
                invoiceDate.getDate() === day &&
                invoiceDate.getMonth() === currentMonth
              ) {
                totalRevenue += parseInt(invoice?.paidAmount);
              }
              return totalRevenue;
            },
            0
          );
          revenueData.push(dailyRevenue);

          // Calculate paidToOwner for the day
          const dailyPaidToOwner = storeData?.paidToOwner?.reduce(
            (totalPaid, payment) => {
              const paymentDate = new Date(payment?.timestamp * 1000);
              if (
                paymentDate.getDate() === day &&
                paymentDate.getMonth() === currentMonth
              ) {
                totalPaid += payment?.payment ? parseInt(payment?.payment) : 0;
              }
              return totalPaid;
            },
            0
          );
          paidToOwnerData.push(dailyPaidToOwner);

          // Calculate sales for the day
          const dailySales = storeData?.invoices?.reduce(
            (totalSales, invoice) => {
              const invoiceDate = new Date(invoice?.payDate * 1000);
              if (
                invoiceDate.getDate() === day &&
                invoiceDate.getMonth() === currentMonth
              ) {
                totalSales += parseInt(invoice?.totalAmount);
              }
              return totalSales;
            },
            0
          );
          salesData.push(dailySales);

          // Calculate profit for the day
          const dailyProfit = storeData?.invoices?.reduce(
            (totalProfit, invoice) => {
              const invoiceDate = new Date(invoice?.payDate * 1000);
              if (
                invoiceDate.getDate() === day &&
                invoiceDate.getMonth() === currentMonth
              ) {
                totalProfit +=
                  (parseInt(invoice?.unitPrice) -
                    parseInt(invoice?.buyingPrice)) *
                  parseInt(invoice?.unitCount);
              }
              return totalProfit;
            },
            0
          );
          profitData.push(dailyProfit);

          // Calculate due for the day
          const dailyDue = storeData?.invoices?.reduce((totalDue, invoice) => {
            const invoiceDate = new Date(invoice?.payDate * 1000);
            if (
              invoiceDate.getDate() === day &&
              invoiceDate.getMonth() === currentMonth
            ) {
              totalDue += parseInt(invoice?.dueAmount);
            }
            return totalDue;
          }, 0);
          dueData.push(dailyDue);

          // Add the day and formatted date to the dates array
          const formattedDate = `${monthNames[currentMonth]}/${
            day < 10 ? "0" : ""
          }${day}`;
          dates.push({ day, Date: formattedDate });
        }

        const storeResult = {
          revenueData,
          paidToOwnerData,
          salesData,
          dueData,
          profitData,
          dates,
        };

        results.push(storeResult);

        const revenueAndSalesData = [];
        const salesAndDueData = [];
        const salesAndRecieveData = [];
        const salesAndProfiteData = [];

        // revenue and sales

        for (let day = 1; day <= 31; day++) {
          const formattedDate = `${monthNames[currentMonth]}/${
            day < 10 ? "0" : ""
          }${day}`;

          const dayData = [];

          for (const storeResult of results) {
            dayData.push({
              Day: day,
              Date: formattedDate,
              Revenue: storeResult?.revenueData[day - 1],
              Sales: storeResult?.salesData[day - 1],
            });
          }
          revenueAndSalesData.push(...dayData);
        }

        // sales and due

        for (let day = 1; day <= 31; day++) {
          const formattedDate = `${monthNames[currentMonth]}/${
            day < 10 ? "0" : ""
          }${day}`;

          const dayData = [];

          for (const storeResult of results) {
            dayData.push({
              Day: day,
              Date: formattedDate,
              Due: storeResult?.dueData[day - 1],
              Sales: storeResult?.salesData[day - 1],
            });
          }
          salesAndDueData.push(...dayData);
        }

        // sales and recieve

        for (let day = 1; day <= 31; day++) {
          const formattedDate = `${monthNames[currentMonth]}/${
            day < 10 ? "0" : ""
          }${day}`;

          const dayData = [];

          for (const storeResult of results) {
            dayData.push({
              Day: day,
              Date: formattedDate,
              Recieved: storeResult?.paidToOwnerData[day - 1] || 0,
              Sales: storeResult?.salesData[day - 1],
            });
          }
          salesAndRecieveData.push(...dayData);
        }

        // sales and profit

        for (let day = 1; day <= 31; day++) {
          const formattedDate = `${monthNames[currentMonth]}/${
            day < 10 ? "0" : ""
          }${day}`;

          const dayData = [];

          for (const storeResult of results) {
            dayData.push({
              Day: day,
              Date: formattedDate,
              Profit: storeResult?.profitData[day - 1],
              Sales: storeResult?.salesData[day - 1],
            });
          }
          salesAndProfiteData.push(...dayData);
        }

        const finalResult = {
          revenueAndSalesData,
          salesAndDueData,
          salesAndRecieveData,
          salesAndProfiteData,
        };

        return {
          data: {
            cardData,
            chartData: finalResult,
          },
        };
      },
      providesTags: ["dashboard"],
    }),
  }),
});

export const {
  useGetDashboardResultQuery,
  useGetStoreResultQuery,
  useGetSingleStoreChartDataQuery,
} = dashboardApi;
