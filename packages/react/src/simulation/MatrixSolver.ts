/**
 * Simple Matrix Solver for Modified Nodal Analysis
 * Solves Ax = b using Gaussian elimination with partial pivoting
 */

export class MatrixSolver {
    /**
     * Solve the linear system Ax = b
     * @param A - Coefficient matrix (n x n)
     * @param b - Right-hand side vector (n x 1)
     * @returns Solution vector x
     */
    static solve(A: number[][], b: number[]): number[] {
        const n = A.length;

        // Create augmented matrix [A|b]
        const aug: number[][] = A.map((row, i) => [...row, b[i]]);

        // Forward elimination with partial pivoting
        for (let col = 0; col < n; col++) {
            // Find pivot (largest absolute value in column)
            let maxRow = col;
            for (let row = col + 1; row < n; row++) {
                if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) {
                    maxRow = row;
                }
            }

            // Swap rows
            if (maxRow !== col) {
                [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
            }

            // Check for singular matrix
            if (Math.abs(aug[col][col]) < 1e-10) {
                console.warn(`Matrix is singular or nearly singular at column ${col}`);
                continue;
            }

            // Eliminate column below pivot
            for (let row = col + 1; row < n; row++) {
                const factor = aug[row][col] / aug[col][col];
                for (let j = col; j <= n; j++) {
                    aug[row][j] -= factor * aug[col][j];
                }
            }
        }

        // Back substitution
        const x: number[] = new Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            let sum = aug[i][n];
            for (let j = i + 1; j < n; j++) {
                sum -= aug[i][j] * x[j];
            }
            x[i] = Math.abs(aug[i][i]) > 1e-10 ? sum / aug[i][i] : 0;
        }

        return x;
    }

    /**
     * Create a zero matrix
     */
    static zeros(rows: number, cols: number): number[][] {
        return Array(rows).fill(0).map(() => Array(cols).fill(0));
    }

    /**
     * Create a zero vector
     */
    static zeroVector(size: number): number[] {
        return Array(size).fill(0);
    }
}
