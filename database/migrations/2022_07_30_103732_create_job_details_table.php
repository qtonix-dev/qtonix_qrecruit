<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJobDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('job_details', function (Blueprint $table) {
            $table->id();
            $table->string('posting_title')->nullable();
            $table->integer('department_id')->default(0);
            $table->string('job_title')->nullable();
            $table->integer('mananger_id')->default(0);
            $table->string('assigned_recruiter_ids')->nullable();
            $table->integer('no_of_positions')->default(0);
            $table->date('target_date')->nullable();
            $table->date('date_opened')->nullable();
            $table->string('job_status')->nullable();
            $table->string('job_type')->nullable();
            $table->string('industry')->nullable();
            $table->string('work_experience')->nullable();
            $table->integer('salary')->default(0);
            $table->mediumText('skillsets')->nullable();
            $table->integer('is_remotePosition')->default(0);
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->string('zip_code')->nullable();
            $table->longText('description')->nullable();
            $table->longText('requirements')->nullable();
            $table->longText('benefits')->nullable();
            $table->string('job_summary_attachment')->nullable();
            $table->string('other_attachment')->nullable();
            $table->integer('user_id')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('job_details');
    }
}
