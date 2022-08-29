<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUrlAndStatusToJobDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('job_details', function (Blueprint $table) {
            $table->string('url')->nullable();
            $table->string('job_opening_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('job_details', function (Blueprint $table) {
           $table->dropColumn('url');
           $table->dropColumn('job_opening_id');
        });
    }
}
