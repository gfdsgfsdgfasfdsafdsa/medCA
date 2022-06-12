import {
	BrowserRouter as Router,
	Route,
	Routes,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./auth/Auth";
import PrivateRoute from "./auth/PrivateRoute";
import Doctor from "./pages/Doctor";
import Patient from "./pages/Patient";
import AppointmentHistory from "./pages/AppointmentHistory";
import DoctorAppointments from "./pages/DoctorAppointments";

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
					<Route path="/doctor"
					       element={
						       <PrivateRoute>
							       <Doctor />
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
