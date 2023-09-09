import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Container } from "react-bootstrap";
import "../styles/chart.css";

export default function ChartComponent({ data }) {
  // Get the top 3 entries
  const topEntries = data.slice(0, 3);

  // Prepare the data for the chart
  const chartData = topEntries.map((entry) => ({
    name: entry.name,
    right_answers: entry.total_right_answers,
    wrong_answers: entry.total_wrong_answers,
    score: entry.total_score,
  }));

  // Custom colors for the bar segments
  const colors = ["	#0a75ad", "#11dd66", "#e25168"];

  return (
    <Container className="chartContainer">
      {data.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill={colors[0]} />
              <Bar dataKey="right_answers" stackId="a" fill={colors[1]} />
              <Bar dataKey="wrong_answers" stackId="a" fill={colors[2]} />
            </BarChart>
          </ResponsiveContainer>
          <h6 className="chartTitle text-center">
            Top {topEntries[0].entity_type === "team" ? "Teams" : "Players"}
          </h6>
        </>
      ) : (
        <h6 className="noDataText text-center">No Data Found</h6>
      )}
    </Container>
  );
}
