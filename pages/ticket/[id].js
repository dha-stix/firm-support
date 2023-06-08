import React, { useEffect, useState, useCallback } from "react";
import SideNav from "../../components/SideNav";
import AuthNav from "../../components/AuthNav";
import ErrorPage from "../../components/ErrorPage";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import {
	convertDateTime,
	statusOptions,
	updateTicketStatus,
} from "../../utils/functions";
import { db, account } from "../../utils/appwrite";
import Loading from "../../components/Loading";
import { BsFillCloudDownloadFill } from "react-icons/bs";

export async function getServerSideProps(context) {
	let ticketObject = {};
	try {
		const response = await db.getDocument(
			process.env.NEXT_PUBLIC_DB_ID,
			process.env.NEXT_PUBLIC_TICKETS_COLLECTION_ID,
			context.query.id
		);

		ticketObject = response;
	} catch (err) {
		ticketObject = {};
	}

	return {
		props: { ticketObject },
	};
}

const Ticket = ({ ticketObject }) => {
	const router = useRouter();
	const [changes, setChanges] = useState(false);
	const [status, setStatus] = useState(ticketObject.status);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState({});

	const authStatus = useCallback(async () => {
		try {
			const user = await account.get();
			setUser(user);
			setLoading(false);
		} catch (err) {
			router.push("/");
		}
	}, []);

	useEffect(() => {
		authStatus();
	}, [authStatus]);

	const handleSubmit = (e) => {
		e.preventDefault();
		updateTicketStatus(router.query.id, status);
	};

	if (!ticketObject.name) return <ErrorPage />;
	if (loading) return <Loading />;

	return (
		<div>
			<Head>
				<title>Support Ticket | FirmSupport</title>
				<meta name='description' content='Generated by create next app' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main>
				<AuthNav />
				<div className=' w-full flex items-center'>
					<div className='md:w-[20%] md:flex hidden'>
						<SideNav />
					</div>
					<div className=' md:w-[80%] w-full min-h-[90vh] py-10 md:px-4 px-8'>
						<h2 className='font-bold text-2xl mb-3'>{ticketObject.subject}</h2>

						<p className='mb-2'>
							Date:{" "}
							<span className='opacity-60'>
								{convertDateTime(ticketObject.$createdAt)}
							</span>
						</p>

						<p className='mb-2'>
							User: <span className='opacity-60'>{ticketObject.name}</span>
						</p>

						<div className='flex md:items-center mb-2 md:flex-row flex-col'>
							<p className='pr-[60px] md:mb-auto mb-2'>
								Email: <span className='opacity-60'> {ticketObject.email}</span>
							</p>
							{ticketObject.attachment_url !== "https://google.com" && (
								<Link
									href={`${ticketObject.attachment_url}`}
									target='_blank'
									className='px-4 py-2 bg-blue-400 hover:bg-red-400 text-gray-100 rounded flex items-center md:w-auto w-2/3'
								>
									Download Attachment{" "}
									<BsFillCloudDownloadFill className='ml-3 text-md' />
								</Link>
							)}
						</div>
						<p className='pr-[60px]'>
							Chat Access Code:{" "}
							<span className='opacity-60 text-red-600'>
								{" "}
								{ticketObject.access_code}
							</span>
						</p>

						<p className='mt-8 font-bold text-blue-600 mb-2'>Message</p>
						<div className='w-full border-[1px] rounded-md p-6 shadow'>
							<p>{ticketObject.content}</p>
						</div>
						<Link
							href={`/chat/${router.query.id}`}
							target='_blank'
							className='my-6 w-[200px] text-center px-4 py-2 bg-blue-400 hover:bg-red-400 text-gray-100 rounded block'
						>
							Resolve / Chat
						</Link>
						<div>
							<h2 className='font-bold text-2xl my-6'>Actions</h2>
							<div className='w-full flex items-center space-x-[50px]'>
								<form className='flex flex-col' onSubmit={handleSubmit}>
									<div className='flex items-center space-x-10'>
										<div className='flex flex-col'>
											<label htmlFor='status' className='mb-2 text-blue-500'>
												Update Ticket Status :{" "}
												<span className='pl-6 text-red-400'>
													{ticketObject.status}
												</span>
											</label>

											<select
												name='status'
												id='status'
												className='p-2 border-[1px] rounded'
												value={status}
												onChange={(e) => {
													setStatus(e.target.value);
													setChanges(true);
												}}
											>
												{statusOptions(ticketObject.status).map((item) => (
													<option value={item.value} key={item.value}>
														{item.title}
													</option>
												))}
											</select>
										</div>
										{changes && status !== "select" && (
											<button
												className='bg-[#314484] text-gray-50 p-4 rounded hover:bg-blue-300'
												type='submit'
											>
												Update
											</button>
										)}
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Ticket;