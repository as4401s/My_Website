import { useMemo, type ReactNode } from 'react';
import { Chess } from 'chess.js';

// Map piece data to SVG image paths (cburnett set from Lichess)
const getPieceImage = (color: string, type: string): string => {
    const c = color === 'w' ? 'w' : 'b';
    const t = type.toUpperCase();
    return `/pieces/${c}${t}.svg`;
};

interface ChessBoard2DProps {
    fen: string;
    selectedSquare: string | null;
    legalMoves: string[];
    lastMove: { from: string; to: string } | null;
    onSquareClick: (square: string) => void;
    isCheck: boolean;
    checkSquare: string | null;
}

export default function ChessBoard2D({
    fen,
    selectedSquare,
    legalMoves,
    lastMove,
    onSquareClick,
    isCheck,
    checkSquare,
}: ChessBoard2DProps) {
    const game = useMemo(() => new Chess(fen), [fen]);
    const board = game.board();

    const squares: ReactNode[] = [];

    for (let rankIdx = 0; rankIdx < 8; rankIdx++) {
        for (let fileIdx = 0; fileIdx < 8; fileIdx++) {
            const rank = 8 - rankIdx;
            const file = String.fromCharCode(97 + fileIdx);
            const sq = `${file}${rank}`;
            const isLight = (rankIdx + fileIdx) % 2 === 0;
            const piece = board[rankIdx][fileIdx];
            const isSelected = selectedSquare === sq;
            const isLegalTarget = legalMoves.includes(sq);
            const isLastMoveSquare = lastMove && (lastMove.from === sq || lastMove.to === sq);
            const isCheckSq = isCheck && checkSquare === sq;

            // Square colour classes
            let bgClass = isLight ? 'bg-[#f0d9b5]' : 'bg-[#b58863]';
            if (isSelected) {
                bgClass = isLight ? 'bg-[#829769]' : 'bg-[#646d40]';
            } else if (isLastMoveSquare) {
                bgClass = isLight ? 'bg-[#cdd16a]' : 'bg-[#aaa23a]';
            }

            squares.push(
                <div
                    key={sq}
                    className={`relative flex items-center justify-center cursor-pointer select-none ${bgClass} transition-colors duration-100`}
                    style={{ aspectRatio: '1' }}
                    onClick={() => onSquareClick(sq)}
                >
                    {/* Check highlight (radial gradient behind king) */}
                    {isCheckSq && (
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,0,0,0.8)_0%,_rgba(255,0,0,0.35)_40%,_transparent_70%)]" />
                    )}

                    {/* Coordinate labels */}
                    {fileIdx === 0 && (
                        <span className={`absolute top-[2px] left-[3px] text-[10px] font-bold leading-none pointer-events-none ${isLight ? 'text-[#b58863]' : 'text-[#f0d9b5]'
                            }`}>
                            {rank}
                        </span>
                    )}
                    {rankIdx === 7 && (
                        <span className={`absolute bottom-[1px] right-[3px] text-[10px] font-bold leading-none pointer-events-none ${isLight ? 'text-[#b58863]' : 'text-[#f0d9b5]'
                            }`}>
                            {file}
                        </span>
                    )}

                    {/* Piece image */}
                    {piece && (
                        <img
                            src={getPieceImage(piece.color, piece.type)}
                            alt={`${piece.color}${piece.type}`}
                            className="w-[85%] h-[85%] pointer-events-none drop-shadow-sm relative z-10"
                            draggable={false}
                        />
                    )}

                    {/* Legal move dot (empty square) */}
                    {isLegalTarget && !piece && (
                        <div className="absolute w-[30%] h-[30%] rounded-full bg-black/20 z-20" />
                    )}
                    {/* Legal move ring (capture square) */}
                    {isLegalTarget && piece && (
                        <div className="absolute inset-[5%] border-[4px] border-black/20 rounded-full z-20" />
                    )}
                </div>
            );
        }
    }

    return (
        <div className="w-full max-w-[min(82vh,640px)] mx-auto">
            <div
                className="grid grid-cols-8 rounded-md overflow-hidden shadow-2xl border-2 border-gray-700/50"
                style={{ aspectRatio: '1' }}
            >
                {squares}
            </div>
        </div>
    );
}
