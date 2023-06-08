import React, { useState } from "react";
import AuthNav from "./AuthNav";
import DashContent from "./DashContent";
import SideNav from "./SideNav";

const Dashboard = ({ openTickets, inprogressTickets, completedTickets }) => {
	return (
		<main>
			<AuthNav />
			<div className='w-full flex items-center'>
				<div className='md:w-[20%] md:flex hidden'>
					<SideNav />
				</div>
				<div className='md:w-[80%] w-full min-h-[90vh] py-10 px-4'>
					<DashContent
						openTickets={openTickets}
						inprogressTickets={inprogressTickets}
						completedTickets={completedTickets}
					/>
				</div>
			</div>
		</main>
	);
};

export default Dashboard;
