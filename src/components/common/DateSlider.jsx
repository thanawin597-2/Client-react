import React, { useState } from "react"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { DateRangePicker } from "react-date-range"

// สไตล์ CSS สำหรับปรับแต่ง
const datePickerStyles = `
    /* สไตล์หลักสำหรับ DateRangePicker */
    .rdrCalendar, .rdrDateRangeWrapper {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    /* ปรับสีของส่วนที่เลือก (Selected Range Color) */
    .rdrDay:not(.rdrDayPassive) .rdrInRange,
    .rdrDay:not(.rdrDayPassive) .rdrStartEdge,
    .rdrDay:not(.rdrDayPassive) .rdrEndEdge,
    .rdrDay:not(.rdrDayPassive) .rdrSelected {
        background-color: #0057B7 !important; /* สีน้ำเงินหลัก */
        color: white !important;
    }

    /* ปรับสีของจุดเริ่มต้น/จุดสิ้นสุด */
    .rdrDay:not(.rdrDayPassive) .rdrStartEdge ~ .rdrInRange,
    .rdrDay:not(.rdrDayPassive) .rdrEndEdge ~ .rdrInRange {
        background-color: #4da5ff !important; /* โทนน้ำเงินอ่อนลงสำหรับ In Range */
    }
    
    /* สไตล์สำหรับปุ่ม Clear Filter */
    .custom-clear-button {
        background-color: #0057B7; /* สีน้ำเงินหลัก */
        border-color: #0057B7;
        color: white;
        transition: background-color 0.3s, border-color 0.3s;
        margin-top: 1rem; /* เพิ่มระยะห่างด้านบนปุ่ม */
    }

    .custom-clear-button:hover {
        background-color: #004593; /* สีน้ำเงินเข้มขึ้นเมื่อ Hover */
        border-color: #004593;
        color: white;
    }

    /* ปรับสไตล์ h5 */
    .date-slider-header {
        color: #0057B7; /* สีน้ำเงินหลัก */
        font-weight: 600;
        margin-bottom: 1rem;
        text-align: center; /* จัดหัวข้อให้อยู่ตรงกลาง */
    }
    

    .date-slider-box {
        background-color: white;
        padding: 20px;
        border-radius: 8px; /* มุมโค้งมน */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* เงาให้ดูมีมิติ */
        max-width: fit-content; /* ปรับขนาดกล่องให้พอดีกับเนื้อหา */
        margin: 20px auto; /* ทำให้กล่องอยู่ตรงกลางแนวนอน */
        display: flex; /* ใช้ Flexbox สำหรับจัดเนื้อหาภายใน */
        flex-direction: column;
        align-items: center; /* จัดเนื้อหาให้อยู่ตรงกลางแนวนอนภายในกล่อง */
    }
`

const DateSlider = ({ onDateChange, onFilterChange }) => {
    const [dateRange, setDateRange] = useState({
        startDate: undefined,
        endDate: undefined,
        key: "selection"
    })

    const handleSelect = (ranges) => {
        setDateRange(ranges.selection)
        onDateChange(ranges.selection.startDate, ranges.selection.endDate)
        onFilterChange(ranges.selection.startDate, ranges.selection.endDate)
    }

    const handleClearFilter = () => {
        setDateRange({
            startDate: undefined,
            endDate: undefined,
            key: "selection"
        })
        onDateChange(null, null)
        onFilterChange(null, null)
    }

    return (
        <>
            <style>{datePickerStyles}</style>
            
            {/* กล่อง Container ที่มีสไตล์ 'date-slider-box' เพื่อให้มีเงา กล่องสีขาว และอยู่ตรงกลาง */}
            <div className="date-slider-box">
                <h5 className="date-slider-header">📅 Filter bookings by date</h5>
                
                {/* DateRangePicker */}
                <DateRangePicker 
                    ranges={[dateRange]} 
                    onChange={handleSelect} 
                    rangeColors={['#0057B7']} // กำหนดสีหลักสำหรับช่วงที่เลือก
                />
                
                {/* ปุ่ม Clear Filter */}
                <button 
                    className="btn custom-clear-button" 
                    onClick={handleClearFilter}
                >
                    Clear Filter
                </button>
            </div>
        </>
    )
}

export default DateSlider