<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'required|boolean',
        ]);

        $category = new Category();
        $category->name = $request->name;
        $category->description = $request->description;
        $category->is_active = $request->is_active;
        $category->slug = Str::slug($request->name);

       

        $category->save();

        return redirect()->back()->with('flash', 'Category added successfully!');
    }
}
