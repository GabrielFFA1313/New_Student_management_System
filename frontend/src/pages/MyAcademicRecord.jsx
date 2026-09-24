import { useMyAcademicRecord } from '../hooks/useMyRecord';
import '../styles/DataPage.css';

export default function MyAcademicRecord() {
  const { data, isLoading, isError, error } = useMyAcademicRecord();

  if (isLoading) return <div className="state-message">Loading your academic record...</div>;
  if (isError) {
    return (
      <div className="state-message error">
        Failed to load your academic record: {error.response?.data?.message || error.message}
      </div>
    );
  }

  const { student, academic_record: record } = data;

  return (
    <div className="data-page">
      <h1>My Academic Record</h1>

      <div className="profile-card" style={{ marginBottom: '1.5rem' }}>
        <div className="profile-row"><span>Student Number</span><strong>{student.student_number}</strong></div>
        <div className="profile-row"><span>Name</span><strong>{student.full_name}</strong></div>
        <div className="profile-row"><span>Program</span><strong>{student.program}</strong></div>
        <div className="profile-row"><span>Year Level</span><strong>{student.year_level}</strong></div>
      </div>

      {record.length === 0 ? (
        <div className="state-message">No academic record available yet.</div>
      ) : (
        record.map((termGroup) => (
          <div key={termGroup.academic_term.id} className="term-section">
            <h2>{termGroup.academic_term.academic_year} — {termGroup.academic_term.semester}</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Units</th>
                  <th>Section</th>
                  <th>Status</th>
                  <th>Midterm</th>
                  <th>Final</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {termGroup.courses.map((course, i) => (
                  <tr key={i}>
                    <td>{course.course_code} — {course.course_title}</td>
                    <td>{course.units}</td>
                    <td>{course.section}</td>
                    <td>{course.enrollment_status}</td>
                    <td>{course.midterm_grade ?? '—'}</td>
                    <td>{course.final_grade ?? '—'}</td>
                    <td>{course.remarks ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}