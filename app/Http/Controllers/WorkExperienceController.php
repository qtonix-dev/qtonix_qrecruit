<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WorkExperience;
use DB;

class WorkExperienceController extends Controller
{
   public function getWorkExperiences(Request $request){
        $workExperiences=WorkExperience::get();
        return ['status'=>true,'workExperiences'=>$workExperiences];
    }
    public function updateWorkExperience(Request $request){

        $input=$request->all();

        $exp_details=WorkExperience::find($input['id']);
        $exp_details->name=$input['name'];
        $exp_details->save();

        return ['status'=>true,'exp_details'=>$exp_details];
    }
    public function saveWorkExperience(Request $request){

        $input=$request->all();

        $exp_details=new WorkExperience;
        $exp_details->name=$input['name'];
        $exp_details->save();

        return ['status'=>true,'exp_details'=>$exp_details];
    }
    public function removeWorkExperience(Request $request){
        $input=$request->all();
        
        WorkExperience::where('id',$input['id'])->delete();

            $workExperiences=WorkExperience::get();
        return ['status'=>true,'workExperiences'=>$workExperiences];

    }
    public function getWorkExperienceDetails (Request $request){
        $exp_details=WorkExperience::find($request->all()['id']);
        return ['status'=>true,'exp_details'=>$exp_details];
    }
}
