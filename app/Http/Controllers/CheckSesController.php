<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use App\User;

class CheckSesController extends BaseController
{
    public function check(Request $request)
    {
        $session = $request->session()->all();
        $session_user_id = $request->session()->has("logged_user");
        if ($session_user_id) {
            if ((User::where('id', $request->session()->get("logged_user"))->count()) > 0) {
                return response()->json([
                    'status' => 'accessOK',
                    'session' => $session,
                ], 200, []);
            }
        }

        return response()->json([
            'status' => 'accessError',
            'session' => $session,
        ], 401);
    }
}
