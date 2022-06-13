import {
	BrowserRouter as Router,
	Route,
	Routes,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./auth/Auth";
import PrivateRoute from "./auth/PrivateRoute";
import VerifyDoctor from "./pages/VerifyDoctor";
import Patient from "./pages/Patient";
import AppointmentHistory from "./pages/AppointmentHistory";
import DoctorAppointments from "./pages/DoctorAppointments";
import VerifiedDoctors from "./pages/VerifiedDoctors";
import DoctorInfo from "./pages/DoctorInfo";

function App() {

    return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route path="/"
						element={
							<PrivateRoute>
								<Dashboard />
							</PrivateRoute>
						}
					/>
					<Route path="/doctors/verify"
					       element={
						       <PrivateRoute>
							       <VerifyDoctor />
						       </PrivateRoute>
					       }
					/>
					<Route path="/doctors/verified"
					       element={
						       <PrivateRoute>
							       <VerifiedDoctors />
						       </PrivateRoute>
					       }
					/>
					<Route path="/doctors/info"
					       element={
						       <PrivateRoute>
							       <DoctorInfo />
						       </PrivateRoute>
					       }
					/>
					<Route path="/patient"
					       element={
						       <PrivateRoute>
							       <Patient />
						       </PrivateRoute>
					       }
					/>
					<Route path="/history"
					       element={
						       <PrivateRoute>
							       <AppointmentHistory />
						       </PrivateRoute>
					       }
					/>
					<Route path="history/appointments"
					       element={
						       <PrivateRoute>
							       <DoctorAppointments />
						       </PrivateRoute>
					       }
					/>
					<Route exact path="/login" element={<Login/>}/>
				</Routes>
			</Router>
		</AuthProvider>
    );
}

export default App;
