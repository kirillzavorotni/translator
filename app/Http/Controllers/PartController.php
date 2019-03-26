<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use App\Part;

class PartController extends BaseController
{
    public function getData(Request $request)
    {
        $parts = Part::all();
        return response()->json($parts, 200);
    }
}
