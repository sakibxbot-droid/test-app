
import React, { useState, useEffect } from 'react';
import { User } from '../../../types';
import { getAllUsers } from '../../../services/mockApi';

const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getAllUsers();
            setUsers(data);
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">User Management</h2>
            <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-2">ID</th>
                                <th className="p-2">Username</th>
                                <th className="p-2">Email</th>
                                <th className="p-2">Wallet Balance</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="p-2">{user.id}</td>
                                    <td className="p-2">{user.username}</td>
                                    <td className="p-2">{user.email}</td>
                                    <td className="p-2">₹{user.walletBalance.toFixed(2)}</td>
                                    <td className="p-2">
                                        <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm">Block</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsersPage;
