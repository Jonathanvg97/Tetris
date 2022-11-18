# Tetris
Para la creacion de este tetris nos guiamos de un repositorio el cual esta conformado de un archivo HTML, Donde anclamos todos los script necesarios
para los estilos y la funcionalidad de la misma.

En el html se dividio en Div,  el primero ocupa el espacio del titulo del tetris, y la barra de puntaje donde se muestra el score del jugador, un div con una
ventana emergente donde nos da la bienvenida al juego y nos indica cuales son las teclas que debemos utilizar para reproducir el juego, para el desarrollo del tablero se 
utilizo un canvas que le dimos un alto y un ancho para  obtener la dimesion necesaria para el desarrollo de las piezas en la misma, por ultimo agregamos un div contenedor
de los botones para manejar dicho juego conformado por 5 botones principales donde tenemos el play y el pause del juego  3 botones con la direccion de las flechas un boton para rotar 
las piezas y por ultimo el boton de reset del juego

<img width="709" alt="image" src="https://user-images.githubusercontent.com/114879421/202710420-5c42ce58-addf-4c4f-a0ad-31706bd3c5d8.png">


En la hoja de estilos, style.css implementamos generalmente los siguientes estilos:
<img width="259" alt="image" src="https://user-images.githubusercontent.com/114879421/202713517-2d976430-64e7-4c32-b5f7-f954e5ec8afe.png">

para el body, utilizamos un badground general con una imagen sin fondo para lograr el efecto que ven en fondo principal se repitio 2 veces eb el eje x para que el vanvas querada
centrado entre ambas imagenes.
<img width="367" alt="image" src="https://user-images.githubusercontent.com/114879421/202713853-80b03956-05d4-4f83-8f41-3969479bdbaa.png">

para los botones utilizamos las siguientes propiedades para darle la forma redonda de los mismos y el color para resaltarlo del fondo anterior 

<img width="268" alt="image" src="https://user-images.githubusercontent.com/114879421/202714056-d41ae490-f9ef-4928-82ef-0ef51aec4a28.png">

por ultimo se aplico el tamaño de la letra y el estilo con los colores necesarios para que todo este espacio tuviera la armonia necesaria.

<img width="272" alt="image" src="https://user-images.githubusercontent.com/114879421/202714336-bafc3d76-8b6d-434c-bd45-bff78ecf372f.png">

Para la Funcionalidad de la misma utilizamos una sola hoja de JS,  en este script  se aplico la funcionalidad mediante cuatro clases principales : 
Game
Utils 
Point 
Tetromino

Cada una de ellas a su vez contiene diferentes elementos que permiten el correcto despliegue del juego tetris, usando métodos, static o constructores,

STATIC: La palabra clave static define un método estático para una clase
CONSTRUCTOR: Es un método especial para crear e inicializar un objeto creado a partir de una clase. Los objetos en JavaScript son colecciones dinámicas.

En el metodo static, se implemento la dimesion de las columnas y las filas en el tablero, los colores de la fichas y la velocidad de los mismo:
SQUARE_LENGHT = medida del cuadrado depende del tamaño de la pantalla,logrando así la adaptación del tablero.

COLUMNS = Número de columnas que tiene el canva, éste varía según el tamaño  de la pantalla donde se inicie el juego.

ROWS = Número de filas que conforman el tablero.

CANVAS_WIDTH y CANVAS_HEIGHT = Se determina el ancho y alto del tablero de tetris , teniendo en cuenta el ancho de la pantalla y el número de filas y columnas.

EMPTY_COLOR = Ésta variable indica el color del fondo del tablero.

BORDER_COLOR = Mediante ésta variable se establece el color de los bordes y las líneas que dividen el tablero en filas y columnas.

DELETED_ROW_COLOR = color que toma la fila que complete y toma éste color declarado antes de eliminarse 

TIMEOUT_LOCK_PUT_NEXT_PIECE = Determina el Tiempo en que se demora en aparecer la otra ficha, es establecido en microsegundos.

PIECE_SPEED = Indica la Velocidad en que baja la ficha.

DELETE_ROW_ANIMATION  = Indica tiempo en el que se demora una fila en desaparecer cuando  se complete.

PER_SQUARE_SCORE = Guarda el valor del puntaje asignado por cada cuadro que se elimine.

COLORS = Éste array contiene la lista de los colores que dibujaran las piezas en el tablero, llamados aleatoriamente igual.

Para el contructor lleva como parametro CanvasId, estos 11 objetos cuentan con un dato,cuyo valor se ve reflejado en booleanos, arrays, números, null o métodos.

En la clase Game se utilizaron los siguientes metodos:

init(){}
resetGame(){}
showWelcome(){}
initControls(){}
attemptMoveRight(){}
attemptMoveLeft(){}
attemptMoveDown(){}
attemptRotate(){}
pauseOrResumeGame(){}
hidden = false indica que no se esconda el elemento y el hidden = true indica que si se esconda el elemento.
pauseGame(){}
resumeGame(){}
moveFigureToExistingPieces(){}
playerLoses(){}
getPointsToDelete(){}
changeDeletedRowColor(){}
addScore(){}
removeRowsFromExistingPieces(){}
verifyAndDeleteFullRows(){}
mainLoop(){}
cleanGameBoardAndOverlapExistingPieces(){}
overlapCurrentFigureOnGameBoard(){}
syncExistingPiecesWithBoard(){}
draw(){}
refreshScore(){}
initSounds(){}
initDomElements(){}
chooseRandomFigure(){}
restartGlobalXAndY(){}
getRandomFigure(){};
initBoardAndExistingPieces(){}
relativePointOutOfLimits(){}
absolutePointOutOfLimits(){}
isEmptyPoint(){};
isValidPoint(){};
figureCanMoveRight
figureCanMoveLeft
figureCanMoveDown
figureCanRotate
rotateFigure
async askUserConfirmResetGame()

La Clase  Utils, contine funciones que se utilizan o son llamadas a lo largo del juego
y contieene 3 STATIC:

getRandomNumberInRang,
getRandomColor,
loadSound,

La Clase  Point, contiene un constructor que tiene como parametro los ejes del tablero "Y" y "X"

La clase Tetromino, posee la cantidad de movimientos o rotaciones que pueda tener la ficha 


Tambien se le implementaron unas alertas  traidas de una libreria JS, para La Bienvenida al juego, reset y para el game-over del juego.





