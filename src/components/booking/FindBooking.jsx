import React, { useState } from "react"
import moment from "moment"
import { cancelBooking, getBookingByConfirmationCode } from "../utils/ApiFunctions"

const FindBooking = () => {
    const [confirmationCode, setConfirmationCode] = useState("")
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [bookingInfo, setBookingInfo] = useState({
        id: "",
        bookingConfirmationCode: "",
        room: { id: "", roomType: "" },
        roomNumber: "",
        checkInDate: "",
        checkOutDate: "",
        guestName: "",
        guestEmail: "",
        numOfAdults: "",
        numOfChildren: "",
        totalNumOfGuests: ""
    })

    const emptyBookingInfo = {
        id: "",
        bookingConfirmationCode: "",
        room: { id: "", roomType: "" },
        roomNumber: "",
        checkInDate: "",
        checkOutDate: "",
        guestName: "",
        guestEmail: "",
        numOfAdults: "",
        numOfChildren: "",
        totalNumOfGuests: ""
    }
    const [isDeleted, setIsDeleted] = useState(false)

    const handleInputChange = (event) => {
        setConfirmationCode(event.target.value)
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        setIsLoading(true)

        try {
            const data = await getBookingByConfirmationCode(confirmationCode)
            setBookingInfo(data)
            setError(null)
        } catch (error) {
            setBookingInfo(emptyBookingInfo)
            if (error.response && error.response.status === 404) {
                setError(error.response.data.message)
            } else {
                setError(error.message)
            }
        }
        setTimeout(() => setIsLoading(false), 1500)
    }

    const handleBookingCancellation = async (bookingId) => {
        try {
            await cancelBooking(bookingInfo.id)
            setIsDeleted(true)
            setSuccessMessage("🎉 Your booking has been successfully canceled!")
            setBookingInfo(emptyBookingInfo)
            setConfirmationCode("")
            setError(null)
        } catch (error) {
            setError(error.message)
        }
        setTimeout(() => {
            setSuccessMessage("")
            setIsDeleted(false)
        }, 2500)
    }

    return (
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light py-5">
            <div className="container p-4 rounded shadow bg-white" style={{ maxWidth: "700px" }}>
                <h2 className="text-center mb-4 fw-bold text-primary"> Find My Booking</h2>
                
                {/* Success & Error Messages */}
                {successMessage && (
                    <div className="alert alert-success text-center mb-3 animate__animated animate__fadeInDown">
                        {successMessage}
                    </div>
                )}
                {error && (
                    <div className="alert alert-danger text-center mb-3 animate__animated animate__fadeInDown">
                        Error: {error}
                    </div>
                )}

                {}
                <form onSubmit={handleFormSubmit} className="d-flex mb-4">
                    <input
                        className="form-control rounded-start"
                        type="text"
                        id="confirmationCode"
                        name="confirmationCode"
                        value={confirmationCode}
                        onChange={handleInputChange}
                        placeholder="Enter your booking confirmation code"
                        required
                    />
                    <button
                        type="submit"
                        className="btn btn-primary rounded-end d-flex align-items-center px-4"
                        style={{ minWidth: "150px" }}
                    >
                        <i className="bi bi-search me-2"></i> Find Booking
                    </button>
                </form>

                {}
                {isLoading ? (
                    <div className="text-center my-4">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                ) : (
                    bookingInfo.bookingConfirmationCode ? (
                        <div className="card shadow-lg border-0 rounded-3 p-4" style={{ backgroundColor: "#f8f9fa" }}>
                            <h3 className="text-center mb-4 text-primary fw-semibold"> Booking Details</h3>
                            <div className="row mb-3">
                                <div className="col-6 fw-semibold">Confirmation Code:</div>
                                <div className="col-6">{bookingInfo.bookingConfirmationCode}</div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-6 fw-semibold">Room Number:</div>
                                <div className="col-6">{bookingInfo.room.id}</div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-6 fw-semibold">Room Type:</div>
                                <div className="col-6">{bookingInfo.room.roomType}</div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-6 fw-semibold">Check-in Date:</div>
                                <div className="col-6">
                                    {moment(bookingInfo.checkInDate).subtract(1, "month").format("MMM Do, YYYY")}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-6 fw-semibold">Check-out Date:</div>
                                <div className="col-6">
                                    {moment(bookingInfo.checkOutDate).subtract(1, "month").format("MMM Do, YYYY")}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-6 fw-semibold">Guest Name:</div>
                                <div className="col-6">{bookingInfo.guestName}</div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-6 fw-semibold">Guest Email:</div>
                                <div className="col-6">{bookingInfo.guestEmail}</div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-6 fw-semibold">Adults:</div>
                                <div className="col-6">{bookingInfo.numOfAdults}</div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-6 fw-semibold">Children:</div>
                                <div className="col-6">{bookingInfo.numOfChildren}</div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-6 fw-semibold">Total Guests:</div>
                                <div className="col-6">{bookingInfo.totalNumOfGuests}</div>
                            </div>
                            <div className="d-flex justify-content-center">
                                <button
                                    onClick={() => handleBookingCancellation(bookingInfo.id)}
                                    className="btn btn-danger fw-semibold d-flex align-items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle me-2" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0-1A6 6 0 1 1 8 2a6 6 0 0 1 0 12z" />
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                    Cancel Booking
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center mt-4 text-muted">Please enter your confirmation code to find your booking.</div>
                    )
                )}
            </div>
        </div>
    )
}

export default FindBooking