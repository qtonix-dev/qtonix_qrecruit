<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCandidateExperienceDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('candidate_experience_details', function (Blueprint $table) {
            $table->id(); 
            $table->string('title')->nullable();
            $table->string('company')->nullable();
            $table->longText('summary')->nullable();
            $table->integer('start_month')->default(0);
            $table->integer('start_year')->default(0);
            $table->integer('end_month')->default(0);
            $table->integer('end_year')->default(0);
            $table->integer('currently_working')->default(0);
            $table->integer('candidate_id')->default(0);
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
        Schema::dropIfExists('candidate_experience_details');
    }
}
