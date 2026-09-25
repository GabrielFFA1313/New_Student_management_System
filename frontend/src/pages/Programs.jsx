import { useState } from 'react';
import { usePrograms, useCreateProgram, useUpdateProgram, useDeleteProgram } from '../hooks/usePrograms';
import ProgramFormModal from '../components/ProgramFormModal';
import '../styles/DataPage.css';

export default function Programs() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');   // what the user is typing
  const [activeSearch, setActiveSearch] = useState('');  // what's actually sent to the API
  const [editingProgram, setEditingProgram] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError, error } = usePrograms({ page, search: activeSearch, per_page: 10 });
  const createProgram = useCreateProgram();
  const updateProgram = useUpdateProgram();
  const deleteProgram = useDeleteProgram();

  function handleSearch() {
    setPage(1);
    setActiveSearch(searchInput);
  }

  function handleSearchKeyDown(e) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  function handleClearSearch() {
    setSearchInput('');
    setActiveSearch('');
    setPage(1);
  }

  function handleCreate() {
    setEditingProgram(null);
    setShowForm(true);
  }

  function handleEdit(program) {
    setEditingProgram(program);
    setShowForm(true);
  }

  async function handleDelete(program) {
    if (!window.confirm(`Delete program "${program.name}"? This cannot be undone.`)) return;
    try {
      await deleteProgram.mutateAsync(program.id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete program.');
    }
  }

  async function handleSubmit(formData) {
    if (editingProgram) {
      await updateProgram.mutateAsync({ id: editingProgram.id, payload: formData });
    } else {
      await createProgram.mutateAsync(formData);
    }
    setShowForm(false);
  }

 if (isLoading) {
    return <div className="state-message">Loading programs...</div>;
  }

  if (isError) {
    if (error.isNetworkError) {
      return <div className="state-message error">{error.friendlyMessage}</div>;
    }
    return (
      <div className="state-message error">
        Failed to load programs: {error.response?.data?.message || error.message}
      </div>
    );
  }

  const programs = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="data-page">
      <div className="page-header">
        <h1>Programs</h1>
        <button className="btn-primary" onClick={handleCreate}>
          + New Program
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or code..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="search-input"
        />
        <button onClick={handleSearch} className="btn-secondary">
          Search
        </button>
        {activeSearch && (
          <button onClick={handleClearSearch} className="btn-secondary">
            Clear
          </button>
        )}
      </div>

      {programs.length === 0 ? (
        <div className="state-message">No programs found.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program.id}>
                <td>{program.code}</td>
                <td>{program.name}</td>
                <td>
                  <span className={`badge badge-${program.status}`}>{program.status}</span>
                </td>
                <td className="actions-cell">
                  <button onClick={() => handleEdit(program)}>Edit</button>
                  <button onClick={() => handleDelete(program)} className="btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {meta && meta.last_page > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span>
            Page {meta.current_page} of {meta.last_page}
          </span>
          <button disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}

      {showForm && (
        <ProgramFormModal
          program={editingProgram}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}