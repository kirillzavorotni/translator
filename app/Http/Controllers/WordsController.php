<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use App\User;
use App\Word;
use App\Group;

class WordsController extends BaseController
{
    public function getData(Request $request)
    {
        $session_user_id = $request->session()->get('logged_user');
        if ($session_user_id) {
            if ((User::where('id', $request->session()->get("logged_user"))->count()) > 0) {
                $countWords = Word::where('user_id', $session_user_id)->count();
                if ($countWords > 0) {
                    $words = Word::where('user_id', $session_user_id)->get();
                    return response()->json($words, 200);
                } else {
                    return response()->json([], 200);
                }
            }
        }
        return response()->json("accessError", 403);
    }

    public function setData(Request $request)
    {
        $session_user_id = $request->session()->has("logged_user");

        if ($session_user_id) {
            if ((User::where('id', $request->session()->get("logged_user"))->count()) > 0) {
                $json = $request->getContent();
                $data = json_decode($json, true);

                $word = Word::create([
                    'value' => $data['value'],
                    'translate' => $data['translate'],
                    'part_id' => $data['part_id'],
                    'group_id' => $data['group_id'],
                    'user_id' => $request->session()->get("logged_user"),
                ]);

                $group = Group::where('id', $data['group_id'])->first();
                $count = $group['words_count'];
                ++$count;

                Group::where('id', $data['group_id'])->update([
                    'words_count' => $count,
                ]);

                $word['status'] = 'added';
                $word['words_count'] = $count;
                return response()->json($word, 200, []);
            }
        }
        return response()->json([
            'status' => 'accessError'
        ], 403);
    }

    public function updateData(Request $request)
    {
        $session_user_id = $request->session()->has("logged_user");
        if ($session_user_id) {
            if ((User::where('id', $request->session()->get("logged_user"))->count()) > 0) {
                $json = $request->getContent();
                $data = json_decode($json, true);

                Word::where('id', $data['id'])->update([
                    'part_id' => $data['part_id'],
                    'translate' => $data['translate'],
                    'value' => $data['value'],
                ]);

                $word = Word::where('id', $data['id'])->get()->first();
                $word['status'] = 'updated';
                return response()->json($word, 200);
            }
        }
        return response()->json([
            'status' => 'accessError'
        ], 403);
    }

    public function delData(Request $request)
    {
        $session_user_id = $request->session()->has("logged_user");
        if ($session_user_id) {
            if ((User::where('id', $request->session()->get("logged_user"))->count()) > 0) {
                $json = $request->getContent();
                $data = json_decode($json, true);
                Word::where('id', $data['id'])->delete();

                $group = Group::where('id', $data['group_id'])->first();
                $count = $group['words_count'];
                --$count;
                $group = Group::where('id', $data['group_id'])->update([
                    'words_count' => $count,
                ]);
                return response()->json([
                    'status' => 'deleted',
                    'words_count_group' => $count,
                    'id' => $data['id'],
                    'words_count' => $count,
                    'group_id' => $data['group_id'],
                ], 200);
            }
        }
        return response()->json([
            'status' => 'accessError'
        ], 403);
    }

    public function getTestData(Request $request)
    {
        $session_user_id = $request->session()->get('logged_user');
        if ($session_user_id) {
            if ((User::where('id', $request->session()->get("logged_user"))->count()) > 0) {

                $json = $request->getContent();
                $data = json_decode($json, true);
                $words_count = Word::where('group_id', $data['group_id'])->count();
                if ($words_count > 0) {
                    $words = Word::where('group_id', $data['group_id'])->get();
                    return response()->json($words, 200);
                } else {
                    return response()->json([], 200);
                }

            }
        }
        return response()->json("accessError", 403);
    }
}
