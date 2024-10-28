document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const scoreList = document.getElementById("score-list");
    const resetBtn = document.getElementById("reset-btn");
    const resetScoresBtn = document.getElementById("reset-scores-btn"); // Nuevo botón
  
    let playerTurn = true; // El jugador siempre empieza
    let gameActive = true; // Estado del juego
    let startTime; // Tiempo de inicio
  
    // Inicializa el estado del tablero
    const boardState = Array(9).fill(null);
    let bestScores = JSON.parse(localStorage.getItem("bestScores")) || [];
  
    // Iniciar el juego
    cells.forEach(cell => {
      cell.addEventListener("click", handlePlayerMove);
    });
    resetBtn.addEventListener("click", resetGame);
    resetScoresBtn.addEventListener("click", resetScores); // Evento para reiniciar resultados
  
    // Función para manejar el movimiento del jugador
    function handlePlayerMove(event) {
      if (!gameActive || !playerTurn) return;
      const cellIndex = event.target.getAttribute("data-index");
      if (boardState[cellIndex]) return;
  
      boardState[cellIndex] = "X"; // Marcar la casilla con "X"
      event.target.textContent = "X"; // Mostrar "X" en la celda
      
      if (!startTime) startTime = new Date(); // Iniciar el temporizador
  
      if (checkWinner("X")) endGame("Jugador"); // Verificar si el jugador ganó
      else if (boardState.includes(null)) {
        playerTurn = false;
        setTimeout(handleComputerMove, 500); // Esperar antes de que la computadora juegue
      }
    }
  
    // Función para manejar el movimiento de la computadora
    function handleComputerMove() {
      if (!gameActive) return;
      let emptyCells = boardState
        .map((val, idx) => (val === null ? idx : null))
        .filter(val => val !== null);
      
      let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      boardState[randomIndex] = "O"; // Marcar la casilla con "O"
      cells[randomIndex].textContent = "O"; // Mostrar "O" en la celda
      
      if (checkWinner("O")) endGame("Computadora"); // Verificar si la computadora ganó
      else playerTurn = true; // Volver el turno al jugador
    }
  
    // Verificar si hay un ganador
    function checkWinner(player) {
      const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];
      return winningCombinations.some(combination =>
        combination.every(index => boardState[index] === player)
      );
    }
  
    // Terminar el juego
    function endGame(winner) {
      gameActive = false; // Detener el juego
      if (winner === "Jugador") {
        const endTime = new Date();
        const timeTaken = (endTime - startTime) / 1000; // Calcular el tiempo de la partida
        const playerName = prompt("¡Ganaste! Ingresa tu nombre:");
        if (playerName) {
          bestScores.push({ name: playerName, time: timeTaken, date: new Date() });
          bestScores.sort((a, b) => a.time - b.time);
          bestScores = bestScores.slice(0, 10);
          localStorage.setItem("bestScores", JSON.stringify(bestScores));
        }
      }
      renderScores(); // Renderizar los mejores tiempos
    }
  
    // Reiniciar el juego
    function resetGame() {
      boardState.fill(null); // Limpiar el estado del tablero
      cells.forEach(cell => (cell.textContent = "")); // Limpiar las celdas
      playerTurn = true; // El jugador comienza
      gameActive = true; // Habilitar el juego
      startTime = null; // Reiniciar el temporizador
    }
  
    // Reiniciar resultados
    function resetScores() {
      bestScores = []; // Limpiar los mejores tiempos
      localStorage.removeItem("bestScores"); // Eliminar de LocalStorage
      renderScores(); // Volver a renderizar la lista
    }
  
    // Renderizar los mejores tiempos
    function renderScores() {
      scoreList.innerHTML = ""; // Limpiar la lista de puntuaciones
      bestScores.forEach(score => {
        const li = document.createElement("li");
        li.textContent = `${score.name}: ${score.time.toFixed(2)}s - ${new Date(score.date).toLocaleString()}`;
        scoreList.appendChild(li);
      });
    }
  
    // Cargar los mejores tiempos al inicio
    renderScores();
  });
  