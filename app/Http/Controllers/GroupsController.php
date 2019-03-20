<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use App\Group;
use App\Word;
use App\User;

class GroupsController extends BaseController
{
    public function getData(Request $request)
    {
        $session_user_id = $request->session()->get('logged_user');
        if ($session_user_id) {
            if ((User::where('id', $request->session()->get("logged_user"))->count()) > 0) {
                $countGroups = Group::where('user_id', $session_user_id)->count();
                if ($countGroups > 0) {
                    $group = Group::where('user_id', $session_user_id)->get();
                    return response($group, 200);
                } else {
                    return response()->json([], 200);
                }
            }
        }
        return response()->json("accessError", 403);
    }

    public function setData(Request $request)
    {
        $session = $request->session()->all();
        $session_id = $request->session()->has("logged_user");
        if ($session_id) {
            if ((User::where('id', $request->session()->get("logged_user"))->count()) > 0) {
                $session_user_id = $request->session()->get("logged_user");
                $json = $request->getContent();
                $data = json_decode($json, true);
                $group = Group::create([
                    'group_name' => $data['group_name'],
                    'create_date' => $data['create_date'],
                    'user_id' => $session_user_id
                ]);
                $group['status'] = 'added';
                $group['words_count'] = 0;
                return response()->json($group, 200);
            }
        }
        return response()->json([
            'status' => 'accessError',
            'session' => $session,
        ], 401);
    }

    public function delData(Request $request)
    {

        $session = $request->session()->all();
        $session_user_id = $request->session()->has("logged_user");
        if ($session_user_id) {
            if ((User::where('id', $request->session()->get("logged_user"))->count()) > 0) {
                $json = $request->getContent();
                $data = json_decode($json, true);
                Word::where('group_id', $data['id'])->delete();
                Group::where('id', $data['id'])->delete();

                return response()->json([
                    'status' => 'deleted',
                    'id' => $data['id'],
                ], 200);
            }
        }
        return response()->json([
            'status' => 'accessError',
            'session' => $session,
        ], 401);
    }

    public function updateData(Request $request)
    {
        $session_user_id = $request->session()->get('logged_user');
        if ($session_user_id) {
            if ((User::where('id', $request->session()->get("logged_user"))->count()) > 0) {
                $json = $request->getContent();
                $data = json_decode($json, true);
                Group::where('id', $data['id'])->update([
                    'group_name' => $data['group_name'],
                ]);
                $group = Group::where('id', $data['id'])->get()->first();
                $group['status'] = 'updated';
                return response()->json($group, 200);
            }
        }
        return response()->json([
            'status' => 'accessError',
        ], 401);
    }
}
