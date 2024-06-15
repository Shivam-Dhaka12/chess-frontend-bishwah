import { Chess, Color, Move, Square } from 'chess.js';
import { useCallback, useEffect, useState } from 'react';
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

interface RoomState {
	board: string;
	moves: string[];
	players: Player[];
	messages: Message[];
}

interface Message {
	message: string;
	id: string;
	color: string;
}

function Game() {
	const [chess, setChess] = useState<Chess>(new Chess());
	const [fen, setFen] = useState<string>(chess.fen());
	const [over, setOver] = useState<'' | string>('');
	const [newMessages, setNewMessages] = useState(false);
	const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
	// 0 is for white, 1 is for black and 2 is for draw
	const [result, setResult] = useState<'' | string>('');
	const [opponent, setOpponent] = useState<Player | null>(null);
	// const [roomState, setRoomState] = useState<RoomState>();
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
				roomState,
			}: {
				msgFromServer: string;
				roomState: RoomState;
			}) => {
				//setRoomState(roomState);
				// Reinitialize Chess instance with the received FEN if not empty
				if (roomState.board !== '' && roomState.board !== null) {
					console.log('Fen from Server: ' + roomState.board);
					const newChess = new Chess(roomState.board);
					setChess(newChess);
					setFen(roomState.board);
				}

				if (roomState.messages) {
					setReceivedMessages(roomState.messages);
				}
				roomState.players.map((player: Player) => {
					if (player.playerName === username)
						setPlayerColor(player.playerColor);
					else setOpponent(player);
				});
				handleRoomEvent(msgFromServer, 'primary');
			}
		);
		socket.on('message', (messaages: Message[]) => {
			setNewMessages(true);
			setReceivedMessages(() => messaages);
		});
		socket.on('player-reconnecting', (msgFromServer: string) => {
			handleRoomEvent(msgFromServer, 'secondary');
		});
		socket.on('player-reconnected', (msgFromServer: string) => {
			handleRoomEvent(msgFromServer, 'secondary');
		});
		socket.on('player-disconnect', (msgFromServer: string) => {
			handleRoomEvent(msgFromServer, 'primary');
			navigate('/');
		});
		socket.on(
			'player-move',
			({
				move,
				username: playerName,
			}: {
				move: MoveData;
				username: string;
			}) => {
				if (playerName !== username) {
					const result: Move | null = makeAMove(move);
					if (result) {
						const newFen = chess.fen();
						setFen(newFen);
						console.log('Updated FEN: ' + newFen);
						const { from, to, color } = move;
						console.log(
							'Player move: ' + from + ' ' + to + ' ' + color
						);
					}
				}
			}
		);
		handleSocketError(socket, showAlert, navigate, '/user/room');
	}

	const makeAMove = useCallback(
		(move: MoveData): Move | null => {
			try {
				const result: Move = chess.move(move);
				console.log('Making a move: ' + JSON.stringify(result));
				console.log(
					`over : ${chess.isGameOver()}, checkmate : ${chess.isCheckmate()}`
				);

				if (chess.isGameOver()) {
					if (chess.isCheckmate()) {
						setOver(
							`Checkmate 😉, ${
								chess.turn() === 'w' ? 'BLACK' : 'WHITE'
							} won the game 🎉`
						);
						if (chess.turn() === 'w') {
							setResult('1');
						} else if (chess.turn() === 'b') {
							setResult('0');
						}
					} else if (chess.isDraw()) {
						setOver(`It's a draw 🤝`);
						setResult('2');
					} else {
						setOver('Game Over ✌️');
					}
				}

				return result;
			} catch (error) {
				return null;
			}
		},
		[chess]
	);

	const onDrop = (sourceSquare: Square, targetSquare: Square): boolean => {
		const moveData: MoveData = {
			from: sourceSquare,
			to: targetSquare,
			color: chess.turn(),
		};

		// Check if the current player is allowed to move the piece
		if (
			(playerColor === 'white' && moveData.color !== 'w') ||
			(playerColor === 'black' && moveData.color !== 'b')
		) {
			return false;
		}

		const move: Move | null = makeAMove(moveData);
		if (move) {
			const newFen = chess.fen();
			setFen(newFen);
			console.log('Sending FEN: ' + newFen);
			console.log('Sending RoomId: ' + roomId);
			socket?.emit('make-move', { move, fen: newFen, roomId });
		}

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
				<p className="p-4 mb-4 text-slate-50 font-bold text-lg md:text-2xl text-center">
					You: <span className="text-sky-500">{username}</span>
				</p>
				<a
					onClick={handleResign}
					className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 font-bold focus:ring-offset-2 focus:ring-offset-slate-50 text-white h-12 px-6 rounded-lg mx-auto max-w-32 flex items-center justify-center sm:w-auto bg-sky-500 highlight-white/20 hover:bg-sky-400"
				>
					Resign
				</a>
			</div>
			<Chat
				playerColor={playerColor || 'w'}
				opponentName={opponent?.playerName || 'Opponent'}
				socket={socket}
				messagesReceived={receivedMessages}
				roomId={roomId || '123'}
				newMessages={newMessages}
				setNewMessages={setNewMessages}
			/>
			<CustomDialog
				open={Boolean(over)}
				title={'Game Over ✌️'}
				contentText={over}
				handleContinue={() => {
					setOver('');
					navigate('/');
					socket?.emit('game-over', {
						roomId,
						result,
					});
				}}
			/>
		</div>
	);
}

export default Game;
