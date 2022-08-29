<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JobType;
use DB;

class JobTypeController extends Controller
{
    public function getJobTypes(Request $request){
        $jobTypes=JobType::get();
        return ['status'=>true,'jobTypes'=>$jobTypes];
    }
    public function updateJobType(Request $request){

        $input=$request->all();

        $type_details=JobType::find($input['id']);
        $type_details->name=$input['name'];
        $type_details->save();

        return ['status'=>true,'type_details'=>$type_details];
    }
    public function savejobType(Request $request){

        $input=$request->all();

        $type_details=new JobType;
        $type_details->name=$input['name'];
        $type_details->save();

        return ['status'=>true,'type_details'=>$type_details];
    }
    public function removeJobType(Request $request){
        $input=$request->all();
        
        JobType::where('id',$input['id'])->delete();

            $jobTypes=JobType::get();
        return ['status'=>true,'jobTypes'=>$jobTypes];

    }
    public function getJobTypeDetails(Request $request){
        $type_details=JobType::find($request->all()['id']);
        return ['status'=>true,'type_details'=>$type_details];
    }
}
