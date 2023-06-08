const { Novu } = require("@novu/node");
const novu = new Novu(process.env.NEXT_PUBLIC_NOVU_API_KEY);

export default async function handler(req, res) {
	const { status, title, username } = req.body;
	const response = await novu
		.trigger("in-app", {
			to: {
				subscriberId: process.env.NEXT_PUBLIC_NOVU_SUBSCRIBER_ID,
			},
			payload: {
				status,
				title,
				username,
			},
		})
		.catch((err) => console.error(err));

	res.status(200).json(response.data);
}
