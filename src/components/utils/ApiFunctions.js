import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

export const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config => {
	const token = localStorage.getItem("token")
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
}))

export const getHeader = () => {
	const token = localStorage.getItem("token")
	return {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json"
	}
}

/* This function adds a new room room to the database */
export async function addRoom(photo, roomType, roomPrice) {
	const formData = new FormData()
	formData.append("photo", photo)
	formData.append("roomType", roomType)
	formData.append("roomPrice", roomPrice)

	const response = await api.postForm("/rooms/add/new-room", formData)
	if (response.status === 201) {
		return true
	} else {
		return false
	}
}


export async function getRoomTypes() {
	try {
		const response = await api.get("/rooms/room/types")
		return response.data
	} catch (error) {
		throw new Error("Error fetching room types")
	}
}

export async function getAllRooms() {
	try {
		const result = await api.get("/rooms/all-rooms")
		return result.data
	} catch (error) {
		throw new Error("Error fetching rooms")
	}
}


export async function deleteRoom(roomId) {
	try {
		const result = await api.delete(`/rooms/delete/room/${roomId}`, {
			headers: getHeader()
		})
		return result.data
	} catch (error) {
		throw new Error(`Error deleting room ${error.message}`)
	}
}

export async function updateRoom(roomId, roomData) {
	const formData = new FormData()
	formData.append("roomType", roomData.roomType)
	formData.append("roomPrice", roomData.roomPrice)
	formData.append("photo", roomData.photo)
	const response = await api.putForm(`/rooms/update/${roomId}`, formData, {
		headers: getHeader()
	})
	return response
}


export async function getRoomById(roomId) {
	try {
		const result = await api.get(`/rooms/room/${roomId}`)
		return result.data
	} catch (error) {
		throw new Error(`Error fetching room ${error.message}`)
	}
}


export async function bookRoom(roomId, booking) {
	try {
		const response = await api.post(`/bookings/room/${roomId}/booking`, booking)
		return response.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error booking room : ${error.message}`)
		}
	}
}

/* This function gets alll bokings from the database */
export async function getAllBookings() {
	try {
		const result = await api.get("/bookings/all-bookings", {
			headers: getHeader()
		})
		return result.data
	} catch (error) {
		throw new Error(`Error fetching bookings : ${error.message}`)
	}
}


export async function getBookingByConfirmationCode(confirmationCode) {
	try {
		const result = await api.get(`/bookings/confirmation/${confirmationCode}`)
		return result.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error find booking : ${error.message}`)
		}
	}
}


export async function cancelBooking(bookingId) {
	try {
		const result = await api.delete(`/bookings/booking/${bookingId}/delete`)
		return result.data
	} catch (error) {
		throw new Error(`Error cancelling booking :${error.message}`)
	}
}

/* This function gets all availavle rooms from the database with a given date and a room type */
export async function getAvailableRooms(checkInDate, checkOutDate, roomType) {
	const result = await api.get(
		`rooms/available-rooms?checkInDate=${checkInDate}
		&checkOutDate=${checkOutDate}&roomType=${roomType}`
	)
	return result
}

/* This function register a new user */
export async function registerUser(registration) {
	try {
		const response = await api.post("/auth/register-user", registration)
		return response.data
	} catch (error) {
		if (error.reeponse && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`User registration error : ${error.message}`)
		}
	}
}


export async function loginUser(login) {
	try {
		const response = await api.post("/auth/login", login)
		if (response.status >= 200 && response.status < 300) {
			return response.data
		} else {
			return null
		}
	} catch (error) {
		console.error(error)
		return null
	}
}


export async function getUserProfile(userId, token) {
	try {
		const response = await api.get(`users/profile/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw error
	}
}

/* This isthe function to delete a user */
export async function deleteUser(userId) {
	try {
		const response = await api.delete(`/users/delete/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		return error.message
	}
}

/* This is the function to get a single user */
export async function getUser(userId, token) {
	try {
		const response = await api.get(`/users/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw error
	}
}

/* This is the function to get user bookings by the user id */
export async function getBookingsByUserId(userId, token) {
	try {
		const response = await api.get(`/bookings/user/${userId}/bookings`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		console.error("Error fetching bookings:", error.message)
		throw new Error("Failed to fetch bookings")
	}
}

export async function getRevenueSummary(startDate, endDate) {
  try {
    const result = await api.get(`/bookings/revenue-summary?startDate=${startDate}&endDate=${endDate}`);
    return result.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Error fetching revenue summary');
    } else {
      throw new Error(`Error fetching revenue summary: ${error.message}`);
    }
  }
}
/* This function gets all booked fitness slots for a specific date */
export async function getBookedFitnessSlots(date) {
    try {
        // ใช้ api.get() ซึ่งจะต่อกับ baseURL: "http://localhost:9192" ให้อัตโนมัติ
        const response = await api.get(`/api/fitness/bookings/byDate?date=${date}`) 
        return response.data
    } catch (error) {
        // Console Log ที่เราเห็นใน Browser น่าจะมาจาก Error ในส่วนนี้
        throw new Error("Error fetching available fitness slots: " + error.message)
    }
}

/* This function saves a new fitness booking to the database */
export async function createFitnessBooking(booking) {
    try {
        const response = await api.post("/api/fitness/bookings", booking)
        return response.data
    } catch (error) {
        if (error.response && error.response.data) {
            // ส่งข้อความ Error จาก Backend กลับไป (เช่น ช่วงเวลาเต็ม)
            throw new Error(error.response.data) 
        } else {
            throw new Error(`Error booking fitness slot: ${error.message}`)
        }
    }
}

export async function getAllFitnessBookings() {
    try {
        const result = await api.get("/api/fitness/admin/all-bookings", {
            headers: getHeader() // ต้องส่ง Header เพื่อยืนยันตัวตน Admin
        });
        return result.data;
    } catch (error) {
        if (error.response && error.response.status === 403) {
             throw new Error("ไม่มีสิทธิ์เข้าถึง: ต้องเป็นผู้ดูแลระบบ (Admin)");
        }
        throw new Error(`Error fetching all fitness bookings: ${error.message}`);
    }
}

export async function deleteBooking(bookingId) {
    try {
        const response = await api.delete(`/api/fitness/delete/booking/${bookingId}`); 
        return response.data; 
    } catch (error) {
        throw new Error(error.response?.data?.message || `Request failed with status code ${error.response?.status}`);
    }
}

