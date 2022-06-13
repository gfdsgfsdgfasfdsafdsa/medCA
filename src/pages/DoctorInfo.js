import Layout from "../Layout";
import {useLocation} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import formatDate from "../lib/formatDate";
import {updateDoc, doc, where, collection, query, getDocs, onSnapshot} from "firebase/firestore";
import { db } from '../firebase-config'
import emailjs from '@emailjs/browser';

const DoctorInfo = () => {

	const form = useRef();
	const { state } = useLocation();
	const navigate = useNavigate()
	const [doctor, setDoctor] = useState({})

	useEffect(() => {
		if(!state){
			navigate('/doctors/verify')
		}else{
			setDoctor(state)
		}

		/*
		async function getDoctor(){
			const q = query(
				collection(db, "MedCA_Users"),
				where("email", "==", state?.email)
			);
			onSnapshot(q, (querySnapshot) => {
				const result = [];

				querySnapshot.forEach((data) => {
					result.push({
						...data.data(),
						id: data.id
					});
				});
				setDoctor(...result)
			});
		}
		getDoctor()
		 */

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state])

	const convertImage = (bmp) => {
		if(!bmp) return ''
		return 'data:image/png;base64,'+bmp
	}

	const sendEmail = () => {

		emailjs.sendForm('service_v00hbpt', 'template_jyhva68', form.current, 'IHbRTLrlIIqSFNVP6')
			.then((result) => {
				//console.log(result.text);
			}, (error) => {
				//console.log(error.text);
			});
	}

	const verifyAccount = async (e) => {
		e.preventDefault();

		if(!doctor?.id) return
		const userDoc = doc(db, "MedCA_Users", doctor?.id)
		await updateDoc(userDoc, { userStatus: 'verified' })
			.then(() => {
				sendEmail()
				setDoctor({
					...doctor,
					userStatus: 'verified'
				})
			})
			.catch((error) => {
				console.log(error)
			})
	}

	return(
		<Layout>
			<form
				ref={form}
				onSubmit={verifyAccount}
				className="col-span-full rounded-sm px-3 flex justify-between items-center">
				<h2 className="font-semibold text-slate-800 text-lg underline">Doctor Information</h2>
				<input type="hidden" name="email" value={doctor?.email || ''} />
				<input type="hidden" name="name" value={doctor?.name || ''} />
				{doctor?.userStatus === 'not verified' && (
					<input
						className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded cursor-pointer" type="submit" value="Verify Account" />
				)}
			</form>
			<div className="col-span-full bg-white rounded-sm border border-slate-200 py-3 px-5">
				<h1 className="font-bold text-lg">Doctor: {doctor?.name}</h1>
				<div className="mt-1">Gender: {doctor?.gender}</div>
				<div className="mt-1">Medical Field: {doctor?.field}</div>
				<div className="mt-1">Email: {doctor?.email}</div>
				<div className="mt-1">Birthday: {formatDate(doctor?.birthday)}</div>
				<div className="mt-1">Account Status: <span className="font-bold">{doctor?.userStatus?.toUpperCase()}</span></div>
				<div className="mt-5 pb-20 px-5">
					<div>Image Proof</div>
					{doctor?.proofImage ? (
						<img src={convertImage(doctor?.proofImage)} width={500} alt=""/>
					): (
						<div className="ml-5 text-red-500">Image Could not be found.</div>
					)}
				</div>
			</div>
		</Layout>
	)
}

export default DoctorInfo
