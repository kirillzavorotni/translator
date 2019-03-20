<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use App\User;

class RegController extends BaseController
{
    public function register(Request $request)
    {
        $json = $request->getContent();
        $data = json_decode($json, true);
        $insetData = array();

        $errors = array();
        if ($data['userName'] == '')
        {
            $errors['messages']['userName'] = 'Введите логин';
        }

        if ($data['userEmail'] == '')
        {
            $errors['messages']['userEmail'] = 'Введите email';
        }

        if ($data['userPass'] == '')
        {
            $errors['messages']['userPass'] = 'Введите пароль';
        }

        if (User::where('email', $data['userEmail'])->count() > 0)
        {
            $errors['messages']['isUser'] = 'Пользователь с таким email уже существует';
        }

        if (empty($errors))
        {

            $user = User::create([
                'user_name' => $data['userName'],
                'email' => $data['userEmail'],
                'password' => $data['userPass'],
            ]);

            $request->session()->put('logged_user', $user['id']);

            return response()->json([
                'status' => 'regOK'
            ], 200);

        } else
        {
            $insetData['userName'] = $data['userName'];
            $insetData['userEmail'] = $data['userEmail'];
            $insetData['userPass'] = $data['userPass'];

            $errors['status'] = 'inputError';
            $errors['formData'] = $insetData;
            return response($errors, 400);
        }
    }
}
