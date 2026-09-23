import { useState, useRef, useEffect } from 'react';
import '../styles/Combobox.css';

export default function Combobox({ options, value, onChange, placeholder, getLabel, getValue }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => getValue(opt) === value);

  const filteredOptions = query
    ? options.filter((opt) => getLabel(opt).toLowerCase().includes(query.toLowerCase()))
    : options;

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(option) {
    onChange(getValue(option));
    setIsOpen(false);
    setQuery('');
  }

  return (
    <div className="combobox" ref={containerRef}>
      <input
        type="text"
        className="combobox-input"
        placeholder={placeholder}
        value={isOpen ? query : selectedOption ? getLabel(selectedOption) : ''}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          setIsOpen(true);
          setQuery('');
        }}
      />
      {isOpen && (
        <ul className="combobox-list">
          {filteredOptions.length === 0 ? (
            <li className="combobox-empty">No matches found</li>
          ) : (
            filteredOptions.map((option) => (
             <li
              key={getValue(option)}
              className={`combobox-option ${getValue(option) === value ? 'selected' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault(); // prevents input blur from firing before the click registers
                handleSelect(option);
              }}
            >
              {getLabel(option)}
            </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}