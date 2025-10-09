import React, { useEffect, useState } from "react";
import { getAllRooms } from "../utils/ApiFunctions";
import { Link } from "react-router-dom";
import room7 from "../../assets/images/room7.jpg";
import { Card, Container } from "react-bootstrap";

const RoomCarousel = () => {
  const [rooms, setRooms] = useState([{ id: "", roomType: "", roomPrice: "", photo: "" }]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getAllRooms()
      .then((data) => {
        setRooms(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="mt-5">Loading rooms....</div>;
  }

  if (errorMessage) {
    return <div className="text-danger mb-5 mt-5">Error : {errorMessage}</div>;
  }

  return (
    <section className="bg-light mb-5 mt-5 shadow">
      <Container>
        <h3 className="mb-4 pt-3 hotel-color">Available Rooms</h3>

        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "1rem",
            scrollBehavior: "smooth",
            paddingBottom: "10px",
          }}
        >
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="card_room h-100 flex-shrink-0"
              style={{ minWidth: "250px", maxWidth: "250px" }}
            >
              <Link to={`/book-room/${room.id}`}>
                <Card.Img
                  variant="top"
                  src={
                    room.photo
                      ? `data:image/png;base64,${room.photo}`
                      : room7
                  }
                  alt="Room Photo"
                  style={{
                    height: "180px",
                    objectFit: "cover",
                  }}
                />
              </Link>
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <Card.Title className="hotel-color">{room.roomType}</Card.Title>
                  <Card.Title className="room-price">${room.roomPrice}/night</Card.Title>
                </div>
                <Link
                  to={`/book-room/${room.id}`}
                  className="btn btn-hotel btn-sm mt-2"
                >
                  Book Now
                </Link>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Container>

      <div className="text-center mt-4 mb-4">
        <Link to={"/browse-all-rooms"} className="btn btn-hotel">
          Browse all rooms
        </Link>
      </div>
    </section>
  );
};

export default RoomCarousel;
