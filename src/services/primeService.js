/**
 * Filter prime numbers from an array.
 * @param {number[]} arr - Array of integers
 * @returns {number[]} Array of prime numbers
 */
function primeService(arr) {
    return arr.filter(isPrime);
}

function isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

module.exports = primeService;
