import { Chess, Color, Move, Square } from 'chess.js';
import { useCallback, useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import CustomDialog from './../Components/CustomDialog';
import Chat from './../Components/Chat';
import CopyLink from './../Components/CopyLink';
import useShowAlert from './../hooks/useShowAlert';
import { getSocketInstance, handleSocketError } from './../utils/socketManager';
import { useRecoilValue } from 'recoil';
import { authState } from './../recoil/atoms/Auth';
import { useNavigate, useParams } from 'react-router-dom';
import { userState } from './../recoil/atoms/User';
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types';

interface MoveData {
	from: Square;
	to: Square;
	color: Color;
	promotion: string;
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
	const initialSquareStyles: {
		[key: string]: { backgroundColor: string; border?: string };
	} = {};
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			const squareKey = `${String.fromCharCode(97 + i)}${j + 1}`; // Convert column letter to lowercase and prepend row number
			const isDarkSquare = (i + j) % 2 !== 0; // Determine if the square is dark based on its position
			initialSquareStyles[squareKey] = {
				backgroundColor: isDarkSquare ? '#475569' : '#E2E8F0', // Set dark squares to black and light squares to white
			};
		}
	}

	console.log(initialSquareStyles);

	const [squareStyles, setSquareStyles] = useState(initialSquareStyles);
	const [chess, setChess] = useState<Chess>(new Chess());
	const [fen, setFen] = useState<string>(chess.fen());
	const [over, setOver] = useState<'' | string>('');
	const [newMessages, setNewMessages] = useState(false);
	const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
	// 0 is for white, 1 is for black and 2 is for draw
	// const [result, setResult] = useState<'' | string>('');
	const [opponent, setOpponent] = useState<Player | null>(null);
	const [validMoves, setValidMoves] = useState<string[]>([]);
	const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
	// const [promotionSquare, setPromotionSquare] = useState<{
	// 	sourceSquare: Square;
	// 	targetSquare: Square;
	// } | null>(null);

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
				console.log('inside');
				console.log('Making a move: ' + JSON.stringify(result));
				console.log(
					`over : ${chess.isGameOver()}, checkmate : ${chess.isCheckmate()}`
				);

				if (chess.isGameOver()) {
					let result = '';
					if (chess.isCheckmate()) {
						setOver(
							`Checkmate 😉, ${
								chess.turn() === 'w' ? 'BLACK' : 'WHITE'
							} won the game 🎉`
						);
						if (chess.turn() === 'w') {
							result = '1'; //black won
						} else if (chess.turn() === 'b') {
							result = '0';
						}
					} else if (chess.isDraw()) {
						setOver(`It's a draw 🤝`);
						result = '2';
					} else {
						setOver('Game Over ✌️');
					}

					socket?.emit('game-over', {
						roomId,
						result,
					});
				}

				return result;
			} catch (error) {
				console.log(error);
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
			promotion: 'q',
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

	function isDarkSquare(square: string) {
		const file = square[0].charCodeAt(0) - 'a'.charCodeAt(0) + 1; // Convert 'a'-'h' to 1-8
		const rank = parseInt(square[1], 10);
		// Determine if the square is dark or light based on its coordinates
		return file % 2 !== rank % 2;
	}

	const onSquareClick = (square: Square) => {
		if (
			(playerColor === 'white' && chess.turn() !== 'w') ||
			(playerColor === 'black' && chess.turn() !== 'b')
		) {
			return;
		}
		if (selectedSquare === square) {
			setSelectedSquare(null);
			setValidMoves([]);
			setSquareStyles(() => ({
				...initialSquareStyles,
			}));
			console.log('clearing');
			return;
		}

		// If a square is already selected and the clicked square is a valid move
		if (selectedSquare && validMoves.includes(square)) {
			onDrop(selectedSquare, square);
			setSelectedSquare(null);
		}

		const moves = chess.moves({ square, verbose: true });
		const legalMoves = moves.map((move) => move.to);
		setSelectedSquare(square);
		setValidMoves(legalMoves);

		const squareStyles = structuredClone(initialSquareStyles);
		legalMoves.forEach((move) => {
			if (isDarkSquare(move)) {
				squareStyles[move] = {
					backgroundColor: 'rgb(2 132 199)',
				};
			} else {
				squareStyles[move] = {
					backgroundColor: 'rgb(186 230 253)',
					border: '3px solid rgb(14 165 233)',
				};
			}
		});

		setSquareStyles((prevStyles) => ({
			...prevStyles,
			...squareStyles,
		}));
	};

	// const onPromotionCheck = (
	// 	sourceSquare: Square,
	// 	targetSquare: Square,
	// 	piece: string
	// ) => {
	// 	const isPromotion =
	// 		((piece === 'wP' &&
	// 			sourceSquare[1] === '7' &&
	// 			targetSquare[1] === '8') ||
	// 			(piece === 'bP' &&
	// 				sourceSquare[1] === '2' &&
	// 				targetSquare[1] === '1')) &&
	// 		Math.abs(sourceSquare.charCodeAt(0) - targetSquare.charCodeAt(0)) <=
	// 			1;

	// 	if (isPromotion) {
	// 		setPromotionSquare({ sourceSquare, targetSquare });
	// 	}

	// 	return isPromotion;
	// };

	// const onPromotionPieceSelect = (piece: string) => {
	// 	if (!promotionSquare) return false;

	// 	const { sourceSquare, targetSquare } = promotionSquare;

	// 	const move = chess.move({
	// 		from: sourceSquare,
	// 		to: targetSquare,
	// 		promotion: piece.toLowerCase(), // Use the selected piece for promotion
	// 	});

	// 	setPromotionSquare(null); // Reset the promotion square
	// 	return !!move; // Return true if the move was successful
	// };

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
						showBoardNotation={false}
						onSquareClick={onSquareClick}
						customSquareStyles={squareStyles}
						autoPromoteToQueen={true}
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
				}}
			/>
		</div>
	);
}

export default Game;
