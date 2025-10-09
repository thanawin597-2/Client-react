import React, { useState, useEffect } from 'react';
import { Table, Alert, Spinner } from 'react-bootstrap';
import { format, isValid } from 'date-fns'; 
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa"

// 🌟🌟 Import ฟังก์ชันลบเข้ามาด้วย 🌟🌟
import { getAllFitnessBookings, deleteBooking } from '../utils/ApiFunctions'; 

const ExistingFitnessBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); 
// ฟังก์ชันช่วยจัดการรูปแบบเวลาที่มาจาก Backend (รองรับ HH.M, HH.0, HH:MM, HHMM)
const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    
    const str = String(timeString);

    // 1. **รูปแบบที่มีโคลอน (HH:MM:SS)**: ตัดเอาแค่ HH:MM
    if (str.includes(':')) {
        // ตัวอย่าง: "17:00:00" -> "17:00"
        // ตัวอย่าง: "01:20" (อาจไม่ถูกต้องแต่ตัดได้) -> "01:20"
        return str.substring(0, 5); 
    }

    // 2. **รูปแบบที่มีจุดทศนิยม (X.X หรือ XX.X)**:
    if (str.includes('.')) {
        // เช่น "9.0" หรือ "19.0" (แสดงว่าเวลาเป็นชั่วโมงเต็ม)
        const hour = Math.floor(parseFloat(str));
        const hourStr = String(hour).padStart(2, '0');
        return `${hourStr}:00`; // คืนค่าเป็น 09:00 หรือ 19:00
    }

    // 3. **รูปแบบตัวเลข 3-4 หลัก (HHMM)**: เช่น "170" หรือ "1700"
    let cleanStr = str.replace(/[^0-9]/g, ''); 
    
    if (cleanStr.length >= 3 && cleanStr.length <= 4) {
        // เติม 0 ด้านหน้าให้เป็น 4 หลัก
        const paddedStr = cleanStr.padStart(4, '0');
        // แยกเป็น HH:MM
        return `${paddedStr.substring(0, 2)}:${paddedStr.substring(2, 4)}`;
    }
    
    // 4. กรณีอื่นๆ (ใช้ค่าเดิม)
    return str; 
};

    // ฟังก์ชันช่วยจัดการรูปแบบวันที่อย่างปลอดภัย
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return isValid(date) ? format(date, 'dd/MM/yyyy') : 'Invalid Date';
        } catch (e) {
            return 'Error Date';
        }
    };
    
    // ฟังก์ชันหลักในการดึงข้อมูล (ถูกแยกออกมาเพื่อให้เรียกซ้ำได้หลังการลบ)
    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null); // ล้างข้อความสำเร็จเมื่อดึงข้อมูลใหม่
        try {
            const result = await getAllFitnessBookings(); 
            if (Array.isArray(result)) {
                setBookings(result);
            } else {
                setError("รูปแบบข้อมูลที่ได้รับจากเซิร์ฟเวอร์ไม่ถูกต้อง");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'ไม่สามารถเชื่อมต่อหรือดึงข้อมูลการจองได้';
            setError(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    // ฟังก์ชันจัดการการลบรายการจอง
    const handleDeleteBooking = async (bookingId) => {
        const confirmDelete = window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบรายการจอง ID: ${bookingId}?`);
        if (!confirmDelete) return;

        setSuccessMessage(null); 
        setError(null); 

        try {
            await deleteBooking(bookingId); // API ลบ
            setSuccessMessage(`รายการจอง ID: ${bookingId} ถูกลบสำเร็จแล้ว`);
            fetchBookings(); // เรียกดึงข้อมูลใหม่
        } catch (error) {
            // จะแสดงข้อความ Error จาก 401 Unauthorized หรือ 404 Not Found
            setError(error.message || 'เกิดข้อผิดพลาดในการลบรายการจอง');
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);
    
    // ... (ส่วน Loading และ Error) ...

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 text-primary">ALL BOOKINGS FITNESS</h2>
            
            {successMessage && ( 
                <Alert variant="success" className="text-center">{successMessage}</Alert>
            )}

            {bookings.length === 0 ? (
                <Alert variant="info" className="text-center shadow-md">
                    ยังไม่มีการจองฟิตเนสในระบบ (โปรดลองจองรายการใหม่)
                </Alert>
            ) : (
                <div className="table-responsive">
                    <Table striped bordered hover responsive className="shadow-lg rounded-lg"> 
                        <thead table-primary text-center>
                            <tr>
                                <th className="table-1">ID</th>
                                {/* <th>รหัสยืนยัน</th> */}
                                <th className="table-1">Names</th>
                                <th className="table-1">Dates</th>
                                <th className="table-1">Start-Dates</th>
                                <th className="table-1">End-Dates</th>
                                <th className="table-1">Delete</th> {/* ไม่มีคอลัมน์ 'เวลาสร้างรายการ' แล้ว */}
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.bookingId}>
                                    <td>{booking.bookingId}</td>
                                    {/* <td>{booking.confirmationCode}</td> */}
                                    <td>{booking.guestName}</td>
                                    <td>{formatDate(booking.bookingDate)}</td>
                                    <td>{formatTime(booking.startTime)}</td>
                                    <td>{formatTime(booking.endTime)}</td>
                                    <td>
                                        <button 
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteBooking(booking.bookingId)}
                                        >
                                           <FaTrashAlt className="me-2" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default ExistingFitnessBookings;