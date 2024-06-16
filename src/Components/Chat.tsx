import React, { useRef, useEffect, useState } from 'react';
import EmojiPickerComponent from './EmojiPicker';
import { Socket } from 'socket.io-client';

interface Message {
	message: string;
	id: string;
	color: string;
}

const Chat = ({
	playerColor,
	opponentName,
	socket,
	messagesReceived,
	roomId,
	newMessages,
	setNewMessages,
}: {
	playerColor: string;
	opponentName: string;
	socket: Socket | undefined;
	messagesReceived: Message[];
	roomId: string;
	newMessages: boolean;
	setNewMessages: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<div>
				{isOpen && (
					<ChatBox
						playerColor={playerColor}
						opponentName={opponentName}
						socket={socket}
						messagesReceived={messagesReceived}
						roomId={roomId}
					/>
				)}
				<img
					src="/chat.png"
					alt="chat button"
					className="fixed cursor-pointer bottom-6 right-6"
					onClick={() => {
						setIsOpen((prev) => !prev);
						setNewMessages(false);
					}}
				/>
				{newMessages && !isOpen && (
					<div className="fixed cursor-pointer bottom-16 right-8">
						<div className="absolute inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900"></div>
					</div>
				)}
			</div>
		</>
	);
};

export default Chat;

function ChatBox({
	playerColor,
	opponentName,
	socket,
	messagesReceived,
	roomId,
}: {
	playerColor: string;
	opponentName: string;
	socket: Socket | undefined;
	messagesReceived: Message[];
	roomId: string;
}) {
	const [messageInput, setMessageInput] = useState<string>('');
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const messages = messagesReceived;
	const lastMessageRef = useRef(null);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (messageInput && socket) {
			// Send the message to the server
			socket.emit('message', {
				message: {
					id: generateRandomId(),
					message: messageInput,
					color: playerColor,
				},
				roomId,
			});
			// Clear the input field
			setMessageInput('');
		}
	};

	const handleEmojiSelect = (emoji: { native: string }) => {
		setMessageInput((prevInputValue) => prevInputValue + emoji.native);
		setShowEmojiPicker(false);
	};

	function generateRandomId(): string {
		const timestamp = Date.now().toString(36); // Convert current timestamp to base 36
		const randomString = Math.random().toString(36).substring(2, 10); // Generate random string
		return timestamp + randomString;
	}

	useEffect(() => {
		// Scroll to the last message when messages change
		if (lastMessageRef.current) {
			(lastMessageRef.current as HTMLElement | null)?.scrollIntoView({
				behavior: 'smooth',
			});
		}
	}, [messages]);

	return (
		<>
			{showEmojiPicker && (
				<div className="fixed bottom-40 right-2 z-30">
					<EmojiPickerComponent onSelect={handleEmojiSelect} />
				</div>
			)}
			<form
				id="form"
				action=""
				className=" bg-slate-900 rounded-lg h-96 text-sm fixed bottom-28 right-6 z-20 w-80 overflow-clip transition-all shadow"
				onSubmit={(e) => handleSubmit(e)}
			>
				<h1 className="text-slate-200 bg-slate-900 pl-8 py-4 font-semibold shadow-md border border-slate-800">
					{opponentName}
				</h1>
				<div id="messages">
					<ul className="p-4 overflow-y-scroll scroll-smooth h-72 scroll-p-0 scroll-m-0 no-scrollbar">
						{messages.map((messaage, index) => (
							<div
								key={messaage.id}
								ref={
									index === messages.length - 1
										? lastMessageRef
										: null
								}
								className={`flex ${
									messaage.color === playerColor
										? 'justify-end'
										: ''
								}`}
							>
								<ChatMsg
									message={messaage.message}
									color={messaage.color}
									playerColor={playerColor}
								/>
							</div>
						))}
					</ul>
				</div>

				<div className="border absolute bottom-0 w-full flex items-center  px-2 justify-between rounded-lg bg-slate-900 border-slate-800">
					<div className=" cursor-pointer w-6">
						<img
							src="/happy.png"
							alt="emoji button"
							onClick={() => setShowEmojiPicker((prev) => !prev)}
						/>
					</div>

					<input
						id="input"
						autoComplete="off"
						className="p-2 text-slate-100 outline-none rounded-lg bg-transparent w-4/5 "
						value={messageInput}
						onChange={(e) => setMessageInput(e.target.value)}
					/>
					<div className=" cursor-pointer w-6">
						<img src="/send.png" alt="emoji button" />
					</div>
				</div>
			</form>
		</>
	);
}

function ChatMsg({
	message,
	color,
	playerColor,
}: {
	message: string;
	color: string;
	playerColor: string;
}) {
	return (
		<div className={`my-1 max-w-full  `}>
			<div
				className={`text-white ${
					color === playerColor
						? 'bg-sky-600 float-right'
						: 'bg-slate-600 float-left'
				} px-4 py-2 rounded-2xl inline-block `}
			>
				{message}
			</div>
		</div>
	);
}
