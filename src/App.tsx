import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from './components/ui/button';

export default function App() {
  const [activeTab, setActiveTab] = useState('diagram');
  const [mermaidLoaded, setMermaidLoaded] = useState(false);
  const [diagramSvg, setDiagramSvg] = useState('');
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const mermaidCode = `classDiagram
    %% Core Package
    class GameState {
        <<enumeration>>
        MENU
        PLAYING
        PAUSED
        GAME_OVER
        NAME_INPUT
    }

    class GameConfig {
        -GameConfig()
        +int WIDTH$
        +int HEIGHT$
        +int FPS$
        +float BALL_SPEED$
        +int LIVES$
        +int BORDER_LINE$
        +int PADDLE_SPEED$
    }

    class GameLoop {
        -Game game
        -double frameTimeNs
        -Thread thread
        -boolean running
        -int fps
        -long lastFpsTime
        -int frameCount
        +GameLoop(game, fps)
        +void run()
        +void start()
        +void stop()
        +boolean isRunning()
        -void printFPS()
    }

    class Observer {
        <<interface>>
        +void onNotify(event, data)
    }

    class Subject {
        -List~Observer~ observers
        +void addObserver(o)
        +void removeObserver(o)
        +void notifyObservers(event, data)
    }

    class Game {
        -GameState state
        -Renderer renderer
        -PhysicsSystem physics
        -CollisionSystem collision
        -ScoreSystem scoreSystem
        -LevelManager levelManager
        -SpawnEnemy spawnEnemy
        +Paddle paddle
        +Ball ball
        -List~Brick~ bricks
        -List~Enemy~ enemies
        -List~Explosion~ explosions
        -List~Bullet~ bullets
        -List~PowerUp~ powerUps
        -HUD hud
        -MenuScreen menuScreen
        -PausedScreen pausedScreen
        -GameScreen currentScreen
        -Input input
        -int currentLevel
        -GameLoop gameLoop
        +Game(renderer, input)
        +void initLevel()
        +void initLevelForPlay(bricksAlive, bricksHitPoints)
        +void loadLevel(level)
        +void startGame()
        +void menu()
        +void pausedGame()
        +void stopGame()
        +void update()
        +void setScreen(screen)
        +void render()
        +GameState getState()
        +void setState(state)
        +void startLoop()
        +void stopLoop()
        +void resumeGame()
        +List~Enemy~ getEnemies()
        +void setEnemies(enemies)
        +List~PowerUp~ getPowerUps()
        +Ball getBall()
        +Paddle getPaddle()
        +int getScore()
        +void setScore(score)
        +void setLives(lives)
        +int getLives()
        +int getLevel()
        +List~Brick~ getBricks()
    }

    %% Engine Package
    class Window {
        -JFrame frame
        -Canvas canvas
        -int width
        -int height
        +Window(title, width, height)
        +Canvas getCanvas()
        +void show()
        +void close()
        +void setVisible(visible)
    }

    class Renderer {
        -Window window
        -BufferStrategy bufferStrategy
        -Graphics2D g
        -AssetManager assets
        +Renderer(window)
        +void clear()
        +void drawBackground(lm)
        +void draw(obj)
        +void drawDoor(spawnEnemy)
        +void present()
        +Graphics2D getGraphics()
    }

    class Input {
        -boolean left
        -boolean right
        -boolean fire
        -boolean esc
        -boolean save
        -int mouseX
        -int mouseY
        -boolean mousePressed
        -int scrollAmount
        -int lastKeyChar
        -int lastKeyCode
        +void keyPressed(e)
        +void keyReleased(e)
        +void keyTyped(e)
        +void mousePressed(e)
        +void mouseReleased(e)
        +void mouseMoved(e)
        +void mouseDragged(e)
        +void mouseWheelMoved(e)
        +boolean isLeft()
        +boolean isRight()
        +boolean isFire()
        +boolean isEscape()
        +boolean isSave()
        +Point getMousePosition()
        +boolean isMousePressed()
        +int getScrollAmount()
        +int consumeKeyChar()
        +int consumeKeyCode()
        +void clearLastTyped()
    }

    class AssetManager {
        -AssetManager instance$
        -Map~String,BufferedImage[]~ spriteSheets
        -Map~String,BufferedImage~ images
        -AssetManager()
        +AssetManager getInstance()$
        +void loadImage(key, path)
        +void loadSpriteSheet(key, path, frameWidth, frameHeight)
        +BufferedImage[] getSpriteFrames(key)
        +BufferedImage getImage(key)
        +void preloadAssets()
    }

    class AudioManager {
        -HashMap~String,Clip~ sounds$
        +void loadSound(name)$
        +void play(name)$
        +void loop(name)$
        +void stop(name)$
        +void setVolume(name, volume)$
    }

    %% Model Package
    class GameObject {
        <<abstract>>
        #int x
        #int y
        #int width
        #int height
        +GameObject(x, y, width, height)
        +int getX()
        +void setX(x)
        +int getY()
        +void setY(y)
        +int getWidth()
        +int getHeight()
    }

    class MovableObject {
        <<abstract>>
        #float velX
        #float velY
        +MovableObject(x, y, width, height)
        +float getVelX()
        +void setVelX(velX)
        +float getVelY()
        +void setVelY(velY)
        +void Move()
    }

    class Ball {
        -int radius
        -float speed
        -int currentFrame
        +Ball(startX, startY)
        +int getRadius()
        +float getSpeed()
        +void setSpeed(speed)
        +void reset(paddle)
    }

    class Paddle {
        -int speed
        -String currentPowerUp
        -int currentFrame
        -long lastFrameTime
        -int frameDelay
        -boolean init
        -PaddleState state
        -long stateStartTime
        -long stateDuration
        -long lastBulletTime
        +Paddle(x, y, width, height, speed)
        +int getSpeed()
        +boolean isInit()
        +PaddleState getState()
        +void setState(state)
        +void applyPowerUp(powerUp)
        +Rectangle getBounds()
        +void handle(input)
        +void createBullet(bullets)
    }

    class PaddleState {
        <<enumeration>>
        NORMAL
        EXTENDED
        INIT
        BROKEN
        TRANFORM
    }

    class Brick {
        -int hitPoints
        -String type
        -int currentFrame
        -long lastFrameTime
        -boolean alive
        +Brick(x, y, width, height, hitPoints, type)
        +int getHitPoints()
        +void setHitPoints(hitPoints)
        +void takeHit()
        +boolean isDestroyed()
        +void destroy()
        +boolean isAlive()
    }

    class NormalBrick {
        +NormalBrick(x, y, width, height)
    }

    class StrongBrick {
        -int currentFrame
        -long lastFrameTime
        +StrongBrick(x, y, width, height)
        +void takeHit()
        +int getCurrentFrame()
    }

    class GhostBrick {
        -int currentFrame
        -long lastFrameTime
        -Random random
        +GhostBrick(x, y, width, height)
        +void takeHit()
        +int getCurrentFrame()
        +boolean isGhost()
    }

    class Bullet {
        -float speed
        -boolean active
        +Bullet(startX, startY)
        +void update()
        +boolean isActive()
        +void setActive(active)
        +void onHit()
    }

    class Enemy {
        -int hp
        -int direction
        -int radius
        -int currentFrame
        -long lastFrameTime
        -Random random
        +Enemy(x, y, radius, hp)
        +int getRadius()
        +void update()
        +void takeDamage()
        +boolean isDead()
        +int getHp()
    }

    class Explosion {
        -int radius
        -int frame
        -boolean finished
        -long lastFrameTime
        +Explosion(x, y, r)
        +void update(totalFrames)
        +int getRadius()
        +int getFrame()
        +boolean isFinished()
    }

    class PowerUpType {
        <<enumeration>>
        WIDEN_PADDLE
        EXTRA_LIFE
        FAST_BALL
        SHOOTING
    }

    class PowerUp {
        -PowerUpType type
        -float speedY
        -boolean active
        -int currentFrame
        -long lastFrameTime
        -int frameDelay
        +PowerUp(x, y, type)
        +void update()
        +void updateFrame(totalFrames)
        +int getCurrentFrame()
        +Rectangle getBounds()
        +PowerUpType getType()
        +boolean isActive()
    }

    %% Systems Package
    class PhysicsSystem {
        +PhysicsSystem()
        +void update(game, ball, paddle, bullets, ss)
        +void updateBullets(bullets)
    }

    class CollisionSystem {
        -PowerUpSystem powerUpSystem
        +CollisionSystem()
        +void checkGeneral(game, ball, paddle, bricks, enemies, scoreSystem, input, powerUps, explosions, bullets)
    }

    class ScoreSystem {
        +int score
        +int lives
        +int combo
        +ScoreSystem()
        +void onNotify(event, data)
        +void addBrickScore()
        +void addEnemyScore()
        +void resetCombo()
        +void loseLife()
        +void reset()
        +int getScore()
        +int getLives()
        +boolean isGameOver()
    }

    class LevelManager {
        -int level
        -int maxLevel
        +LevelManager()
        +List~Brick~ loadLevel(levelNumber)
        +int getLevel()
        +int getMaxLevel()
    }

    class PowerUpSystem {
        +PowerUpSystem()
        +void spawnPowerUp(game, x, y)
        +void checkPaddlePowerUpCollision(paddle, ball, powerUps, scoreSystem)
    }

    class SpawnEnemy {
        -Game game
        -long lastSpawnTime
        -long spawnInterval
        -long lastDoorChangeTime$
        -boolean doorLeft
        -boolean doorRight
        -int frameDoorLeft
        -int frameDoorRight
        -Random random
        -boolean doorOpening
        +SpawnEnemy(game, spawnInterval)
        +void update()
        +boolean isDoorLeft()
        +boolean isDoorRight()
        +int getFrameDoorLeft()
        +int getFrameDoorRight()
        +void updateDoor()
        +boolean isDoorOpening()
    }

    %% Persistence Package
    class Leaderboard {
        -String SUPABASE_URL$
        -String SUPABASE_KEY$
        -String TABLE$
        +void submitScore(playerName, score)$
        +List~Entry~ fetchLeaderboard()$
    }

    class LeaderboardEntry {
        +String name
        +int score
        +Entry(name, score)
    }

    class SaveManager {
        -String SAVE_FILE$
        -Gson gson$
        +void save(game)$
        +SaveData load()$
        +boolean hasSave()$
        +void delete()$
    }

    class SaveData {
        +int level
        +int score
        +int lives
        +float ballX
        +float ballY
        +float ballVelX
        +float ballVelY
        +float paddleX
        +float paddleWidth
        +boolean[] bricksAlive
        +int[] bricksHitPoints
        +int enemyCount
        +float[] enemyX
        +float[] enemyY
        +int[] enemyHp
        +int powerUpCount
    }

    %% UI Package
    class GameScreen {
        <<abstract>>
        #Game game
        #Input input
        #AssetManager assets
        #Font gameFont
        +GameScreen(game, input)
        +void update()*
        +void render(renderer)*
        #void drawButton(g, rect, text)
        #void drawTextButton(g, rect, text)
        #void drawCenteredString(g, text, width, y)
    }

    class MenuScreen {
        -Rectangle startButton
        -Rectangle exitButton
        -Rectangle leaderboardButton
        -Rectangle continueButton
        -int currentFrame
        -long lastFrameTime1
        -long lastFrameTime2
        -int y_background
        +MenuScreen(game, input)
        +void update()
        +void render(renderer)
    }

    class PausedScreen {
        -Rectangle restartButton
        -Rectangle exitButton
        -Rectangle resumeButton
        -Rectangle saveButton
        -Rectangle deleteButton
        -Font nesFont
        +PausedScreen(game, input)
        +void update()
        +void render(renderer)
    }

    class NameInputScreen {
        -int score
        -StringBuilder playerName
        -boolean submitted
        -Rectangle submitButton
        -Rectangle cancelButton
        -Font nesFont
        -long lastBlink
        -boolean cursorOn
        +NameInputScreen(game, input, score)
        +void update()
        +void render(renderer)
        -void submit()
        -void cancel()
    }

    class LeaderboardScreen {
        -Rectangle backButton
        -List~Entry~ topPlayers
        -Font nesFont
        -float fadeAlpha
        -boolean loading
        -String errorMessage
        +LeaderboardScreen(game, input)
        +void preloadAssets()
        +void setData(data)
        +void update()
        +void render(renderer)
    }

    class HUD {
        -int score
        -int lives
        +HUD()
        +void update(ss)
        +void render(renderer)
    }

    class Main {
        +void main(args)$
    }

    %% Inheritance Relationships
    MovableObject --|> GameObject
    Ball --|> MovableObject
    Paddle --|> MovableObject
    Bullet --|> MovableObject
    Enemy --|> MovableObject
    Brick --|> GameObject
    NormalBrick --|> Brick
    StrongBrick --|> Brick
    GhostBrick --|> Brick
    PowerUp --|> GameObject
    Explosion --|> GameObject
    CollisionSystem --|> Subject
    PowerUpSystem --|> Subject
    MenuScreen --|> GameScreen
    PausedScreen --|> GameScreen
    NameInputScreen --|> GameScreen
    LeaderboardScreen --|> GameScreen

    %% Implementation Relationships
    GameLoop ..|> Runnable : implements
    ScoreSystem ..|> Observer : implements

    %% Composition/Aggregation Relationships
    Game *-- Renderer
    Game *-- Input
    Game *-- PhysicsSystem
    Game *-- CollisionSystem
    Game *-- ScoreSystem
    Game *-- LevelManager
    Game *-- PowerUpSystem
    Game *-- SpawnEnemy
    Game *-- Paddle
    Game *-- Ball
    Game *-- HUD
    Game *-- MenuScreen
    Game *-- PausedScreen
    Game *-- GameLoop
    Game o-- GameState
    Game o-- GameScreen

    Renderer *-- Window
    Renderer *-- AssetManager
    Window *-- JFrame
    Window *-- Canvas

    GameScreen *-- Game
    GameScreen *-- Input
    GameScreen *-- AssetManager

    Subject o-- Observer
    CollisionSystem *-- PowerUpSystem
    PowerUp o-- PowerUpType
    Paddle o-- PaddleState
    GameLoop *-- Game
    SpawnEnemy *-- Game
    LeaderboardScreen o-- LeaderboardEntry
    Leaderboard ..> LeaderboardEntry : creates

    %% Dependencies
    PhysicsSystem ..> Game : uses
    PhysicsSystem ..> Ball : uses
    PhysicsSystem ..> Paddle : uses
    PhysicsSystem ..> ScoreSystem : uses
    CollisionSystem ..> Game : uses
    CollisionSystem ..> Ball : uses
    CollisionSystem ..> Brick : uses
    LevelManager ..> Brick : uses
    LevelManager ..> NormalBrick : creates
    LevelManager ..> StrongBrick : creates
    LevelManager ..> GhostBrick : creates
    PowerUpSystem ..> PowerUp : creates
    SpawnEnemy ..> Enemy : creates
    SaveManager ..> Game : uses
`;

  useEffect(() => {
    const loadMermaid = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          themeVariables: {
            primaryColor: '#E8F4F8',
            primaryTextColor: '#1a1a1a',
            primaryBorderColor: '#2563eb',
            lineColor: '#475569',
            secondaryColor: '#FEF3C7',
            tertiaryColor: '#E0E7FF',
            fontSize: '14px',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          },
          class: {
            useMaxWidth: false,
          },
        });

        const { svg } = await mermaid.render('mermaid-diagram', mermaidCode);
        setDiagramSvg(svg);
        setMermaidLoaded(true);
      } catch (error) {
        console.error('Error loading Mermaid:', error);
      }
    };

    loadMermaid();
  }, []);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const packages = [
    {
      name: 'com.mygame.arkanoid.core',
      classes: ['GameState', 'GameConfig', 'GameLoop', 'Observer', 'Subject', 'Game'],
      description: 'Core game logic và game loop, quản lý trạng thái và event system',
    },
    {
      name: 'com.mygame.arkanoid.engine',
      classes: ['Window', 'Renderer', 'Input', 'AssetManager', 'AudioManager'],
      description: 'Graphics rendering, input handling, và resource management',
    },
    {
      name: 'com.mygame.arkanoid.model',
      classes: ['GameObject', 'MovableObject', 'Ball', 'Paddle', 'Brick', 'NormalBrick', 'StrongBrick', 'GhostBrick', 'Bullet', 'Enemy', 'Explosion', 'PowerUp', 'PowerUpType', 'PaddleState'],
      description: 'Game entities và object hierarchy với inheritance structure',
    },
    {
      name: 'com.mygame.arkanoid.systems',
      classes: ['PhysicsSystem', 'CollisionSystem', 'ScoreSystem', 'LevelManager', 'PowerUpSystem', 'SpawnEnemy'],
      description: 'Game systems xử lý physics, collision, scoring, levels và spawning',
    },
    {
      name: 'com.mygame.arkanoid.persistence',
      classes: ['Leaderboard', 'SaveManager', 'SaveData'],
      description: 'Data persistence: save/load game state và leaderboard integration',
    },
    {
      name: 'com.mygame.arkanoid.ui',
      classes: ['GameScreen', 'MenuScreen', 'PausedScreen', 'NameInputScreen', 'LeaderboardScreen', 'HUD'],
      description: 'UI screens và HUD với template method pattern',
    },
    {
      name: 'com.mygame.arkanoid.util',
      classes: ['Main'],
      description: 'Entry point cho application',
    },
  ];

  const designPatterns = [
    {
      name: 'Singleton Pattern',
      location: 'AssetManager',
      purpose: 'Quản lý assets toàn cục',
      description: 'AssetManager sử dụng Singleton pattern để đảm bảo chỉ có một instance duy nhất quản lý tất cả hình ảnh và sprite sheets trong game.',
      implementation: [
        'Private constructor để ngăn khởi tạo từ bên ngoài',
        'Static instance variable',
        'Public static getInstance() method',
        'Thread-safe lazy initialization',
      ],
      code: `private static AssetManager instance;
private AssetManager() { }
public static AssetManager getInstance() {
    if (instance == null) instance = new AssetManager();
    return instance;
}`,
    },
    {
      name: 'Observer Pattern',
      location: 'Subject, Observer, ScoreSystem, CollisionSystem, PowerUpSystem',
      purpose: 'Event-driven scoring system',
      description: 'Observer pattern cho phép ScoreSystem lắng nghe các sự kiện game (brick destroyed, powerup taken) mà không cần coupling chặt chẽ với các class khác. CollisionSystem và PowerUpSystem extend Subject để phát các sự kiện.',
      implementation: [
        'Observer interface định nghĩa onNotify(event, data)',
        'Subject class quản lý danh sách observers',
        'ScoreSystem implements Observer để nhận thông báo',
        'CollisionSystem extends Subject để phát sự kiện va chạm',
        'PowerUpSystem extends Subject để phát sự kiện power-up',
      ],
      events: ['BRICK_DESTROYED', 'BRICK_HIT', 'BALL_HIT_PADDLE', 'POWERUP_TAKEN'],
      code: `public interface Observer {
    void onNotify(String event, Object data);
}

public class ScoreSystem implements Observer {
    @Override
    public void onNotify(String event, Object data) {
        switch (event) {
            case "BRICK_DESTROYED" -> addBrickScore();
            case "POWERUP_TAKEN" -> addLife();
        }
    }
}`,
    },
    {
      name: 'Template Method Pattern',
      location: 'GameScreen + subclasses',
      purpose: 'Skeleton cho các màn hình UI',
      description: 'GameScreen là abstract class định nghĩa template cho tất cả UI screens. Các subclass override update() và render() với logic riêng nhưng dùng chung các utility methods.',
      implementation: [
        'GameScreen là abstract class với abstract methods: update(), render()',
        'Concrete methods: drawButton(), drawTextButton() (dùng chung)',
        'Subclasses: MenuScreen, PausedScreen, NameInputScreen, LeaderboardScreen',
        'Mỗi subclass implement logic riêng cho update và render',
      ],
      code: `public abstract class GameScreen {
    protected Game game;
    protected Input input;
    
    public abstract void update();
    public abstract void render(Renderer renderer);
    
    // Template methods
    protected void drawButton(Graphics2D g, Rectangle rect, String text) { ... }
}`,
    },
    {
      name: 'Inheritance Hierarchy',
      location: 'GameObject hierarchy',
      purpose: 'Phân cấp các game objects',
      description: 'GameObject là base class cho tất cả entities. MovableObject extends GameObject cho các object có thể di chuyển. Brick hierarchy cho phép polymorphism khi xử lý các loại gạch khác nhau.',
      implementation: [
        'GameObject (abstract): x, y, width, height',
        'MovableObject (abstract): thêm velX, velY, Move()',
        'Concrete classes: Ball, Paddle, Bullet, Enemy',
        'Brick hierarchy: NormalBrick, StrongBrick, GhostBrick',
      ],
      benefits: ['Code reuse', 'Polymorphism', 'Extensibility', 'Type safety'],
    },
    {
      name: 'Factory Method Pattern',
      location: 'PowerUpSystem.spawnPowerUp()',
      purpose: 'Tạo PowerUp ngẫu nhiên',
      description: 'PowerUpSystem.spawnPowerUp() sử dụng Factory Method pattern để tạo random PowerUp mà không cần biết trước loại cụ thể. Xác suất spawn: 50%.',
      implementation: [
        'Random selection từ enum PowerUpType',
        'Encapsulation logic tạo object trong một method',
        'PowerUpType enum: WIDEN_PADDLE, EXTRA_LIFE, FAST_BALL, SHOOTING',
        'Spawn probability configurable (hiện tại 50%)',
      ],
      code: `public void spawnPowerUp(Game game, int x, int y) {
    if (Math.random() < 0.5f) {
        PowerUpType[] types = PowerUpType.values();
        PowerUpType randomType = types[(int)(Math.random() * types.length)];
        game.getPowerUps().add(new PowerUp(x, y, randomType));
    }
}`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-8">
          <h1 className="mb-2">Arkanoid Game - UML Class Diagram</h1>
          <p className="text-slate-600">
            Chi tiết thiết kế kiến trúc cho game Arkanoid với 38 classes, 8 packages và 5 design patterns
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="diagram">UML Diagram</TabsTrigger>
            <TabsTrigger value="packages">Packages Overview</TabsTrigger>
            <TabsTrigger value="patterns">Design Patterns</TabsTrigger>
          </TabsList>

          <TabsContent value="diagram">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Class Diagram</CardTitle>
                    <CardDescription>
                      38 classes được tổ chức trong 8 packages với đầy đủ relationships
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out">
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleResetZoom} title="Reset Zoom">
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In">
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <div className="px-3 py-2 bg-slate-100 rounded-md text-sm">
                      {Math.round(zoom * 100)}%
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!mermaidLoaded ? (
                  <div className="flex items-center justify-center h-96 bg-slate-50 rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-slate-600">Đang tải UML diagram...</p>
                    </div>
                  </div>
                ) : (
                  <div
                    ref={containerRef}
                    className="bg-white border border-slate-200 rounded-lg overflow-hidden relative"
                    style={{ height: '800px', cursor: isDragging ? 'grabbing' : 'grab' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                  >
                    <div
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                        transformOrigin: '0 0',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                      }}
                      className="p-8"
                      dangerouslySetInnerHTML={{ __html: diagramSvg }}
                    />
                  </div>
                )}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    💡 <strong>Hướng dẫn:</strong> Dùng chuột để kéo diagram, scroll để zoom in/out, hoặc dùng các nút zoom phía trên
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages">
            <div className="grid gap-6">
              {packages.map((pkg, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg font-mono">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {pkg.classes.map((className, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {className}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 text-sm text-slate-600">
                      <strong>{pkg.classes.length}</strong> classes
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardHeader>
                  <CardTitle>Tổng quan Architecture</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl mb-2">31</div>
                      <div className="text-sm text-slate-600">Total Classes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl mb-2">7</div>
                      <div className="text-sm text-slate-600">Packages</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl mb-2">5</div>
                      <div className="text-sm text-slate-600">Design Patterns</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patterns">
            <div className="grid gap-6">
              {designPatterns.map((pattern, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{pattern.name}</CardTitle>
                        <CardDescription className="mt-2">
                          <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                            {pattern.location}
                          </span>
                        </CardDescription>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {pattern.purpose}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-700">{pattern.description}</p>

                    <div>
                      <h4 className="mb-2 text-slate-900">Implementation:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                        {pattern.implementation.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {pattern.events && (
                      <div>
                        <h4 className="mb-2 text-slate-900">Events:</h4>
                        <div className="flex flex-wrap gap-2">
                          {pattern.events.map((event, idx) => (
                            <code key={idx} className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm">
                              {event}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}

                    {pattern.benefits && (
                      <div>
                        <h4 className="mb-2 text-slate-900">Benefits:</h4>
                        <div className="flex flex-wrap gap-2">
                          {pattern.benefits.map((benefit, idx) => (
                            <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {pattern.code && (
                      <div>
                        <h4 className="mb-2 text-slate-900">Code Example:</h4>
                        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{pattern.code}</code>
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
