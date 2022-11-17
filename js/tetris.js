//en este scrpit se aplica la funcionalidad mediante cuatro clases principales : game, utils , point y tetromino
//El static no se asocia a un objeto si no a una clase
class Game { 
    // Square length in pixels
    static SQUARE_LENGTH = screen.width > 420 ? 15 : 20; //la medida del cuadrado depende del tamaño de la pantalla
    //porejemplosi la pantalla es mayor a 420px va a ser de 30px o si no de 20
    static COLUMNS = 14;
    static ROWS = 26;
// por medio de este codigo se detemina el ancho y alto del tablero de tetris , teniendo en cuenta el ancho de la pantalla y el numero de filas y columnas
    static CANVAS_WIDTH = this.SQUARE_LENGTH * this.COLUMNS;
    static CANVAS_HEIGHT = this.SQUARE_LENGTH * this.ROWS;
    //Color del fondo del tablero
    static EMPTY_COLOR = "black";
    //Color de los bordes del tablero
    static BORDER_COLOR = "green";
    //Color a aplicar cuando se elimina una fila completa del tablero
    static DELETED_ROW_COLOR = "white";
    // When a piece collapses with something at its bottom, how many time wait for putting another piece? (in ms)
    static TIMEOUT_LOCK_PUT_NEXT_PIECE = 300; // tiempo en que se demora en aparecer la otra ficha
    // Speed of falling piece (in ms)
    static PIECE_SPEED = 300;// velocidad en que baja la ficha entre menor sea el numero , bajara mas rapido
    // Animation time when a row is being deleted
    static DELETE_ROW_ANIMATION = 300; // tiempo en el que se demora una fila en desaparecer cuando  se complete
    // Score to add when a square dissapears (for each square)
    static PER_SQUARE_SCORE = 1; //puntaje asignado por cada cuadro que se elimmine
    static COLORS = [ // colores de las fichas
        "#ffd300",
        "#de38c8",
        "#8afffb",
        "#ef98f5",
        "#2cf5b2",
        "#fc9777",
        "#ebdfe5",
        "#f50707",
        "#11f57a",
        "#00a9fe",
        "#fabd39",
        "#ae9ee8",
        "#c3e619",
        "#f92672",
        "#66d9ef",
        "#a6e22e",
        "#fd971f",
    ];
    


    //El método constructor es un metodo especial para crear e inicializar un objeto creado a partir de una clase.

    constructor(canvasId) {
        //variables
        this.canvasId = canvasId;
        this.timeoutFlag = false;
        this.board = [];
        this.existingPieces = [];
        this.globalX = 0;//averiguar
        this.globalY = 0;
        this.paused = true;
        this.currentFigure = null;
        this.sounds = {};
        this.canPlay = false;
        this.intervalId = null;
        this.init();
    }


    //En este metodo init , se inicializa los siguientes metodoso:
    init() {
        this.showWelcome();// da la bienvenidia al juego 
        this.initDomElements();//Muestra los botones del juego
        this.initSounds();//inicia el sonido de fondo al darle play al juego
        this.resetGame();//muestra el boton de reinicio del juego
        this.draw();//muestra el tablero de juego
        this.initControls();//da la funcionalidad de los distintos botones del juego
    }


    // este metodo reset reinica y pausa las funcionalidad de los elementos del juego
    resetGame() {
        this.score = 0;
        this.sounds.success.currentTime = 0;  //reinicia los sonidos
        this.sounds.success.pause();
        this.sounds.background.currentTime = 0;
        this.sounds.background.pause();
        this.initBoardAndExistingPieces(); 
        this.chooseRandomFigure(); //escoge una nueva ficha aleatoria
        this.restartGlobalXAndY(); //reinicia la posicion de la ficha
        this.syncExistingPiecesWithBoard(); //borra las fichas anteriores del tablero
        this.refreshScore();
        this.pauseGame();
    }

