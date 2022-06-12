import {useState} from "react";
import TheSidebar from "./components/TheSidebar";
import TheHeader from "./components/TheHeader";

const Layout = ({ children }) => {

	const [sidebarOpen, setSidebarOpen] = useState(false);

	return(
		<div className="flex h-screen overflow-hidden bg-blue-50">

			{/* Sidebar */}
			<TheSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

			{/* Content area */}
			<div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

				{/*  Site header */}
				<TheHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

				<main>
					<div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
						<div className="grid grid-cols-12 gap-6">
							{children}
						</div>
					</div>
				</main>


			</div>
		</div>
	)
}

export default Layout