const ALLOWED_KEYS = ['fibonacci', 'prime', 'lcm', 'hcf', 'AI'];
const MAX_ARRAY_LENGTH = 1000;
const MAX_FIBONACCI_N = 1000;
const MAX_STRING_LENGTH = 500;

function validateBfhlInput(body) {
    // Check empty body
    if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
        return { valid: false, status: 400, error: 'Request body must be a non-empty JSON object' };
    }

    // Check exactly one key
    const keys = Object.keys(body).filter(k => ALLOWED_KEYS.includes(k));
    const extraKeys = Object.keys(body).filter(k => !ALLOWED_KEYS.includes(k));

    if (extraKeys.length > 0) {
        return { valid: false, status: 400, error: `Unknown key(s): ${extraKeys.join(', ')}. Allowed keys: ${ALLOWED_KEYS.join(', ')}` };
    }

    if (keys.length === 0) {
        return { valid: false, status: 400, error: `No valid key found. Allowed keys: ${ALLOWED_KEYS.join(', ')}` };
    }

    if (keys.length > 1) {
        return { valid: false, status: 400, error: 'Exactly one key must be present in the request body' };
    }

    const key = keys[0];
    const value = body[key];

    // Validate per key type
    switch (key) {
        case 'fibonacci': {
            if (!Number.isInteger(value) || value <= 0) {
                return { valid: false, status: 422, error: 'fibonacci must be a positive integer' };
            }
            if (value > MAX_FIBONACCI_N) {
                return { valid: false, status: 422, error: `fibonacci value must be <= ${MAX_FIBONACCI_N}` };
            }
            break;
        }

        case 'prime':
        case 'lcm':
        case 'hcf': {
            if (!Array.isArray(value)) {
                return { valid: false, status: 422, error: `${key} must be an array of integers` };
            }
            if (value.length === 0) {
                return { valid: false, status: 422, error: `${key} array must not be empty` };
            }
            if (value.length > MAX_ARRAY_LENGTH) {
                return { valid: false, status: 422, error: `${key} array must have at most ${MAX_ARRAY_LENGTH} elements` };
            }
            for (let i = 0; i < value.length; i++) {
                if (!Number.isInteger(value[i])) {
                    return { valid: false, status: 422, error: `${key} array must contain only integers (index ${i} is invalid)` };
                }
            }
            if ((key === 'lcm' || key === 'hcf') && value.some(v => v <= 0)) {
                return { valid: false, status: 422, error: `${key} array must contain only positive integers` };
            }
            break;
        }

        case 'AI': {
            if (typeof value !== 'string') {
                return { valid: false, status: 422, error: 'AI must be a string' };
            }
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return { valid: false, status: 422, error: 'AI query must not be empty' };
            }
            if (trimmed.length > MAX_STRING_LENGTH) {
                return { valid: false, status: 422, error: `AI query must be at most ${MAX_STRING_LENGTH} characters` };
            }
            // Sanitize: return trimmed value
            return { valid: true, key, value: trimmed };
        }
    }

    return { valid: true, key, value };
}

module.exports = { validateBfhlInput };
