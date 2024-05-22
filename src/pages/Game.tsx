import { Chess, Color, Move, Square } from 'chess.js';
import { useCallback, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import CustomDialog from '../Components/CustomDialog';
import Chat from '../Components/Chat';
import CopyLink from '../Components/CopyLink';
import useShowAlert from '../hooks/useShowAlert';
import { getSocketInstance, handleSocketError } from '../utils/socketManager';
import { useRecoilValue } from 'recoil';
import { authState } from '../recoil/atoms/Auth';
import { useNavigate, useParams } from 'react-router-dom';

interface MoveData {
	from: Square;
	to: Square;
	color: Color;
}

function Game() {
	const chess = useMemo<Chess>(() => new Chess(), []);
	const [fen, setFen] = useState<string>(chess.fen());
	const [over, setOver] = useState<'' | string>('');
	const showAlert = useShowAlert();
	const navigate = useNavigate();

	const { roomId } = useParams();

	const authToken = useRecoilValue(authState).token;

	const handleRoomEvent = (
		msgFromServer: string,
		alertType: 'primary' | 'error' | 'secondary'
	) => {
		showAlert({
			show: true,
			type: alertType,
			msg: msgFromServer,
		});
	};

	const socket = getSocketInstance(authToken);

	if (socket) {
		socket.emit('is-reconnecting', roomId);

		socket.on('room-joined', (msgFromServer: string) => {
			handleRoomEvent(msgFromServer, 'primary');
		});
		socket.on('player-reconnecting', (msgFromServer: string) => {
			handleRoomEvent(msgFromServer, 'secondary');
		});
		socket.on('player-reconnected', (msgFromServer: string) => {
			handleRoomEvent(msgFromServer, 'primary');
		});
		socket.on('player-disconnect', (msgFromServer: string) => {
			handleRoomEvent(msgFromServer, 'error');
		});

		handleSocketError(socket, showAlert, navigate, '/user/room');
	}

	const makeAMove = useCallback(
		(move: MoveData): Move | null => {
			try {
				const result: Move = chess.move(move);
				setFen(chess.fen());
				socket?.emit('make-move', { move, roomId });
				console.log(
					`over : ${chess.isGameOver()}, checkmate : ${chess.isCheckmate()}`
				);

				if (chess.isGameOver()) {
					if (chess.isCheckmate()) {
						setOver(
							`CHECKMATE!!! ${
								chess.turn() === 'w' ? 'BLACK' : 'WHITE'
							} WINS THE GAME`
						);
					} else if (chess.isDraw()) {
						setOver(`DRAW HAS HAPPENED`);
					} else {
						setOver('GAME OVER!!!');
					}
				}

				return result;
			} catch (error) {
				return null;
			}
		},
		[chess, roomId, socket]
	);

	const onDrop = (sourceSquare: Square, targetSquare: Square): boolean => {
		const moveData: MoveData = {
			from: sourceSquare,
			to: targetSquare,
			color: chess.turn(),
		};

		const move: Move | null = makeAMove(moveData);

		if (move === null) {
			return false;
		}

		return true;
	};

	return (
		<div className="w-full justify-center flex">
			<CopyLink link="http://localhost:3000" />
			<div className="w-full max-w-80 sm:max-w-96 md:max-w-sm  h-full  ">
				<p className="font-bold text-lg sm:text-xl lg:text-2xl tracking-tight text-center text-white mb-6 md:mb-10">
					R<span className="text-sky-500">oo</span>m{' '}
					<span className="text-sky-500">:</span> {roomId}
				</p>
				<p className="p-4  text-slate-50 font-bold text-lg md:text-2xl">
					Player <span className="text-sky-500">1</span>
				</p>
				<div className="rounded-lg overflow-x-clip border border-slate-700 shadow-md">
					<Chessboard
						position={fen}
						onPieceDrop={onDrop}
						customDarkSquareStyle={{
							backgroundColor: '#475569',
						}}
						customLightSquareStyle={{
							backgroundColor: '#E2E8F0',
						}}
						showBoardNotation
					/>
				</div>
				<p className="p-4  text-slate-50 font-bold text-lg md:text-2xl">
					Player <span className="text-sky-500">2</span>
				</p>
			</div>
			<Chat />
			<CustomDialog
				open={Boolean(over)}
				title={over}
				contentText={over}
				handleContinue={() => setOver('')}
			/>
		</div>
	);
}

export default Game;