    //se crea una ventana emergente para dar la bienvenida y las instruciones del juego
    showWelcome() {
        Swal.fire({
            title: 'Bienvenidos!',
            text: ' Controles: "P" Pausar o reanudar "R"  Rotar, "Flechas de dirección " Mover figura hacia esa dirección, También puedes usar los botones si estás en móvil .',
            imageUrl: './Imagen/Tetris1.gif',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
            confirmButtonText: "OK",
            confirmButtonColor:"black",
            background: "yellow",
            color: "#000000",
            })
    }

//En este metodo se definen eventos como el keydown = presionar una tecla determinada , y establecer instrucciones en cada case para la direccion de la pieza
    initControls() {
        document.addEventListener("keydown", (e) => {//
            const { code } = e;  //se crea una constante "code" para que contenga la lista de moviminetos y opciones que tiene el juego
            if (!this.canPlay && code !== "KeyP") { // se tiene encuenta que canplay esta asignada inicialmente en el constructor y esta asignadada ccomo false
                return;
            }
            switch (code) {
                case "ArrowRight": //mover a la derecha despues de cada presion
                    this.attemptMoveRight();
                    break;
                case "ArrowLeft":
                    this.attemptMoveLeft(); //mover a a izquierda despues de cada presion
                    break;
                case "ArrowDown":
                    this.attemptMoveDown(); //mover para abajo despues de cada presion
                    break;
                case "KeyR":
                    this.attemptRotate(); //Rotar la ficha despues de cada presion
                    break;
                case "KeyP": 
                    this.pauseOrResumeGame(); //pausar el juego despues de cada presion
                    break;
            }
            this.syncExistingPiecesWithBoard(); //sincroniza las fichas en el tablero segun los movimientos que se le dieron
        });


        //mediante un nodo se trae del html el id de cada boton
        this.$btnDown.addEventListener("click", () => { //se utiliza un nodo para lllamar al id del boton que esta en el  html 
            if (!this.canPlay) return;
            this.attemptMoveDown();
        });
        this.$btnRight.addEventListener("click", () => {
            if (!this.canPlay) return;
            this.attemptMoveRight();
        });
        this.$btnLeft.addEventListener("click", () => {
            if (!this.canPlay) return;
            this.attemptMoveLeft();
        });
        this.$btnRotate.addEventListener("click", () => {
            if (!this.canPlay) return;
            this.attemptRotate();
        });
        [this.$btnPause, this.$btnResume].forEach($btn => $btn.addEventListener("click", () => {
            this.pauseOrResumeGame();
        }));
    }

    attemptMoveRight() {  //luego de darle un evento a cada tecla se le agrega un contador para que con cada presion en la tecla se le vaya sumando y asi se pueda ir moviendo la ficha en el tablero teniendo en cuenta la posicion ya sea x o y
        if (this.figureCanMoveRight()) {
            this.globalX++;
        }
    }

    attemptMoveLeft() {
        if (this.figureCanMoveLeft()) {
            this.globalX--; 
        }
    }

    attemptMoveDown() {
        if (this.figureCanMoveDown()) {
            this.globalY++;
        }
    }

    attemptRotate() { 
        this.rotateFigure();
    }

    pauseOrResumeGame() {  // en este metodo se utiliza los nodos  y tambien se utiliza el atributo hidden para que el boton de pausar o play se muestre dependiendo si esta en juego o si esta en pausa 
        if (this.paused) {
            this.resumeGame();
            this.$btnResume.hidden = true; //no se muestra el boton de play
            this.$btnPause.hidden = false; //se muestra el boton de stop
        } else {
            this.pauseGame();
            this.$btnResume.hidden = false; //se muestra el boton de play
            this.$btnPause.hidden = true; // no se muestra el boton de stop
        }
    }

    pauseGame() {
        this.sounds.background.pause(); // se pausa la cancion de fondo
        this.paused = true; 
        this.canPlay = false;
        clearInterval(this.intervalId); // el interval permite que la pieza baje,pero en este caso como el juego se pausa se agrega el clear para que limpie ese intervalo
    }

