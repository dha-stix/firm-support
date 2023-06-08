import React, { useState } from "react";
import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { MdAdminPanelSettings } from "react-icons/md";
import { ImExit } from "react-icons/im";
import { useRouter } from "next/router";
import { logOut } from "../utils/functions";
import { BsFillTicketPerforatedFill } from "react-icons/bs";

const SideNav = () => {
	const router = useRouter();
	return (
		<div className='w-[20%] fixed top-[10vh] bg-white left-0 h-[90vh] py-10 px-2 border-[1px] border-r-gray-200 cursor-pointer'>
			<Link
				href='/staff/dashboard'
				className='py-2 px-6 hover:bg-[#0B2447] hover:text-[#F1F6F9] w-full rounded mb-6 flex items-start'
			>
				<AiFillHome className='mr-2' size={22} />
				Home
			</Link>

			<Link
				href='/staff/list'
				className='py-2 px-6 hover:bg-[#0B2447] hover:text-[#F1F6F9] w-full rounded mb-6 flex items-start'
			>
				<MdAdminPanelSettings className='mr-2' size={22} />
				Admin
			</Link>
			<p
				className='py-2 px-6 hover:bg-[#0B2447] hover:text-[#F1F6F9] w-full rounded mb-6 flex items-start'
				onClick={() => logOut(router)}
			>
				<ImExit className='mr-2' size={22} />
				Exit
			</p>
		</div>
	);
};

export default SideNav;
