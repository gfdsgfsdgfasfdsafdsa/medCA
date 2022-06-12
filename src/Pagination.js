import {useState} from "react";


const Pagination = ({ perPage, total, paginate, pageIndex, setCurrentIndex }) => {
	const pageNumbers = []

	for(let i = 1; i <= Math.ceil(total / perPage); i++){
		pageNumbers.push(i)
	}

	const b = 5
	const [state, setState] = useState({
		startIndex: 0,
		endIndex: b,
	})


	function paginationRecordCount(pageIndex, total){
		if(total === undefined) return
		let start = (pageIndex - 1) * perPage + 1
		let end = total

		if (perPage < total) {
			end = perPage * pageIndex
			if (end > total) {
				end = total;
			}
		}

		return `Showing ${start} to ${end} of ${total} results`
	}

	const setEnd = () => {
		setState({
			startIndex: state.startIndex + b,
			endIndex: state.endIndex + b
		})
		setCurrentIndex(pageIndex + 1)
	}

	const setStart = () => {
		setState({
			startIndex: state.startIndex - b,
			endIndex: state.endIndex - b
		})
		setCurrentIndex(pageIndex - 1)
	}

	return (
		<div>
			<div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
				<div className="sm:flex-1 sm:flex sm:items-center sm:justify-between">
					<div>
						<p className="text-sm text-gray-700">
							{paginationRecordCount(pageIndex, total)}
						</p>
					</div>
					<div className="mt-3 md:mt-0">
						<nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
							{state.startIndex - b < 0 ? (
								<button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-gray-200 text-sm font-medium text-gray-500">
									<span className="sr-only">Previous</span>
									<svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
										<path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
									</svg>
								</button>
							): (
								<button onClick={setStart}
								        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
									<span className="sr-only">Previous</span>
									<svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
										<path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
									</svg>
								</button>
							)}
							<ul>
								{pageNumbers?.slice(state.startIndex, state.endIndex).map(n => {
									if(n === pageIndex){
										return (
											<button key={n}
											        onClick={() => paginate(n)}
											        className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">{n}</button>
										)
									}else{
										return (
											<button key={n}
											        onClick={() => paginate(n)}
											        className="z-10 bg-gray-100 border-gray-300 text-gray-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">{n}</button>
										)
									}
								})}
							</ul>
							{state.endIndex + b > total ? (
								<button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-gray-200 text-sm font-medium text-gray-500">
									<svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
										<path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
									</svg>
								</button>
							): (
								<button onClick={setEnd}
								        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
									<svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
										<path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
									</svg>
								</button>
							)}
						</nav>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Pagination