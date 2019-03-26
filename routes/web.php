<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//header('Access-Control-Allow-Origin: *');
//header('Access-Control-Allow-Methods:  POST, GET, OPTIONS, PUT, DELETE');
//header('Access-Control-Allow-Headers:  Content-Type, X-Auth-Token, Origin, Authorization');

Route::get('/', function () {
    return view('welcome');
});

Route::post('/register', 'RegController@register');
Route::post('/login', 'LogController@login');

Route::get('/checkSession', 'CheckSesController@check');
Route::get('/logout', 'LogOutController@out');
Route::get('/part', 'PartController@getData');

Route::get('/groups', 'GroupsController@getData');
Route::post('/groups/delete', 'GroupsController@delData');
Route::post('/groups/add', 'GroupsController@setData');
Route::post('/groups/update', 'GroupsController@updateData');

Route::get('/words', 'WordsController@getData');
Route::post('/words/update', 'WordsController@updateData');
Route::post('/words', 'WordsController@setData');
Route::post('/words/delete', 'WordsController@delData');

Route::post('/words/test_words', 'WordsController@getTestData');

Route::get('/score', 'ScoreboardController@getData');
Route::post('/score/add', 'ScoreboardController@setData');
