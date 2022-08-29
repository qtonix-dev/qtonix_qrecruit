<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class HRController extends Controller
{
    
    public function getMyCandidates(Request $request){
         $input=$request->all();
        $users=User::where('id',CandidateDetail::where('added_by',$input['added_by'])->pluck('user_id')->toArray())->get();

        $users->map(function($user){
            $user['candidate_details']=CandidateDetail::where('candidate_id',$user->id)->first();
            $user['education_details']=CandidateEducationalDetail::where('candidate_id',$user->id)->get();
            $user['experience_details']=CandidateExperienceDetail::where('candidate_id',$user->id)->get();
            $user['candidate_skills']=CandidateSkill::where('candidate_id',$user->id)->first();

        });

         return ['status'=>true,'candidates'=>$users];

    }
    public function getListsOfRecruiters(Request $request){
         $input=$request->all();
        if(isset($input['leader_id'])){
            $users=User::where('user_type','Recruiter')->where('leader_id',$input['leader_id'])->get();

        }elseif(isset($input['manager_id'])){
            $users=User::where('user_type','Recruiter')->where('manager_id',$input['manager_id'])->get();

        }elseif(isset($input['company_id'])){
            $users=User::where('user_type','Recruiter')->where('company_id',$input['company_id'])->get();
        }else{
             $users=User::where('user_type','Recruiter')->get();
        }

        return ['status'=>true,'recruiters'=>$users];

    }
    public function getListsOfManagers(Request $request){

        $input=$request->all();
        if(isset($input['company_id'])){
            $users=User::where('user_type','Manager')->where('company_id',$input['company_id'])->get();
        }else{
             $users=User::where('user_type','Manager')->get();
        }
        return ['status'=>true,'managers'=>$users];

    }
    public function getListsOfTeamLeaders(Request $request){

            $input=$request->all();
        if(isset($input['manager_id'])){
            $users=User::where('user_type','Team Leader')->where('manager_id',$input['manager_id'])->get();
        }elseif(isset($input['company_id'])){
            $users=User::where('user_type','Team Leader')->where('company_id',$input['company_id'])->get();
        }else{
            $users=User::where('user_type','Team Leader')->get();
        }

        

        return ['status'=>true,'leaders'=>$users];

    }

}
