<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'user_name' => 'fedor',
            'email' => 'fedor@mail.ru',
            'password' => '123',
        ]);

        DB::table('groups')->insert([
            'group_name' => 'transport',
            'user_id' => 1,
            'words_count' => 2,
            'create_date' => '18-03-2019',
        ]);

        DB::table('groups')->insert([
            'group_name' => 'family',
            'user_id' => 1,
            'words_count' => 2,
            'create_date' => '18-03-2019',
        ]);

        DB::table('words')->insert([
            'value' => 'car',
            'translate' => 'Автомобиль',
            'group_id' => 1,
            'user_id' => 1,
            'part_sp' => 'noun',
        ]);

        DB::table('words')->insert([
            'value' => 'fly',
            'translate' => 'Самолет',
            'group_id' => 1,
            'user_id' => 1,
            'part_sp' => 'noun',
        ]);

        DB::table('words')->insert([
            'value' => 'mother',
            'translate' => 'Мама',
            'group_id' => 2,
            'user_id' => 1,
            'part_sp' => 'noun',
        ]);

        DB::table('words')->insert([
            'value' => 'father',
            'translate' => 'Папа',
            'group_id' => 2,
            'user_id' => 1,
            'part_sp' => 'noun',
        ]);

//        words (`value`,`translate`,`group_id`, `user_id`, `part_sp`) VALUES ('car', 'автомобиль', 1, 1, 'noun');
    }
}
