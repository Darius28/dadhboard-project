import axios from "axios";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { BackendUrl } from "../../utils/BackendUrl";
import Sales from "../Graph/Sales";

export default function Orders() {
  const [transData, setTransData] = useState();

  const getData = async () => {
    const { data } = await axios.get(`${BackendUrl}/get-top-bar-chart-data`, {
      withCredentials: true,
    });
    console.log("home data: ", data);
    const transformedData = [
      ["Item Name", "Orders"],
      ...data.map((item) => [item.product_name, item.total_sales]),
    ];
    setTransData(transformedData);
  };

  const dummyData = [
    ["Item Name", "Orders"],
    ["2014", 1000],
    ["2015", 1170],
    ["2016", 660],
    ["2017", 1030],
    ["2018", 1200],
  ];

  const options = {
    chart: {
      title: "Top Sales",
    },
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Chart
        chartType="Bar"
        width="600px"
        height="400px"
        data={transData}
        options={options}
      />
    </>
  );
}
