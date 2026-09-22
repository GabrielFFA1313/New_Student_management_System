<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        // Anyone authenticated can browse basic user info (for dropdowns) except plain students
        return in_array($user->role, ['administrator', 'registrar', 'instructor']);
    }
}