<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $query = Role::query();
        
        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }
        
        $roles = $query->paginate(10);
        
        return Inertia::render('settings/RoleManagement', [
            'roles' => $roles
        ]);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles',
            'description' => 'nullable|string'
        ]);
        
        Role::create($validated);
        
        return redirect()->back();
    }
    
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,'.$role->id,
            'description' => 'nullable|string'
        ]);
        
        $role->update($validated);
        
        return redirect()->back();
    }
    
    public function destroy(Role $role)
    {
        // Optional: Check if role has users before deletion
        if ($role->users()->count() > 0) {
            return redirect()->back()->with('error', 'Cannot delete role with assigned users');
        }
        
        $role->delete();
        
        return redirect()->back();
    }
}
