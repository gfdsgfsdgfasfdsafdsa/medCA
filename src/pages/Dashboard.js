import Layout from "../Layout";
import {useEffect, useState} from "react";
import { collection } from "firebase/firestore";
import { onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from '../firebase-config'
import Pagination from "../Pagination";
import formatDate from "../lib/formatDate";

const Dashboard = () => {
	const [doctors, setDoctors] = useState([])
	const [appointments, setAppointments] = useState([])

	const [dCurrentPage, setDCurrentPage] = useState(1)
	const [aCurrentPage, setACurrentPage] = useState(1)
	const perPage = 3
	const [dSearch, setDSearch] = useState('')
	const [aSearch, setASearch] = useState('')
	const [dFilteredData, setDFilteredData] = useState([]);
	const [aFilteredData, setAFilteredData] = useState([]);

	useEffect(() => {
		async function getDoctorList() {
			const q = query(
				collection(db, "MedCA_Users"),
				orderBy("name", "asc"),
			);

			onSnapshot(q, (querySnapshot) => {
				const result = [];
				let index = 0
				querySnapshot.forEach((data) => {
					if(data.data()?.userType === 'doctor' && data.data()?.userStatus === 'verified'){
						result.push({
							...data.data(),
							id: index,
						});
						index++
					}
				});
				setDoctors(result);
			});
		}

		async function getAppointmentList() {
			const q = query(
				collection(db, "appointments"),
				orderBy("schedule_date", "desc"),
			);

			onSnapshot(q, (querySnapshot) => {
				const result = [];
				let index = 0
				querySnapshot.forEach((data) => {
					result.push({
						...data.data(),
						schedule_date: formatDate(data.data()?.schedule_date),
						id: index++,
					});
				});
				setAppointments(result);
			});
		}

		getAppointmentList()
		getDoctorList()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const dHandleSearchChange = (e) => setDSearch(e.target.value);
	const aHandleSearchChange = (e) => setASearch(e.target.value);

	useEffect(() => {
		let result;

		if (!dSearch) {
			result = doctors;
			setDCurrentPage(1)
		}

		if (dSearch) {
			setDCurrentPage(1)
			const needle = dSearch.toLowerCase();
			result = doctors.filter((doctor) => {
				return (
					doctor.name?.toLowerCase().includes(needle)
				);
			});
		}
		setDFilteredData(result);

	}, [dSearch, doctors]);

	useEffect(() => {
		let result;

		if (!aSearch) {
			result = appointments;
			setACurrentPage(1)
		}

		if (aSearch) {
			setACurrentPage(1)
			const needle = aSearch.toLowerCase();
			result = appointments.filter((a) => {
				return (
					a?.patientName.toLowerCase().includes(needle) ||
					a?.doctorName.toLowerCase().includes(needle)
				);
			});
		}
		setAFilteredData(result);

	}, [aSearch, appointments]);

	const dLastIndex = dCurrentPage * perPage
	const dFirstIndex = dLastIndex - perPage
	const dCurrent = dFilteredData?.slice(dFirstIndex, dLastIndex)

	const aLastIndex = aCurrentPage * perPage
	const aFirstIndex = aLastIndex - perPage
	const aCurrent = aFilteredData?.slice(aFirstIndex, aLastIndex)

	const dPaginate = (n) => setDCurrentPage(n)
	const aPaginate = (n) => setACurrentPage(n)

	return(
		<Layout>
			<div className="col-span-full bg-white rounded-sm border border-slate-200">
				<header className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
					<div>
						<h2 className="font-semibold text-slate-800 text-lg underline">All Verified Doctors</h2>
					</div>
					<div className="mt-2 xl:w-80">
						<input
							onChange={dHandleSearchChange}
							type="text"
							className="block w-full px-3 py-1 text-base font-normal text-gray-700 bg-white bg-clip-padding
        border border-solid border-gray-300 rounded m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
							placeholder="Search Doctor"
						/>
					</div>
				</header>
				<div className="p-3">
					{/* Table */}
					<div className="overflow-x-auto">
						<table className="table-auto w-full">
							{/* Table header */}
							<thead className="text-xs font-semibold uppercase text-slate-400 bg-slate-50">
							<tr>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-left">Doctor</div>
								</th>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-left">Email</div>
								</th>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-left">Gender</div>
								</th>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-center">Medical Field</div>
								</th>
							</tr>
							</thead>
							{/* Table body */}
							<tbody className="text-sm divide-y divide-slate-100">
							{dCurrent?.length === 0 ? (
								<tr>
									<td colSpan={4} className="p-2 whitespace-nowrap">
										<div className="text-center">
											<div className="font-medium text-slate-800">No Data</div>
										</div>
									</td>
								</tr>
							):(
								dCurrent?.map(doctor => {
									return (
										<tr key={doctor.id}>
											<td className="p-2 whitespace-nowrap">
												<div className="flex items-center">
													<div className="font-medium text-slate-800">{doctor.name}</div>
												</div>
											</td>
											<td className="p-2 whitespace-nowrap">
												<div className="text-left">{doctor.email}</div>
											</td>
											<td className="p-2 whitespace-nowrap">
												<div className="text-left">{doctor.gender}</div>
											</td>
											<td className="p-2 whitespace-nowrap">
												<div className="text-center">{doctor.medical_field}</div>
											</td>
										</tr>
									)
								})
							)}
							</tbody>
						</table>
						<Pagination
							perPage={perPage}
							total={dFilteredData?.length}
							paginate={dPaginate}
							pageIndex={dCurrentPage}
							setCurrentIndex={setDCurrentPage}
						/>
					</div>

				</div>
			</div>
			<div className="col-span-full bg-white rounded-sm border border-slate-200">
				<header className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
					<div>
						<h2 className="font-semibold text-slate-800 text-lg underline">All Appointments</h2>
					</div>
					<div className="mt-2 xl:w-80">
						<input
							onChange={aHandleSearchChange}
							type="text"
							className="block w-full px-3 py-1 text-base font-normal text-gray-700 bg-white bg-clip-padding
        border border-solid border-gray-300 rounded m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
							placeholder="Search Doctor/Patient"
						/>
					</div>
				</header>
				<div className="p-3">
					{/* Table */}
					<div className="overflow-x-auto">
						<table className="table-auto w-full">
							{/* Table header */}
							<thead className="text-xs font-semibold uppercase text-slate-400 bg-slate-50">
							<tr>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-left">Doctor Name</div>
								</th>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-left">Patient Name</div>
								</th>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-left">Schedule Date</div>
								</th>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-center">Schedule Time</div>
								</th>
							</tr>
							</thead>
							{/* Table body */}
							<tbody className="text-sm divide-y divide-slate-100">
							{aCurrent?.length === 0 ? (
								<tr>
									<td colSpan={4} className="p-2 whitespace-nowrap">
										<div className="text-center">
											<div className="font-medium text-slate-800">No Data</div>
										</div>
									</td>
								</tr>
							):(
								aCurrent?.map(appointment => {
									return (
										<tr key={appointment.id}>
											<td className="p-2 whitespace-nowrap">
												<div className="flex items-center">
													<div className="font-medium text-slate-800">{appointment.doctorName}</div>
												</div>
											</td>
											<td className="p-2 whitespace-nowrap">
												<div className="text-left">{appointment.patientName}</div>
											</td>
											<td className="p-2 whitespace-nowrap">
												<div className="text-left">{appointment.schedule_date}</div>
											</td>
											<td className="p-2 whitespace-nowrap">
												<div className="text-center">{appointment.schedule_time}</div>
											</td>
										</tr>
									)
								})
							)}
							</tbody>
						</table>
						<Pagination
							perPage={perPage}
							total={aFilteredData?.length}
							paginate={aPaginate}
							pageIndex={aCurrentPage}
							setCurrentIndex={setACurrentPage}
						/>
					</div>

				</div>
			</div>
		</Layout>
	)
}

export default Dashboard
