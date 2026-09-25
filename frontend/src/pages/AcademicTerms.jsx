import { useState } from 'react';
import {
  useAcademicTerms,
  useCreateAcademicTerm,
  useUpdateAcademicTerm,
  useDeleteAcademicTerm,
} from '../hooks/useAcademicTerms';
import AcademicTermFormModal from '../components/AcademicTermFormModal';
import '../styles/DataPage.css';

export default function AcademicTerms() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [editingTerm, setEditingTerm] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError, error } = useAcademicTerms({ page, search: activeSearch, per_page: 10 });
  const createTerm = useCreateAcademicTerm();
  const updateTerm = useUpdateAcademicTerm();
  const deleteTerm = useDeleteAcademicTerm();

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
    setEditingTerm(null);
    setShowForm(true);
  }

  function handleEdit(term) {
    setEditingTerm(term);
    setShowForm(true);
  }

  async function handleDelete(term) {
    if (!window.confirm(`Delete ${term.academic_year} ${term.semester}? This cannot be undone.`)) return;
    try {
      await deleteTerm.mutateAsync(term.id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete academic term.');
    }
  }

  async function handleSubmit(formData) {
    if (editingTerm) {
      await updateTerm.mutateAsync({ id: editingTerm.id, payload: formData });
    } else {
      await createTerm.mutateAsync(formData);
    }
    setShowForm(false);
  }

  if (isLoading) return <div className="state-message">Loading academic terms...</div>;
  if (isError) {
    if (error.isNetworkError) {
      return <div className="state-message error">{error.friendlyMessage}</div>;
    }
    return (
      <div className="state-message error">
        Failed to load academic terms: {error.response?.data?.message || error.message}
      </div>
    );
  }

  const terms = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="data-page">
      <div className="page-header">
        <h1>Academic Terms</h1>
        <button className="btn-primary" onClick={handleCreate}>+ New Academic Term</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by year or semester..."
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

      {terms.length === 0 ? (
        <div className="state-message">No academic terms found.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Academic Year</th>
              <th>Semester</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {terms.map((term) => (
              <tr key={term.id}>
                <td>{term.academic_year}</td>
                <td>{term.semester}</td>
                <td>{term.start_date}</td>
                <td>{term.end_date}</td>
                <td><span className={`badge badge-${term.status === 'active' ? 'active' : 'inactive'}`}>{term.status}</span></td>
                <td className="actions-cell">
                  <button onClick={() => handleEdit(term)}>Edit</button>
                  <button onClick={() => handleDelete(term)} className="btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {meta && meta.last_page > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span>Page {meta.current_page} of {meta.last_page}</span>
          <button disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}

      {showForm && (
        <AcademicTermFormModal term={editingTerm} onSubmit={handleSubmit} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}