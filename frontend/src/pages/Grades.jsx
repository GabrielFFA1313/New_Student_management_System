import { useState } from 'react';
import { useGrades, useCreateGrade, useUpdateGrade } from '../hooks/useGrades';
import GradeFormModal from '../components/GradeFormModal';
import '../styles/DataPage.css';

export default function Grades() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [editingGrade, setEditingGrade] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError, error } = useGrades({
    page,
    search: activeSearch || undefined,
    per_page: 10,
  });

  const createGrade = useCreateGrade();
  const updateGrade = useUpdateGrade();

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

  function handleCreate() {
    setEditingGrade(null);
    setShowForm(true);
  }

  function handleEdit(grade) {
    setEditingGrade(grade);
    setShowForm(true);
  }

  async function handleSubmit(formData) {
    if (editingGrade) {
      await updateGrade.mutateAsync({ id: editingGrade.id, payload: formData });
    } else {
      await createGrade.mutateAsync(formData);
    }
    setShowForm(false);
  }

  if (isLoading) return <div className="state-message">Loading grades...</div>;
  if (isError) {
    return (
      <div className="state-message error">
        Failed to load grades: {error.response?.data?.message || error.message}
      </div>
    );
  }

  const grades = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="data-page">
      <div className="page-header">
        <h1>Grades</h1>
        <button className="btn-primary" onClick={handleCreate}>+ Record Grade</button>
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

      {grades.length === 0 ? (
        <div className="state-message">No grades found.</div>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Midterm</th>
                <th>Final</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.id}>
                  <td>{grade.enrollment?.student?.full_name ?? `Enrollment #${grade.enrollment_id}`}</td>
                  <td>{grade.midterm_grade ?? '—'}</td>
                  <td>{grade.final_grade ?? '—'}</td>
                  <td>
                    {grade.remarks ? (
                      <span className={`badge badge-${grade.remarks === 'passed' ? 'active' : 'inactive'}`}>
                        {grade.remarks}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="actions-cell">
                    <button onClick={() => handleEdit(grade)}>Edit</button>
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
        <GradeFormModal grade={editingGrade} onSubmit={handleSubmit} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}