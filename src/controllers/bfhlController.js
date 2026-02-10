const { validateBfhlInput } = require('../validators/bfhlValidator');
const fibonacciService = require('../services/fibonacciService');
const primeService = require('../services/primeService');
const lcmService = require('../services/lcmService');
const hcfService = require('../services/hcfService');
const aiService = require('../services/aiService');

const bfhlController = async (req, res, next) => {
    try {
        const validation = validateBfhlInput(req.body);
        if (!validation.valid) {
            return res.status(validation.status).json({
                is_success: false,
                error: validation.error
            });
        }

        const { key, value } = validation;
        let data;

        switch (key) {
            case 'fibonacci':
                data = fibonacciService(value);
                break;
            case 'prime':
                data = primeService(value);
                break;
            case 'lcm':
                data = lcmService(value);
                break;
            case 'hcf':
                data = hcfService(value);
                break;
            case 'AI':
                data = await aiService(value);
                break;
            default:
                return res.status(400).json({
                    is_success: false,
                    error: `Unknown key: ${key}`
                });
        }

        return res.status(200).json({
            is_success: true,
            official_email: process.env.OFFICIAL_EMAIL || 'not_configured@chitkara.edu.in',
            data
        });
    } catch (err) {
        next(err);
    }
};

module.exports = bfhlController;
