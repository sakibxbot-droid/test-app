
import React, { useState, useEffect } from 'react';
import { getAdminStats } from '../../../services/mockApi';

interface AdminStats {
  totalUsers: number;
  totalTournaments: number;
  totalPrizeDistributed: number;
  totalRevenue: number;
}

const StatCard: React.FC<{ title: string; value: string; icon: string }> = ({ title, value, icon }) => (
  <div className="bg-brand-surface p-6 rounded-lg shadow-lg flex items-center">
    <div className="p-3 bg-brand-primary/20 rounded-full mr-4">
        <i className={`${icon} text-brand-secondary text-2xl`}></i>
    </div>
    <div>
        <p className="text-sm text-brand-text-secondary">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getAdminStats();
            setStats(data);
        };
        fetchStats();
    }, []);

    if (!stats) {
        return <div>Loading stats...</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.totalUsers.toString()} icon="fas fa-users" />
                <StatCard title="Total Tournaments" value={stats.totalTournaments.toString()} icon="fas fa-trophy" />
                <StatCard title="Prize Distributed" value={`₹${stats.totalPrizeDistributed.toLocaleString()}`} icon="fas fa-hand-holding-usd" />
                <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon="fas fa-chart-line" />
            </div>
        </div>
    );
};

export default AdminDashboardPage;