    resumeGame() {
        this.sounds.background.play(); // se reanude la cancion
        this.refreshScore(); // se muestra y actualiza el puntaje actual que lleva el jugador
        this.paused = false;
        this.canPlay = true;
        this.intervalId = setInterval(this.mainLoop.bind(this), Game.PIECE_SPEED); // cuando se vuelva a reanudar el juego, las piezas bajen de acuerdo a la velocidad que se establecio inicalmente, y el main loop es para que vya iteranndo varias veces 
    }


    moveFigurePointsToExistingPieces() {
        this.canPlay = false;
        for (const point of this.currentFigure.getPoints()) {
            point.x += this.globalX;
            point.y += this.globalY;
            this.existingPieces[point.y][point.x] = {
                //existing lo que hace es mediante el punto x y y ,mantener una posicion fija de la ficha en el tablero, teniendo en cuenta  la posicion global x  y y 
                taken: true,//cuando la ficha ya haya tocado el fondo del tablero de paso a la siguiente ficha
                color: point.color, //mantiene el color de la ficha cuando ya esta en una posicion fija del tablero
            }
        }
        this.restartGlobalXAndY();// este metodo permite detectar cuando la ficha toque su punto final en el tablero para despues generar una nueva ficha desde el punto cero "arriba del tablero"
        this.canPlay = true; // despues de que cada ficha toque su punto final siga dejando jugar
    }


    //funcion cuando pierde el jugador
    playerLoses() {
        // Check if there's something at Y 1. Maybe it is not fair for the player, but it works
        // Comprobar si hay algo en Y 1. Tal vez no sea justo para el jugador, pero funciona
        for (const point of this.existingPieces[1]) {
            //define la posicion minima que puede alcanzar la ficha en el tablero, en este caso la posicion minima quen puede llegar a tener es 1 "segunda linea del tetris"
            if (point.taken) { 
                return true; 
            }
        }
        return false; // puede seguir jugando
    }
    
// metodo se utiliza para eliminar una fila cuando sea completada
    getPointsToDelete = () => {
        const points = [];// se crea un arraylist para coleccionar los puntos cuando la fila sea eliminada horizontalmente "y"
        let y = 0;//crea una variable contadora para iniciar los puntos en 0
        for (const row of this.existingPieces) { //con este for se recorren todas las filas de las piezas existentes
            const isRowFull = row.every(point => point.taken); //el metodo Every Determina si todos los elementos en el array satisfacen una condición, en este caso verifica cada punto del tablero "cuadro" que contenga un elemento que ocupe ese espacio
            if (isRowFull) {
                // We only need the Y coordinate
                // Solo necesitamos la coordenada Y
                points.push(y); //El método push() añade uno o más elementos al final de un array , en este caso a la lista "points" y devuelve la nueva longitud del array.
                //si se cumple la condicion elimina la fila y suma 1 por cada cuadro eliminado de dicha fila
            }
            y++;
        }
        return points; //retorna los puntos a la constante points
    }

