/**
 * Generate Fibonacci series of n numbers.
 * @param {number} n - Positive integer <= 1000
 * @returns {number[]} Fibonacci series
 */
function fibonacciService(n) {
    const series = [];
    for (let i = 0; i < n; i++) {
        if (i === 0) series.push(0);
        else if (i === 1) series.push(1);
        else series.push(series[i - 1] + series[i - 2]);
    }
    return series;
}

module.exports = fibonacciService;
