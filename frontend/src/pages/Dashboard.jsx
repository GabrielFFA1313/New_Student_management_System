import { useAuth } from '../context/authContext';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Role: {user?.role}</p>
      <p>This dashboard will show summary cards in a later phase.</p>
    </div>
  );
}