    // en este metodo se toman las coordenadas de los elementos que se encuentren en Y (filas) y se cambia el color de la fila cuando se completa y luego es elimminada
    changeDeletedRowColor(yCoordinates) {
        for (let y of yCoordinates) {
            for (const point of this.existingPieces[y]) {
                point.color = Game.DELETED_ROW_COLOR;
            }
        }
    };

// en este metodo se declara una operacion matematica donde se multiplica las columnas y las filas que son eliminadas y por ultimo se actucliza el puntaje
    addScore(rows) {
        this.score += Game.PER_SQUARE_SCORE * Game.COLUMNS * rows.length;
        this.refreshScore();
    }

// en este metodo finalmente es eliminada la fila del todo, vuelve a tomar el color determinado inicialmente del tablero
removeRowsFromExistingPieces(yCoordinates) {
    for (let y of yCoordinates) {
        for (const point of this.existingPieces[y]) {
            point.color = Game.EMPTY_COLOR;
            point.taken = false;// false es para que el espacio del tablero quede disponible para las siguientes fichas
        }
    }
}

// en este metodo se verifica y se elimina la fila completada 
    verifyAndDeleteFullRows() {
        const yCoordinates = this.getPointsToDelete(); // si la fila no tiene todos los cuadros ocupados , no se elimna nada y seguira jugando normal hasta que se complete una fila
        if (yCoordinates.length <= 0) return; 
        this.addScore(yCoordinates);//si se completa una fila : se reinicia los sonidos de elimianr
        this.sounds.success.currentTime = 0;
        this.sounds.success.play(); // se activa el sonido de la eliminacion de la fila
        this.changeDeletedRowColor(yCoordinates);
        this.canPlay = false; // se paraliza el juego hasta que la linea desaparezca
        
        // en el settime out se construye la animacion que va a eliminar la fila
        setTimeout(() => {
            this.sounds.success.pause();// se pausa el sonido de elimminar la fila
            this.removeRowsFromExistingPieces(yCoordinates);// se remueven las fichas existente en el tablero en el eje y
            this.syncExistingPiecesWithBoard();//sincroniza el espacio del tablero para que las fichas que quedan en el board ocupen este espacio 
            const invertedCoordinates = Array.from(yCoordinates);
            // Now the coordinates are in descending order
            invertedCoordinates.reverse();

            for (let yCoordinate of invertedCoordinates) {
                for (let y = Game.ROWS - 1; y >= 0; y--) {
                    for (let x = 0; x < this.existingPieces[y].length; x++) {
                        if (y < yCoordinate) {
                            let counter = 0;
                            let auxiliarY = y;
                            while (this.isEmptyPoint(x, auxiliarY + 1) && !this.absolutePointOutOfLimits(x, auxiliarY + 1) && counter < yCoordinates.length) {
                                this.existingPieces[auxiliarY + 1][x] = this.existingPieces[auxiliarY][x];
                                this.existingPieces[auxiliarY][x] = {
                                    color: Game.EMPTY_COLOR,
                                    taken: false,
                                }
                                
                                this.syncExistingPiecesWithBoard();
                                counter++;
                                auxiliarY++;
                            }
                        }
                    }
                }
            }

            this.syncExistingPiecesWithBoard()
            this.canPlay = true;
        }, Game.DELETE_ROW_ANIMATION);
    }
    
    mainLoop() {
        if (!this.canPlay) {
            return;
        }
        // If figure can move down, move down
        // si la ficha se puede mover hacia bajo , es porque aun no ha hecho contacto con otra pieza o suelo del tablero
        if (this.figureCanMoveDown()) {//se le suma 1 a la ficha por cada iteracion para que vaya desplazandose hacia abajo por el tablero
            this.globalY++;
        } else {
            // If figure cannot, then we start a timeout because
            // player can move figure to keep it going down
            // for example when the figure collapses with another points but there's remaining
            // space at the left or right and the player moves there so the figure can keep going down

            // Si la figura no puede bajar , entonces comenzamos un tiempo de espera para que se salga la siguiente ficha
            if (this.timeoutFlag) return;
            this.timeoutFlag = true;
            setTimeout(() => {
                this.timeoutFlag = false;
                // If the time expires, we re-check if figure cannot keep going down. If it can
                // (because player moved it) then we return and keep the loop
                // Si el tiempo expira, volvemos a verificar si la cifra no puede seguir bajando. si puede
                 // (porque el jugador lo movió) luego volvemos y mantenemos el ciclo
                if (this.figureCanMoveDown()) {
                    return;
                }
                // At this point, we know that the figure collapsed either with the floor
                // or with another point. So we move all the figure to the existing pieces array
                // En este punto, sabemos que la figura hizo contacto ya sea con el piso u otra figura
                 // Entonces movemos toda la figura al tablero de piezas existente
                this.sounds.tap.currentTime = 0;
                this.sounds.tap.play();
                this.moveFigurePointsToExistingPieces();//se activa la siguiente ficha para salir
                if (this.playerLoses()) { // se verifica constantemente el estado del jugador
                    //

                    Swal.fire({// si el jugador pierde se muestra un alerta de game over y da opcion de volbver a jugar
                        icon: 'error',
                        title: 'GAME OVER',
                        text: 'Volver a jugar',
                        confirmButtonColor:"black",
                        background: "yellow",
                        color: "#000000",
                      })
                    this.sounds.background.pause();
                    this.canPlay = false;
                    this.resetGame();
                    return;
                }
                //en caso de que no pierda vuelve a ejecutar los siguientes metodos
                this.verifyAndDeleteFullRows();
                this.chooseRandomFigure();
                this.syncExistingPiecesWithBoard();
            }, Game.TIMEOUT_LOCK_PUT_NEXT_PIECE);// tiempo en que se demora en aparecer la otra ficha
        }
        this.syncExistingPiecesWithBoard();//monta las fichas sobre el tablero
    }


//en este metodo se limpia el tablero , si hay piezas existentes las mantiene con el color original antes de ser eliminadas
    cleanGameBoardAndOverlapExistingPieces() {
        for (let y = 0; y < Game.ROWS; y++) {
            for (let x = 0; x < Game.COLUMNS; x++) {
                this.board[y][x] = {
                    color: Game.EMPTY_COLOR,
                    taken: false,
                };
                // Overlap existing piece if any
                // Superponer pieza existente si hay alguna
                if (this.existingPieces[y][x].taken) {
                    this.board[y][x].color = this.existingPieces[y][x].color;
                }
            }
        }
    }

