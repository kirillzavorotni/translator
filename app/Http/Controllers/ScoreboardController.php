<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Score;

class ScoreboardController extends Controller
{
    public function getData(Request $request)
    {
        $session_user_id = $request->session()->get('logged_user');
        if ($session_user_id) {
            if ((User::where('id', $request->session()->get("logged_user"))->count()) > 0) {
                $scores = Score::where("user_id", $session_user_id)->get();
                if ($scores->count() > 0) {
                    return response()->json($scores, 200);
                } else {
                    return response()->json([], 200);
                }
            }
        }
        return response()->json("accessError", 403);
    }

    public function setData(Request $request)
    {
        $session_user_id = $request->session()->get('logged_user');
        if ($session_user_id) {
            if ((User::where('id', $request->session()->get("logged_user"))->count()) > 0) {
                $json = $request->getContent();
                $data = json_decode($json, true);

                $score = Score::create([
                    'date' => $data['date'],
                    'score' => $data['score'],
                    'out_of' => $data['out_of'],
                    'user_id' => $request->session()->get("logged_user"),
                ]);

                return response()->json($score, 200);
            }
        }
        return response()->json(["status" => "accessError"], 403);
    }
}
