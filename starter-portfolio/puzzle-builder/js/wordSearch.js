class WordSearch {
    constructor(size) {
        this.size = size;
        this.grid = Array(size).fill().map(() => Array(size).fill(''));
        this.solution = Array(size).fill().map(() => Array(size).fill(false));
        this.words = [];
        this.wordLocations = new Map();
        this.directions = [
            [0, 1],   // right
            [1, 0],   // down
            [1, 1],   // diagonal down-right
            [-1, 1],  // diagonal up-right
            [0, -1],  // left
            [-1, 0],  // up
            [-1, -1], // diagonal up-left
            [1, -1]   // diagonal down-left
        ];
    }

    generatePuzzle(words) {
        // Clean and validate words
        this.words = words
            .map(word => word.trim().toUpperCase())
            .filter(word => word.length > 0 && word.length <= this.size);

        // Try to place each word
        for (let word of this.words) {
            let placed = false;
            let attempts = 0;
            const maxAttempts = 100;

            while (!placed && attempts < maxAttempts) {
                const direction = this.directions[Math.floor(Math.random() * this.directions.length)];
                const position = this.findValidPosition(word, direction);

                if (position) {
                    this.placeWord(word, position, direction);
                    placed = true;
                }
                attempts++;
            }

            if (!placed) {
                console.warn(`Could not place word: ${word}`);
                // Remove word from list if it couldn't be placed
                this.words = this.words.filter(w => w !== word);
            }
        }

        this.fillEmptySpaces();
        
        return {
            grid: this.grid,
            solution: this.solution,
            words: this.words,
            wordLocations: this.wordLocations
        };
    }

    findValidPosition(word, [dx, dy]) {
        const maxTries = 50;
        for (let attempt = 0; attempt < maxTries; attempt++) {
            const x = Math.floor(Math.random() * this.size);
            const y = Math.floor(Math.random() * this.size);

            if (this.canPlaceWord(word, x, y, dx, dy)) {
                return [x, y];
            }
        }
        return null;
    }

    canPlaceWord(word, x, y, dx, dy) {
        // Check if word would go out of bounds
        if (x + dx * (word.length - 1) >= this.size || 
            x + dx * (word.length - 1) < 0 ||
            y + dy * (word.length - 1) >= this.size || 
            y + dy * (word.length - 1) < 0) {
            return false;
        }

        // Check if space is available
        for (let i = 0; i < word.length; i++) {
            const currentX = x + dx * i;
            const currentY = y + dy * i;
            const currentCell = this.grid[currentY][currentX];
            
            if (currentCell && currentCell !== word[i]) {
                return false;
            }
        }

        return true;
    }

    placeWord(word, [x, y], [dx, dy]) {
        const positions = [];
        for (let i = 0; i < word.length; i++) {
            const currentX = x + dx * i;
            const currentY = y + dy * i;
            this.grid[currentY][currentX] = word[i];
            this.solution[currentY][currentX] = true;
            positions.push([currentY, currentX]);
        }
        this.wordLocations.set(word, positions);
    }

    fillEmptySpaces() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (!this.grid[y][x]) {
                    this.grid[y][x] = letters[Math.floor(Math.random() * letters.length)];
                }
            }
        }
    }
} 