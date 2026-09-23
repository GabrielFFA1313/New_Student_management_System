import { useState } from 'react';
import {
  useEnrollments,
  useCreateEnrollment,
  useUpdateEnrollmentStatus,
  useDeleteEnrollment,
} from '../hooks/useEnrollments';
import { useCourseOfferings } from '../hooks/useCourseOfferings';
import EnrollmentFormModal from '../components/EnrollmentFormModal';
import '../styles/DataPage.css';

export default function Enrollments() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [offeringFilter, setOfferingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { data: offeringsData } = useCourseOfferings({ per_page: 100 });
  const offerings = offeringsData?.data ?? [];

  const { data, isLoading, isError, error } = useEnrollments({
    page,
    search: activeSearch || undefined,
    course_offering_id: offeringFilter || undefined,
    status: statusFilter || undefined,
    per_page: 10,
  });

  const createEnrollment = useCreateEnrollment();
  const updateStatus = useUpdateEnrollmentStatus();
  const deleteEnrollment = useDeleteEnrollment();

  function handleSearch() {
    setPage(1);
    setActiveSearch(searchInput);
  }

  function handleSearchKeyDown(e) {
    if (e.key === 'Enter') handleSearch();
  }

  function handleClearSearch() {
    setSearchInput('');
    setActiveSearch('');
    setPage(1);
  }

  function handleFilterChange(setter, value) {
    setter(value);
    setPage(1);
  }

  async function handleStatusChange(enrollment, newStatus) {
    try {
      await updateStatus.mutateAsync({ id: enrollment.id, status: newStatus });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update enrollment status.');
    }
  }

  async function handleDelete(enrollment) {
    if (!window.confirm(`Delete this enrollment? This cannot be undone.`)) return;
    try {
      await deleteEnrollment.mutateAsync(enrollment.id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete enrollment.');
    }
  }

  async function handleSubmit(formData) {
    await createEnrollment.mutateAsync(formData);
    setShowForm(false);
  }

  if (isLoading) return <div className="state-message">Loading enrollments...</div>;
  if (isError) {
    return (
      <div className="state-message error">
        Failed to load enrollments: {error.response?.data?.message || error.message}
      </div>
    );
  }

  const enrollments = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="data-page">
      <div className="page-header">
        <h1>Enrollments</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ New Enrollment</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by student name or number..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="search-input"
        />
        <button onClick={handleSearch} className="btn-secondary">Search</button>
        {activeSearch && (
          <button onClick={handleClearSearch} className="btn-secondary">Clear</button>
        )}
      </div>

      <div className="filter-bar">
        <select value={offeringFilter} onChange={(e) => handleFilterChange(setOfferingFilter, e.target.value)}>
          <option value="">All Course Offerings</option>
          {offerings.map((offering) => (
            <option key={offering.id} value={offering.id}>
              {offering.course?.course_code} - Sec {offering.section}
            </option>
          ))}
        </select>

        <select value={statusFilter} onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}>
          <option value="">All Statuses</option>
          <option value="enrolled">Enrolled</option>
          <option value="dropped">Dropped</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {enrollments.length === 0 ? (
        <div className="state-message">No enrollments found.</div>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Section</th>
                <th>Enrollment Date</th>
                <th>Status</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id}>
                  <td>{enrollment.student?.student_number} — {enrollment.student?.full_name}</td>
                  <td>{enrollment.course_offering?.course?.course_code}</td>
                  <td>{enrollment.course_offering?.section}</td>
                  <td>{enrollment.enrollment_date}</td>
                  <td>
                    <select
                      value={enrollment.status}
                      onChange={(e) => handleStatusChange(enrollment, e.target.value)}
                    >
                      <option value="enrolled">Enrolled</option>
                      <option value="dropped">Dropped</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    {enrollment.grade
                      ? `Midterm: ${enrollment.grade.midterm_grade ?? '—'} / Final: ${enrollment.grade.final_grade ?? '—'}`
                      : 'Not graded'}
                  </td>
                  <td className="actions-cell">
                    <button onClick={() => handleDelete(enrollment)} className="btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span>Page {meta.current_page} of {meta.last_page}</span>
          <button disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}

      {showForm && (
        <EnrollmentFormModal onSubmit={handleSubmit} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}