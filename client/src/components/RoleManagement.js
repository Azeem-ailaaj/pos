import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [newRole, setNewRole] = useState({
        name: '',
        permissions: [],
        description: ''
    });

    const availablePermissions = [
        'create_user', 'edit_user', 'delete_user', 'view_user',
        'create_product', 'edit_product', 'delete_product', 'view_product',
        'manage_orders', 'view_orders', 'manage_settings'
    ];

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await axios.get('/api/roles');
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/roles', newRole);
            fetchRoles();
            setNewRole({ name: '', permissions: [], description: '' });
        } catch (error) {
            console.error('Error creating role:', error);
        }
    };

    return (
        <div className="container">
            <h2>Role Management</h2>
            <form onSubmit={handleSubmit} className="role-form">
                <div className="form-group">
                    <label>Role Name:</label>
                    <input
                        type="text"
                        value={newRole.name}
                        onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        value={newRole.description}
                        onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label>Permissions:</label>
                    <div className="permissions-list">
                        {availablePermissions.map(permission => (
                            <label key={permission} className="permission-item">
                                <input
                                    type="checkbox"
                                    checked={newRole.permissions.includes(permission)}
                                    onChange={(e) => {
                                        const updatedPermissions = e.target.checked
                                            ? [...newRole.permissions, permission]
                                            : newRole.permissions.filter(p => p !== permission);
                                        setNewRole({...newRole, permissions: updatedPermissions});
                                    }}
                                />
                                {permission}
                            </label>
                        ))}
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Create Role</button>
            </form>
            <div className="roles-list">
                {roles.map(role => (
                    <div key={role._id} className="role-item"></div>
                        <h3>{role.name}</h3>
                        <p>{role.description}</p>
                        <ul>
                            {role.permissions.map(perm => (
                                <li key={perm}>{perm}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoleManagement;
