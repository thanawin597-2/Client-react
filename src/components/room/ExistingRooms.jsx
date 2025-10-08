import React, { useEffect, useState } from "react"
import { deleteRoom, getAllRooms } from "../utils/ApiFunctions"
import { Col, Row } from "react-bootstrap"
import RoomFilter from "../common/RoomFilter"
import RoomPaginator from "../common/RoomPaginator"
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa"
import { Link } from "react-router-dom"

const ExistingRooms = () => {
    const [rooms, setRooms] = useState([{ id: "", roomType: "", roomPrice: "" }])
    const [currentPage, setCurrentPage] = useState(1)
    const [roomsPerPage] = useState(8)
    const [isLoading, setIsLoading] = useState(false)
    const [filteredRooms, setFilteredRooms] = useState([{ id: "", roomType: "", roomPrice: "" }])
    const [selectedRoomType, setSelectedRoomType] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    useEffect(() => {
        fetchRooms()
    }, [])

    const fetchRooms = async () => {
        setIsLoading(true)
        try {
            const result = await getAllRooms()
            setRooms(result)
            setIsLoading(false)
        } catch (error) {
            setErrorMessage(error.message)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (selectedRoomType === "") {
            setFilteredRooms(rooms)
        } else {
            const filteredRooms = rooms.filter((room) => room.roomType === selectedRoomType)
            setFilteredRooms(filteredRooms)
        }
        setCurrentPage(1)
    }, [rooms, selectedRoomType])

    const handlePaginationClick = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const handleDelete = async (roomId) => {
        try {
            const result = await deleteRoom(roomId)
            if (result === "") {
                setSuccessMessage(`Room No ${roomId} was deleted`)
                fetchRooms()
            } else {
                console.error(`Error deleting room : ${result.message}`)
            }
        } catch (error) {
            setErrorMessage(error.message)
        }
        setTimeout(() => {
            setSuccessMessage("")
            setErrorMessage("")
        }, 3000)
    }

    const calculateTotalPages = (filteredRooms, roomsPerPage, rooms) => {
        const totalRooms = filteredRooms.length > 0 ? filteredRooms.length : rooms.length
        return Math.ceil(totalRooms / roomsPerPage)
    }

    const indexOfLastRoom = currentPage * roomsPerPage
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom)

    return (
        <>
            <div className="container my-5 p-4 bg-white rounded shadow" style={{ maxWidth: "90%", margin: "auto" }}>
                {/* แสดงข้อความ success / error */}
                {successMessage && (
                    <div className="alert alert-success text-center mb-3" role="alert">
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="alert alert-danger text-center mb-3" role="alert">
                        {errorMessage}
                    </div>
                )}

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-primary fw-semibold">Existing Rooms</h2>
                    <Link to={"/add-room"} className="btn btn-primary d-flex align-items-center">
                        <FaPlus className="me-2" /> Add Room
                    </Link>
                </div>

                {/* Loader */}
                {isLoading ? (
                    <p className="text-center">Loading existing rooms...</p>
                ) : (
                    <>
                        <Row className="mb-3">
                            <Col md={6}>
                                <RoomFilter data={rooms} setFilteredData={setFilteredRooms} />
                            </Col>
                            <Col md={6} className="text-end">
                                {/* อัปเดตปุ่มให้ดูดีขึ้น */}
                                {/* ไม่มีปุ่มตรงนี้แล้ว เพราะใช้ปุ่มด้านบนเพื่อเพิ่มข้อมูล */}
                            </Col>
                        </Row>

                        {/* ตารางข้อมูล */}
                        <table className="table table-bordered table-hover table-striped rounded-3">
                            <thead className="table-primary text-center">
                                <tr>
                                    <th>ID</th>
                                    <th>Room Type</th>
                                    <th>Room Price</th>
                                    <th style={{ width: "20%" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRooms.length > 0 ? (
                                    currentRooms.map((room) => (
                                        <tr key={room.id} className="text-center align-middle">
                                            <td>{room.id}</td>
                                            <td>{room.roomType}</td>
                                            <td>{room.roomPrice}</td>
                                            <td className="d-flex justify-content-center gap-2">
                                                <Link to={`/edit-room/${room.id}`} className="btn btn-sm btn-warning d-flex align-items-center" title="Edit">
                                                    <FaEdit className="me-2" /> Edit
                                                </Link>
                                                <button
                                                    className="btn btn-sm btn-danger d-flex align-items-center"
                                                    onClick={() => handleDelete(room.id)}
                                                    title="Delete"
                                                >
                                                    <FaTrashAlt className="me-2" /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted">
                                            No rooms found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* พิจารณาใช้คอมโพเนนต์ Pagination */}
                        <RoomPaginator
                            currentPage={currentPage}
                            totalPages={calculateTotalPages(filteredRooms, roomsPerPage, rooms)}
                            onPageChange={handlePaginationClick}
                        />
                    </>
                )}
            </div>
        </>
    )
}

export default ExistingRooms