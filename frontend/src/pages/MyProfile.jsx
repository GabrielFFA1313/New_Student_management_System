import { useMyProfile } from '../hooks/useMyRecord';
import '../styles/DataPage.css';

export default function MyProfile() {
  const { data: student, isLoading, isError, error } = useMyProfile();

  if (isLoading) return <div className="state-message">Loading your profile...</div>;
  if (isError) {
    if (error.isNetworkError) {
      return <div className="state-message error">{error.friendlyMessage}</div>;
    }
    return (
      <div className="state-message error">
        Failed to load your profile: {error.response?.data?.message || error.message}
      </div>
    );
  }
  if (!student) {
    return <div className="state-message">No profile data available.</div>;
  }

  return (
    <div className="data-page">
      <h1>My Profile</h1>
      <div className="profile-card">
        <div className="profile-row"><span>Student Number</span><strong>{student.student_number}</strong></div>
        <div className="profile-row"><span>Full Name</span><strong>{student.full_name}</strong></div>
        <div className="profile-row"><span>Program</span><strong>{student.program?.name} ({student.program?.code})</strong></div>
        <div className="profile-row"><span>Year Level</span><strong>{student.year_level}</strong></div>
        <div className="profile-row"><span>Email</span><strong>{student.email || '—'}</strong></div>
        <div className="profile-row"><span>Contact Number</span><strong>{student.contact_number || '—'}</strong></div>
        <div className="profile-row"><span>Status</span><strong className={`badge badge-${student.status === 'active' ? 'active' : 'inactive'}`}>{student.status}</strong></div>
      </div>
    </div>
  );
}