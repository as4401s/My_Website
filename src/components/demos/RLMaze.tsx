import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Zap, Target, Brain } from 'lucide-react';

const MAZE_SIZE = 8;
const CELL_SIZE = 40;

interface Cell {
  x: number;
  y: number;
  isWall: boolean;
  isGoal: boolean;
  qValues: { up: number; down: number; left: number; right: number };
}

interface Agent {
  x: number;
  y: number;
}

const DIRECTIONS = [
  { dx: 0, dy: -1, action: 'up', opposite: 'down' },
  { dx: 0, dy: 1, action: 'down', opposite: 'up' },
  { dx: -1, dy: 0, action: 'left', opposite: 'right' },
  { dx: 1, dy: 0, action: 'right', opposite: 'left' },
] as const;

export default function RLMaze() {
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [agent, setAgent] = useState<Agent>({ x: 1, y: 1 });
  const [isTraining, setIsTraining] = useState(false);
  const [episode, setEpisode] = useState(0);
  const [steps, setSteps] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [learningRate, setLearningRate] = useState(0.1);
  const [epsilon, setEpsilon] = useState(0.3);
  const [speed, setSpeed] = useState(100);
  const [showQValues, setShowQValues] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize maze
  const initMaze = useCallback((): Cell[][] => {
    const newMaze: Cell[][] = [];
    for (let y = 0; y < MAZE_SIZE; y++) {
      newMaze[y] = [];
      for (let x = 0; x < MAZE_SIZE; x++) {
        // Create walls around edges and some internal walls
        const isWall = 
          x === 0 || x === MAZE_SIZE - 1 || 
          y === 0 || y === MAZE_SIZE - 1 ||
          (x === 3 && y > 1 && y < 6) ||
          (y === 4 && x > 3 && x < 7);
        
        newMaze[y][x] = {
          x,
          y,
          isWall,
          isGoal: x === MAZE_SIZE - 2 && y === MAZE_SIZE - 2,
          qValues: { up: 0, down: 0, left: 0, right: 0 },
        };
      }
    }
    return newMaze;
  }, []);

  useEffect(() => {
    setMaze(initMaze());
  }, [initMaze]);

  const getBestAction = (x: number, y: number): string => {
    const cell = maze[y][x];
    const actions = Object.entries(cell.qValues);
    actions.sort((a, b) => b[1] - a[1]);
    return actions[0][0];
  };

  const chooseAction = (x: number, y: number): string => {
    // Epsilon-greedy
    if (Math.random() < epsilon) {
      const validActions = DIRECTIONS.filter(d => {
        const nx = x + d.dx;
        const ny = y + d.dy;
        return nx >= 0 && nx < MAZE_SIZE && ny >= 0 && ny < MAZE_SIZE && !maze[ny][nx].isWall;
      });
      return validActions[Math.floor(Math.random() * validActions.length)].action;
    }
    return getBestAction(x, y);
  };

  const step = useCallback(() => {
    setAgent((prevAgent) => {
      const action = chooseAction(prevAgent.x, prevAgent.y);
      const dir = DIRECTIONS.find(d => d.action === action);
      
      if (!dir) return prevAgent;

      const newX = prevAgent.x + dir.dx;
      const newY = prevAgent.y + dir.dy;

      // Check bounds and walls
      if (
        newX < 0 || newX >= MAZE_SIZE ||
        newY < 0 || newY >= MAZE_SIZE ||
        maze[newY][newX].isWall
      ) {
        return prevAgent;
      }

      // Calculate reward
      let reward = -0.1; // Small penalty for each step
      if (maze[newY][newX].isGoal) {
        reward = 10;
      }

      // Update Q-value
      setMaze((prevMaze) => {
        const newMaze = prevMaze.map(row => row.map(cell => ({ ...cell })));
        const cell = newMaze[prevAgent.y][prevAgent.x];
        const nextCell = newMaze[newY][newX];
        const bestNextQ = Math.max(...Object.values(nextCell.qValues));
        
        cell.qValues[action as keyof typeof cell.qValues] = 
          (1 - learningRate) * cell.qValues[action as keyof typeof cell.qValues] +
          learningRate * (reward + 0.9 * bestNextQ);
        
        return newMaze;
      });

      setSteps(s => s + 1);
      setTotalReward(r => r + reward);

      // Check if reached goal
      if (maze[newY][newX].isGoal) {
        setEpisode(e => e + 1);
        setSteps(0);
        return { x: 1, y: 1 }; // Reset to start
      }

      return { x: newX, y: newY };
    });
  }, [maze, epsilon, learningRate]);

  useEffect(() => {
    if (isTraining) {
      intervalRef.current = setInterval(step, speed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTraining, step, speed]);

  const reset = () => {
    setIsTraining(false);
    setAgent({ x: 1, y: 1 });
    setEpisode(0);
    setSteps(0);
    setTotalReward(0);
    setMaze(initMaze());
  };

  const getQValueColor = (value: number) => {
    // Map value from [-10, 10] to color
    const normalized = Math.max(-1, Math.min(1, value / 10));
    if (normalized > 0) {
      return `rgba(34, 197, 94, ${0.2 + normalized * 0.8})`;
    } else {
      return `rgba(239, 68, 68, ${0.2 + Math.abs(normalized) * 0.8})`;
    }
  };

  const getArrow = (action: string) => {
    switch (action) {
      case 'up': return '↑';
      case 'down': return '↓';
      case 'left': return '←';
      case 'right': return '→';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Controls */}
      <div className="glass-card p-4 rounded-xl mb-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {/* Learning Rate */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Learning Rate: {learningRate.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              value={learningRate}
              onChange={(e) => setLearningRate(Number(e.target.value))}
              className="w-full accent-brand-accent"
            />
          </div>

          {/* Epsilon */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Exploration (ε): {epsilon.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={epsilon}
              onChange={(e) => setEpsilon(Number(e.target.value))}
              className="w-full accent-brand-accent"
            />
          </div>

          {/* Speed */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Speed: {speed}ms
            </label>
            <input
              type="range"
              min="50"
              max="500"
              step="50"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-brand-accent"
            />
          </div>

          {/* Show Q-Values */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showQValues}
                onChange={(e) => setShowQValues(e.target.checked)}
                className="accent-brand-accent"
              />
              <span className="text-xs text-gray-400">Show Q-Values</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsTraining(!isTraining)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent/80 transition-colors"
          >
            {isTraining ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isTraining ? 'Pause' : 'Start Training'}
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-white text-sm hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="glass-card p-3 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="w-4 h-4 text-brand-accent" />
            <span className="text-xs text-gray-500">Episodes</span>
          </div>
          <p className="text-2xl font-bold text-white">{episode}</p>
        </div>
        <div className="glass-card p-3 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-500">Steps</span>
          </div>
          <p className="text-2xl font-bold text-white">{steps}</p>
        </div>
        <div className="glass-card p-3 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-500">Reward</span>
          </div>
          <p className={`text-2xl font-bold ${totalReward >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalReward.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Maze */}
      <div className="glass-card p-4 rounded-xl overflow-x-auto">
        <div 
          className="inline-grid gap-0.5 mx-auto"
          style={{ 
            gridTemplateColumns: `repeat(${MAZE_SIZE}, ${CELL_SIZE}px)`,
          }}
        >
          {maze.map((row, y) =>
            row.map((cell, x) => {
              const isAgent = agent.x === x && agent.y === y;
              const bestAction = getBestAction(x, y);

              return (
                <div
                  key={`${x}-${y}`}
                  className={`relative flex items-center justify-center text-xs font-mono transition-all duration-200 ${
                    cell.isWall
                      ? 'bg-gray-800'
                      : cell.isGoal
                      ? 'bg-green-500/30 border-2 border-green-500'
                      : ''
                  }`}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    backgroundColor: !cell.isWall && !cell.isGoal && showQValues
                      ? getQValueColor(cell.qValues[bestAction as keyof typeof cell.qValues])
                      : undefined,
                  }}
                >
                  {cell.isGoal ? (
                    <Target className="w-5 h-5 text-green-400" />
                  ) : isAgent ? (
                    <div className="w-6 h-6 rounded-full bg-brand-accent flex items-center justify-center animate-pulse">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                  ) : showQValues && !cell.isWall ? (
                    <span className="text-[10px] text-white/70">
                      {getArrow(bestAction)}
                    </span>
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-brand-accent flex items-center justify-center">
              <Brain className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-gray-400">Agent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500/30 border border-green-500 rounded flex items-center justify-center">
              <Target className="w-2.5 h-2.5 text-green-400" />
            </div>
            <span className="text-gray-400">Goal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-800 rounded" />
            <span className="text-gray-400">Wall</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500/50 rounded" />
            <span className="text-gray-400">High Q-Value</span>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-4 text-center text-sm text-gray-400">
        <p>
          The agent learns to navigate the maze using <strong className="text-brand-accent">Q-Learning</strong>.
          <br />
          Green cells indicate high Q-values (good actions). Watch as the agent explores and learns!
        </p>
      </div>
    </div>
  );
}
