import { account, db, storage } from "./appwrite";
import { toast } from "react-toastify";
import { ID } from "appwrite";
import emailjs from "@emailjs/browser";

const generateID = () => Math.random().toString(36).substring(2, 24);

const emailTicketCreation = (user, ticketID, email, date_created, title) => {
	emailjs
		.send(
			process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID,
			process.env.NEXT_PUBLIC_TICKET_CREATION_ID,
			{ user, ticketID, email, date_created, title },
			process.env.NEXT_PUBLIC_EMAIL_API_KEY
		)
		.then(
			(result) => {
				console.log(result);
			},
			(error) => {
				errorMessage(error.text);
			}
		);
};

const emailStaffMessage = (user, chatURL, email, access_code) => {
	emailjs
		.send(
			process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID,
			process.env.NEXT_PUBLIC_NEW_MESSAGE_ID,
			{ user, chatURL, email, access_code },
			process.env.NEXT_PUBLIC_EMAIL_API_KEY
		)
		.then(
			(result) => {
				console.log(result);
			},
			(error) => {
				errorMessage(error.text);
			}
		);
};

export const createSlug = (sentence) => {
	let slug = sentence.toLowerCase().trim();
	slug = slug.replace(/[^a-z0-9]+/g, "-");
	slug = slug.replace(/^-+|-+$/g, "");
	return slug;
};
export const parseJSON = (jsonString) => {
	try {
		return JSON.parse(jsonString);
	} catch (error) {
		console.error("Error parsing JSON:", error);
		return null;
	}
};

export const statusOptions = (value) => {
	const statuses = [
		{ title: "Open", value: "open" },
		{ title: "In Progress", value: "in-progress" },
		{ title: "Completed", value: "completed" },
	];
	const result = statuses.filter((item) => item.value !== value);
	const empty = { title: "Select", value: "select" };
	const updatedResult = [empty, ...result];
	return updatedResult;
};

export const convertDateTime = (dateTimeString) => {
	const dateTime = new Date(dateTimeString);
	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	};
	return dateTime.toLocaleString("en-US", options);
};

export const successMessage = (message) => {
	toast.success(message, {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	});
};

export const errorMessage = (message) => {
	toast.error(message, {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	});
};

const checkUserFromList = async (email, router) => {
	try {
		const response = await db.listDocuments(
			process.env.NEXT_PUBLIC_DB_ID,
			process.env.NEXT_PUBLIC_USERS_COLLECTION_ID
		);
		const users = response.documents;
		const result = users.filter((user) => user.email === email);

		if (result.length > 0) {
			successMessage("Welcome back 🎉");
			router.push("/staff/dashboard");
		} else {
			errorMessage("Unauthorized...Contact Management.");
		}
	} catch (error) {
		errorMessage("An error occurred 😪");
		console.error(error);
	}
};

export const logIn = async (email, setEmail, password, setPassword, router) => {
	try {
		await account.createEmailSession(email, password);
		await checkUserFromList(email, router);
		setEmail("");
		setPassword("");
	} catch (error) {
		console.log(error);
		errorMessage("Invalid credentials ❌");
	}
};

export const logOut = async (router) => {
	try {
		await account.deleteSession("current");
		router.push("/");
		successMessage("See ya later 🎉");
	} catch (error) {
		console.log(error);
		errorMessage("Encountered an error 😪");
	}
};

export const checkAuthStatus = async (setUser, setLoading, router) => {
	try {
		const response = await account.get();
		setUser(response);
		setLoading(false);
	} catch (err) {
		router.push("/");
		console.error(err);
	}
};

