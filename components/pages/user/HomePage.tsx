
import React, { useState, useEffect } from 'react';
import { Tournament, User } from '../../../types';
import { getUpcomingTournaments, joinTournament } from '../../../services/mockApi';
import { useAuth } from '../../../context/AuthContext';

const TournamentCard: React.FC<{ tournament: Tournament, onJoin: (tournamentId: number, entryFee: number) => void }> = ({ tournament, onJoin }) => {
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    setIsJoining(true);
    await onJoin(tournament.id, tournament.entryFee);
    setIsJoining(false);
  };
    
  const matchDate = new Date(tournament.matchTime);
  const formattedDate = matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const formattedTime = matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="bg-brand-surface rounded-lg shadow-lg overflow-hidden flex flex-col">
      <div className="p-4 flex-grow">
        <h3 className="font-bold text-lg text-brand-text">{tournament.title}</h3>
        <p className="text-brand-text-secondary text-sm mb-2">{tournament.gameName}</p>
        <div className="text-xs space-y-2">
          <div className="flex justify-between items-center"><span className="text-brand-text-secondary">Prize Pool</span><span className="font-semibold text-brand-secondary">₹{tournament.prizePool.toLocaleString()}</span></div>
          <div className="flex justify-between items-center"><span className="text-brand-text-secondary">Entry Fee</span><span className="font-semibold text-brand-success">₹{tournament.entryFee}</span></div>
          <div className="flex justify-between items-center"><span className="text-brand-text-secondary">Date/Time</span><span className="font-semibold">{formattedDate}, {formattedTime}</span></div>
        </div>
      </div>
      <button 
        onClick={handleJoin} 
        disabled={isJoining}
        className="w-full bg-brand-primary text-white font-bold py-3 hover:bg-brand-primary-variant transition-colors disabled:bg-gray-600">
        {isJoining ? 'Joining...' : 'Join Now'}
      </button>
    </div>
  );
};


const HomePage: React.FC = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    const { user, updateUser } = useAuth();

    useEffect(() => {
        const fetchTournaments = async () => {
            const data = await getUpcomingTournaments(user!.id);
            setTournaments(data);
        };
        if (user) {
          fetchTournaments();
        }
    }, [user]);

    const handleJoinTournament = async (tournamentId: number, entryFee: number) => {
        setMessage(null);
        try {
            const updatedUser = await joinTournament(user!.id, tournamentId, entryFee);
            updateUser(updatedUser);
            setMessage({ type: 'success', text: 'Successfully joined tournament!' });
            // Refetch tournaments to update the list (remove joined one)
            const data = await getUpcomingTournaments(user!.id);
            setTournaments(data);
        } catch (err) {
            setMessage({ type: 'error', text: (err as Error).message });
        }
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Upcoming Tournaments</h2>
            
            {message && (
                <div className={`p-3 rounded-md mb-4 text-center ${message.type === 'success' ? 'bg-brand-success/20 text-brand-success' : 'bg-brand-danger/20 text-brand-danger'}`}>
                    {message.text}
                </div>
            )}

            {tournaments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tournaments.map(t => (
                        <TournamentCard key={t.id} tournament={t} onJoin={handleJoinTournament} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-brand-text-secondary mt-8">No upcoming tournaments available right now.</p>
            )}
        </div>
    );
};

export default HomePage;
