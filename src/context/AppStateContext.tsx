import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Transaction = {
  id: string;
  title: string;
  category: 'CRAVINGS' | 'MOVING' | 'FUN STUFF' | 'SURVIVAL';
  categoryLabel: string;
  amount: number;
  date: string;
  badge?: string;
  badgeType?: 'legit' | 'saved' | 'high';
  icon: string;
};

export type Subscription = {
  id: string;
  title: string;
  amount: number;
  dueText: string;
  dueDays: number;
  active: boolean;
  color: string;
  icon: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  isToday: boolean;
  type: 'alert' | 'tool' | 'achievement' | 'recap';
  tags?: string[];
  unread?: boolean;
};

export type UserProfile = {
  name: string;
  tagline: string;
  privacyGuard: boolean;
  vibeAlerts: boolean;
  linkedBanksCount: number;
};

interface AppStateContextType {
  transactions: Transaction[];
  subscriptions: Subscription[];
  notifications: NotificationItem[];
  profile: UserProfile;
  budgetLimit: number;
  totalBurned: number;
  leftToSpend: number;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addSubscription: (sub: Omit<Subscription, 'id'>) => void;
  toggleSubscription: (id: string) => void;
  setBudgetLimit: (limit: number) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  clearNotifications: () => void;
  resetAllData: () => void;
}

const STORAGE_KEY = '@spark_app_state_v1';

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'PIZZA HUT',
    category: 'CRAVINGS',
    categoryLabel: 'Food & Dranks',
    amount: 25.0,
    date: 'Today',
    badge: 'LEGIT',
    badgeType: 'legit',
    icon: 'pizza-outline',
  },
  {
    id: '2',
    title: 'UBER RIDE',
    category: 'MOVING',
    categoryLabel: "Vibin' & Movin'",
    amount: 12.5,
    date: 'Today',
    badge: 'SAVED',
    badgeType: 'saved',
    icon: 'car-outline',
  },
  {
    id: '3',
    title: 'THRIFT SHOP',
    category: 'FUN STUFF',
    categoryLabel: 'Drip Check',
    amount: 45.0,
    date: 'Today',
    badge: 'DRIP',
    badgeType: 'legit',
    icon: 'shirt-outline',
  },
  {
    id: '4',
    title: 'OLIVE GARDEN',
    category: 'CRAVINGS',
    categoryLabel: 'Food & Dranks',
    amount: 42.0,
    date: 'Yesterday',
    badge: 'HIGH SPEND',
    badgeType: 'high',
    icon: 'restaurant-outline',
  },
  {
    id: '5',
    title: 'ARCADE NIGHT',
    category: 'FUN STUFF',
    categoryLabel: 'Gaming',
    amount: 35.0,
    date: '3 days ago',
    icon: 'game-controller-outline',
  },
  {
    id: '6',
    title: 'WHOLE FOODS',
    category: 'SURVIVAL',
    categoryLabel: 'Groceries',
    amount: 190.0,
    date: '4 days ago',
    icon: 'cart-outline',
  },
  {
    id: '7',
    title: 'GAS STATION',
    category: 'MOVING',
    categoryLabel: 'Fuel',
    amount: 65.0,
    date: '5 days ago',
    icon: 'flash-outline',
  },
];

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: '1',
    title: 'NETFLIX',
    amount: 15.99,
    dueText: 'Due in 3 days',
    dueDays: 3,
    active: true,
    color: '#FF4D4D',
    icon: 'tv-outline',
  },
  {
    id: '2',
    title: 'SPOTIFY',
    amount: 9.99,
    dueText: 'Due in 12 days',
    dueDays: 12,
    active: true,
    color: '#2ECC71',
    icon: 'musical-notes-outline',
  },
  {
    id: '3',
    title: 'CREATIVE CLOUD',
    amount: 52.99,
    dueText: 'Due in 24 days',
    dueDays: 24,
    active: true,
    color: '#A55EA5',
    icon: 'color-palette-outline',
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'HIGH BURN ALERT!',
    body: "You just dropped $42 at Olive Garden. That's 15% of your food budget gone, chief.",
    time: '2m ago',
    isToday: true,
    type: 'alert',
    tags: ['BUDGET', 'HIGH SPEND'],
    unread: true,
  },
  {
    id: '2',
    title: 'TOOL CALL COMPLETE',
    body: "I've successfully linked your Netflix sub. I'll remind you 3 days before the burn.",
    time: '1h ago',
    isToday: true,
    type: 'tool',
    unread: true,
  },
  {
    id: '3',
    title: 'SAVINGS BADGE UNLOCKED',
    body: 'You survived the weekend without a single Uber. You\'re a legend.',
    time: '1d ago',
    isToday: false,
    type: 'achievement',
    tags: ['ACHIEVEMENT'],
  },
  {
    id: '4',
    title: 'WEEKLY RECAP READY',
    body: 'Want to see where your money flew last week? Tap to peep the stats.',
    time: '1d ago',
    isToday: false,
    type: 'recap',
  },
];

const INITIAL_PROFILE: UserProfile = {
  name: 'ALEX JOHNSON',
  tagline: 'Top Tier Baller',
  privacyGuard: true,
  vibeAlerts: true,
  linkedBanksCount: 2,
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [budgetLimit, setBudgetLimitState] = useState<number>(25000);

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.subscriptions) setSubscriptions(parsed.subscriptions);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.budgetLimit) setBudgetLimitState(parsed.budgetLimit);
      }
    } catch (e) {
      console.warn('Failed to load storage state', e);
    }
  };

  const saveState = async (newState: any) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn('Failed to save storage state', e);
    }
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: Date.now().toString(),
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveState({ transactions: updated, subscriptions, notifications, profile, budgetLimit });
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveState({ transactions: updated, subscriptions, notifications, profile, budgetLimit });
  };

  const addSubscription = (sub: Omit<Subscription, 'id'>) => {
    const newSub: Subscription = {
      ...sub,
      id: Date.now().toString(),
    };
    const updated = [...subscriptions, newSub];
    setSubscriptions(updated);
    saveState({ transactions, subscriptions: updated, notifications, profile, budgetLimit });
  };

  const toggleSubscription = (id: string) => {
    const updated = subscriptions.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
    setSubscriptions(updated);
    saveState({ transactions, subscriptions: updated, notifications, profile, budgetLimit });
  };

  const setBudgetLimit = (limit: number) => {
    setBudgetLimitState(limit);
    saveState({ transactions, subscriptions, notifications, profile, budgetLimit: limit });
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updated };
    setProfile(newProfile);
    saveState({ transactions, subscriptions, notifications, profile: newProfile, budgetLimit });
  };

  const clearNotifications = () => {
    setNotifications([]);
    saveState({ transactions, subscriptions, notifications: [], profile, budgetLimit });
  };

  const resetAllData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setProfile(INITIAL_PROFILE);
    setBudgetLimitState(25000);
    AsyncStorage.removeItem(STORAGE_KEY);
  };

  const totalBurned = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const leftToSpend = Math.max(0, budgetLimit - totalBurned);

  return (
    <AppStateContext.Provider
      value={{
        transactions,
        subscriptions,
        notifications,
        profile,
        budgetLimit,
        totalBurned,
        leftToSpend,
        addTransaction,
        deleteTransaction,
        addSubscription,
        toggleSubscription,
        setBudgetLimit,
        updateProfile,
        clearNotifications,
        resetAllData,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
