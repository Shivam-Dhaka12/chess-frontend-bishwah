import { Socket } from 'socket.io-client';
import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import EmojiPickerComponent from './EmojiPicker';

const useSocket = () => {
	const [receivedMessages, setReceivedMessages] = useState<
		{ msg: string; id: number; msg_id: number }[]
	>([
		{
			msg: 'hi asdf;aksdf sdf\n asdf;ljka\nsd;fjkas;djf\nasdfl;ljasdl;flaslddf',
			id: 1,
			msg_id: 1256184834,
		},
		{
			msg: 'hi asdf;aksdf sdf\n asdf;jasdl;flaslddf',
			id: 1,
			msg_id: 12354375374,
		},
		{
			msg: 'hi asdf;aksdf sdf\n asdfflaslddf',
			id: 1,
			msg_id: 175637453234,
		},
		{
			msg: 'hi asdf;aksdf sdf\n asdfflaslddf',
			id: 1,
			msg_id: 17563745353234,
		},
		{
			msg: 'hi asdf;aksdf sdf\n asdfflaslddf',
			id: 1,
			msg_id: 17565364353234,
		},
		{
			msg: 'hello',
			id: 2,
			msg_id: 1254245234,
		},
		{
			msg: 'hurray',
			id: 1,
			msg_id: 123424524524,
		},
		{
			msg: 'hello',
			id: 2,
			msg_id: 125452245234,
		},
	]);
	const [messageInput, setMessageInput] = useState<string>('');
	const [socket, setSocket] = useState<Socket | null>(null);

	const handleSubmit = (
		event: React.FormEvent<HTMLFormElement>,
		socket: Socket | null
	) => {
		event.preventDefault();
		if (messageInput && socket) {
			// Send the message to the server
			socket.emit('message', messageInput);

			// Clear the input field
			setMessageInput('');
		}
		553;
	};

	useEffect(() => {
		const newSocket: Socket = io('http://192.168.1.2:3000');

		// Connect to the Socket.IO server
		newSocket.on('connect', () => {
			console.log('Connected to Socket.IO server');
			setSocket(newSocket);
		});

		newSocket.on('message', (msg) => {
			console.log(`Received message: ${msg}`);
			setReceivedMessages((prevState) => [...prevState, msg]);
		});

		// Cleanup on component unmount
		return () => {
			newSocket.disconnect();
		};
	}, []);

	return {
		socket,
		receivedMessages,
		messageInput,
		setMessageInput,
		handleSubmit,
	};
};

const Chat = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<div>
				{isOpen && <ChatBox />}
				<img
					src="/chat.png"
					alt="chat button"
					className="fixed cursor-pointer bottom-6 right-6"
					onClick={() => setIsOpen((prev) => !prev)}
				/>
			</div>
		</>
	);
};

export default Chat;

function ChatBox() {
	const {
		socket,
		receivedMessages,
		messageInput,
		setMessageInput,
		handleSubmit,
	} = useSocket();

	const lastMessageRef = useRef(null);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

	const handleEmojiSelect = (emoji: { native: string }) => {
		setMessageInput((prevInputValue) => prevInputValue + emoji.native);
		setShowEmojiPicker(false);
	};

	useEffect(() => {
		// Scroll to the last message when messages change
		if (lastMessageRef.current) {
			(lastMessageRef.current as HTMLElement | null)?.scrollIntoView({
				behavior: 'smooth',
			});
		}
	}, [receivedMessages]);

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
				onSubmit={(e) => handleSubmit(e, socket)}
			>
				<h1 className="text-slate-200 bg-slate-900 pl-8 py-4 font-semibold shadow-md border border-slate-800">
					Player Name
				</h1>
				<div id="messages">
					<ul className="p-4 overflow-y-scroll scroll-smooth h-72 scroll-p-0 scroll-m-0 no-scrollbar">
						{receivedMessages.map((msg, index) => (
							<div
								key={msg.msg_id}
								ref={
									index === receivedMessages.length - 1
										? lastMessageRef
										: null
								}
								className={`flex ${
									msg.id === 2 ? 'justify-end' : ''
								}`}
							>
								<ChatMsg msg={msg.msg} id={msg.id} />
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

function ChatMsg({ msg, id }: { msg: string; id: number }) {
	return (
		<div className={`my-1 max-w-56  `}>
			<div
				className={`text-white ${
					id === 1 ? 'bg-sky-600' : 'bg-slate-600'
				} px-4 py-2 rounded-2xl inline-block`}
			>
				{msg} {id}
			</div>
		</div>
	);
}
