import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Package, Layers } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { ScrollArea } from './components/ui/scroll-area';
import { Badge } from './components/ui/badge';

const packageInfo = [
  { name: 'core', color: 'bg-blue-600', count: 4 },
  { name: 'engine', color: 'bg-emerald-600', count: 5 },
  { name: 'model', color: 'bg-violet-600', count: 7 },
  { name: 'systems', color: 'bg-amber-600', count: 5 },
  { name: 'persistence', color: 'bg-rose-600', count: 2 },
  { name: 'ui', color: 'bg-fuchsia-600', count: 7 },
];

const designPatterns = [
  { name: 'Singleton', usage: 'AssetManager' },
  { name: 'State', usage: 'GameState enum' },
  { name: 'Factory', usage: 'LevelManager' },
  { name: 'Observer', usage: 'Input system' },
  { name: 'Strategy', usage: 'GameScreen implementations' },
  { name: 'Game Loop', usage: 'GameLoop class' },
];

export default function App() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [diagramRendered, setDiagramRendered] = useState(false);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!diagramRef.current || diagramRendered) return;

      try {
        const mermaid = (await import('mermaid')).default;
        
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          securityLevel: 'loose',
          themeVariables: {
            primaryColor: '#dbeafe',
            primaryTextColor: '#1e3a8a',
            primaryBorderColor: '#3b82f6',
            lineColor: '#64748b',
            secondaryColor: '#e0e7ff',
            tertiaryColor: '#fef3c7',
            mainBkg: '#eff6ff',
            secondBkg: '#dbeafe',
            tertiaryBkg: '#fef9c3',
            textColor: '#0f172a',
            border1: '#3b82f6',
            border2: '#60a5fa',
            arrowheadColor: '#64748b',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            fontSize: '14px',
          },
        });

        const diagramDefinition = `
classDiagram
    class GameState {
        <<enumeration>>
        MENU
        PLAYING
        PAUSED
        GAME_OVER
        NAME_INPUT
    }
    
    class PowerUpType {
        <<enumeration>>
        WIDEN_PADDLE
        EXTRA_LIFE
        FAST_BALL
    }

    class GameConfig {
        -GameConfig()
        +WIDTH int
        +HEIGHT int
        +FPS int
        +BALL_SPEED float
        +LIVES int
    }

    class GameLoop {
        <<Runnable>>
        -game Game
        -frameTimeNs double
        -thread Thread
        -running boolean
        +GameLoop(game, fps)
        +run() void
        +start() void
        +stop() void
        +isRunning() boolean
    }

    class Game {
        -state GameState
        -renderer Renderer
        -physics PhysicsSystem
        -collision CollisionSystem
        -scoreSystem ScoreSystem
        -levelManager LevelManager
        -paddle Paddle
        -ball Ball
        -hud HUD
        -menuScreen MenuScreen
        -pausedScreen PausedScreen
        -input Input
        -currentScreen GameScreen
        -currentLevel int
        -gameLoop GameLoop
        +Game(renderer, input)
        +initLevel() void
        +startGame() void
        +menu() void
        +pausedGame() void
        +stopGame() void
        +update() void
        +render() void
    }

    class Window {
        -frame JFrame
        -canvas Canvas
        -width int
        -height int
        +Window(title, width, height)
        +getCanvas() Canvas
        +show() void
        +close() void
    }

    class Renderer {
        -window Window
        -assets AssetManager
        +Renderer(window)
        +clear() void
        +draw(obj) void
        +present() void
    }

    class Input {
        <<KeyListener>>
        -left boolean
        -right boolean
        -fire boolean
        -esc boolean
        +keyPressed(e) void
        +keyReleased(e) void
        +isLeft() boolean
        +isRight() boolean
        +isFire() boolean
    }

    class AssetManager {
        <<Singleton>>
        -instance AssetManager
        -AssetManager()
        +getInstance() AssetManager
        +loadImage(key, path) void
        +getImage(key) BufferedImage
    }

    class AudioManager {
        +loadSound(name) void
        +play(name) void
        +loop(name) void
        +stop(name) void
    }

    class GameObject {
        <<abstract>>
        #x int
        #y int
        #width int
        #height int
        +GameObject(x, y, width, height)
        +getX() int
        +getY() int
    }

    class MovableObject {
        <<abstract>>
        #velX float
        #velY float
        +getVelX() float
        +setVelX(velX) void
    }

    class Ball {
        -radius int
        -color Color
        +Ball(x, y)
        +reset(paddle) void
    }

    class Paddle {
        -speed int
        -init boolean
        +Paddle(x, y, speed)
        +handle(input) void
        +move(dx) void
    }

    class Brick {
        <<abstract>>
        #health int
        #color Color
        +hit() void
        +isDestroyed() boolean
    }

    class NormalBrick {
        +NormalBrick(x, y, w, h)
    }

    class StrongBrick {
        +StrongBrick(x, y, w, h)
        +hit() void
    }

    class PowerUp {
        -type PowerUpType
        -active boolean
        +PowerUp(x, y, type)
        +isActive() boolean
        +update() void
    }

    class PhysicsSystem {
        +update(game, ball, paddle, scoreSystem) void
    }

    class CollisionSystem {
        +checkGeneral(game, ball, paddle, bricks) void
    }

    class ScoreSystem {
        -score int
        -lives int
        -highScore int
        +getScore() int
        +addScore(points) void
        +getLives() int
        +loseLife() void
        +addLife() void
    }

    class LevelManager {
        -level int
        +loadLevel(levelNumber) List
        +getLevel() int
    }

    class PowerUpSystem {
        +update(powerUps, paddle, ball) void
    }

    class Leaderboard {
        -entries List
        +addEntry(name, score) void
        +getTopEntries(limit) List
        +saveToFile() void
        +loadFromFile() void
    }

    class LeaderboardEntry {
        -name String
        -score int
        +getName() String
        +getScore() int
    }

    class GameScreen {
        <<abstract>>
        #game Game
        #input Input
        +update() void
        +render(renderer) void
    }

    class MenuScreen {
        -playButton Rectangle
        +update() void
        +render(renderer) void
    }

    class PausedScreen {
        -resumeButton Rectangle
        +update() void
        +render(renderer) void
    }

    class PlayScreen {
        +update() void
        +render(renderer) void
    }

    class NameInputScreen {
        -nameBuilder StringBuilder
        -finalScore int
        +update() void
        +render(renderer) void
    }

    class LeaderboardScreen {
        -leaderboard Leaderboard
        -backButton Rectangle
        +update() void
        +render(renderer) void
    }

    class HUD {
        -score int
        -lives int
        -level int
        +update(scoreSystem) void
        +render(renderer) void
    }

    MovableObject --|> GameObject
    Ball --|> MovableObject
    Paddle --|> MovableObject
    Brick --|> GameObject
    NormalBrick --|> Brick
    StrongBrick --|> Brick
    PowerUp --|> MovableObject
    
    MenuScreen --|> GameScreen
    PausedScreen --|> GameScreen
    PlayScreen --|> GameScreen
    NameInputScreen --|> GameScreen
    LeaderboardScreen --|> GameScreen

    Game *-- Renderer
    Game *-- Input
    Game *-- PhysicsSystem
    Game *-- CollisionSystem
    Game *-- ScoreSystem
    Game *-- LevelManager
    Game *-- Paddle
    Game *-- Ball
    Game *-- HUD
    Game *-- MenuScreen
    Game *-- PausedScreen
    Game *-- GameLoop
    Game --> GameState

    Renderer *-- Window
    Renderer *-- AssetManager

    GameScreen *-- Game
    GameScreen *-- Input
    
    LeaderboardScreen --> Leaderboard
    NameInputScreen --> Leaderboard
    Leaderboard o-- LeaderboardEntry
    
    PowerUp --> PowerUpType
`;

        const { svg } = await mermaid.render('arkanoid-uml', diagramDefinition);
        if (diagramRef.current) {
          diagramRef.current.innerHTML = svg;
          setDiagramRendered(true);
        }
      } catch (error) {
        console.error('Error rendering diagram:', error);
        if (diagramRef.current) {
          diagramRef.current.innerHTML = `
            <div class="p-8 text-center">
              <p class="text-red-600 font-medium mb-2">Error rendering diagram</p>
              <p class="text-slate-600">${error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
          `;
        }
      }
    };

    renderDiagram();
  }, [diagramRendered]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-slate-900">Arkanoid Game - UML Class Diagram</h1>
              <p className="text-slate-600 mt-1">
                Complete object-oriented design architecture
              </p>
            </div>
            <Badge variant="outline" className="px-4 py-2">
              <Layers className="w-4 h-4 mr-2" />
              30 Classes
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="diagram" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="diagram">UML Diagram</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="patterns">Design Patterns</TabsTrigger>
          </TabsList>

          {/* UML Diagram Tab */}
          <TabsContent value="diagram" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-slate-600" />
                  <span className="text-slate-700">Zoom: {Math.round(zoom * 100)}%</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleZoomOut} variant="outline" size="sm">
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleZoomIn} variant="outline" size="sm">
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleReset} variant="outline" size="sm">
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div
                className="relative overflow-hidden bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg border-2 border-sky-200 shadow-inner"
                style={{ height: '70vh' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <ScrollArea className="h-full w-full">
                  <div
                    style={{
                      transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                      transformOrigin: '0 0',
                      cursor: isPanning ? 'grabbing' : 'grab',
                      transition: isPanning ? 'none' : 'transform 0.2s',
                    }}
                  >
                    <div
                      ref={diagramRef}
                      className="p-8 min-w-full min-h-full"
                    >
                      <div className="text-center text-slate-500 py-8">
                        Loading diagram...
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>

              <p className="text-slate-500 mt-4 text-center">
                💡 Drag to pan, use zoom controls to navigate
              </p>
            </Card>
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packageInfo.map((pkg) => (
                <Card key={pkg.name} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${pkg.color}`} />
                      <h3 className="text-slate-900">com.mygame.arkanoid.{pkg.name}</h3>
                    </div>
                    <Badge variant="secondary">{pkg.count}</Badge>
                  </div>
                  <p className="text-slate-600">
                    {pkg.name === 'core' && 'Game engine core components and main loop'}
                    {pkg.name === 'engine' && 'Rendering, input, and asset management'}
                    {pkg.name === 'model' && 'Game objects and entities'}
                    {pkg.name === 'systems' && 'Physics, collision, and game systems'}
                    {pkg.name === 'persistence' && 'Data persistence and leaderboards'}
                    {pkg.name === 'ui' && 'User interface screens and HUD'}
                  </p>
                </Card>
              ))}
            </div>

            <Card className="p-6 mt-6">
              <h3 className="text-slate-900 mb-4">Package Structure Overview</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-700 mb-2">Total Classes:</p>
                    <p className="text-slate-900">30 classes</p>
                  </div>
                  <div>
                    <p className="text-slate-700 mb-2">Abstract Classes:</p>
                    <p className="text-slate-900">4 (GameObject, MovableObject, Brick, GameScreen)</p>
                  </div>
                  <div>
                    <p className="text-slate-700 mb-2">Enumerations:</p>
                    <p className="text-slate-900">2 (GameState, PowerUpType)</p>
                  </div>
                  <div>
                    <p className="text-slate-700 mb-2">Interfaces:</p>
                    <p className="text-slate-900">Multiple (Runnable, KeyListener, MouseListener)</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Design Patterns Tab */}
          <TabsContent value="patterns">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {designPatterns.map((pattern, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sky-700">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-slate-900 mb-2">{pattern.name} Pattern</h3>
                      <p className="text-slate-600">
                        <span className="text-slate-700">Implementation:</span> {pattern.usage}
                      </p>
                      {pattern.name === 'Singleton' && (
                        <p className="text-slate-500 mt-2">
                          Ensures only one instance of AssetManager exists throughout the application
                        </p>
                      )}
                      {pattern.name === 'State' && (
                        <p className="text-slate-500 mt-2">
                          Manages different game states (MENU, PLAYING, PAUSED, GAME_OVER, NAME_INPUT)
                        </p>
                      )}
                      {pattern.name === 'Factory' && (
                        <p className="text-slate-500 mt-2">
                          Creates different brick patterns for various game levels
                        </p>
                      )}
                      {pattern.name === 'Observer' && (
                        <p className="text-slate-500 mt-2">
                          Observes and handles keyboard and mouse events
                        </p>
                      )}
                      {pattern.name === 'Strategy' && (
                        <p className="text-slate-500 mt-2">
                          Different screen behaviors encapsulated in GameScreen subclasses
                        </p>
                      )}
                      {pattern.name === 'Game Loop' && (
                        <p className="text-slate-500 mt-2">
                          Fixed timestep game loop for consistent game updates
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 mt-6">
              <h3 className="text-slate-900 mb-4">Key Architectural Decisions</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-sky-600 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-slate-700">Separation of Concerns</p>
                    <p className="text-slate-600">
                      Clear separation between model, view (UI), and systems (controllers)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-sky-600 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-slate-700">Composition over Inheritance</p>
                    <p className="text-slate-600">
                      Game class composes various systems instead of inheriting behavior
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-sky-600 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-slate-700">Single Responsibility Principle</p>
                    <p className="text-slate-600">
                      Each system handles one specific concern (physics, collision, score)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-sky-600 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-slate-700">Extensibility</p>
                    <p className="text-slate-600">
                      Easy to add new brick types, power-ups, or game screens through inheritance
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
