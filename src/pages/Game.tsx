import { Chess, Color, Move, Square } from 'chess.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import CustomDialog from '../Components/CustomDialog';
import Chat from '../Components/Chat';
import CopyLink from '../Components/CopyLink';
import useShowAlert from '../hooks/useShowAlert';
import { getSocketInstance, handleSocketError } from '../utils/socketManager';
import { useRecoilValue } from 'recoil';
import { authState } from '../recoil/atoms/Auth';
import { useNavigate, useParams } from 'react-router-dom';
import { userState } from '../recoil/atoms/User';
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types';

interface MoveData {
	from: Square;
	to: Square;
	color: Color;
}

interface Player {
	playerId: string;
	playerName: string;
	playerColor: 'white' | 'black';
}

function Game() {
	const chess = useMemo<Chess>(() => new Chess(), []);
	const [fen, setFen] = useState<string>(chess.fen());
	const [over, setOver] = useState<'' | string>('');
	const [opponent, setOpponent] = useState<Player | null>(null);
	const [playerColor, setPlayerColor] = useState<
		BoardOrientation | undefined
	>(undefined);
	const showAlert = useShowAlert();
	const navigate = useNavigate();
	const username = useRecoilValue(userState).username;

	const { roomId } = useParams();

	const authToken = useRecoilValue(authState).token;
	const socket = getSocketInstance(authToken);

	function handleResign() {
		if (socket) {
			socket.emit('resign');
		}
		showAlert({
			show: true,
			type: 'primary',
			msg: 'You resigned, better luck next time 🍀',
		});
		navigate('/');
	}

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

	useEffect(() => {
		if (socket) {
			socket.emit('room-join', roomId);
			return () => {
				socket.off('room-join');
			};
		}
	}, [roomId, socket]);

	if (socket) {
		socket.on(
			'room-joined',
			({
				msgFromServer,
				players,
			}: {
				msgFromServer: string;
				players: [Player];
			}) => {
				console.log('Players: ' + players);
				players.map((player: Player) => {
					if (player.playerName === username)
						setPlayerColor(player.playerColor);
					else setOpponent(player);
				});
				handleRoomEvent(msgFromServer, 'primary');
			}
		);
		socket.on('player-reconnecting', (msgFromServer: string) => {
			handleRoomEvent(msgFromServer, 'secondary');
		});
		socket.on('player-disconnect', (msgFromServer: string) => {
			handleRoomEvent(msgFromServer, 'primary');
			navigate('/');
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
			<CopyLink roomId={roomId || 'error'} link={window.location.href} />
			<div className="w-full max-w-80 sm:max-w-96 md:max-w-sm  h-full  ">
				<p className="font-bold text-lg sm:text-xl lg:text-2xl tracking-tight text-center text-white mb-6 md:mb-10">
					R<span className="text-sky-500">oo</span>m{' '}
					<span className="text-sky-500">:</span> {roomId}
				</p>
				<p className="p-4  text-slate-50 font-bold text-lg md:text-2xl text-center">
					Opponent:{' '}
					<span className="text-sky-500">
						{opponent?.playerName || 'Yet to join'}
					</span>
				</p>
				<div className="rounded-lg overflow-x-clip border border-slate-700 shadow-md">
					<Chessboard
						position={fen}
						onPieceDrop={onDrop}
						boardOrientation={playerColor}
						customDarkSquareStyle={{
							backgroundColor: '#475569',
						}}
						customLightSquareStyle={{
							backgroundColor: '#E2E8F0',
						}}
						showBoardNotation
					/>
				</div>
				<p className="p-4  text-slate-50 font-bold text-lg md:text-2xl text-center">
					You: <span className="text-sky-500">{username}</span>
				</p>
				<a
					onClick={handleResign}
					className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 font-bold focus:ring-offset-2 focus:ring-offset-slate-50 text-white h-12 px-6 rounded-lg mx-auto max-w-32 flex items-center justify-center sm:w-auto bg-sky-500 highlight-white/20 hover:bg-sky-400"
				>
					Resign
				</a>
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
