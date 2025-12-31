function validateCreateFood(req, res, next) {
    const errors = [];
    const { name, description } = req.body || {};

    if (typeof name !== 'string' || !name.trim()) {
        errors.push('name is required and must be a non-empty string');
    }

    if (description !== undefined && typeof description !== 'string') {
        errors.push('description must be a string when provided');
    }

    if (!req.file) {
        errors.push('video file is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'food item validation failed',
            errors: errors,
        });
    }

    req.body.name = name.trim();

    if (typeof description === 'string') {
        req.body.description = description.trim();
    }

    next();
}

module.exports = {
    validateCreateFood,
};
