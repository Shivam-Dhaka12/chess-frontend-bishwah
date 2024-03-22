import { useState } from 'react';
import Form from '../Components/Form';
import { useNavigate } from 'react-router-dom';
import { getSocketInstance } from '../utils/socketManager';
import useShowAlert from '../hooks/useShowAlert';
interface FormProps {
	onSetForm: (form: string) => void;
}

export default function JoinRoom() {
	const [form, setForm] = useState('join');
	function handleSetForm(formValue: string) {
		if (formValue === 'join' || formValue === 'create') setForm(formValue);
	}
	return (
		<Form>
			<h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center text-white mb-8 md:mb-12">
				R<span className="text-sky-500">oo</span>m
			</h1>
			<div className=" flex flex-col items-center">
				<img
					src="/Chess_Join_Room.svg"
					className="max-w-72"
					width={150}
				/>
				{form === 'join' && <JoinRoomForm onSetForm={handleSetForm} />}
				{form === 'create' && (
					<CreateRoomForm onSetForm={handleSetForm} />
				)}
			</div>
		</Form>
	);
}

function CreateRoomForm({ onSetForm }: FormProps) {
	const navigate = useNavigate();
	const setAlert = useShowAlert();
	const socket = getSocketInstance();
	const [roomId, setRoomId] = useState('');

	function handleCreateRoom(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log(roomId);
		if (socket) {
			console.log(socket.emit('room-create', roomId));

			socket.on('room-created', (roomIdFromServer) => {
				console.log('room-created');
				setAlert({
					show: true,
					type: 'primary',
					msg: 'Room created: ' + roomIdFromServer,
				});
				navigate('/user/game');
			});
		}
	}
	return (
		<form
			action=""
			className="flex flex-col max-w-56 mt-8"
			onSubmit={(e) => handleCreateRoom(e)}
		>
			<input
				type="text"
				placeholder="Enter room ID"
				className="px-2 mb-4 py-2 bg-transparent border-b-2 border-b-gray-200 text-gray-50 outline-none
				hover:border-b-gray-50 transition-colors white-eye text-center"
				required
				onChange={(e) => setRoomId(e.target.value)}
				value={roomId}
			/>
			<button
				className="mt-4 cursor-pointer  focus:outline-none focus:ring-2 focus:ring-slate-400 font-semibold focus:ring-offset-2 focus:ring-offset-slate-50 text-white h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto bg-sky-500 highlight-white/20 hover:bg-sky-400"
				type="submit"
			>
				Create room
			</button>
			<p className=" my-2 text-center max-w-3xl mx-auto   cursor-pointer font-mono font-medium  text-sky-400">
				OR
			</p>
			<button
				onClick={() => onSetForm('join')}
				className="sm:flex items-center justify-center  px-4 h-12 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-600 shadow-sm rounded-lg  bg-slate-800 ring-0 text-slate-300 highlight-white/5 hover:bg-slate-700 tracking-wide font-semibold"
			>
				Join Room
			</button>
		</form>
	);
}

function JoinRoomForm({ onSetForm }: FormProps) {
	const navigate = useNavigate();
	const setAlert = useShowAlert();
	const socket = getSocketInstance();
	const [roomId, setRoomId] = useState('');

	function handleJoinRoom(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log(roomId);
		if (socket) {
			console.log(socket.emit('room-join', roomId));

			socket.on('room-joined', (msgFromServer) => {
				console.log('room-joined');
				setAlert({
					show: true,
					type: 'primary',
					msg: msgFromServer,
				});
				navigate('/user/game');
			});
		}
	}

	return (
		<form
			className="flex flex-col max-w-56 mt-8"
			onSubmit={(e) => handleJoinRoom(e)}
		>
			<input
				type="text"
				placeholder="Enter room ID"
				className="px-2 mb-4 py-2 bg-transparent border-b-2 border-b-gray-200 text-gray-50 outline-none
				hover:border-b-gray-50 transition-colors white-eye text-center"
				onChange={(e) => setRoomId(e.target.value)}
				value={roomId}
			/>
			<button
				type="submit"
				className="mt-4 cursor-pointer  focus:outline-none focus:ring-2 focus:ring-slate-400 font-semibold focus:ring-offset-2 focus:ring-offset-slate-50 text-white h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto bg-sky-500 highlight-white/20 hover:bg-sky-400"
			>
				Join Room
			</button>
			<p className=" my-2 text-center max-w-3xl mx-auto   cursor-pointer font-mono font-medium  text-sky-400">
				OR
			</p>
			<button
				onClick={() => onSetForm('create')}
				className="sm:flex items-center justify-center  px-4 h-12 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-600 shadow-sm rounded-lg  bg-slate-800 ring-0 text-slate-300 highlight-white/5 hover:bg-slate-700 tracking-wide font-semibold"
			>
				Create Room
			</button>
		</form>
	);
}
