document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const wordSearchForm = document.getElementById('word-search-form');
    const puzzlePreview = document.getElementById('puzzle-preview');
    const actionButtons = document.querySelector('.action-buttons');
    const showSolutionBtn = document.getElementById('show-solution');
    const printPuzzleBtn = document.getElementById('print-puzzle');
    const savePuzzleBtn = document.getElementById('save-puzzle');
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.puzzle-section');

    let currentPuzzle = null;
    let showingSolution = false;
    let isSelecting = false;
    let selectedCells = new Set();
    let foundWords = new Set();
    let startCell = null;
    let currentWord = '';  // Add this to track current selection

    // Navigation
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show selected section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === type) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Word Search Generation
    wordSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const size = parseInt(document.getElementById('puzzle-size').value);
        const words = document.getElementById('word-list').value
            .split('\n')
            .filter(word => word.trim().length > 0);

        if (words.length === 0) {
            alert('Please enter at least one word');
            return;
        }

        const wordSearch = new WordSearch(size);
        currentPuzzle = wordSearch.generatePuzzle(words);
        
        renderPuzzle(currentPuzzle.grid);
        actionButtons.classList.remove('hidden');

        // Hide the input section after generating puzzle
        document.querySelector('.input-section').style.display = 'none';
        document.querySelector('.puzzle-section.active').style.gridTemplateColumns = '1fr';
    });

    // Show/Hide Solution
    showSolutionBtn.addEventListener('click', () => {
        if (!currentPuzzle) return;
        
        showingSolution = !showingSolution;
        showSolutionBtn.textContent = showingSolution ? 'Hide Solution' : 'Show Solution';
        
        const cells = puzzlePreview.querySelectorAll('.puzzle-cell');
        cells.forEach((cell, index) => {
            const y = Math.floor(index / currentPuzzle.grid.length);
            const x = index % currentPuzzle.grid.length;
            
            if (showingSolution && currentPuzzle.solution[y][x]) {
                cell.style.backgroundColor = 'var(--accent-color)';
            } else if (cell.classList.contains('found')) {
                cell.style.backgroundColor = '#E36414';  // Keep found words highlighted
            } else {
                cell.style.backgroundColor = 'var(--secondary-color)';
            }
        });
    });

    // Print Puzzle
    printPuzzleBtn.addEventListener('click', () => {
        window.print();
    });

    // Save Puzzle
    savePuzzleBtn.addEventListener('click', () => {
        if (!currentPuzzle) return;

        const puzzles = JSON.parse(localStorage.getItem('savedPuzzles') || '[]');
        puzzles.push({
            id: Date.now(),
            date: new Date().toISOString(),
            size: currentPuzzle.grid.length,
            grid: currentPuzzle.grid,
            solution: currentPuzzle.solution
        });
        
        localStorage.setItem('savedPuzzles', JSON.stringify(puzzles));
        alert('Puzzle saved!');
        loadSavedPuzzles();
    });

    // Render puzzle grid
    function renderPuzzle(grid) {
        puzzlePreview.innerHTML = '';
        foundWords.clear();
        currentWord = '';
        
        // Add data-size attribute for CSS scaling
        puzzlePreview.setAttribute('data-size', grid.length);
        puzzlePreview.style.gridTemplateColumns = `repeat(${grid.length}, 28px)`;

        grid.forEach((row, y) => {
            row.forEach((letter, x) => {
                const cell = document.createElement('div');
                cell.className = 'puzzle-cell';
                cell.textContent = letter;
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                // Add click handler for each cell
                cell.addEventListener('click', () => toggleCell(cell));
                
                puzzlePreview.appendChild(cell);
            });
        });

        updateWordList();
    }

    function toggleCell(cell) {
        if (cell.classList.contains('selected')) {
            // Deselect cell
            cell.classList.remove('selected');
            selectedCells.delete(cell);
            
            // Rebuild current word from remaining selected cells
            currentWord = Array.from(selectedCells)
                .sort((a, b) => {
                    const aIndex = parseInt(a.dataset.x) + parseInt(a.dataset.y) * currentPuzzle.grid.length;
                    const bIndex = parseInt(b.dataset.x) + parseInt(b.dataset.y) * currentPuzzle.grid.length;
                    return aIndex - bIndex;
                })
                .map(cell => cell.textContent)
                .join('');
        } else {
            // Select cell
            cell.classList.add('selected');
            selectedCells.add(cell);
            
            // Update current word
            currentWord = Array.from(selectedCells)
                .sort((a, b) => {
                    const aIndex = parseInt(a.dataset.x) + parseInt(a.dataset.y) * currentPuzzle.grid.length;
                    const bIndex = parseInt(b.dataset.x) + parseInt(b.dataset.y) * currentPuzzle.grid.length;
                    return aIndex - bIndex;
                })
                .map(cell => cell.textContent)
                .join('');
        }

        // Check if current selection forms a word
        checkWord(currentWord);
    }

    function checkWord(selectedWord) {
        // Check both forward and backward
        const forwardWord = selectedWord;
        const backwardWord = selectedWord.split('').reverse().join('');
        
        let foundWord = null;
        if (currentPuzzle.words.includes(forwardWord)) {
            foundWord = forwardWord;
        } else if (currentPuzzle.words.includes(backwardWord)) {
            foundWord = backwardWord;
        }

        if (foundWord && !foundWords.has(foundWord)) {
            foundWords.add(foundWord);
            selectedCells.forEach(cell => {
                cell.classList.remove('selected');
                cell.classList.add('found');
                cell.style.backgroundColor = '#E36414';
            });
            selectedCells.clear();
            currentWord = '';
            updateWordList();
            checkVictory();
        }
    }

    function checkVictory() {
        if (foundWords.size === currentPuzzle.words.length) {
            showVictoryScreen();
        }
    }

    function showVictoryScreen() {
        const victoryDiv = document.createElement('div');
        victoryDiv.className = 'victory-screen';
        victoryDiv.innerHTML = `
            <div class="victory-content">
                <h2>Congratulations!</h2>
                <p>You found all ${foundWords.size} words!</p>
                <button class="new-puzzle-btn">Create New Puzzle</button>
            </div>
        `;
        
        document.body.appendChild(victoryDiv);
        
        victoryDiv.querySelector('.new-puzzle-btn').addEventListener('click', () => {
            // Show the input section again
            document.querySelector('.input-section').style.display = 'block';
            document.querySelector('.puzzle-section.active').style.gridTemplateColumns = '1fr 2fr';
            
            // Reset the form
            document.getElementById('word-list').value = '';
            
            // Remove victory screen and word list
            victoryDiv.remove();
            document.querySelector('.word-list')?.remove();
            
            // Clear the puzzle preview
            puzzlePreview.innerHTML = '';
            actionButtons.classList.add('hidden');
        });
    }

    function updateWordList() {
        const existingWordList = document.querySelector('.word-list');
        if (existingWordList) {
            existingWordList.remove();
        }

        const wordListDiv = document.createElement('div');
        wordListDiv.className = 'word-list';
        wordListDiv.innerHTML = `
            <h3>Words to Find (${foundWords.size}/${currentPuzzle.words.length})</h3>
            <div class="words">
                ${currentPuzzle.words.map(word => 
                    `<span class="word ${foundWords.has(word) ? 'found' : ''}">${word}</span>`
                ).join('')}
            </div>
        `;
        puzzlePreview.parentElement.appendChild(wordListDiv);
    }

    // Load saved puzzles
    function loadSavedPuzzles() {
        const savedPuzzlesList = document.getElementById('saved-puzzles-list');
        const puzzles = JSON.parse(localStorage.getItem('savedPuzzles') || '[]');

        savedPuzzlesList.innerHTML = puzzles.length === 0 
            ? '<p>No saved puzzles yet.</p>'
            : puzzles.map(puzzle => `
                <div class="saved-puzzle">
                    <p>Created: ${new Date(puzzle.date).toLocaleDateString()}</p>
                    <p>Size: ${puzzle.size}x${puzzle.size}</p>
                    <button onclick="loadPuzzle(${puzzle.id})">Load</button>
                    <button onclick="deletePuzzle(${puzzle.id})">Delete</button>
                </div>
            `).join('');
    }

    // Initial load of saved puzzles
    loadSavedPuzzles();
});

// Global functions for saved puzzles
function loadPuzzle(id) {
    const puzzles = JSON.parse(localStorage.getItem('savedPuzzles') || '[]');
    const puzzle = puzzles.find(p => p.id === id);
    if (puzzle) {
        currentPuzzle = puzzle;
        renderPuzzle(puzzle.grid);
        document.querySelector('[data-type="word-search"]').click();
    }
}

function deletePuzzle(id) {
    if (confirm('Are you sure you want to delete this puzzle?')) {
        const puzzles = JSON.parse(localStorage.getItem('savedPuzzles') || '[]');
        localStorage.setItem('savedPuzzles', 
            JSON.stringify(puzzles.filter(p => p.id !== id))
        );
        loadSavedPuzzles();
    }
} 