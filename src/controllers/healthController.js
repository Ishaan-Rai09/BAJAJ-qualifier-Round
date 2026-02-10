const healthController = (req, res) => {
    res.status(200).json({
        is_success: true,
        official_email: process.env.OFFICIAL_EMAIL || 'not_configured@chitkara.edu.in'
    });
};

module.exports = healthController;
