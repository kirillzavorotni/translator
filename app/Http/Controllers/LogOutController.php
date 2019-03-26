<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class LogOutController extends BaseController
{
    public function out(Request $request)
    {
        if ($request->session()->has("logged_user")) {
            $request->session()->forget("logged_user");
            return response()->json([
                'status' => 'logOutSuccess'
            ], 200, []);
        }

        return response()->json([
            'status' => 'logOutSError'
        ], 401, []);
    }
}