export const startMessage = async (
	name,
	email,
	subject,
	message,
	attachment,
	setLoading
) => {
	const createTicket = async (file_url = "https://google.com") => {
		try {
			const response = await db.createDocument(
				process.env.NEXT_PUBLIC_DB_ID,
				process.env.NEXT_PUBLIC_TICKETS_COLLECTION_ID,
				ID.unique(),
				{
					name,
					email,
					subject,
					content: message,
					status: "open",
					messages: [
						JSON.stringify({
							id: generateID(),
							content: message,
							admin: false,
							name: "Customer",
						}),
					],
					attachment_url: file_url,
					access_code: generateID(),
				}
			);
			//👇🏻 email user who created the ticket
			emailTicketCreation(
				name,
				response.$id,
				email,
				convertDateTime(response.$createdAt),
				subject
			);
			setLoading(false);
			successMessage("Ticket created 🎉");
		} catch (error) {
			errorMessage("Encountered saving ticket ❌");
		}
	};

	if (attachment !== null) {
		try {
			const response = await storage.createFile(
				process.env.NEXT_PUBLIC_BUCKET_ID,
				ID.unique(),
				attachment
			);
			const file_url = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_ID}/files/${response.$id}/view?project=${process.env.NEXT_PUBLIC_PROJECT_ID}&mode=admin`;
			createTicket(file_url);
		} catch (error) {
			errorMessage("Error uploading the image ❌");
		}
	} else {
		await createTicket();
	}
};

export const addUser = async (name, email, password) => {
	try {
		await account.create(generateID(), email, password, name);

		const addUserToDatabase = async () => {
			try {
				const response = await db.createDocument(
					process.env.NEXT_PUBLIC_DB_ID,
					process.env.NEXT_PUBLIC_USERS_COLLECTION_ID,
					ID.unique(),
					{ user_id: generateID(), name, email }
				);
				successMessage("User added successfully 🎉");
			} catch (error) {
				console.log(error);
				errorMessage("Encountered an error (Invalid data) ❌");
			}
		};

		await addUserToDatabase();
	} catch (error) {
		console.log(error);
	}
};

export const getUsers = async (setUsers) => {
	try {
		const response = await db.listDocuments(
			process.env.NEXT_PUBLIC_DB_ID,
			process.env.NEXT_PUBLIC_USERS_COLLECTION_ID
		);
		setUsers(response.documents);
	} catch (error) {
		console.log(error);
	}
};

export const deleteUser = async (id) => {
	try {
		await db.deleteDocument(
			process.env.NEXT_PUBLIC_DB_ID,
			process.env.NEXT_PUBLIC_USERS_COLLECTION_ID,
			id
		);
		successMessage("User removed 🎉"); // Success
	} catch (error) {
		console.log(error); // Failure
		errorMessage("Encountered an error 😪");
	}
};

export const getTickets = async (
	setOpenTickets,
	setInProgressTickets,
	setCompletedTickets
) => {
	try {
		const response = await db.listDocuments(
			process.env.NEXT_PUBLIC_DB_ID,
			process.env.NEXT_PUBLIC_TICKETS_COLLECTION_ID
		);
		const tickets = response.documents;
		const openTickets = tickets.filter((ticket) => ticket.status === "open");
		const inProgressTickets = tickets.filter(
			(ticket) => ticket.status === "in-progress"
		);
		const completedTickets = tickets.filter(
			(ticket) => ticket.status === "completed"
		);
		setCompletedTickets(completedTickets);
		setOpenTickets(openTickets);
		setInProgressTickets(inProgressTickets);
	} catch (error) {
		console.log(error); // Failure
	}
};

export const updateTicketStatus = async (id, status) => {
	try {
		await db.updateDocument(
			process.env.NEXT_PUBLIC_DB_ID,
			process.env.NEXT_PUBLIC_TICKETS_COLLECTION_ID,
			id,
			{ status }
		);
		successMessage("Status updated, refresh page 🎉");
	} catch (error) {
		console.log(error); // Failure
		errorMessage("Encountered an error ❌");
	}
};

export const sendMessage = async (text, docId) => {
	const doc = await db.getDocument(
		process.env.NEXT_PUBLIC_DB_ID,
		process.env.NEXT_PUBLIC_TICKETS_COLLECTION_ID,
		docId
	);

	try {
		const user = await account.get();
		const result = await db.updateDocument(
			process.env.NEXT_PUBLIC_DB_ID,
			process.env.NEXT_PUBLIC_TICKETS_COLLECTION_ID,
			docId,
			{
				messages: [
					...doc.messages,
					JSON.stringify({
						id: generateID(),
						content: text,
						admin: true,
						name: user.name,
					}),
				],
			}
		);
		if (result.$id) {
			successMessage("Message Sent! ✅");
			emailStaffMessage(
				doc.name,
				`http://localhost:3000/chat/${doc.$id}`,
				doc.email,
				doc.access_code
			);
		} else {
			errorMessage("Error! Try resending your message❌");
		}
	} catch (error) {
		const result = await db.updateDocument(
			process.env.NEXT_PUBLIC_DB_ID,
			process.env.NEXT_PUBLIC_TICKETS_COLLECTION_ID,
			docId,
			{
				messages: [
					...doc.messages,
					JSON.stringify({
						id: generateID(),
						content: text,
						admin: false,
						name: "Customer",
					}),
				],
			}
		);
		if (result.$id) {
			successMessage("Message Sent! ✅");
			notifyStaff(result.name, result.status, result.subject);
		} else {
			errorMessage("Error! Try resending your message❌");
		}
	}
};

const notifyStaff = async (username, status, title) => {
	try {
		await fetch("/api/notify", {
			method: "POST",
			body: JSON.stringify({
				username,
				status,
				title,
			}),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});
	} catch (err) {
		console.error(err);
	}
};
