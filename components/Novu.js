import {
	NovuProvider,
	PopoverNotificationCenter,
	NotificationBell,
} from "@novu/notification-center";

function Novu() {
	function onNotificationClick(message) {
		if (message?.cta?.data?.url) {
			window.location.href = message.cta.data.url;
		}
	}

	return (
		<NovuProvider
			subscriberId={process.env.NEXT_PUBLIC_NOVU_SUBSCRIBER_ID}
			applicationIdentifier={process.env.NEXT_PUBLIC_NOVU_APP_ID}
		>
			<PopoverNotificationCenter
				onNotificationClick={onNotificationClick}
				colorScheme='light'
			>
				{({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
			</PopoverNotificationCenter>
		</NovuProvider>
	);
}
export default Novu;
