<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class UserController extends Controller
{
    /**
     * @OA\Get(
     *     path="/users",
     *     tags={"Users"},
     *     summary="List users, optionally filtered by role (for dropdowns)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="role", in="query", @OA\Schema(type="string", enum={"administrator","registrar","instructor","student"})),
     *     @OA\Parameter(name="search", in="query", @OA\Schema(type="string"), description="Search by name or email"),
     *     @OA\Response(response=200, description="List of users (id, name, email, role only — no sensitive fields)")
     * )
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $query = User::query()->select(['id', 'name', 'email', 'role']);

        if ($role = $request->query('role')) {
            $query->where('role', $role);
        }

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        $users = $query->orderBy('name')->limit(50)->get();

        return response()->json([
            'success' => true,
            'message' => 'Users retrieved successfully.',
            'data' => $users,
        ]);
    }
}