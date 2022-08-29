<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SkillSet;
use DB;

class SkillSetController extends Controller
{  

    public function getSkillSets(Request $request){
        $skillSets=SkillSet::get();
        return ['status'=>true,'skillSets'=>$skillSets];
    }
    public function updateSkillSet(Request $request){

        $input=$request->all();

        $skill_details=SkillSet::find($input['id']);
        $skill_details->name=$input['name'];
        $skill_details->save();

        return ['status'=>true,'skill_details'=>$skill_details];
    }
    public function saveSkillSet(Request $request){

        $input=$request->all();

        $skill_details=new SkillSet;
        $skill_details->name=$input['name'];
        $skill_details->save();

        return ['status'=>true,'skill_details'=>$skill_details];
    }
    public function removeSkillSet(Request $request){
        $input=$request->all();
        
        SkillSet::where('id',$input['id'])->delete();

            $skillSets=SkillSet::get();
        return ['status'=>true,'skillSets'=>$skillSets];

    }
    public function getSkillSetDetails(Request $request){
        $skill_details=SkillSet::find($request->all()['id']);
        return ['status'=>true,'skill_details'=>$skill_details];
    }
}
