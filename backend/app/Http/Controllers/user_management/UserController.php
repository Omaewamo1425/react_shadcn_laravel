<?php

namespace App\Http\Controllers\user_management;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class UserController extends Controller
{

    use AuthorizesRequests;

    public function index()
    {
        // $this->authorize('view users');
        return User::with('permissions')->get();
    }

    public function store(Request $request)
    {
        $this->authorize('create users');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ], [
            'name.required' => 'The user name is required.',
            'email.required' => 'The email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already taken.',
            'password.required' => 'A password is required.',
            'password.min' => 'The password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',
            'permissions.array' => 'Permissions must be an array.',
            'permissions.*.exists' => 'One or more selected permissions are invalid.',
        ]);


        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        if (!empty($validated['permissions'])) {
            $user->syncPermissions($validated['permissions']);
        }

        return response()->json($user, 201);
    }


    public function update(Request $request, User $user)
    {
        $this->authorize('edit users');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = bcrypt($validated['password']);
        }

        $user->update($updateData);

        if (isset($validated['permissions'])) {
            $user->syncPermissions($validated['permissions']);
        }

        return response()->json($user);
    }


    public function destroy(User $user)
    {
        $this->authorize('delete users');
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }

}