    //mantener actualizada la posicion en el plano global y fijo del tablero
    overlapCurrentFigureOnGameBoard() {
        if (!this.currentFigure) return;
        for (const point of this.currentFigure.getPoints()) {
            this.board[point.y + this.globalY][point.x + this.globalX].color = point.color;
        }
    }

//sincroniza las fichas en el tablero mediante los dos metodos anteriores
    syncExistingPiecesWithBoard() {
        this.cleanGameBoardAndOverlapExistingPieces();
        this.overlapCurrentFigureOnGameBoard();
    }


    // este metodo draw se utilza para dibujar la figura del tablero en este caso , repitiendolo en pantalla en constantemente , en este caso cada 17 milisegundos
    draw() {
        let x = 0, y = 0;
        for (const row of this.board) {
            x = 0;
            for (const point of row) {
                this.canvasContext.fillStyle = point.color;
                this.canvasContext.fillRect(x, y, Game.SQUARE_LENGTH, Game.SQUARE_LENGTH);
                this.canvasContext.restore();
                this.canvasContext.strokeStyle = Game.BORDER_COLOR;
                this.canvasContext.strokeRect(x, y, Game.SQUARE_LENGTH, Game.SQUARE_LENGTH);
                x += Game.SQUARE_LENGTH;
            }
            y += Game.SQUARE_LENGTH;
        }
        setTimeout(() => {
            requestAnimationFrame(this.draw.bind(this));//el request animation frame informa al navegador que quieres realizar una animación y solicita que el navegador programe el repintado de la ventana para el próximo ciclo de animación. El método acepta como argumento una función a la que llamar antes de efectuar el repintado.
        }, 17);
    }


    //En este metodo se utiliza un nodo paraa traerlo del html y actualiza el puntaje a medidad que el juego corre
    refreshScore() {
        this.$score.textContent = `Score: ${this.score}`;
    }


    //en este metodo se inicializa todos los sonidos del juego
    initSounds() {
        this.sounds.background = Utils.loadSound("assets/coldplay.mp3", true);
        this.sounds.success = Utils.loadSound("assets/success.wav");
        this.sounds.denied = Utils.loadSound("assets/denied.wav");
        this.sounds.tap = Utils.loadSound("assets/tap.wav");
    }

    //inicializa todos los botones definidos en el html
    initDomElements() {
        this.$canvas = document.querySelector("#" + this.canvasId);
        this.$score = document.querySelector("#puntaje");
        this.$btnPause = document.querySelector("#btnPausar");
        this.$btnResume = document.querySelector("#btnIniciar");
        this.$btnRotate = document.querySelector("#btnRotar");
        this.$btnDown = document.querySelector("#btnAbajo");
        this.$btnRight = document.querySelector("#btnDerecha");
        this.$btnLeft = document.querySelector("#btnIzquierda");
        this.$canvas.setAttribute("width", Game.CANVAS_WIDTH + "px");
        this.$canvas.setAttribute("height", Game.CANVAS_HEIGHT + "px");
        this.canvasContext = this.$canvas.getContext("2d");
    }

