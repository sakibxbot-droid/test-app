import { User, Tournament, Participant, Transaction, TransactionType } from '../types';

// --- DATABASE SIMULATION using localStorage ---

const DB_KEY = 'adept-play-db';

// Add password to the DB user type, but not the type shared with the frontend
interface DbUser extends User {
    password?: string;
}

interface Database {
    users: DbUser[];
    tournaments: Tournament[];
    participants: Participant[];
    transactions: Transaction[];
    autoincrement: {
        users: number;
        tournaments: number;
        participants: number;
        transactions: number;
    };
}

const getDb = (): Database => {
    const dbString = localStorage.getItem(DB_KEY);
    if (dbString) {
        return JSON.parse(dbString);
    }
    
    // Default initial data if DB doesn't exist
    const initialDb: Database = {
        users: [
            { id: 1, username: 'player1', email: 'player1@test.com', walletBalance: 1000, role: 'user', password: 'password1' },
            { id: 2, username: 'player2', email: 'player2@test.com', walletBalance: 500, role: 'user', password: 'password2' },
            { id: 3, username: 'admin', email: 'admin@test.com', walletBalance: 0, role: 'admin', password: 'admin123' },
        ],
        tournaments: [
            { id: 1, title: 'Valorant Vanguard Series', gameName: 'Valorant', entryFee: 100, prizePool: 1000, matchTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'Upcoming', roomId: 'VAL123', roomPassword: 'pass' },
            { id: 2, title: 'BGMI Champions Cup', gameName: 'BGMI', entryFee: 50, prizePool: 500, matchTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'Upcoming' },
            { id: 3, title: 'Free Fire Frenzy', gameName: 'Free Fire', entryFee: 200, prizePool: 2000, matchTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'Completed', winnerId: 1 },
        ],
        participants: [
            { id: 1, userId: 1, tournamentId: 3 },
            { id: 2, userId: 2, tournamentId: 3 },
        ],
        transactions: [
             { id: 1, userId: 1, amount: 1000, type: TransactionType.CREDIT, description: 'Initial Balance', createdAt: new Date().toISOString() },
             { id: 2, userId: 2, amount: 500, type: TransactionType.CREDIT, description: 'Initial Balance', createdAt: new Date().toISOString() },
             { id: 3, userId: 1, amount: 200, type: TransactionType.DEBIT, description: 'Entry for Free Fire Frenzy', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
             { id: 4, userId: 1, amount: 2000, type: TransactionType.CREDIT, description: 'Won Free Fire Frenzy', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        ],
        autoincrement: {
            users: 3,
            tournaments: 3,
            participants: 2,
            transactions: 4,
        }
    };
    localStorage.setItem(DB_KEY, JSON.stringify(initialDb));
    return initialDb;
};

const saveDb = (db: Database) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));


// --- INSTALLATION FUNCTIONS ---
export const isInstalled = (): boolean => {
    return localStorage.getItem(DB_KEY) !== null;
};

export const installApp = (): void => {
    localStorage.removeItem(DB_KEY);
    getDb(); // This will create and save the initial DB
};

// --- API FUNCTIONS ---

export const getCurrentUser = async (): Promise<User | null> => {
    await simulateDelay(100);
    const userId = sessionStorage.getItem('loggedInUserId');
    if (!userId) return null;

    const db = getDb();
    const user = db.users.find(u => u.id === parseInt(userId));
    if (!user) return null;

    const { password, ...userToReturn } = user; // Don't return password
    return userToReturn;
};

export const loginUser = async (username: string, passwordInput: string): Promise<User> => {
    await simulateDelay(500);
    const db = getDb();
    const user = db.users.find(u => u.username === username && u.role === 'user' && u.password === passwordInput);
    if (!user) {
        throw new Error('Invalid username or password.');
    }
    const { password, ...userToReturn } = user; // Don't return password
    return userToReturn;
};

