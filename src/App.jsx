import React from "react"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "/node_modules/bootstrap/dist/js/bootstrap.min.js"
import ExistingRooms from "./components/room/ExistingRooms"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/home/Home"
import EditRoom from "./components/room/EditRoom"
import AddRoom from "./components/room/AddRoom"
import NavBar from "./components/layout/NavBar"
import Footer from "./components/layout/Footer"
import RoomListing from "./components/room/RoomListing"
import Admin from "./components/admin/Admin"
import Checkout from "./components/booking/Checkout"
import BookingSuccess from "./components/booking/BookingSuccess"
import Bookings from "./components/booking/Bookings"
import FindBooking from "./components/booking/FindBooking"
import Login from "./components/auth/Login"
import Registration from "./components/auth/Registration"
import Profile from "./components/auth/Profile"
import { AuthProvider } from "./components/auth/AuthProvider"
import RequireAuth from "./components/auth/RequireAuth"
import RevenueSummary from "./components/admin/RevenueSummary"
import FitnessBookingPage from "./components/fitness/FitnessBookingPage" 
import ExistingFitnessBookings from './components/fitness/ExistingFitnessBookings';

function App() {
	return (
		<AuthProvider>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
				}}
			>
				<Router>
					<NavBar />
					<main style={{ flex: 1 }}>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/edit-room/:roomId" element={<EditRoom />} />
							<Route path="/existing-rooms" element={<ExistingRooms />} />
							<Route path="/add-room" element={<AddRoom />} />

							<Route
								path="/book-room/:roomId"
								element={
									<RequireAuth>
										<Checkout />
									</RequireAuth>
								}
							/>
							<Route
							path="/existing-fitness-bookings" 
							element={<ExistingFitnessBookings />}
							/>
							<Route path="/fitness" element={<FitnessBookingPage />} />
							<Route path="/browse-all-rooms" element={<RoomListing />} />
							<Route path="/admin" element={<Admin />} />
							<Route path="/booking-success" element={<BookingSuccess />} />
							<Route path="/existing-bookings" element={<Bookings />} />
							<Route path="/find-booking" element={<FindBooking />} />
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Registration />} />
							<Route path="/profile" element={<Profile />} />
							<Route path="/logout" element={<FindBooking />} />
							<Route
								path="/revenue-summary"
								element={
									<RequireAuth>
										<RevenueSummary />
									</RequireAuth>
								}
							/>
						</Routes>
					</main>
					<Footer />
				</Router>
			</div>
		</AuthProvider>
	)
}


export default App