    //en este metodo se utiliza el random para que aleatoriamente salga una figura al azar
    chooseRandomFigure() {
        this.currentFigure = this.getRandomFigure();
    }

    //se establece las posiciones para el inicio de cada figura tanto y como en x
    //siendo para Y posicion 0
    //para X posicion 5
    restartGlobalXAndY() {
        this.globalX = Math.floor(Game.COLUMNS / 2) - 1;
        this.globalY = 0;
    }


    getRandomFigure() {
        /*
        * Nombres de los tetrominós tomados de: https://www.joe.co.uk/gaming/tetris-block-names-221127
        * Regresamos una nueva instancia en cada ocasión, pues si definiéramos las figuras en constantes o variables, se tomaría la misma
        * referencia en algunas ocasiones
        * */
        switch (Utils.getRandomNumberInRange(1, 7)) {
            case 1:
                /*
                El cuadrado (smashboy)

                **
                **
                */
                return new Tetromino([
                    [new Point(0, 0), new Point(1, 0), new Point(0, 1), new Point(1, 1)]
                ]);
            case 2:

                /*
                La línea (hero)

                **
                */
                return new Tetromino([
                    [new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(3, 0)],
                    [new Point(0, 0), new Point(0, 1), new Point(0, 2), new Point(0, 3)],
                ]);
            case 3:

                /*
                La L (orange ricky)
                  *
                *

                */

                return new Tetromino([
                    [new Point(0, 1), new Point(1, 1), new Point(2, 1), new Point(2, 0)],
                    [new Point(0, 0), new Point(0, 1), new Point(0, 2), new Point(1, 2)],
                    [new Point(0, 0), new Point(0, 1), new Point(1, 0), new Point(2, 0)],
                    [new Point(0, 0), new Point(1, 0), new Point(1, 1), new Point(1, 2)],
                ]);
            case 4:

                /*
                La J (blue ricky)
                *
                *

                */

                return new Tetromino([
                    [new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(2, 1)],
                    [new Point(0, 0), new Point(1, 0), new Point(0, 1), new Point(0, 2)],
                    [new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(2, 1)],
                    [new Point(0, 2), new Point(1, 2), new Point(1, 1), new Point(1, 0)],
                ]);
            case 5:
                /*
               La Z (Cleveland Z)
               **
                **
               */

                return new Tetromino([
                    [new Point(0, 0), new Point(1, 0), new Point(1, 1), new Point(2, 1)],
                    [new Point(0, 1), new Point(1, 1), new Point(1, 0), new Point(0, 2)],
                ]);
            case 6:

                /*
               La otra Z (Rhode island Z)
                **
               **
               */
                return new Tetromino([
                    [new Point(0, 1), new Point(1, 1), new Point(1, 0), new Point(2, 0)],
                    [new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(1, 2)],
                ]);
            case 7:
            default:

                /*
               La T (Teewee)

                *
               *
               */
                return new Tetromino([
                    [new Point(0, 1), new Point(1, 1), new Point(1, 0), new Point(2, 1)],
                    [new Point(0, 0), new Point(0, 1), new Point(0, 2), new Point(1, 1)],
                    [new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(1, 1)],
                    [new Point(0, 1), new Point(1, 0), new Point(1, 1), new Point(1, 2)],
                ]);
        }
    }
 
    //en este metodo se limpia el tablero y las piezas existentes en el , para que estas puedan desplazarse en todo el tetris
    //verifica constantemente los espacios en x y y para confirmar que estos esten vacios y las piezas puedan desplazarse libremente

    initBoardAndExistingPieces() {
        this.board = [];
        this.existingPieces = [];
        for (let y = 0; y < Game.ROWS; y++) {
            this.board.push([]);
            this.existingPieces.push([]);
            for (let x = 0; x < Game.COLUMNS; x++) {
                this.board[y].push({
                    color: Game.EMPTY_COLOR,
                    taken: false,
                });
                this.existingPieces[y].push({
                    taken: false,
                    color: Game.EMPTY_COLOR,
                });
            }
        }
    }

