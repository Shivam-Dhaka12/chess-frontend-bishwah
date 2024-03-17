import { Chess, Color, Move, Square } from 'chess.js';
import { useCallback, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import CustomDialog from '../Components/CustomDialog';
import Chat from '../Components/Chat';
import CopyLink from '../Components/CopyLink';

interface MoveData {
	from: Square;
	to: Square;
	color: Color;
}

const Game = () => {
	const chess = useMemo<Chess>(() => new Chess(), []);
	const [fen, setFen] = useState<string>(chess.fen());
	const [over, setOver] = useState<'' | string>('');

	const makeAMove = useCallback(
		(move: MoveData): Move | null => {
			try {
				const result: Move = chess.move(move);
				setFen(chess.fen());

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
		[chess]
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
				<Chat />
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
};

export default Game;
