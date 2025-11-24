
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Tournament, Participant, User } from '../../../types';
import { getTournamentDetails, updateTournamentRoom, declareWinner } from '../../../services/mockApi';

const AdminManageTournamentPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const tournamentId = parseInt(id || '0');
    
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [roomId, setRoomId] = useState('');
    const [roomPassword, setRoomPassword] = useState('');
    const [winnerId, setWinnerId] = useState<string>('');
    const [message, setMessage] = useState('');

    const fetchDetails = useCallback(async () => {
        const details = await getTournamentDetails(tournamentId);
        setTournament(details.tournament);
        setParticipants(details.participants);
        setRoomId(details.tournament.roomId || '');
        setRoomPassword(details.tournament.roomPassword || '');
    }, [tournamentId]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const handleUpdateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateTournamentRoom(tournamentId, roomId, roomPassword);
            setMessage('Room details updated successfully!');
            fetchDetails();
        } catch (error) {
            setMessage('Failed to update room details.');
        }
    };
    
    const handleDeclareWinner = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!winnerId) {
            setMessage('Please select a winner.');
            return;
        }
        try {
            await declareWinner(tournamentId, parseInt(winnerId));
            setMessage('Winner declared and prize distributed!');
            fetchDetails();
        } catch (error) {
            setMessage('Failed to declare winner.');
        }
    };

    if (!tournament) return <div>Loading...</div>;

    const isCompleted = tournament.status === 'Completed';

    return (
        <div>
            <h2 className="text-3xl font-bold mb-2">{tournament.title}</h2>
            <p className="text-brand-text-secondary mb-6">{tournament.gameName}</p>
            {message && <div className="p-3 my-4 rounded-md text-center bg-blue-500/20 text-blue-300">{message}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Participants ({participants.length})</h3>
                        <div className="overflow-y-auto max-h-96">
                            <ul>
                                {participants.map(p => <li key={p.id} className="p-2 border-b border-gray-700">{p.username}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="bg-brand-surface p-6 rounded-lg shadow-lg mb-6">
                        <h3 className="text-xl font-semibold mb-4">Room Details</h3>
                        <form onSubmit={handleUpdateRoom}>
                            <input type="text" placeholder="Room ID" value={roomId} onChange={e => setRoomId(e.target.value)} disabled={isCompleted} className="w-full bg-gray-800 border border-gray-700 p-2 rounded-md mb-2 disabled:opacity-50" />
                            <input type="text" placeholder="Room Password" value={roomPassword} onChange={e => setRoomPassword(e.target.value)} disabled={isCompleted} className="w-full bg-gray-800 border border-gray-700 p-2 rounded-md mb-4 disabled:opacity-50" />
                            <button type="submit" disabled={isCompleted} className="w-full bg-brand-primary text-white font-bold py-2 rounded-lg hover:bg-brand-primary-variant transition-colors disabled:bg-gray-600">Update Room</button>
                        </form>
                    </div>

                    <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Declare Winner</h3>
                        {isCompleted ? (
                           <p className="text-brand-success">Winner has been declared.</p>
                        ) : (
                        <form onSubmit={handleDeclareWinner}>
                            <select value={winnerId} onChange={e => setWinnerId(e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2 rounded-md mb-4">
                                <option value="">Select Winner</option>
                                {participants.map(p => <option key={p.userId} value={p.userId}>{p.username}</option>)}
                            </select>
                            <button type="submit" className="w-full bg-brand-success text-white font-bold py-2 rounded-lg hover:bg-green-700 transition-colors">Declare & Distribute</button>
                        </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminManageTournamentPage;
