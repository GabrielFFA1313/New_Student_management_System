import { useState } from 'react';
import '../styles/Modal.css';

export default function ProgramFormModal({ program, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    code: program?.code || '',
    name: program?.name || '',
    description: program?.description || '',
    status: program?.status || 'active',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ _general: err.response?.data?.message || 'Something went wrong.' });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{program ? 'Edit Program' : 'New Program'}</h2>

        {errors._general && <div className="error-banner">{errors._general}</div>}

        <form onSubmit={handleSubmit}>
          <label>
            Code
            <input name="code" value={formData.code} onChange={handleChange} required />
            {errors.code && <span className="field-error">{errors.code[0]}</span>}
          </label>

          <label>
            Name
            <input name="name" value={formData.name} onChange={handleChange} required />
            {errors.name && <span className="field-error">{errors.name[0]}</span>}
          </label>

          <label>
            Description
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </label>

          <label>
            Status
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}