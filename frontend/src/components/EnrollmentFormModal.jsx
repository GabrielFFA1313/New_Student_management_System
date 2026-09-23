import { useState } from 'react';
import { useStudents } from '../hooks/useStudents';
import { useCourseOfferings } from '../hooks/useCourseOfferings';
import Combobox from './Combobox';
import '../styles/Modal.css';

export default function EnrollmentFormModal({ onSubmit, onClose }) {
  const { data: studentsData } = useStudents({ per_page: 100 });
  const { data: offeringsData } = useCourseOfferings({ per_page: 100, status: 'open' });

  const students = studentsData?.data ?? [];
  const offerings = offeringsData?.data ?? [];

  const [formData, setFormData] = useState({
    student_id: '',
    course_offering_id: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleComboboxChange(field, value) {
    setFormData({ ...formData, [field]: value });
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
        <h2>New Enrollment</h2>

        {errors._general && <div className="error-banner">{errors._general}</div>}

        <form onSubmit={handleSubmit}>
          <label>
            Student
            <Combobox
              options={students}
              value={formData.student_id}
              onChange={(id) => handleComboboxChange('student_id', id)}
              placeholder="Search student by name or number..."
              getLabel={(s) => `${s.student_number} — ${s.full_name}`}
              getValue={(s) => s.id}
            />
            {errors.student_id && <span className="field-error">{errors.student_id[0]}</span>}
          </label>

          <label>
            Course Offering
            <Combobox
              options={offerings}
              value={formData.course_offering_id}
              onChange={(id) => handleComboboxChange('course_offering_id', id)}
              placeholder="Search by course code or section..."
              getLabel={(o) => `${o.course?.course_code} - Sec ${o.section} (${o.enrolled_count ?? 0}/${o.capacity})`}
              getValue={(o) => o.id}
            />
            {errors.course_offering_id && <span className="field-error">{errors.course_offering_id[0]}</span>}
          </label>

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Enrolling...' : 'Enroll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}