import Layout from "../Layout";
import {useEffect, useState} from "react";
import { collection } from "firebase/firestore";
import { onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db } from '../firebase-config'
import Pagination from "../Pagination";
import {useNavigate} from "react-router-dom";

const VerifiedDoctors = () => {
	const [doctors, setDoctors] = useState([])

	const navigate = useNavigate()

	const [currentPage, setCurrentPage] = useState(1)
	const perPage = 10
	const [search, setSearch] = useState('')
	const [filteredData, setFilteredData] = useState([]);

	useEffect(() => {
		async function getDoctorList() {
			const q = query(
				collection(db, "MedCA_Users"),
				orderBy("name", "asc"),
			);

			onSnapshot(q, (querySnapshot) => {
				const result = [];
				querySnapshot.forEach((data) => {
					if(data.data()?.userType === 'doctor' && data.data()?.userStatus === 'verified'){
						result.push({
							...data.data(),
							id: data.id,
						});
					}
				});
				setDoctors(result);
			});
		}

		getDoctorList()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleSearchChange = (e) => setSearch(e.target.value);

	useEffect(() => {
		let result;

		if (!search) {
			result = doctors;
			setCurrentPage(1)
		}

		if (search) {
			setCurrentPage(1)
			const needle = search.toLowerCase();
			result = doctors.filter((doctor) => {
				return (
					doctor.name?.toLowerCase().includes(needle)
				);
			});
		}
		setFilteredData(result);

	}, [search, doctors]);

	const lastIndex = currentPage * perPage
	const firstIndex = lastIndex - perPage
	const current = filteredData?.slice(firstIndex, lastIndex)

	const paginate = (n) => setCurrentPage(n)

	return(
		<Layout>
			<div className="col-span-full bg-white rounded-sm border border-slate-200">
				<header className="px-5 py-4 border-b border-slate-100 flex justify-between">
					<div>
						<h2 className="font-semibold text-slate-800 text-lg underline">Doctors</h2>
						<span className="text-xs text-slate-800">Verified Doctors</span>
					</div>
					<div className="mt-2 xl:w-80">
						<input
							onChange={handleSearchChange}
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
									<div className="font-semibold text-left">VerifyDoctor</div>
								</th>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-left">Email</div>
								</th>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-left">Action</div>
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
								current?.map(doctor => {
									return (
										<tr key={doctor?.id}>
											<td className="p-2 whitespace-nowrap">
												<div className="flex items-center">
													<div className="font-medium text-slate-800">{doctor.name}</div>
												</div>
											</td>
											<td className="p-2 whitespace-nowrap">
												<div className="text-left">{doctor.email}</div>
											</td>
											<td className="p-2 whitespace-nowrap">
												<div className="text-blue-700 cursor-pointer"
												     onClick={() => navigate('/doctors/info', {
													     state: {
														     name: doctor.name,
														     gender: doctor.gender,
														     field: doctor.medical_field,
														     userStatus: doctor?.userStatus,
														     proofImage: doctor?.proofImage,
														     email: doctor?.email,
														     birthday: doctor?.birthday,
														     id: doctor?.id,
													     }
												     })}
												>
													View Details
												</div>
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

export default VerifiedDoctors
