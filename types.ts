
export interface User {
  id: number;
  username: string;
  email: string;
  walletBalance: number;
  role: 'user' | 'admin';
}

export interface Tournament {
  id: number;
  title: string;
  gameName: string;
  entryFee: number;
  prizePool: number;
  matchTime: string;
  roomId?: string;
  roomPassword?: string;
  status: 'Upcoming' | 'Live' | 'Completed';
  winnerId?: number | null;
}

export interface Participant {
  id: number;
  userId: number;
  tournamentId: number;
  username?: string; // For convenience
}

export enum TransactionType {
    CREDIT = 'credit',
    DEBIT = 'debit'
}

export interface Transaction {
  id: number;
  userId: number;
  amount: number;
  type: TransactionType;
  description: string;
  createdAt: string;
}
