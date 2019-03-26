<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use App\User;

class LogController extends BaseController
{
    public function login(Request $request)
    {
        $json = $request->getContent();
        $data = json_decode($json, true);
        $insetData = array();
        $insetData['userEmail'] = $data['userEmail'];
        $insetData['userPass'] = $data['userPass'];

        $errors = array();
        $user = User::where('email', $data['userEmail'])->first();
        if ($user) {
            if ($user['password'] === $data['userPass']) {
                $request->session()->put("logged_user", $user['id']);
                return response()->json([
                    'status' => 'logOK',
                    'userName' => $user["user_name"],
                ], 200, []);
            } else {
                $errors['messages']['userPass'] = 'Не верный пароль!';
                $errors['status'] = 'logError';
                $errors['formData'] = $insetData;
                return response($errors, 401);
            }
        } else {
            $errors['messages']['userExist'] = 'Пользователь с таким логином не найден!';
            $errors['status'] = 'logError';
            $errors['formData'] = $insetData;
            return response($errors, 401);
        }
    }
}
