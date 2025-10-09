import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { getBookedFitnessSlots, createFitnessBooking } from "../utils/ApiFunctions"; 
import { format } from 'date-fns';
import { useAuth } from '../auth/AuthProvider'; // ตรวจสอบว่ามี AuthProvider หรือไม่
import { useNavigate } from 'react-router-dom';

const FitnessBookingPage = () => {
    const { user } = useAuth(); // ดึงข้อมูลผู้ใช้ที่เข้าสู่ระบบ
    const navigate = useNavigate();

    // ----------------------------------------------------
    // 1. STATE MANAGEMENT
    // ----------------------------------------------------
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [availableSlots, setAvailableSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    
    // ตั้งค่าเริ่มต้นการจอง
    const [newBooking, setNewBooking] = useState({
        bookingDate: format(new Date(), 'yyyy-MM-dd'),
        startTime: '',
        guestName: user ? user.firstName + " " + user.lastName : '', // ดึงชื่อจากผู้ใช้
        userId: user ? user.id : null, 
    });

    // ----------------------------------------------------
    // 2. LOGIC การคำนวณเวลาที่ว่าง
    // ----------------------------------------------------
    const generateTimeSlots = (bookedTimes) => {
        const slots = [];
        // สร้างช่วงเวลา 09:00 - 20:00 (1 ชั่วโมงต่อช่วง)
        for (let hour = 9; hour < 20; hour++) {
            const startTime = format(new Date(2000, 0, 1, hour, 0), 'HH:mm');
            const endTime = format(new Date(2000, 0, 1, hour + 1, 0), 'HH:mm');
            const slot = $`{startTime} - ${endTime}`;
            
            // ตรวจสอบว่าช่วงเวลานี้ถูกจองแล้วหรือไม่
            // bookedTimes คือ List<String> ของ startTime (เช่น ["13:00", "15:00"])
            const isBooked = bookedTimes.includes(startTime);

            // เพิ่มช่วงเวลาที่ยังไม่ถูกจองลงในรายการ
            if (!isBooked) {
                slots.push({ value: startTime, label: slot });
            }
        }
        setAvailableSlots(slots);
    };

    // ----------------------------------------------------
    // 3. GET API: ดึงเวลาที่ถูกจองแล้ว
    // ----------------------------------------------------
    const fetchBookedSlots = async (date) => {
        setLoading(true);
        setError(null);
        setAvailableSlots([]);
        try {
            // 🌟 ใช้ฟังก์ชันจาก ApiFunctions.js (ชี้ไปที่ Port 9192) 🌟
            const bookedTimes = await getBookedFitnessSlots(date);
            setBookedSlots(bookedTimes);
            generateTimeSlots(bookedTimes); // คำนวณเวลาที่ว่าง
        } catch (err) {
            setError(err.message || "ไม่สามารถดึงตารางเวลาที่ว่างได้ กรุณาลองใหม่");
            setBookedSlots([]);
            setAvailableSlots([]);
        } finally {
            setLoading(false);
        }
    };

    // ----------------------------------------------------
    // 4. useEffect (เรียก API เมื่อวันที่เปลี่ยน)
    // ----------------------------------------------------
    useEffect(() => {
        if (!user) {
            // หากไม่มีผู้ใช้ล็อกอิน ให้ออกไปหน้าล็อกอิน
            //navigate('/login'); 
            // setError("Full authentication is required to access this resource");
        } else if (newBooking.bookingDate) {
            fetchBookedSlots(newBooking.bookingDate);
        }
    }, [newBooking.bookingDate, user]);


    // ----------------------------------------------------
    // 5. EVENT HANDLERS
    // ----------------------------------------------------
    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        setNewBooking((prev) => ({ 
            ...prev, 
            bookingDate: date, 
            startTime: '' // เคลียร์เวลาเมื่อเปลี่ยนวัน
        }));
        setError(null);
        setSuccessMessage("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewBooking((prev) => ({ 
            ...prev, 
            [name]: value 
        }));
        setError(null);
        setSuccessMessage("");
    };

    // ----------------------------------------------------
    // 6. POST API: Submit Form
    // ----------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage("");

        if (!user) {
            setError("กรุณาเข้าสู่ระบบก่อนทำการจอง");
            return;
        }

        if (!newBooking.bookingDate || !newBooking.startTime || !newBooking.guestName) {
            setError("กรุณากรอกข้อมูลการจองให้ครบถ้วน");
            return;
        }

        try {
            // 🌟🌟 ใช้ฟังก์ชัน API ที่ถูกต้อง (ชี้ไปที่ Port 9192) 🌟🌟
            const result = await createFitnessBooking(newBooking);
            setSuccessMessage(`Booking Successf!`);
            
            // เคลียร์ฟอร์มบางส่วนและรีเฟรชตารางเวลา
            setNewBooking((prev) => ({
                ...prev,
                startTime: '',
            }));
            fetchBookedSlots(newBooking.bookingDate);

        } catch (err) {
            // ข้อความ Error จาก Backend เช่น "ช่วงเวลานี้ถูกจองเต็มแล้ว"
            setError(err.message || "เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่"); 
        }
    };


    // ----------------------------------------------------
    // 7. JSX RENDERING
    // ----------------------------------------------------
    
    // ตรวจสอบว่าผู้ใช้ล็อกอินแล้วหรือยัง (ตาม Error ในภาพที่เคยเจอ)
    if (!user) {
        return (
            <div className="container mt-5">
                <Alert variant="danger">
                    การยืนยันตัวตนเต็มรูปแบบมีความจำเป็นต่อการเข้าถึงหน้านี้ กรุณาเข้าสู่ระบบ
                    <Button variant="link" onClick={() => navigate('/login')}>
                        เข้าสู่ระบบ
                    </Button>
                </Alert>
            </div>
        );
    }
    
    return (
  <div className="fitness-page-bg">
    <div className="content-wrapper">


      <Form onSubmit={handleSubmit} className="p-4 border rounded shadow" style={{ maxWidth: "500px", width: "100%" }}>
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
         <h2 className="text-center mb-4">Booking Fitness</h2>
        {/* Date Picker */}
        <Form.Group controlId="bookingDate" className="mb-3">
          <Form.Label>Select Date</Form.Label>
          <Form.Control
            type="date"
            name="bookingDate"
            value={newBooking.bookingDate}
            min={format(new Date(), 'yyyy-MM-dd')}
            onChange={handleDateChange}
            required
          />
        </Form.Group>

        {/* Time Slot Dropdown */}
        <Form.Group controlId="startTime" className="mb-3">
          <Form.Label>
            Select Times (1 Hour/Session)
            <span className="span-1"> *Each reservation lasts for hour</span>
          </Form.Label>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" size="sm" /> กำลังดึงข้อมูล...
            </div>
          ) : (
            <Form.Control
              as="select"
              name="startTime"
              value={newBooking.startTime}
              onChange={handleChange}
              required
            >
              <option value="">--- Times ---</option>
              {availableSlots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </Form.Control>
          )}
          {!loading && availableSlots.length === 0 && newBooking.bookingDate && (
            <Alert variant="info" className="mt-2">
              ไม่มีช่วงเวลาว่างในวันที่ {newBooking.bookingDate}
            </Alert>
          )}
        </Form.Group>

        {/* Guest Name Field */}
        <Form.Group controlId="guestName" className="mb-3">
          <Form.Label>Names</Form.Label>
          <Form.Control
            type="text"
            name="guestName"
            value={newBooking.guestName}
            onChange={handleChange}
            placeholder="Reservation Names"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "กำลังดำเนินการ..." : "Confirm Booking"}
        </Button>
      </Form>
    </div>
  </div>
);

};

export default FitnessBookingPage;