<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InterviewType;
use DB;
class InterviewTypeController extends Controller
{
    public function getInterviewTypes(Request $request){
        $interviewTypes=InterviewType::get();
        return ['status'=>true,'interviewTypes'=>$interviewTypes];
    }
    public function updateInterviewTypeDetails(Request $request){

        $input=$request->all();

        $interview_type_details=InterviewType::find($input['id']);
        $interview_type_details->name=$input['name'];
        $interview_type_details->save();

        return ['status'=>true,'interview_type_details'=>$interview_type_details];
    }
    public function saveInterviewTypeDetails(Request $request){

        $input=$request->all();

        $interview_type_details=new InterviewType;
        $interview_type_details->name=$input['name'];
        $interview_type_details->save();

        return ['status'=>true,'interview_type_details'=>$interview_type_details];
    }
     public function removeInterviewType(Request $request){
        $input=$request->all();
        
        InterviewType::where('id',$input['id'])->delete();

            $interviewTypes=InterviewType::get();
        return ['status'=>true,'interviewTypes'=>$interviewTypes];

    }
     public function getInterviewTypeDetails(Request $request){
        $interview_type_details=InterviewType::find($request->all()['id']);
        return ['status'=>true,'interview_type_details'=>$interview_type_details];
    }
}
