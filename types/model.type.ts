export type User = {
  id: string;
  username: string;
  passwordHash: string;
};

export type Event = {
  id: string;
  title: string;
  sport: string;
  startTime: string;
  limit: number;
  organizerId: string;
  participants: string[];
  pendingRequests: string[];
};

export type JoinStatus = "none" | "pending" | "joined";
