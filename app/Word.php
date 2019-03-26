<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Word extends Model
{
    protected $fillable = [
        'value', 'translate', 'part_id', 'group_id', 'user_id',
    ];

//    protected $primaryKey = 'id';
}
