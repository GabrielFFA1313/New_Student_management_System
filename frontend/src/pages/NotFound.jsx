import { Link } from 'react-router-dom';
import '../styles/StatusPage.css';

export default function NotFound() {
  return (
    <div className="status-page">
      <h1>404</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="btn-primary">Return to Dashboard</Link>
    </div>
  );
}