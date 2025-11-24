
import React, { useState, useEffect } from 'react';
import { Tournament } from '../../../types';
import { getAllTournaments, createTournament } from '../../../services/mockApi';
import { generateTournamentDetails } from '../../../services/geminiService';
import { Link } from 'react-router-dom';

const AdminTournamentsPage: React.FC = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [title, setTitle] = useState('');
    const [gameName, setGameName] = useState('');
    const [entryFee, setEntryFee] = useState('');
    const [prizePool, setPrizePool] = useState('');
    const [matchTime, setMatchTime] = useState('');
    const [message, setMessage] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const fetchTournaments = async () => {
        const data = await getAllTournaments();
        setTournaments(data);
    };

    useEffect(() => {
        fetchTournaments();
    }, []);

    const handleGenerateDetails = async () => {
        if (!gameName) {
            setMessage('Please enter a game name first.');
            return;
        }
        setIsGenerating(true);
        setMessage('');
        try {
            const details = await generateTournamentDetails(gameName);
            setTitle(details.title);
        } catch (error) {
            setMessage('Failed to generate details.');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createTournament({
                title, gameName,
                entryFee: parseInt(entryFee),
                prizePool: parseInt(prizePool),
                matchTime,
            });
            setMessage('Tournament created successfully!');
            setTitle(''); setGameName(''); setEntryFee(''); setPrizePool(''); setMatchTime('');
            fetchTournaments();
        } catch (error) {
            setMessage('Failed to create tournament.');
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Manage Tournaments</h2>
            
            <div className="bg-brand-surface p-6 rounded-lg shadow-lg mb-8">
                <h3 className="text-xl font-semibold mb-4">Create New Tournament</h3>
                {message && <div className="p-2 text-center my-2 rounded-md bg-blue-500/20 text-blue-300">{message}</div>}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Game Name" value={gameName} onChange={e => setGameName(e.target.value)} required className="bg-gray-800 border border-gray-700 p-2 rounded-md" />
                     <div className="relative">
                        <input type="text" placeholder="Tournament Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-gray-800 border border-gray-700 p-2 rounded-md" />
                        <button type="button" onClick={handleGenerateDetails} disabled={isGenerating || !gameName} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-brand-primary px-2 py-1 rounded disabled:bg-gray-500">
                           {isGenerating ? '...' : 'AI Gen'}
                        </button>
                    </div>
                    <input type="number" placeholder="Entry Fee (₹)" value={entryFee} onChange={e => setEntryFee(e.target.value)} required className="bg-gray-800 border border-gray-700 p-2 rounded-md" />
                    <input type="number" placeholder="Prize Pool (₹)" value={prizePool} onChange={e => setPrizePool(e.target.value)} required className="bg-gray-800 border border-gray-700 p-2 rounded-md" />
                    <input type="datetime-local" value={matchTime} onChange={e => setMatchTime(e.target.value)} required className="bg-gray-800 border border-gray-700 p-2 rounded-md" />
                    <button type="submit" className="md:col-span-2 w-full bg-brand-primary text-white font-bold py-2 rounded-lg hover:bg-brand-primary-variant transition-colors">Create Tournament</button>
                </form>
            </div>

            <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">All Tournaments</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-2">Title</th><th className="p-2">Game</th><th className="p-2">Status</th><th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tournaments.map(t => (
                                <tr key={t.id} className="border-b border-gray-800">
                                    <td className="p-2">{t.title}</td>
                                    <td className="p-2">{t.gameName}</td>
                                    <td className="p-2"><span className={`px-2 py-1 text-xs rounded-full ${t.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{t.status}</span></td>
                                    <td className="p-2">
                                        <Link to={`/admin/manage-tournament/${t.id}`} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">Manage</Link>
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

export default AdminTournamentsPage;
