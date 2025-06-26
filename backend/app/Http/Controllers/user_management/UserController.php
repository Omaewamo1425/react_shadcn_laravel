<?php

namespace App\Http\Controllers\user_management;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class UserController extends Controller
{

    use AuthorizesRequests;

    public function index(Request $request)
    {
        $query = User::with('roles');

        if ($search = $request->query('search')) {
            $query->where('first_name', 'like', "%$search%")
                ->orWhere('last_name', 'like', "%$search%")
                ->orWhere('email', 'like', "%$search%");
        }

        if ($sortBy = $request->query('sort_by')) {
            $order = $request->query('order', 'asc');
            $query->orderBy($sortBy, $order);
        }

        return response()->json($query->paginate($request->query('limit', 10)));
    }



    public function store(Request $request)
    {
        $this->authorize('create-users');

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|string|exists:roles,name',

        ], [
            'first_name.required' => 'The first name is required.',
            'last_name.required' => 'The last name is required.',
            'email.required' => 'The email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already taken.',
            'password.required' => 'A password is required.',
            'password.min' => 'The password must be at least 8 characters.',
            'role.required' => 'The role is required.',
            'role.exists'   => 'The selected role is exist.',
        ]);

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        $user->syncRoles([$validated['role']]);

        return response()->json([
            'status' => 'success',
            'message' => "user added successfully",
            // 'user' => $user
        ], 200);
    }


    public function update(Request $request, User $user)
    {
        $this->authorize('edit-users');

         $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|string|exists:roles,name',

        ], [
            'first_name.required' => 'The first ame is required.',
            'last_name.required' => 'The first ame is required.',
            'email.required' => 'The email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already taken.',
            'password.required' => 'A password is required.',
            'password.min' => 'The password must be at least 8 characters.',
            'role.required' => 'The role is required.',
            'role.exists'   => 'The selected role is exist.',
           
        ]);

        $updateData = [
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = bcrypt($validated['password']);
        }

        $user->update($updateData);

        $user->syncRoles([$validated['role']]);

        // if (isset($validated['permissions'])) {
        //     $user->syncPermissions($validated['permissions']);
        // }

        return response()->json([
            'status' => 'success',
            'message' => "user updated successfully",
            'user'    => $user->load('roles'),
        ], 200);
    }


    public function destroy(User $user)
    {
        $this->authorize('delete-users');
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }

}
