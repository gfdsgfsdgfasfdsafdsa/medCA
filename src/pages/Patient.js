import Layout from "../Layout";
import {useEffect, useState} from "react";
import { collection } from "firebase/firestore";
import { onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from '../firebase-config'
import Pagination from "../Pagination";

const Patient = () => {
	const [patients, setPatients] = useState([])

	const [currentPage, setCurrentPage] = useState(1)
	const perPage = 10
	const [search, setSearch] = useState('')
	const [filteredData, setFilteredData] = useState([]);

	useEffect(() => {
		async function getPatientList() {
			const q = query(
				collection(db, "MedCA_Users"),
				orderBy("name", "asc"),
			);

			onSnapshot(q, (querySnapshot) => {
				const result = [];

				let index = 0
				querySnapshot.forEach((data) => {
					if(data.data().userType === 'patient'){
						result.push({
							...data.data(),
							id: index++,
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
					patient.name?.toLowerCase().includes(needle)
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
			<div className="col-span-full bg-white rounded-sm border border-slate-200">
				<header className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
					<div>
						<h2 className="font-semibold text-slate-800 text-lg underline">Patients</h2>
					</div>
					<div className="xl:w-80">
						<input
							onChange={handleSearchChange}
							type="text"
							className="block w-full px-3 py-1 text-base font-normal text-gray-700 bg-white bg-clip-padding
        border border-solid border-gray-300 rounded m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
							placeholder="Search Patient Name"
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
									<div className="font-semibold text-left">Email</div>
								</th>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-left">Gender</div>
								</th>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-left">Birthdate</div>
								</th>
							</tr>
							</thead>
							{/* Table body */}
							<tbody className="text-sm divide-y divide-slate-100">
							{current?.length === 0 ? (
								<tr>
									<td colSpan={4} className="p-2 whitespace-nowrap">
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
													<div className="font-medium text-slate-800">{patient.name}</div>
												</div>
											</td>
											<td className="p-2 whitespace-nowrap">
												<div className="text-left">{patient.email}</div>
											</td>
											<td className="p-2 whitespace-nowrap">
												<div className="text-left">{patient.gender}</div>
											</td>
											<td className="p-2 whitespace-nowrap">
												<div className="text-left">{patient.birthday}</div>
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

export default Patient