export const signupUser = async (username: string, email: string, passwordInput: string): Promise<User> => {
    await simulateDelay(500);
    const db = getDb();
    if (db.users.some(u => u.username === username)) {
        throw new Error('Username already exists.');
    }
    if (db.users.some(u => u.email === email)) {
        throw new Error('Email already registered.');
    }

    db.autoincrement.users += 1;
    const newUser: DbUser = {
        id: db.autoincrement.users,
        username, email,
        password: passwordInput,
        walletBalance: 500, // Welcome bonus
        role: 'user',
    };
    db.users.push(newUser);
    
    db.autoincrement.transactions += 1;
    db.transactions.push({
        id: db.autoincrement.transactions,
        userId: newUser.id,
        amount: 500,
        type: TransactionType.CREDIT,
        description: 'Welcome Bonus',
        createdAt: new Date().toISOString(),
    });

    saveDb(db);
    const { password, ...userToReturn } = newUser;
    return userToReturn;
};

export const loginAdmin = async (username: string, passwordInput: string): Promise<User> => {
    await simulateDelay(500);
    const db = getDb();
    const admin = db.users.find(u => u.username === username && u.role === 'admin' && u.password === passwordInput);
    if (!admin) {
        throw new Error('Invalid admin credentials.');
    }
    const { password, ...adminToReturn } = admin;
    return adminToReturn;
};

export const getUpcomingTournaments = async (userId: number): Promise<Tournament[]> => {
    await simulateDelay(300);
    const db = getDb();
    const joinedTournamentIds = new Set(
        db.participants.filter(p => p.userId === userId).map(p => p.tournamentId)
    );
    return db.tournaments.filter(t => t.status === 'Upcoming' && !joinedTournamentIds.has(t.id));
};

export const joinTournament = async (userId: number, tournamentId: number, entryFee: number): Promise<User> => {
    await simulateDelay(700);
    const db = getDb();
    const user = db.users.find(u => u.id === userId);
    const tournament = db.tournaments.find(t => t.id === tournamentId);

    if (!user || !tournament) {
        throw new Error('User or Tournament not found.');
    }
    if (user.walletBalance < entryFee) {
        throw new Error('Insufficient balance.');
    }
    if (db.participants.some(p => p.userId === userId && p.tournamentId === tournamentId)) {
        throw new Error('Already joined this tournament.');
    }

    user.walletBalance -= entryFee;
    
    db.autoincrement.transactions += 1;
    db.transactions.push({
        id: db.autoincrement.transactions,
        userId,
        amount: entryFee,
        type: TransactionType.DEBIT,
        description: `Entry for ${tournament.title}`,
        createdAt: new Date().toISOString(),
    });
    
    db.autoincrement.participants += 1;
    db.participants.push({
        id: db.autoincrement.participants,
        userId,
        tournamentId,
    });
    
    saveDb(db);
    const { password, ...userToReturn } = user;
    return userToReturn;
};

export const getMyTournaments = async (userId: number): Promise<Tournament[]> => {
    await simulateDelay(300);
    const db = getDb();
    const joinedTournamentIds = new Set(
        db.participants.filter(p => p.userId === userId).map(p => p.tournamentId)
    );
    return db.tournaments.filter(t => joinedTournamentIds.has(t.id)).sort((a,b) => new Date(b.matchTime).getTime() - new Date(a.matchTime).getTime());
};

