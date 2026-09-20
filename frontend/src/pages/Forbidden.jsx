import { Link } from 'react-router-dom';

export default function Forbidden() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>403 — Access Denied</h1>
      <p>You don't have permission to view this page.</p>
      <Link to="/dashboard">Return to Dashboard</Link>
    </div>
  );
}