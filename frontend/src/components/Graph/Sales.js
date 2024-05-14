import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { BackendUrl } from "../../utils/BackendUrl";
import axios from "axios";

export default function Sales() {
  const [chartData, setChartData] = useState();

  const getData = async () => {
    console.log("get-sales-and-purchase-data triggered");
    const { data } = await axios.get(
      `${BackendUrl}/get-sales-and-purchase-data`,
      { withCredentials: true }
    );
    console.log("DATA===>: ", data);

    const result = [["Month", "Purchase Order", "Sales Order"]];
    const months = Object.keys(data.purchaseOrderSalesByMonth);

    months.forEach((month) => {
      const purchaseOrderSales = data.purchaseOrderSalesByMonth[month] || 0;
      const salesOrderSales = data.salesOrderSalesByMonth[month] || 0;
      result.push([month, purchaseOrderSales, salesOrderSales]);
    });

    setChartData(result);
  };

  const options = {
    chart: {
      title: "Company Performance",
      titleTextStyle: { color: "#333" },
    },
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Chart
        chartType="AreaChart"
        width="600px"
        height="400px"
        data={chartData}
        options={options}
      />
    </>
  );
}
