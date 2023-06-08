import React, { useState } from "react";
import { Collapse } from "react-collapse";
import { AiFillCaretDown } from "react-icons/ai";
import Link from "next/link";

const DashContent = ({ openTickets, inprogressTickets, completedTickets }) => {
	const [firstOpen, setFirstOpen] = useState(false);
	const [secondOpen, setSecondOpen] = useState(false);
	const [thirdOpen, setThirdOpen] = useState(false);
	const toggle = (value) => {
		if (value === "open") {
			setSecondOpen(false);
			setThirdOpen(false);
			setFirstOpen(true);
		}
		if (value === "in-progress") {
			setThirdOpen(false);
			setFirstOpen(false);
			setSecondOpen(true);
		}
		if (value === "completed") {
			setFirstOpen(false);
			setSecondOpen(false);
			setThirdOpen(true);
		}
	};

	return (
		<>
			<header className='flex flex-wrap md:space-x-6 w-full items-center justify-center mb-12'>
				<div className='md:w-[300px] w-full py-8 border-[1px] shadow-md rounded-md hover:border-b-red-400 hover:border-b-4 flex items-center justify-center flex-col m-4'>
					<h3 className='text-xl text-red-400 mb-4'>Open</h3>
					<p>{openTickets.length}</p>
				</div>
				<div className='md:w-[300px] w-full py-8 border-[1px] shadow-md rounded-md hover:border-b-gray-400 hover:border-b-4 flex items-center justify-center flex-col m-4'>
					<h3 className='text-xl text-gray-400 mb-4'>In Progress</h3>
					<p>{inprogressTickets.length}</p>
				</div>
				<div className='md:w-[300px] w-full py-8 border-[1px] shadow-md rounded-md hover:border-b-green-400 hover:border-b-4 flex items-center justify-center flex-col m-4'>
					<h3 className='text-xl text-green-400 mb-4'>Completed</h3>
					<p>{completedTickets.length}</p>
				</div>
			</header>

			<div className='my-10 border-[1px]'>
				<div
					className='p-4 border-b-[1px] w-full flex items-center justify-between cursor-pointer'
					onClick={() => toggle("open")}
				>
					<h3>
						Open <span className='text-red-500'>({openTickets.length})</span>
					</h3>
					<AiFillCaretDown size={25} className='text-red-400' />
				</div>
				<Collapse isOpened={firstOpen}>
					<div className='w-full p-6 space-y-4'>
						{openTickets.length > 0 &&
							openTickets.map((ticket) => (
								<Link
									href={`/ticket/${ticket.$id}`}
									key={ticket.$id}
									className='text-blue-600 block hover:underline'
								>
									⚠️ {ticket.subject}
								</Link>
							))}
					</div>
				</Collapse>
			</div>

			<div className='my-10 border-[1px]'>
				<div
					className='p-4 border-b-[1px] w-full flex items-center justify-between cursor-pointer'
					onClick={() => toggle("in-progress")}
				>
					<h3>
						In Progress{" "}
						<span className='text-gray-400'>({inprogressTickets.length})</span>
					</h3>
					<AiFillCaretDown size={25} className='text-red-400' />
				</div>
				<Collapse isOpened={secondOpen}>
					<div className='w-full p-6 space-y-4'>
						{inprogressTickets.length > 0 &&
							inprogressTickets.map((ticket) => (
								<Link
									href={`/ticket/${ticket.$id}`}
									key={ticket.$id}
									className='text-blue-600 block hover:underline'
								>
									🙋🏻‍♀️ {ticket.subject}
								</Link>
							))}
					</div>
				</Collapse>
			</div>

			<div className='my-10 border-[1px]'>
				<div
					className='p-4 border-b-[1px] w-full flex items-center justify-between cursor-pointer'
					onClick={() => toggle("completed")}
				>
					<h3>
						Completed{" "}
						<span className='text-green-400'>({completedTickets.length})</span>
					</h3>
					<AiFillCaretDown size={25} className='text-red-400' />
				</div>
				<Collapse isOpened={thirdOpen}>
					<div className='w-full p-6 space-y-4'>
						{completedTickets.length > 0 &&
							completedTickets.map((ticket) => (
								<Link
									href={`/ticket/${ticket.$id}`}
									key={ticket.$id}
									className='text-blue-600 block hover:underline'
								>
									✅ {ticket.subject}
								</Link>
							))}
					</div>
				</Collapse>
			</div>
		</>
	);
};

export default DashContent;
