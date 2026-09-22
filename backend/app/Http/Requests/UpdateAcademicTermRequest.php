<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAcademicTermRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $termId = $this->route('academic_term')->id;

        return [
            'academic_year' => [
                'sometimes',
                'required',
                'string',
                'regex:/^\d{4}-\d{4}$/',
                Rule::unique('academic_terms', 'academic_year')
                    ->where(fn ($query) => $query->where('semester', $this->semester))
                    ->ignore($termId),
            ],
            'semester' => ['sometimes', 'required', 'string', 'max:50'],
            'start_date' => ['sometimes', 'required', 'date'],
            'end_date' => ['sometimes', 'required', 'date', 'after:start_date'],
            'status' => ['nullable', 'in:upcoming,active,closed'],
        ];
    }

    public function messages(): array
    {
        return [
            'academic_year.regex' => 'Academic year must be in the format YYYY-YYYY (e.g. 2026-2027).',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->academic_year && preg_match('/^(\d{4})-(\d{4})$/', $this->academic_year, $matches)) {
                $startYear = (int) $matches[1];
                $endYear = (int) $matches[2];

                if ($endYear !== $startYear + 1) {
                    $validator->errors()->add(
                        'academic_year',
                        'The second year must be exactly one year after the first (e.g. 2026-2027, not 2027-2026 or 2026-2030).'
                    );
                }
            }
        });
    }
}