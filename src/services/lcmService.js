/**
 * Compute LCM of an array of positive integers.
 * @param {number[]} arr - Array of positive integers
 * @returns {number} LCM
 */
function lcmService(arr) {
    return arr.reduce((acc, val) => lcm(acc, val));
}

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

function lcm(a, b) {
    return (a / gcd(a, b)) * b;
}

module.exports = lcmService;
