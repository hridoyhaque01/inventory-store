import React from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ChartBar = ({ title, data }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <p className="text-base smtext-lg lg:text-2xl text-blackHigh font-bold">
          {t(title)}
        </p>
        <span className="inline-block px-4 py-2 bg-primaryMainLight text-whiteHigh text-xs sm:text-sm rounded-full">
          {t("navigations.monthly")}
        </span>
      </div>
      <div className="flex items-center justify-start gap-6 mt-8 mb-10 text-xs sm:text-base">
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded-full bg-primaryMainLight"></div>
          <p>{t("navigations.sales")}</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded-full bg-secondaryMain"></div>
          <p>{t("navigations.profit")}</p>
        </div>
      </div>
      <section className="overflow-x-auto overflow-y-hidden flex items-center justify-center">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#54ADAA" />
                <stop offset="100%" stopColor="rgba(84, 173, 170, 0.40)" />
              </linearGradient>
            </defs>
            <defs>
              <linearGradient id="gradientTwo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#234B4C" />
                <stop offset="100%" stopColor="rgba(35, 75, 76, 0.40)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
            <XAxis dataKey="Date" />
            <YAxis />
            <Tooltip />
            {/* <Legend /> */}
            <Bar
              type="monotone"
              dataKey="Profit"
              fill="url(#gradientTwo)"
              radius={[24, 24, 0, 0]}
            />
            <Bar
              type="monotone"
              dataKey="Sales"
              fill="url(#gradient)"
              radius={[24, 24, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default ChartBar;
