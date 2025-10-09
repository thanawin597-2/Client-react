import React, { useState } from "react";
import { format, addDays, addMonths, parseISO } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getRevenueSummary } from "../utils/ApiFunctions"  // Import API

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const RevenueSummary = () => {
  const [period, setPeriod] = useState("monthly");  // 'daily', 'weekly', 'monthly'
  const [startDate, setStartDate] = useState(new Date(2025, 9, 1));  // Default: Oct 1, 2025 (current month)
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const calculateEndDate = () => {
    const start = startDate;
    switch (period) {
      case "daily":
        return addDays(start, 1);
      case "weekly":
        return addDays(start, 7);
      case "monthly":
        return addMonths(start, 1);
      default:
        return start;
    }
  };

  const fetchSummary = async () => {
    setLoading(true);
    setError("");
    const endDate = calculateEndDate();
    try {
      const response = await getRevenueSummary(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );
      setTotalRevenue(response.totalRevenue || 0);
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการดึงข้อมูล: " + err.message);
    }
    setLoading(false);
  };

  // Simple chart data (bar for daily/weekly, pie for monthly)
  const chartData = totalRevenue > 0 ? (
    period === "monthly" ? {
      labels: ["Total Revenue"],
      datasets: [{
        data: [totalRevenue],
        backgroundColor: ["#0057B7"],
      }],
    } : {
      labels: [format(startDate, "dd/MM")],
      datasets: [{
        label: "Revenue (บาท)",
        data: [totalRevenue],
        backgroundColor: ["#FF6384"],
      }],
    }
  ) : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "กราฟสรุปรายรับ" },
    },
  };

  return (
    <div>
      <style>{`
        /* RevenueSummary Styles */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .container h2 {
          color: #333;
          font-weight: bold;
          border-bottom: 2px solid #36A2EB;
          padding-bottom: 10px;
          margin-bottom: 30px;
        }

        /* Filter Section */
        .row.mb-3 {
          background-color: #fff;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          margin-bottom: 20px;
        }

        .form-label {
          font-weight: 600;
          color: #495057;
          margin-bottom: 8px;
        }

        .form-select, .form-control {
          border: 1px solid #ced4da;
          border-radius: 6px;
          padding: 10px;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .form-select:focus, .form-control:focus {
          border-color: #36A2EB;
          box-shadow: 0 0 0 0.2rem rgba(54, 162, 235, 0.25);
        }

        .btn-primary {
          background-color: #36A2EB;
          border-color: #36A2EB;
          border-radius: 6px;
          padding: 10px 20px;
          font-weight: 500;
          transition: background-color 0.15s ease-in-out;
        }

        .btn-primary:hover {
          background-color: #2c8cc9;
          border-color: #2c8cc9;
        }

        .btn-primary:disabled {
          background-color: #6c757d;
          border-color: #6c757d;
        }

        /* Summary Table */
        .row.mb-3 .col-md-12 {
          background-color: #fff;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .table {
          margin-bottom: 0;
          font-size: 14px;
        }

        .table th {
          background-color: #36A2EB;
          color: #fff;
          font-weight: 600;
          border: none;
          padding: 15px 12px;
          text-align: center;
        }

        .table td {
          padding: 15px 12px;
          text-align: center;
          border: 1px solid #dee2e6;
          vertical-align: middle;
        }

        .table tr:nth-child(even) {
          background-color: #f8f9fa;
        }

        .table tr:hover {
          background-color: #e9ecef;
        }

        /* Error and Info Messages */
        .alert {
          border-radius: 6px;
          border: none;
          margin-top: 15px;
          font-size: 14px;
        }

        .alert-danger {
          background-color: #f8d7da;
          color: #721c24;
        }

        .text-muted {
          text-align: center;
          font-style: italic;
          color: #6c757d !important;
          margin-top: 15px;
        }

        /* Chart Section */
        .row .col-md-12 {
          background-color: #fff;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          margin-bottom: 20px;
        }

        .row .col-md-12 canvas {
          max-height: 400px;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .container {
            padding: 10px;
          }
          
          .row.mb-3 {
            padding: 15px;
          }
          
          .table th, .table td {
            padding: 10px 8px;
            font-size: 13px;
          }
          
          .btn-primary {
            width: 100%;
            margin-top: 10px;
          }
        }
      `}</style>
      <div className="container">
        <h2 className="text-center mb-4">สรุปรายรับรายจ่าย</h2>
        
        {/* Filter Period */}
        <div className="row mb-3">
          <div className="col-md-3">
            <label className="form-label">ประเภทช่วงเวลา:</label>
            <select
              className="form-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="daily">รายวัน</option>
              <option value="weekly">รายสัปดาห์</option>
              <option value="monthly">รายเดือน</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">วันที่เริ่มต้น:</label>
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              className="form-control"
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div className="col-md-3 align-self-end">
            <button
              className="btn btn-primary"
              onClick={fetchSummary}
              disabled={loading}
            >
              {loading ? "กำลังโหลด..." : "สรุป"}
            </button>
          </div>
        </div>

        {/* Summary Table */}
        <div className="row mb-3">
          <div className="col-md-12">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ช่วงเวลา</th>
                  <th>วันที่เริ่ม</th>
                  <th>วันที่สิ้นสุด</th>
                  <th>รายรับรวม (บาท)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{period === "daily" ? "รายวัน" : period === "weekly" ? "รายสัปดาห์" : "รายเดือน"}</td>
                  <td>{format(startDate, "dd/MM/yyyy")}</td>
                  <td>{format(calculateEndDate(), "dd/MM/yyyy")}</td>
                  <td>{totalRevenue.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            {error && <div className="alert alert-danger">{error}</div>}
            {totalRevenue === 0 && !loading && <p className="text-muted">ไม่มีรายรับในช่วงเวลานี้</p>}
          </div>
        </div>

        {/* Chart */}
        {chartData && (
          <div className="row">
            <div className="col-md-12">
              {period === "monthly" ? (
                <Pie data={chartData} options={chartOptions} />
              ) : (
                <Bar data={chartData} options={chartOptions} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueSummary;