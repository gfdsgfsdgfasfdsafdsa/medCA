import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {onSnapshot, query, orderBy, doc} from "firebase/firestore";
import { collection } from "firebase/firestore";
import { db } from '../firebase-config'
import Layout from "../Layout";
import Pagination from "../Pagination";
import formatDate from "../lib/formatDate";

const DoctorAppointments = () => {
	const { state } = useLocation();
	const [patients, setPatients] = useState([])

	const [currentPage, setCurrentPage] = useState(1)
	const perPage = 7
	const [search, setSearch] = useState('')
	const [filteredData, setFilteredData] = useState([]);

	useEffect(() => {
		async function getPatientList() {
			const q = query(
				collection(db, "appointments"),
				orderBy("schedule_date", "desc"),
			);

			onSnapshot(q, (querySnapshot) => {
				const result = [];

				querySnapshot.forEach((data) => {
					if(data.data()?.doctorName === state?.name){
						result.push({
							...data.data(),
							schedule_date: formatDate(data?.data()?.schedule_date),
							id: data.id,
						});
					}
				});

				setPatients(result);
			});
		}

		getPatientList()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleSearchChange = (e) => setSearch(e.target.value);

	useEffect(() => {
		let result;

		if (!search) {
			result = patients;
			setCurrentPage(1)
		}

		if (search) {
			setCurrentPage(1)
			const needle = search.toLowerCase();
			result = patients.filter((patient) => {
				return (
					patient.patientName?.toLowerCase().includes(needle)
				);
			});
		}
		setFilteredData(result);

	}, [search, patients]);

	const lastIndex = currentPage * perPage
	const firstIndex = lastIndex - perPage
	const current = filteredData?.slice(firstIndex, lastIndex)

	const paginate = (n) => setCurrentPage(n)


	return(
		<Layout>
			<div className="col-span-full rounded-sm px-3">
				<h2 className="font-semibold text-slate-800 text-lg underline">Appointment History</h2>
			</div>
			<div className="col-span-full bg-white rounded-sm border border-slate-200 py-3 px-3">
				<h1 className="font-bold text-lg">Doctor: {state.name}</h1>
				<div className="mt-1">Gender: {state.gender}</div>
				<div className="mt-1">Medical Field: {state.field}</div>
			</div>
			<div className="col-span-full bg-white rounded-sm border border-slate-200">
				<header className="px-5 py-4 border-b border-slate-100 flex justify-between">
					<div>
						<h2 className="font-semibold text-slate-800 text-lg">Patients</h2>
					</div>
					<div className="mt-2 xl:w-80">
						<input
							onChange={handleSearchChange}
							type="text"
							className="block w-full px-3 py-1 text-base font-normal text-gray-700 bg-white bg-clip-padding
        border border-solid border-gray-300 rounded m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
							placeholder="Search Patient"
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
									<div className="font-semibold text-left">Patient Name</div>
								</th>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-left">Schedule Date</div>
								</th>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-left">Schedule Time</div>
								</th>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-left">Appointment Reason</div>
								</th>
							</tr>
							</thead>
							{/* Table body */}
							<tbody className="text-sm divide-y divide-slate-100">
							{patients?.length === 0 ? (
								<tr>
									<td colSpan={3} className="p-2 whitespace-nowrap">
										<div className="text-center">
											<div className="font-medium text-slate-800">No Data</div>
										</div>
									</td>
								</tr>
							):(
								current?.map(patient => {
									return (
										<tr key={patient.id}>
											<td className="p-2 whitespace-nowrap">
												<div className="flex items-center">
													<div className="font-medium text-slate-800">{patient.patientName}</div>
												</div>
											</td>
											<td className="p-2 whitespace-nowrap">
												<div className="text-left">{patient.schedule_date}</div>
											</td>
											<td className="p-2 whitespace-nowrap">
												<div className="text-left">{patient.schedule_time}</div>
											</td>
											<td className="p-2 max-w-sm">
												<div className="text-left">{patient?.appointmentreason}</div>
											</td>
										</tr>
									)
								})
							)}
							</tbody>
						</table>
						<Pagination
							perPage={perPage}
							total={filteredData?.length}
							paginate={paginate}
							pageIndex={currentPage}
							setCurrentIndex={setCurrentPage}
						/>
					</div>

				</div>
			</div>
		</Layout>
	)
}

export default DoctorAppointments