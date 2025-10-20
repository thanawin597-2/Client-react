import React, { useEffect, useState, useMemo } from "react";
import moment from "moment";
import { Form, FormControl, Button, Row, Col, Alert } from "react-bootstrap";
import BookingSummary from "./BookingSummary";
import { bookRoom, getRoomById } from "../utils/ApiFunctions";
import { useNavigate, useParams } from "react-router-dom";
import { FaCalendarCheck, FaInfoCircle, FaUserPlus, FaMoneyBillWave } from 'react-icons/fa';


const PRIMARY_COLOR = "#0057B7";

// *** Utility Function ที่ยังคงไว้ ***


const isGuestCountValid = (numOfAdults, numOfChildren) => {
    const adultCount = parseInt(numOfAdults || "0");
    const childrenCount = parseInt(numOfChildren || "0");
    const totalCount = adultCount + childrenCount;
    return totalCount >= 1 && adultCount >= 1;
};



const BookingForm = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const currentUserEmail = localStorage.getItem("userId");

    const [roomPrice, setRoomPrice] = useState(0);
    const [booking, setBooking] = useState({
        guestFullName: "",
        guestEmail: currentUserEmail || "",
        checkInDate: "",
        checkOutDate: "",
        numOfAdults: "",
        numOfChildren: ""
    });
    
    // State สำหรับ UI และ Error Handling
    const [validated, setValidated] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [dateError, setDateError] = useState("");
    const [guestError, setGuestError] = useState("");
    const [fetchError, setFetchError] = useState("");

    // วันที่เริ่มต้นที่สามารถจองได้ (วันปัจจุบัน) ในรูปแบบ YYYY-MM-DD
    const minDate = moment().format("YYYY-MM-DD");

    // ดึงราคาห้องพัก
    useEffect(() => {
        const getPrice = async () => {
            try {
                const response = await getRoomById(roomId);
                setRoomPrice(response.roomPrice);
            } catch (error) {
                setFetchError("Error fetching room details. Please try again.");
                console.error(error);
            }
        };
        getPrice();
    }, [roomId]);

    // ฟังก์ชันคำนวณราคา (เหมือน V2)
    const calculatePayment = () => {
        const checkInDate = moment(booking.checkInDate)
        const checkOutDate = moment(booking.checkOutDate)
        // ตรวจสอบว่าวันที่ถูกต้องและ checkOut อยู่หลัง checkIn
        if (!checkOutDate.isAfter(checkInDate)) return 0;
        
        const diffInDays = checkOutDate.diff(checkInDate, "days")
        const paymentPerDay = roomPrice || 0; // ใช้ roomPrice จาก state
        return diffInDays * paymentPerDay
    }
    // ********************************************

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBooking(prevBooking => ({ ...prevBooking, [name]: value }));
        
        // ล้าง Error เมื่อมีการเปลี่ยนแปลง input
        if (name === "checkInDate" || name === "checkOutDate") {
            setDateError("");
        }
        if (name === "numOfAdults" || name === "numOfChildren") {
            setGuestError("");
        }
    };

    // V1 Logic: ตรวจสอบความถูกต้องของวันที่
    const isCheckOutDateValid = (inDate, outDate) => {
        if (!inDate || !outDate) return true;
        if (!moment(outDate).isSameOrAfter(moment(inDate))) {
            setDateError("Check-out date must be on or after check-in date.");
            return false;
        }
        setDateError("");
        return true;
    };

    // V1 Logic: รวมการตรวจสอบทั้งหมด
    const validateForm = (form) => {
        let isValid = form.checkValidity();

        // 1. ตรวจสอบวันที่
        const datesValid = isCheckOutDateValid(booking.checkInDate, booking.checkOutDate);
        isValid = isValid && datesValid;

        // 2. ตรวจสอบจำนวนผู้เข้าพัก
        const guestsValid = isGuestCountValid(booking.numOfAdults, booking.numOfChildren);
        if (!guestsValid) {
            setGuestError("Total guests must be at least 1, and there must be at least 1 adult.");
            isValid = false;
        } else {
            setGuestError("");
        }
        
        setValidated(true);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        
        if (validateForm(form)) {
            // เมื่อฟอร์มถูกต้อง ให้แสดง BookingSummary
            setIsSubmitted(true); 
        } else {
            e.stopPropagation();
            setIsSubmitted(false); // ซ่อน summary หาก validation ไม่ผ่าน
        }
    };

    const handleFormSubmit = async () => {
        try {
            const confirmationCode = await bookRoom(roomId, booking);
            navigate("/booking-success", { state: { message: confirmationCode } });
        } catch (error) {
            const errorMessage = error.message || "Booking failed due to an unexpected issue.";
            console.error("Booking failed:", error);
            navigate("/booking-success", { state: { error: errorMessage } });
        }
    };

    return (
        <div className="container mb-5">
            <Row className="justify-content-center">
                
                {/* Error Banner */}
                <Col xs={12} lg={10}>
                    {fetchError && <Alert variant="danger" className="mt-3">{fetchError}</Alert>}
                </Col>

                {/* Booking Form Column */}
                <Col md={6} lg={5}>
                    <div className="card card-body mt-5 shadow-lg border-0">
                        <h4 className="card-title text-center mb-4" style={{ color: PRIMARY_COLOR }}>
                            <FaCalendarCheck className="me-2 mb-1" />
                            **Reserve Your Room**
                        </h4>

                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            {/* Full Name */}
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="guestFullName" className="fw-bold" style={{ color: PRIMARY_COLOR }}>
                                    Full Name
                                </Form.Label>
                                <FormControl
                                    required
                                    type="text"
                                    id="guestFullName"
                                    name="guestFullName"
                                    value={booking.guestFullName}
                                    placeholder="Enter your full name"
                                    onChange={handleInputChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter your full name.
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Email (Disabled) */}
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="guestEmail" className="fw-bold" style={{ color: PRIMARY_COLOR }}>
                                    Email
                                </Form.Label>
                                <FormControl
                                    required
                                    type="email"
                                    id="guestEmail"
                                    name="guestEmail"
                                    value={booking.guestEmail}
                                    placeholder="Enter your email"
                                    onChange={handleInputChange}
                                    disabled
                                    className="bg-light"
                                />
                                <Form.Text className="text-muted">
                                    Your email is pre-filled from your login.
                                </Form.Text>
                            </Form.Group>

                            {/* Lodging Period */}
                            <fieldset className="p-3 mb-4 border rounded" style={{ borderColor: PRIMARY_COLOR + '40' }}>
                                <legend className="scheduler-border fw-bold" style={{ color: PRIMARY_COLOR, fontSize: '1.1rem' }}>
                                    🗓️ Lodging Period
                                </legend>
                                <Row>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Label htmlFor="checkInDate" className="small text-muted">Check-in date</Form.Label>
                                        <FormControl
                                            required
                                            type="date"
                                            id="checkInDate"
                                            name="checkInDate"
                                            value={booking.checkInDate}
                                            min={minDate}
                                            onChange={handleInputChange}
                                            isInvalid={!!dateError && validated}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please select a valid check-in date.
                                        </Form.Control.Feedback>
                                    </Col>

                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Label htmlFor="checkOutDate" className="small text-muted">Check-out date</Form.Label>
                                        <FormControl
                                            required
                                            type="date"
                                            id="checkOutDate"
                                            name="checkOutDate"
                                            value={booking.checkOutDate}
                                            min={booking.checkInDate || minDate}
                                            onChange={handleInputChange}
                                            isInvalid={!!dateError && validated}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please select a valid check-out date.
                                        </Form.Control.Feedback>
                                    </Col>
                                    {dateError && (
                                        <Col xs={12}>
                                            <Alert variant="danger" className="p-2 mt-2">{dateError}</Alert>
                                        </Col>
                                    )}
                                </Row>
                            </fieldset>

                            {/* Number of Guests */}
                            <fieldset className="p-3 mb-4 border rounded" style={{ borderColor: PRIMARY_COLOR + '40' }}>
                                <legend className="scheduler-border fw-bold" style={{ color: PRIMARY_COLOR, fontSize: '1.1rem' }}>
                                    <FaUserPlus className="me-1" />
                                    Number of Guests
                                </legend>
                                <Row>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Label htmlFor="numOfAdults" className="small text-muted">Adults (Min 1)</Form.Label>
                                        <FormControl
                                            required
                                            type="number"
                                            id="numOfAdults"
                                            name="numOfAdults"
                                            value={booking.numOfAdults}
                                            min={1}
                                            placeholder="1"
                                            onChange={handleInputChange}
                                            isInvalid={!!guestError && validated}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Minimum 1 adult is required.
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Label htmlFor="numOfChildren" className="small text-muted">Children</Form.Label>
                                        <FormControl
                                            required
                                            type="number"
                                            id="numOfChildren"
                                            name="numOfChildren"
                                            value={booking.numOfChildren}
                                            min={0}
                                            placeholder="0"
                                            onChange={handleInputChange}
                                            isInvalid={!!guestError && validated}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Select 0 if no children.
                                        </Form.Control.Feedback>
                                    </Col>
                                    {guestError && (
                                        <Col xs={12}>
                                            <Alert variant="danger" className="p-2 mt-2">{guestError}</Alert>
                                        </Col>
                                    )}
                                </Row>
                            </fieldset>

                            {/* Submit Button */}
                            <div className="d-grid mt-4">
                                <Button 
                                    type="submit" 
                                    style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR, color: "white" }} 
                                    className="btn-lg fw-bold"
                                >
                                    Continue to Booking Summary
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Col>

                {/* Booking Summary Column (Now only displays the Summary when submitted) */}
                <Col md={6} lg={5} className="mt-5 mt-md-0 d-flex align-items-stretch">
                    {isSubmitted && (
                        <div className="w-100">
                            <BookingSummary
                                booking={booking}
                                payment={calculatePayment()}
                                onConfirm={handleFormSubmit}
                                isFormValid={validated && !dateError && !guestError} 
                            />
                        </div>
                    )}
                    {/* Placeholder Card ถูกลบออกแล้ว */}
                </Col>
            </Row>
        </div>
    );
};
export default BookingForm