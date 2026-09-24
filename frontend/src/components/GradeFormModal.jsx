import { useState } from 'react';
import { useEnrollments } from '../hooks/useEnrollments';
import Combobox from './Combobox';
import '../styles/Modal.css';

export default function GradeFormModal({ grade, onSubmit, onClose }) {
  // Only show enrollments without an existing grade when creating a new one
  const { data: enrollmentsData } = useEnrollments({ per_page: 100, status: 'enrolled' });
  const enrollments = (enrollmentsData?.data ?? []).filter((e) => !e.grade || grade);

  const [formData, setFormData] = useState({
    enrollment_id: grade?.enrollment_id || '',
    midterm_grade: grade?.midterm_grade || '',
    final_grade: grade?.final_grade || '',
    remarks: grade?.remarks || '',
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
      } else if (err.response?.status === 403) {
        setErrors({ _general: err.response.data.message || 'You may only grade enrollments in your own course offerings.' });
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
        <h2>{grade ? 'Update Grade' : 'Record Grade'}</h2>

        {errors._general && <div className="error-banner">{errors._general}</div>}

        <form onSubmit={handleSubmit}>
          <label>
            Enrollment
            {grade ? (
              <input
                disabled
                value={`${grade.enrollment?.student_id ? `Student #${grade.enrollment.student_id}` : ''} — Enrollment #${grade.enrollment_id}`}
              />
            ) : (
              <Combobox
                options={enrollments}
                value={formData.enrollment_id}
                onChange={(id) => setFormData({ ...formData, enrollment_id: id })}
                placeholder="Search by student or course..."
                getLabel={(e) =>
                  `${e.student?.student_number} — ${e.student?.full_name} (${e.course_offering?.course?.course_code} Sec ${e.course_offering?.section})`
                }
                getValue={(e) => e.id}
              />
            )}
            {errors.enrollment_id && <span className="field-error">{errors.enrollment_id[0]}</span>}
          </label>

          <label>
            Midterm Grade
            <input
              type="number"
              step="0.01"
              min="1"
              max="5"
              name="midterm_grade"
              value={formData.midterm_grade}
              onChange={handleChange}
              placeholder="e.g. 1.50"
            />
            {errors.midterm_grade && <span className="field-error">{errors.midterm_grade[0]}</span>}
          </label>

          <label>
            Final Grade
            <input
              type="number"
              step="0.01"
              min="1"
              max="5"
              name="final_grade"
              value={formData.final_grade}
              onChange={handleChange}
              placeholder="e.g. 1.75"
            />
            {errors.final_grade && <span className="field-error">{errors.final_grade[0]}</span>}
          </label>

          <label>
            Remarks
            <select name="remarks" value={formData.remarks} onChange={handleChange}>
              <option value="">— Not set —</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </label>

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}