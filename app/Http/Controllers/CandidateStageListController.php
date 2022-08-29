<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CandidateStageList;
use DB;

class CandidateStageListController extends Controller
{
    public function getCandidateStageList(Request $request){
        $candidateStageLists=CandidateStageList::get();
        return ['status'=>true,'candidate_stage_list'=>$candidateStageLists];
    }
    public function updateCandidateStage(Request $request){

        $input=$request->all();

        $stage_details=CandidateStageList::find($input['id']);
        $stage_details->name=$input['name'];
        $stage_details->save();

        return ['status'=>true,'stage_details'=>$stage_details];
    }
    public function saveCandidateStage(Request $request){

        $input=$request->all();

        $stage_details=new CandidateStageList;
        $stage_details->name=$input['name'];
        $stage_details->save();

        return ['status'=>true,'stage_details'=>$stage_details];
    }
    public function removeCandidateStage(Request $request){
        $input=$request->all();
        
        CandidateStageList::where('id',$input['id'])->delete();

            $candidateStageLists=CandidateStageList::get();
        return ['status'=>true,'candidate_stage_list'=>$candidateStageLists];

    }
    public function getCandidateStageDetails(Request $request){
        $stage_details=CandidateStageList::find($request->all()['id']);
        return ['status'=>true,'stage_details'=>$stage_details];
    }
}
