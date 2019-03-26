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




        DB::table('parts')->insert([
            'value' => 'Noun',
        ]);
        DB::table('parts')->insert([
            'value' => 'Verb',
        ]);
        DB::table('parts')->insert([
            'value' => 'Adjective',
        ]);
        DB::table('parts')->insert([
            'value' => 'Numeral',
        ]);
        DB::table('parts')->insert([
            'value' => 'Pronoun',
        ]);
        DB::table('parts')->insert([
            'value' => 'Adverb',
        ]);
        DB::table('parts')->insert([
            'value' => 'Article',
        ]);
        DB::table('parts')->insert([
            'value' => 'Preposition',
        ]);
        DB::table('parts')->insert([
            'value' => 'Conjunction',
        ]);
        DB::table('parts')->insert([
            'value' => 'Interjection',
        ]);




        DB::table('words')->insert([
            'value' => 'car',
            'translate' => 'Автомобиль',
            'group_id' => 1,
            'user_id' => 1,
            'part_id' => 1,
        ]);

        DB::table('words')->insert([
            'value' => 'fly',
            'translate' => 'Самолет',
            'group_id' => 1,
            'user_id' => 1,
            'part_id' => 1,
        ]);

        DB::table('words')->insert([
            'value' => 'mother',
            'translate' => 'Мама',
            'group_id' => 2,
            'user_id' => 1,
            'part_id' => 1,
        ]);

        DB::table('words')->insert([
            'value' => 'father',
            'translate' => 'Папа',
            'group_id' => 2,
            'user_id' => 1,
            'part_id' => 1,
        ]);

//        words (`value`,`translate`,`group_id`, `user_id`, `part_sp`) VALUES ('car', 'автомобиль', 1, 1, 'noun');
    }
}
