<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class createDB extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'createDB:start {name?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create database';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $schemaName = $this->argument('name') ?: config("database.connections.mysql.database");

        $charset = config("database.connections.mysql.charset",'utf8mb4');

        $collation = config("database.connections.mysql.collation",'utf8mb4_unicode_ci');

        $query = "CREATE DATABASE IF NOT EXISTS $schemaName CHARACTER SET $charset COLLATE $collation;";


        config(["database.connections.mysql.database" => $schemaName]);

        DB::statement($query);
    }
}
