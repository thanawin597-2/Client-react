import React from "react"
import { Link } from "react-router-dom"

const Admin = () => {
    return (
        <section
            className="container mt-5 text-center"
            style={{
                backgroundColor: "#fff",
                padding: "40px 20px",
                borderRadius: "10px",
                color: "#fff" // สีข้อความให้ตัดกับพื้นหลัง
            }}
        >
            <h2 className="mb-4">Welcome to Admin Panel</h2>
            <hr className="mb-4" style={{ borderColor: "#fff" }} />
            <div className="d-flex flex-column align-items-center gap-3">
                <Link
                    to={"/existing-rooms"}
					className="btn btn-light btn-lg w-50"
					style={{
						backgroundColor: "#0057B7", 
						padding: "15px 30px",
						borderRadius: "8px",
						color: "#fff",
						textDecoration: "none",
						fontSize: "1.2rem",
					}}
>
                    Manage Rooms
                </Link>
                <Link
                    to={"/existing-bookings"}
                    className="btn btn-light btn-lg w-50"
					style={{
						backgroundColor: "#0057B7", 
						padding: "15px 30px",
						borderRadius: "8px",
						color: "#fff",
						textDecoration: "none",
						fontSize: "1.2rem",
					}}
                >
                    Manage Bookings
                </Link>
                <Link to={"/revenue-summary"}
                 className="btn btn-light btn-lg w-50"
					style={{
						backgroundColor: "#0057B7", 
						padding: "15px 30px",
						borderRadius: "8px",
						color: "#fff",
						textDecoration: "none",
						fontSize: "1.2rem",
					}}>Revenue Summary</Link>
                    <Link
                    to={"/existing-fitness-bookings"} 
                     className="btn btn-secondary btn-lg w-50"
                     style={{
						backgroundColor: "#0057B7", 
						padding: "15px 30px",
						borderRadius: "8px",
						color: "#fff",
						textDecoration: "none",
						fontSize: "1.2rem",
					}}
              >
                Manage Fitness Bookings
                 </Link>
            </div>
        </section>
    
    )
}

export default Admin