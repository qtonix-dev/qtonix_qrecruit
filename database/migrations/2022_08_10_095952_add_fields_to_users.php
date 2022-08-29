<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldsToUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('personal_email')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('alt_phone_number')->nullable();
            $table->string('employee_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('personal_email');
            $table->dropColumn('phone_number');
            $table->dropColumn('alt_phone_number');
            $table->dropColumn('employee_id');
        });
    }
}
