const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  permissions: [{
    type: String,
    enum: ['create_user', 'edit_user', 'delete_user', 'view_user', 
           'create_product', 'edit_product', 'delete_product', 'view_product',
           'manage_orders', 'view_orders', 'manage_settings']
  }],
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
