<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CandidateSourceList;
use DB;

class CandidateSourceListController extends Controller
{
    public function getCandidateSourceList(Request $request){
        $candidateSourceLists=CandidateSourceList::get();
        return ['status'=>true,'candidate_source_list'=>$candidateSourceLists];
    }
    public function updateCandidateSource(Request $request){

        $input=$request->all();

        $source_details=CandidateSourceList::find($input['id']);
        $source_details->name=$input['name'];
        $source_details->save();

        return ['status'=>true,'source_details'=>$source_details];
    }
    public function saveCandidateSource(Request $request){

        $input=$request->all();

        $source_details=new CandidateSourceList;
        $source_details->name=$input['name'];
        $source_details->save();

        return ['status'=>true,'source_details'=>$source_details];
    }
    public function removeCandidateSource(Request $request){
        $input=$request->all();
        
        CandidateSourceList::where('id',$input['id'])->delete();

            $candidateSourceLists=CandidateSourceList::get();
        return ['status'=>true,'candidate_source_list'=>$candidateSourceLists];

    }
    public function getCandidateSourceDetails(Request $request){
        $source_details=CandidateSourceList::find($request->all()['id']);
        return ['status'=>true,'source_details'=>$source_details];
    }
}
