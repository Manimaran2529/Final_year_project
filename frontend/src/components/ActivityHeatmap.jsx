import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ActivityHeatmap() {

  const [data, setData] = useState([]);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/daily-activity/${userId}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  return (
    <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
      <h2 className="text-xl mb-6">Activity Heatmap</h2>

      <CalendarHeatmap
        startDate={oneYearAgo}
        endDate={today}
        values={data}
        classForValue={(value) => {
          if (!value) return "color-empty";
          if (value.total >= 5) return "color-github-4";
          if (value.total >= 3) return "color-github-3";
          if (value.total >= 1) return "color-github-2";
          return "color-github-1";
        }}
        tooltipDataAttrs={(value) => {
          if (!value || !value.date) return {};
          return {
            "data-tip": `${value.date} | Total: ${value.total}`
          };
        }}
      />
    </div>
  );
}