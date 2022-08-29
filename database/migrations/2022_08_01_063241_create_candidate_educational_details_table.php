<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCandidateEducationalDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('candidate_educational_details', function (Blueprint $table) {
            $table->id();
            $table->string('institute')->nullable();
            $table->string('department')->nullable();
            $table->string('degree')->nullable();
            $table->integer('start_year')->default(0);
            $table->integer('end_year')->default(0);
            $table->integer('currently_persuring')->default(0);
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
        Schema::dropIfExists('candidate_educational_details');
    }
}