    /**
     *
     * @param point An object that has x and y properties; the coordinates shouldn't be global, but relative to the point
     * @returns {boolean}
     */
    //punto Un objeto que tiene propiedades x e y; las coordenadas no deben ser globales, sino relativas al punto
    

    //En este metodo se establece una posicion relativa para las piezas y una absoluta para el tablero
    relativePointOutOfLimits(point) {
        const absoluteX = point.x + this.globalX;
        const absoluteY = point.y + this.globalY;
        return this.absolutePointOutOfLimits(absoluteX, absoluteY);
    }

    /**
     * @param absoluteX
     * @param absoluteY
     * @returns {boolean}
     */

    //delimita los puntos de colision que tiene la ficha , en el tablero
    absolutePointOutOfLimits(absoluteX, absoluteY) {
        return absoluteX < 0 || absoluteX > Game.COLUMNS - 1 || absoluteY < 0 || absoluteY > Game.ROWS - 1; //cuando x sea menor a 0 la ficha no se muestra
    }

    // It returns true even if the point is not valid (for example if it is out of limit, because it is not the function's responsibility)
    //  aunque el punto no sea válido Devuelve verdadero (por ejemplo si está fuera de límite, no es responsabilidad de la función)


    //este metodo verifica si hay espacios vacios en el tablero tanto en el eje x como en el y, de lo contrario se superpone una pieza sobre otra
    isEmptyPoint(x, y) {
        if (!this.existingPieces[y]) return true;
        if (!this.existingPieces[y][x]) return true;
        if (this.existingPieces[y][x].taken) {//taken se refiere a cuando la ficha esta puesta en una posicion fija del tablero
            return false;
        } else {
            return true;
        }
    }

     /**
      * Comprobar si un punto (en el tablero de juego) es válido para poner otro punto allí.
      * apuntar el punto a comprobar, con coordenadas relativas
      * apunta en el tablero los puntos que conforman una figura
      */
    isValidPoint(point, points) {
        const emptyPoint = this.isEmptyPoint(this.globalX + point.x, this.globalY + point.y);
        const hasSameCoordinateOfFigurePoint = points.findIndex(p => {
            return p.x === point.x && p.y === point.y;
        }) !== -1;
        const outOfLimits = this.relativePointOutOfLimits(point);
        if ((emptyPoint || hasSameCoordinateOfFigurePoint) && !outOfLimits) {
            return true;
        } else {
            return false;
        }
    }
//delimitar los movimientos del boton de derecha, para mantenerlo dentro del marco del canva
    figureCanMoveRight() {
        if (!this.currentFigure) return false;
        for (const point of this.currentFigure.getPoints()) {
            const newPoint = new Point(point.x + 1, point.y);//mientras que la ficha cuente con el espacio en cada uso de la tecla aumente de a uno 
            if (!this.isValidPoint(newPoint, this.currentFigure.getPoints())) {
                return false;//en caso de que no cuente con el espacio no lo mueva
            }
        }
        return true;
    }


    //delimitar los movimientos del boton de izquierda, para mantenerlo dentro del marco del canva
    figureCanMoveLeft() {
        if (!this.currentFigure) return false;
        for (const point of this.currentFigure.getPoints()) {
            const newPoint = new Point(point.x - 1, point.y);
            if (!this.isValidPoint(newPoint, this.currentFigure.getPoints())) {
                return false;
            }
        }
        return true;
    }

    //delimitar los movimientos del boton de bajar, para mantenerlo dentro del marco del canva
    figureCanMoveDown() {
        if (!this.currentFigure) return false;
        for (const point of this.currentFigure.getPoints()) {
            const newPoint = new Point(point.x, point.y + 1);
            if (!this.isValidPoint(newPoint, this.currentFigure.getPoints())) {
                return false;
            }
        }
        return true;
    }

