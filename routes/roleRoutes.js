const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const { checkPermission } = require('../middleware/authMiddleware');

router.get('/', checkPermission('manage_settings'), async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', checkPermission('manage_settings'), async (req, res) => {
    const role = new Role({
        name: req.body.name,
        permissions: req.body.permissions,
        description: req.body.description
    });

    try {
        const newRole = await role.save();
        res.status(201).json(newRole);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
