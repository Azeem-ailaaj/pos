const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    // ...existing code...
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    }
    // ...existing code...
});
