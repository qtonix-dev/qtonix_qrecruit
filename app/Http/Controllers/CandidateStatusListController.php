<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CandidateStatusList;
use DB;

class CandidateStatusListController extends Controller
{
   public function getCandidateStatusList(Request $request){
        $candidateStatusLists=CandidateStatusList::get();
        return ['status'=>true,'candidate_status_list'=>$candidateStatusLists];
    }
    public function updateCandidateStatus(Request $request){

        $input=$request->all();

        $status_details=CandidateStatusList::find($input['id']);
        $status_details->name=$input['name'];
        $status_details->save();

        return ['status'=>true,'status_details'=>$status_details];
    }
    public function saveCandidateStatus(Request $request){

        $input=$request->all();

        $status_details=new CandidateStatusList;
        $status_details->name=$input['name'];
        $status_details->save();

        return ['status'=>true,'status_details'=>$status_details];
    }
    public function removeCandidateStatus(Request $request){
        $input=$request->all();
        
        CandidateStatusList::where('id',$input['id'])->delete();

            $candidate_status_list=CandidateStatusList::get();
        return ['status'=>true,'candidate_status_list'=>$candidate_status_list];

    }
    public function getCandidateStatusDetails(Request $request){
        $status_details=CandidateStatusList::find($request->all()['id']);
        return ['status'=>true,'status_details'=>$status_details];
    }
}