export const getTransactions = async (userId: number): Promise<Transaction[]> => {
    await simulateDelay(300);
    const db = getDb();
    return db.transactions.filter(tx => tx.userId === userId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const updateUserPassword = async (userId: number, currentPassword: string, newPassword: string): Promise<void> => {
    await simulateDelay(500);
    const db = getDb();
    const user = db.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found.');
    if (user.password !== currentPassword) throw new Error('Incorrect current password.');
    user.password = newPassword;
    saveDb(db);
};


// --- ADMIN API FUNCTIONS ---

export const getAdminStats = async () => {
    await simulateDelay(500);
    const db = getDb();
    const totalPrizeDistributed = db.tournaments
        .filter(t => t.status === 'Completed' && t.winnerId)
        .reduce((sum, t) => sum + t.prizePool, 0);

    const totalRevenue = db.transactions
        .filter(tx => tx.type === TransactionType.DEBIT && tx.description.startsWith('Entry for'))
        .reduce((sum, tx) => sum + tx.amount, 0) * 0.20; // Assuming 20% commission

    return {
        totalUsers: db.users.filter(u => u.role === 'user').length,
        totalTournaments: db.tournaments.length,
        totalPrizeDistributed,
        totalRevenue,
    };
};

export const getAllTournaments = async (): Promise<Tournament[]> => {
    await simulateDelay(300);
    return getDb().tournaments.sort((a,b) => new Date(b.matchTime).getTime() - new Date(a.matchTime).getTime());
};

export const createTournament = async (data: Omit<Tournament, 'id' | 'status'>): Promise<Tournament> => {
    await simulateDelay(500);
    const db = getDb();
    db.autoincrement.tournaments += 1;
    const newTournament: Tournament = {
        ...data,
        id: db.autoincrement.tournaments,
        status: 'Upcoming',
    };
    db.tournaments.push(newTournament);
    saveDb(db);
    return newTournament;
};

export const getTournamentDetails = async (tournamentId: number): Promise<{ tournament: Tournament, participants: Participant[] }> => {
    await simulateDelay(300);
    const db = getDb();
    const tournament = db.tournaments.find(t => t.id === tournamentId);
    if (!tournament) throw new Error('Tournament not found.');

    const participants = db.participants.filter(p => p.tournamentId === tournamentId).map(p => {
        const user = db.users.find(u => u.id === p.userId);
        return { ...p, username: user?.username || 'Unknown' };
    });

    return { tournament, participants };
};

export const updateTournamentRoom = async (tournamentId: number, roomId: string, roomPassword: string): Promise<Tournament> => {
    await simulateDelay(400);
    const db = getDb();
    const tournament = db.tournaments.find(t => t.id === tournamentId);
    if (!tournament) throw new Error('Tournament not found.');

    tournament.roomId = roomId;
    tournament.roomPassword = roomPassword;
    if (tournament.status === 'Upcoming') {
        tournament.status = 'Live'; // Updating room details makes it Live
    }
    saveDb(db);
    return tournament;
};

export const declareWinner = async (tournamentId: number, winnerId: number): Promise<void> => {
    await simulateDelay(800);
    const db = getDb();
    const tournament = db.tournaments.find(t => t.id === tournamentId);
    const winner = db.users.find(u => u.id === winnerId);

    if (!tournament || !winner) {
        throw new Error('Tournament or Winner not found.');
    }
    if(tournament.status === 'Completed') {
        throw new Error('Winner has already been declared for this tournament.');
    }

    tournament.status = 'Completed';
    tournament.winnerId = winnerId;
    winner.walletBalance += tournament.prizePool;
    
    db.autoincrement.transactions += 1;
    db.transactions.push({
        id: db.autoincrement.transactions,
        userId: winnerId,
        amount: tournament.prizePool,
        type: TransactionType.CREDIT,
        description: `Won ${tournament.title}`,
        createdAt: new Date().toISOString(),
    });

    saveDb(db);
};

export const getAllUsers = async (): Promise<User[]> => {
    await simulateDelay(300);
    return getDb().users.filter(u => u.role === 'user');
};

export const updateAdminPassword = async (adminId: number, currentPassword: string, newPassword: string): Promise<void> => {
    await simulateDelay(500);
    const db = getDb();
    const admin = db.users.find(u => u.id === adminId && u.role === 'admin');
    if (!admin) throw new Error('Admin user not found.');
    if (admin.password !== currentPassword) throw new Error('Incorrect current password.');
    admin.password = newPassword;
    saveDb(db);
};