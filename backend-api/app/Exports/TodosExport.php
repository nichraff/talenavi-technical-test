<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class TodosExport implements FromArray, WithHeadings
{
    protected $todos;

    public function __construct($todos)
    {
        $this->todos = $todos;
    }

    public function array(): array
    {
        $data = [];

        // Data Todo
        foreach ($this->todos as $todo) {
            $data[] = [
                $todo->title,
                $todo->assignee,
                $todo->due_date,
                $todo->time_tracked,
                $todo->status,
                $todo->priority,
            ];
        }

        // Baris kosong
        $data[] = ['', '', '', '', '', ''];

        // Summary
        $data[] = [
            'SUMMARY',
            '',
            '',
            '',
            '',
            '',
        ];

        $data[] = [
            'Total Todo',
            count($this->todos),
            '',
            '',
            '',
            '',
        ];

        $totalTimeTracked = $this->todos->sum('time_tracked');

        $data[] = [
            'Total Time Tracked',
            $totalTimeTracked,
            '',
            '',
            '',
            '',
        ];

        return $data;
    }

    public function headings(): array
    {
        return [
            'Title',
            'Assignee',
            'Due Date',
            'Time Tracked',
            'Status',
            'Priority',
        ];
    }
}