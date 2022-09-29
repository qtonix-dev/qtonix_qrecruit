<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Interview;
use App\Models\CandidateDetail;
use App\Models\User;
use App\Models\InterviewType;
use App\Models\JobDetail;
use App\Models\InterviewLog;
use App\Models\CandidateTimeline;

use DB;
class InterviewController extends Controller
{
    public function scheduleAnInterview(Request $request){

        $input=$request->all();
        $interview_details=new Interview;
        $interview_details->user_id=$input['user_id'];
        $interview_details->candidate_id=$input['candidate_id'];
        $interview_details->interview_notes=isset($input['interview_notes'])? $input['interview_notes']:'';
        $interview_details->interview_type=$input['interview_type'];
        $interview_details->posting_id=$input['posting_title'];
        $interview_details->start_time=date('Y-m-d H:i:s',strtotime($input['start_time']));
        $interview_details->end_time=date('Y-m-d',strtotime($input['start_time'])).' '.date('H:i:s',strtotime($input['end_time']));
        $interview_details->interviewers=implode(", ",$input['interviewers']);
        $interview_details->location=$input['location'];
        $interview_details->save();


        $candidateTimeline=new CandidateTimeline;
        $candidateTimeline->candidate_id=$input['candidate_id'];
        $candidateTimeline->user_id=$input['user_id'];
        $candidateTimeline->value=$interview_details->id;
        $candidateTimeline->secondary_value=date('Y-m-d H:i:s',strtotime($input['start_time']));
        $candidateTimeline->type='interview scheduled';
        $candidateTimeline->save();

        $interviewLog=new InterviewLog;
        $interviewLog->interview_id=$interview_details->id;
        $interviewLog->user_id=$input['user_id'];
        $interviewLog->value=date('Y-m-d H:i:s',strtotime($input['start_time']));
        $interviewLog->type='interview scheduled';
        $interviewLog->save();

        return ['status'=>true];

    }
    public function updateInterviewDetails(Request $request){

        $input=$request->all();
        $interview_details=Interview::find($input['interview_id']);
        $interview_details->candidate_id=$input['candidate_id'];
        $interview_details->interview_notes=isset($input['interview_notes'])? $input['interview_notes']:'';
        $interview_details->interview_type=$input['interview_type'];
        $interview_details->posting_id=$input['posting_id'];
        $interview_details->start_time=date('Y-m-d H:i:s',strtotime($input['start_time']));
        $interview_details->end_time=date('Y-m-d',strtotime($input['start_time'])).' '.date('H:i:s',strtotime($input['end_time']));
        $interview_details->interviewers=implode(", ",$input['interviewers']);
        $interview_details->location=$input['location'];
        $interview_details->save();

        $candidateTimeline=new CandidateTimeline;
        $candidateTimeline->candidate_id=$input['candidate_id'];
        $candidateTimeline->user_id=$input['user_id'];
        $candidateTimeline->value=$interview_details->id;
        $candidateTimeline->type='interview details updated';
        $candidateTimeline->save();


        $interviewLog=new InterviewLog;
        $interviewLog->interview_id=$interview_details->id;
        $interviewLog->user_id=$input['user_id'];
        $interviewLog->value=date('Y-m-d H:i:s',strtotime($input['start_time']));
        $interviewLog->type='interview details updated';
        $interviewLog->save();

        return ['status'=>true];

    }
    function getInterviewList($input){
        $user=User::find($input['user_id']);
        if($user->user_type=="Manager"){

            $recruiters=User::where('manager_id',$input['user_id'])->pluck('id')->toArray();
            $interviewList=Interview::whereIn('user_id',$recruiters)->orderBy('id','desc');

        }
        else if($user->user_type=="Team Leader"){

            $recruiters=User::where('leader_id',$input['user_id'])->pluck('id')->toArray();
            $interviewList=Interview::whereIn('user_id',$recruiters)->orderBy('id','desc');

        }else if($user->user_type=="Recruiter"){

             $interviewList=Interview::where('user_id',$input['user_id'])->orderBy('id','desc');

        }else if($user->user_type=="Admin"){

             $interviewList=Interview::orderBy('id','desc');
        }
        if(isset($input['candidate_id'])){

            $interviewList=$interviewList->where('candidate_id',$input['candidate_id'])->get();
        }else{
            $interviewList=$interviewList->get();
        }
        $interviewList->map(function($interview){
            $interview['candidate_name']=CandidateDetail::find($interview->candidate_id)['name'];
            $interview['interviewer_names']=implode(', ',User::whereIn('id',explode(", ",$interview->interviewers))->pluck('name')->toArray());
            $interview['interview_type_name']=InterviewType::find($interview->interview_type)['name'];
            $interview['job_title']=JobDetail::find($interview->posting_id)['posting_title'];

        });
        return $interviewList;
    }
    public function getScheduledInterviewLists(Request $request){
        $input=$request->all();
        $jobs=JobDetail::get();
            
            $user=User::find($input['user_id']);

           

            if($user->user_type=="Manager"){

                $recruiters=User::where('manager_id',$input['user_id'])->where('user_type','Recruiter')->get();

                 $interviewers=User::where(function ($query) use ($user) {
                                    $query->where('manager_id',$user->id)->whereIn('user_type',['Recruiter','Manager']);
                                })
                            ->orWhere('id',$input['user_id'])
                            ->orWhere('user_type','Admin')
                            ->get();

                $recruiters=User::where('manager_id',$input['user_id'])->pluck('id')->toArray();
                $candidates=CandidateDetail::whereIn('candidate_owner',$recruiters)->get();

            }
            else if($user->user_type=="Team Leader"){

                $recruiters=User::where('leader_id',$input['user_id'])->where('user_type','Recruiter')->get();
                $interviewers=User::where(function ($query) use ($user) {
                                    $query->where('manager_id',$user->manager_id)->whereIn('user_type',['Recruiter','Manager']);
                                })
                            ->orWhere('id',$user->manager_id) ->orWhere('user_type','Admin')
                            ->get();
                $recruiters=User::where('leader_id',$input['user_id'])->pluck('id')->toArray();
                $candidates=CandidateDetail::whereIn('candidate_owner',$recruiters)->get();

            }else if($user->user_type=="Recruiter"){

                 $recruiters=User::where('leader_id',$user->leader_id)->where('user_type','Recruiter')->get();
                 $interviewers=User::where(function ($query) use ($user) {
                                    $query->where('manager_id',$user->manager_id)->whereIn('user_type',['Recruiter','Manager']);
                                })
                            ->orWhere('id',$user->manager_id) ->orWhere('user_type','Admin')
                            ->get();

                $candidates=CandidateDetail::where('candidate_owner',$input['user_id'])->get();

            }else if($user->user_type=="Admin"){

                 $recruiters=User::where('user_type','Recruiter')->get();
                 $interviewers=User::get();
                 $candidates=CandidateDetail::get();
            }

            $interviewTypes=InterviewType::get();
        $interviewList=$this->getInterviewList($input);
        
        return [
                'status'=>true,
                'interviewList'=>$interviewList,
                'interviewers'=>$interviewers,
                'jobs'=>$jobs,
                'interviewTypes'=>$interviewTypes,
                'candidates'=>$candidates
            ];
    }
    public function rescheduleInterview(Request $request){
        $input=$request->all();
        $interview_details=Interview::find($input['interview_id']);
        $interview_details->interview_notes=isset($input['interview_notes'])? $input['interview_notes']:'';
        $interview_details->start_time=date('Y-m-d H:i:s',strtotime($input['start_time']));
        $interview_details->end_time=date('Y-m-d',strtotime($input['start_time'])).' '.date('H:i:s',strtotime($input['end_time'])); 
        $interview_details->status='Scheduled';
        $interview_details->save();

        $candidateTimeline=new CandidateTimeline;
        $candidateTimeline->candidate_id=$interview_details->candidate_id;
        $candidateTimeline->user_id=$interview_details->user_id;
        $candidateTimeline->value=$interview_details->id;
        $candidateTimeline->type='interview rescheduled';
        $candidateTimeline->secondary_value=date('Y-m-d H:i:s',strtotime($input['start_time']));
        $candidateTimeline->save();


        $interviewLog=new InterviewLog;
        $interviewLog->interview_id=$interview_details->id;
        $interviewLog->user_id=$input['user_id'];
        $interviewLog->value=date('Y-m-d H:i:s',strtotime($input['start_time']));
        $interviewLog->type='interview rescheduled';
        $interviewLog->save();

        $interviewList=$this->getInterviewList($input);
        
        return ['status'=>true,'interviewList'=>$interviewList];

    }
    public function completeInterview(Request $request){
        $input=$request->all();
        $interview_details=Interview::find($input['interview_id']);
        $interview_details->status='Completed';
        $interview_details->save();

        $candidateTimeline=new CandidateTimeline;
        $candidateTimeline->candidate_id=$interview_details->candidate_id;
        $candidateTimeline->user_id=$interview_details->user_id;
        $candidateTimeline->value=$interview_details->id;
        $candidateTimeline->type='interview completed';
        $candidateTimeline->save();

        $interviewLog=new InterviewLog;
        $interviewLog->interview_id=$interview_details->id;
        $interviewLog->user_id=$input['user_id'];
        $interviewLog->value=date('Y-m-d H:i:s',strtotime($interview_details->start_time));
        $interviewLog->type='interview completed';
        $interviewLog->save();
        
        $interviewList=$this->getInterviewList($input);
        
        return ['status'=>true,'interviewList'=>$interviewList];

    }
    public function cancelInterview(Request $request){
        $input=$request->all();
         $interview_details=Interview::find($input['interview_id']);
        $interview_details->status='Cancelled';
        $interview_details->save();
         $candidateTimeline=new CandidateTimeline;
        $candidateTimeline->candidate_id=$interview_details->candidate_id;
        $candidateTimeline->user_id=$interview_details->user_id;
        $candidateTimeline->value=$interview_details->id;
        $candidateTimeline->type='interview cancelled';
        $candidateTimeline->save();

        $interviewLog=new InterviewLog;
        $interviewLog->interview_id=$interview_details->id;
        $interviewLog->user_id=$input['user_id'];
        $interviewLog->value=date('Y-m-d H:i:s',strtotime($interview_details->start_time));
        $interviewLog->type='interview cancelled';
        $interviewLog->save();
        $interviewList=$this->getInterviewList($input);
        
        return ['status'=>true,'interviewList'=>$interviewList];

    }
    public function getInterviewDetailsForEdit(Request $request){
        $input=$request->all();

        $jobs=JobDetail::get();
            
            $user=User::find($input['user_id']);

           

            if($user->user_type=="Manager"){

                $recruiters=User::where('manager_id',$input['user_id'])->where('user_type','Recruiter')->get();

                 $interviewers=User::where(function ($query) use ($user) {
                                    $query->where('manager_id',$user->id)->whereIn('user_type',['Recruiter','Manager']);
                                })
                            ->orWhere('id',$input['user_id'])
                            ->orWhere('user_type','Admin')
                            ->get();

                $recruiters=User::where('manager_id',$input['user_id'])->pluck('id')->toArray();
                $candidates=CandidateDetail::whereIn('candidate_owner',$recruiters)->get();

            }
            else if($user->user_type=="Team Leader"){

                $recruiters=User::where('leader_id',$input['user_id'])->where('user_type','Recruiter')->get();
                $interviewers=User::where(function ($query) use ($user) {
                                    $query->where('manager_id',$user->manager_id)->whereIn('user_type',['Recruiter','Manager']);
                                })
                            ->orWhere('id',$user->manager_id) ->orWhere('user_type','Admin')
                            ->get();
                $recruiters=User::where('leader_id',$input['user_id'])->pluck('id')->toArray();
                $candidates=CandidateDetail::whereIn('candidate_owner',$recruiters)->get();

            }else if($user->user_type=="Recruiter"){

                 $recruiters=User::where('leader_id',$user->leader_id)->where('user_type','Recruiter')->get();
                 $interviewers=User::where(function ($query) use ($user) {
                                    $query->where('manager_id',$user->manager_id)->whereIn('user_type',['Recruiter','Manager']);
                                })
                            ->orWhere('id',$user->manager_id) ->orWhere('user_type','Admin')
                            ->get();

                $candidates=CandidateDetail::where('candidate_owner',$input['user_id'])->get();

            }else if($user->user_type=="Admin"){

                 $recruiters=User::where('user_type','Recruiter')->get();
                 $interviewers=User::get();
                 $candidates=CandidateDetail::get();
            }

            $interviewTypes=InterviewType::get();
            $interview_details=Interview::find($input['interview_id']);
            //$interview_details['interviewers']=explode(", ",$interview_details->interviewers);

         return [
                'status'=>true,
                'interviewers'=>$interviewers,
                'jobs'=>$jobs,
                'interviewTypes'=>$interviewTypes,
                'candidates'=>$candidates,
                'interview_details'=>$interview_details
            ];
    }
    public function getMetadataForInterviewForm(Request $request){
         $input=$request->all();

        $jobs=JobDetail::get();
            
            $user=User::find($input['user_id']);

           

            if($user->user_type=="Manager"){

                $recruiters=User::where('manager_id',$input['user_id'])->where('user_type','Recruiter')->get();

                 $interviewers=User::where(function ($query) use ($user) {
                                    $query->where('manager_id',$user->id)->whereIn('user_type',['Recruiter','Manager']);
                                })
                            ->orWhere('id',$input['user_id'])
                            ->orWhere('user_type','Admin')
                            ->get();

                $recruiters=User::where('manager_id',$input['user_id'])->pluck('id')->toArray();
                $candidates=CandidateDetail::whereIn('candidate_owner',$recruiters)->get();

            }
            else if($user->user_type=="Team Leader"){

                $recruiters=User::where('leader_id',$input['user_id'])->where('user_type','Recruiter')->get();
                $interviewers=User::where(function ($query) use ($user) {
                                    $query->where('manager_id',$user->manager_id)->whereIn('user_type',['Recruiter','Manager']);
                                })
                            ->orWhere('id',$user->manager_id) ->orWhere('user_type','Admin')
                            ->get();
                $recruiters=User::where('leader_id',$input['user_id'])->pluck('id')->toArray();
                $candidates=CandidateDetail::whereIn('candidate_owner',$recruiters)->get();

            }else if($user->user_type=="Recruiter"){

                 $recruiters=User::where('leader_id',$user->leader_id)->where('user_type','Recruiter')->get();
                 $interviewers=User::where(function ($query) use ($user) {
                                    $query->where('manager_id',$user->manager_id)->whereIn('user_type',['Recruiter','Manager']);
                                })
                            ->orWhere('id',$user->manager_id) ->orWhere('user_type','Admin')
                            ->get();

                $candidates=CandidateDetail::where('candidate_owner',$input['user_id'])->get();

            }else if($user->user_type=="Admin"){

                 $recruiters=User::where('user_type','Recruiter')->get();
                 $interviewers=User::get();
                 $candidates=CandidateDetail::get();
            }

            $interviewTypes=InterviewType::get();

         return [
                'status'=>true,
                'interviewers'=>$interviewers,
                'jobs'=>$jobs,
                'interviewTypes'=>$interviewTypes,
                'candidates'=>$candidates
            ];
    }
}
