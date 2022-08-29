<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCandidateDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('candidate_details', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('mobileNo');
            $table->string('altMobileNo');
            $table->string('street')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->string('zip_code')->nullable();
            $table->integer('company_id')->nullable();
            $table->integer('exp_in_year')->default(0);
            $table->string('highest_qualification')->nullable();
            $table->string('current_job_title')->nullable();
            $table->string('current_employer')->nullable();
            $table->integer('current_salary')->default(0);
            $table->integer('expected_salary')->default(0); 
            $table->string('candidate_status')->nullable();
            $table->string('source')->nullable();
            $table->integer('added_by')->default(0);
            $table->string('resume')->nullable();
            $table->string('resume_name')->nullable();
            $table->rememberToken();
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
        Schema::dropIfExists('candidate_details');
    }
}