    //delimitar los movimientos si la figura puede rotar, de lo contrario retorne falso
    figureCanRotate() {
        const newPointsAfterRotate = this.currentFigure.getNextRotation();
        for (const rotatedPoint of newPointsAfterRotate) {
            if (!this.isValidPoint(rotatedPoint, this.currentFigure.getPoints())) {
                return false;
            }
        }
        return true;
    }

//en este metodo se activan los sonidos en el caso en que la figura no se puede rotar 
    rotateFigure() {
        if (!this.figureCanRotate()) {
            this.sounds.denied.currentTime = 0;
            this.sounds.denied.play();
            return;
        }
        this.currentFigure.points = this.currentFigure.getNextRotation();
        this.currentFigure.incrementRotationIndex();
    }
//se crea el alert para confirmas si el jugador quiere reinicarl el juego
        async askUserConfirmResetGame() {
            this.pauseGame();
            Swal.fire({
                title: 'Quieres reiniciar el juego?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, reiniciar',
                confirmButtonColor:"black",
                background: "yellow",
                color: "#000000",
              }).then((result) => {
                if (result.isConfirmed) {
                    this.resetGame();
                  Swal.fire(
                    'Reiniciado!',
                    'El juego ha sido reiniciado.',
                    'success'
                  )
                } else {
                        this.resumeGame();
                    }
                //location.reload();
                
              })
    
            
        }
}
//Encierra funciones que se van a reutilizar a lo largo del juego 
class Utils {
    //se utiliza el metodo getnumberrange para generar un numero aleatorio en un rango 
    static getRandomNumberInRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    //A partir de la funcion getrandomnumberinrange se elige un color  de game.color
    static getRandomColor() {
        return Game.COLORS[Utils.getRandomNumberInRange(0, Game.COLORS.length - 1)];
    }

    //carga un sonido para el juego 
    static loadSound(src, loop) {
        const sound = document.createElement("audio");
        sound.src = src;
        sound.setAttribute("preload", "auto");
        sound.setAttribute("controls", "none");
        sound.loop = loop || false;
        sound.style.display = "none";
        document.body.appendChild(sound);
        return sound;
    }
}


// esta clase se la aplican dos coordenadas  x o y de las fichas del tetris 
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}


//Se aplican las rotaciones que son las figuras que representan al tetromino(forma geometrica compuesta por 4 cuadrados iguales)
class Tetromino {
    //en el constructo se reciben las rotaciones posibles de las figuras 
    constructor(rotations) {
        this.rotations = rotations;
        this.rotationIndex = 0;
        this.points = this.rotations[this.rotationIndex];
        const randomColor = Utils.getRandomColor();// se aplica un color aleatorio mediante el metodo getrandomcolor 
        this.rotations.forEach(points => { // para cada punto de rotacion se utiliza el foreach aplicando un color aleatorio
            points.forEach(point => {
                point.color = randomColor;
            });
        });
        this.incrementRotationIndex();//como se cambia la rotacion se incrementa el indice de rotacion AVERIGUAR
    }
    
    //Devulve los puntos del tetromino
    getPoints() {
        return this.points;
    }
    

    //Al incrementar el indice de rotacion lo que hace es que si el indice se va a pasar , los regresa a cero y sino lo aumenta en uno
    incrementRotationIndex() {
        if (this.rotations.length <= 0) {
            this.rotationIndex = 0;
        } else {
            if (this.rotationIndex + 1 >= this.rotations.length) {
                this.rotationIndex = 0;
            } else {
                this.rotationIndex++;
            }
        }
    }


    //si obtiene la siguiente rotacion , lo que hace es regresar la rotacion en el siguiente indice 
    getNextRotation() {
        return this.rotations[this.rotationIndex];
    }

}

//Se crea una nueva instacia del juego pasandole el id del elemento en donde se debe dibujar 
const game = new Game("canvas");//el canvas llamado hace referencia al id de la etiqueta canvas en el html
document.querySelector("#reset").addEventListener("click", () => {
    //se llama al reset con el # para preguntarle si quiere reinicar el juego
    game.askUserConfirmResetGame();
});
