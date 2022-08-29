<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRemoveFieldsToJob extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('job_details', function (Blueprint $table) {
            $table->dropColumn('industry');
            $table->dropColumn('country');
            $table->dropColumn('zip_code');
            $table->dropColumn('other_attachment');
            $table->dropColumn('skillsets');
            $table->dropColumn('job_status');
            $table->dropColumn('mananger_id');
            $table->integer('manager_id')->default(0);
            $table->dropColumn('job_opening_id');
            $table->dropColumn('job_type');
            $table->dropColumn('work_experience');

            $table->string('skillset_ids')->nullable();
            $table->string('job_summary_attachment_name')->nullable();
            $table->integer('job_status_id')->default(0);
            $table->integer('job_type_id')->default(0);
            $table->integer('experience_id')->default(0);
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
            $table->string('industry')->nullable();
            $table->string('country')->nullable();
            $table->string('zip_code')->nullable();
            $table->string('other_attachment')->nullable();
            $table->mediumText('skillsets')->nullable();
            $table->string('job_status')->nullable();
            $table->integer('job_opening_id')->default(0);
            $table->dropColumn('manager_id');
            $table->integer('mananger_id')->default(0);

            $table->string('job_type')->nullable();
            $table->string('work_experience')->nullable();
            
            $table->dropColumn('skillset_ids');
            $table->dropColumn('job_summary_attachment_name');
            $table->dropColumn('job_status_id');
            $table->dropColumn('job_type_id');
            $table->dropColumn('experience_id');
        });
    }
}
