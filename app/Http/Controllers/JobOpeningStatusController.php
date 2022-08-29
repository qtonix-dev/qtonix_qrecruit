<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JobOpeningStatus;
use DB;

class JobOpeningStatusController extends Controller
{
    public function getJobOpeningStatusList(Request $request){
        $statusList=JobOpeningStatus::get();
        return ['status'=>true,'statusList'=>$statusList];
    }
    public function updateJobOpeningStatus(Request $request){

        $input=$request->all();

        $status_details=JobOpeningStatus::find($input['id']);
        $status_details->name=$input['name'];
        $status_details->save();

        return ['status'=>true,'status_details'=>$status_details];
    }
    public function saveJobOpeningStatus(Request $request){

        $input=$request->all();

        $status_details=new JobOpeningStatus;
        $status_details->name=$input['name'];
        $status_details->save();

        return ['status'=>true,'status_details'=>$status_details];
    }
    public function removeJobOpeningStatus(Request $request){
        $input=$request->all();
        
        JobOpeningStatus::where('id',$input['id'])->delete();

            $statusList=JobOpeningStatus::get();
        return ['status'=>true,'statusList'=>$statusList];

    }
    public function getJobOpeningStatusDetails(Request $request){
        $status_details=JobOpeningStatus::find($request->all()['id']);
        return ['status'=>true,'status_details'=>$status_details];
    }
}
