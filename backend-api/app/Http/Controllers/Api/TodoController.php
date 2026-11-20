<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Todo;
use App\Exports\TodosExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'assignee' => 'nullable|string|max:255',
            'due_date' => 'required|date|after_or_equal:today',
            'time_tracked' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:pending,open,in_progress,completed',
            'priority' => 'required|in:low,medium,high',
        ]);

        $validated['time_tracked'] = $validated['time_tracked'] ?? 0;
        $validated['status'] = $validated['status'] ?? 'pending';

        $todo = Todo::create($validated);

        return response()->json([
            'message' => 'Todo berhasil dibuat',
            'data' => $todo
        ], 201);
    }

    public function export(Request $request)
    {
        $query = Todo::query();

        // Filter berdasarkan title
        if ($request->filled('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        // Filter berdasarkan assignee (bisa beberapa nama)
        if ($request->filled('assignee')) {
            $assignees = explode(',', $request->assignee);

            $query->whereIn('assignee', $assignees);
        }

        // Filter berdasarkan rentang due_date
        if ($request->filled('due_date_start')) {
            $query->whereDate('due_date', '>=', $request->due_date_start);
        }

        if ($request->filled('due_date_end')) {
            $query->whereDate('due_date', '<=', $request->due_date_end);
        }

        // Filter time_tracked minimum
        if ($request->filled('time_tracked_min')) {
            $query->where('time_tracked', '>=', $request->time_tracked_min);
        }

        // Filter time_tracked maksimum
        if ($request->filled('time_tracked_max')) {
            $query->where('time_tracked', '<=', $request->time_tracked_max);
        }

        // Filter berdasarkan status (bisa beberapa status)
        if ($request->filled('status')) {
            $statuses = explode(',', $request->status);

            $query->whereIn('status', $statuses);
        }

        // Filter berdasarkan priority (bisa beberapa priority)
        if ($request->filled('priority')) {
            $priorities = explode(',', $request->priority);

            $query->whereIn('priority', $priorities);
        }

        $todos = $query->get();

        return Excel::download(new TodosExport($todos), 'todos.xlsx');
    }
}