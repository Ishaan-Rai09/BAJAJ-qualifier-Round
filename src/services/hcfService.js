/**
 * Compute HCF (GCD) of an array of positive integers.
 * @param {number[]} arr - Array of positive integers
 * @returns {number} HCF
 */
function hcfService(arr) {
    return arr.reduce((acc, val) => gcd(acc, val));
}

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

module.exports = hcfService;
