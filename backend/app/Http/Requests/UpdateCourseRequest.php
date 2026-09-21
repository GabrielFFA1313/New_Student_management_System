<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('course_code')) {
            $this->merge(['course_code' => strtoupper(trim($this->course_code))]);
        }
    }

    public function rules(): array
    {
        $courseId = $this->route('course')->id;

        return [
            'course_code' => ['sometimes', 'required', 'string', 'max:20', Rule::unique('courses', 'course_code')->ignore($courseId)],
            'course_title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'units' => ['sometimes', 'required', 'integer', 'min:1', 'max:10'],
            'status' => ['nullable', 'in:active,inactive'],
        ];
    }
}