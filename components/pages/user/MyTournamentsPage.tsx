
import React, { useState, useEffect } from 'react';
import { Tournament } from '../../../types';
import { getMyTournaments } from '../../../services/mockApi';
import { useAuth } from '../../../context/AuthContext';

const MyTournamentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTournaments = async () => {
      if (!user) return;
      setLoading(true);
      const data = await getMyTournaments(user.id);
      setTournaments(data);
      setLoading(false);
    };
    fetchTournaments();
  }, [user]);

  const upcomingTournaments = tournaments.filter(t => t.status === 'Upcoming' || t.status === 'Live');
  const completedTournaments = tournaments.filter(t => t.status === 'Completed');

  const TournamentItem: React.FC<{ tournament: Tournament }> = ({ tournament }) => {
    const matchDate = new Date(tournament.matchTime);
    const formattedDateTime = matchDate.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

    return (
      <div className="bg-brand-surface p-4 rounded-lg shadow-md mb-3">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-bold text-lg">{tournament.title}</h3>
                <p className="text-sm text-brand-text-secondary">{tournament.gameName}</p>
                <p className="text-sm text-brand-text-secondary mt-1">{formattedDateTime}</p>
            </div>
            <div className={`px-3 py-1 text-xs font-semibold rounded-full ${
                tournament.status === 'Live' ? 'bg-red-500/20 text-red-400' :
                tournament.status === 'Upcoming' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
            }`}>
                {tournament.status}
            </div>
        </div>
        {tournament.status === 'Live' && (
            <div className="mt-3 pt-3 border-t border-gray-700 space-y-2">
                <p><span className="font-semibold">Room ID:</span> <span className="text-brand-secondary">{tournament.roomId}</span></p>
                <p><span className="font-semibold">Password:</span> <span className="text-brand-secondary">{tournament.roomPassword}</span></p>
            </div>
        )}
        {tournament.status === 'Completed' && (
            <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="font-semibold">Result: <span className={tournament.winnerId === user?.id ? 'text-brand-success' : 'text-brand-text'}>
                    {tournament.winnerId === user?.id ? `Winner (Prize: ₹${tournament.prizePool})` : 'Participated'}
                </span></p>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Tournaments</h2>
      <div className="flex border-b border-gray-700 mb-4">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 text-center font-semibold transition-colors ${activeTab === 'upcoming' ? 'text-brand-secondary border-b-2 border-brand-secondary' : 'text-brand-text-secondary'}`}
        >
          Upcoming/Live
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 text-center font-semibold transition-colors ${activeTab === 'completed' ? 'text-brand-secondary border-b-2 border-brand-secondary' : 'text-brand-text-secondary'}`}
        >
          Completed
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {activeTab === 'upcoming' && (
            upcomingTournaments.length > 0 ? (
              upcomingTournaments.map(t => <TournamentItem key={t.id} tournament={t} />)
            ) : (
              <p className="text-center text-brand-text-secondary mt-8">You haven't joined any upcoming tournaments.</p>
            )
          )}
          {activeTab === 'completed' && (
            completedTournaments.length > 0 ? (
              completedTournaments.map(t => <TournamentItem key={t.id} tournament={t} />)
            ) : (
              <p className="text-center text-brand-text-secondary mt-8">No completed tournaments found.</p>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default MyTournamentsPage;
