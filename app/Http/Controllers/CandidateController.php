<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JobDetail;
use App\Models\User;
use App\Models\AppliedJob;
use App\Models\CandidateDetail;
use App\Models\CandidateEducationalDetail;
use App\Models\CandidateExperienceDetail;
use App\Models\CandidateSkill;
use App\Models\CandidateStage;
use App\Models\JobOpeningStatus;

use App\Models\CandidateSourceList;
use App\Models\CandidateStageList;
use App\Models\CandidateStatusList;
use App\Models\SkillSet;
use App\Models\Department;
use App\Models\CandidateNote;
use App\Models\CandidateCall;
use App\Models\SubmittedCandidate;
use App\Models\CandidateReviews;
use App\Models\CandidateTimeline;
use App\Models\CandidateAttachment;
use App\Models\Interview;

use App\Models\InterviewType;
use App\Models\NoteType;

use DB;

class CandidateController extends Controller
{
    public function getDashboardData(Request $request){


        $hiredId=CandidateStageList::where('name','Hired')->first();
        $rejectId=CandidateStageList::where('name','Rejected')->first();

        $jobStatus=JobOpeningStatus::whereIn('name',['Filled','Cancelled'])->pluck('id')->toArray();

        $totalCandidates=CandidateDetail::count();
        $totalJobs=JobDetail::whereNotIn('job_status_id',$jobStatus)->count();
        $hiredCandidatesCount=CandidateDetail::whereMonth('created_at', date('m'))->where('stage',$hiredId)->count();
        $rejectedCandidatesCount=CandidateDetail::whereMonth('created_at', date('m'))->where('stage',$rejectId)->count();


       /* $candidateCountArray=CandidateDetail::select(DB::raw('count(id) as `data`'), DB::raw("DATE_FORMAT(created_at, '%Y-%m-01') month_date"),  DB::raw('YEAR(created_at) year, MONTH(created_at) month'))
            ->where('created_at','>',date('Y-m-01 H:i:s',strtotime(date('Y-m ').' -1 year +1 month')))
            ->groupby('year','month')
            ->orderBy('created_at','desc')->pluck('data','month_date')->toArray();*/

         $candidateCountArray=CandidateDetail::select(DB::raw('count(id) as `data`'), DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') create_date"))
            ->where('created_at','>=',date("Y-m-d", strtotime( date( 'Y-m-d' )." -7 days")))
            ->groupby('create_date')
            ->orderBy('created_at','desc')->pluck('data','create_date')->toArray();    


            $candidate_inflow=[];

        

        //date("Y-m-d", strtotime( date( 'Y-m-d' )." -7 days"))


        for($i=7;$i>0;$i--){
               $candidate_inflow[date("Y-m-d", strtotime( date( 'Y-m-d' )." -$i days"))]=0;
        }
        foreach($candidateCountArray as $index=>$candidateArray){

            $candidate_inflow[$index]=$candidateArray;
        }
        $stage_summary=[];
        $stages=CandidateStageList::get();

        foreach($stages as $stage){

            $stage_summary[$stage['name']]=CandidateDetail::where('stage',$stage->id)->count();
        }
            

            return [
                    'status'=>true,
                    'candidate_inflow'=>$candidate_inflow,
                    'stage_summary'=>$stage_summary,
                    'hiredCandidatesCount'=>$hiredCandidatesCount,
                    'rejectedCandidatesCount'=>$rejectedCandidatesCount,
                    'totalCandidates'=>$totalCandidates,
                    'totalJobs'=>$totalJobs,
                    'date'=>date("Y-m-d", strtotime( date( 'Y-m-d' )." -7 days"))
                ];
    }
    public function submitCandidateToManager(Request $request){
        $input=$request->all();

        $submittedCandidate=new SubmittedCandidate;
        $submittedCandidate->candidate_id=$input['candidate_id'];
        $submittedCandidate->user_id=$input['user_id'];
        $submittedCandidate->manager_id=$input['manager_id'];
        $submittedCandidate->save();

        $candidateTimeline=new CandidateTimeline;
        $candidateTimeline->candidate_id=$input['candidate_id'];
        $candidateTimeline->user_id=$input['user_id'];
        $candidateTimeline->value=User::find($input['manager_id'])['name'];
        $candidateTimeline->type='candidate submission';
        $candidateTimeline->save();

        return ['candidateTimelines'=>$this->getCandidateTimeline($input['candidate_id']),'status'=>true];
       
    }
    public function getCandidateforStageKanban(Request $request){
        $input=$request->all();
        $stage_summary=[];
        $stages=CandidateStageList::get();
        foreach($stages as $stage){
            $stage_item['id']=$stage->id;
            $stage_item['title']=$stage->name;
            $stage_item['class']=$stage->name;
            $candidates=CandidateDetail::select('*',DB::raw("CONCAT(current_job_title ,' ', current_employer) as title"))->where('stage',$stage->id)->get();
            $candidates->map(function($candidate){
                $candidate['education_details']=CandidateEducationalDetail::where('candidate_id',$candidate->id)->get();
                $candidate['experience_details']=CandidateExperienceDetail::where('candidate_id',$candidate->id)->get();
                $candidate['candidate_skills']=CandidateSkill::where('candidate_id',$candidate->id)->get();
                $candidate['candidate_status_name']=CandidateStatusList::find($candidate->candidate_status)['name'];
                $candidate['modified_date']=date('Y-m-d',strtotime($candidate->modified_date));
                if($candidate['candidate_owner']){
                     $candidate['candidate_owner_name']=User::find($candidate['candidate_owner'])['name'];
                }

            });
            $stage_item['cards']=$candidates;
            $stage_summary[]=$stage_item;
        }    

            return [
                    'status'=>true,
                    'stages'=>$stage_summary
                ];
    }
    public function updateCandidateStageOfCandidate(Request $request){
        $input=$request->all();
        $candidate_details=CandidateDetail::find($input['candidate_id']);
        $candidate_details->modified_date=date('Y-m-d H:i:s');
        $candidate_details->stage=$input['stage'];
        /*$candidate_details->rating=$input['rating'];
        $candidate_details->rejection_reason=(isset($input['rejection_reason']) && $input['rejection_reason'])?$input['rejection_reason']:'';*/
        $candidate_details->save();


        if(CandidateStage::where('candidate_id',$candidate_details->id)->orderBy('id','desc')->first()['stage']!=$input['stage']){
                $candidate_stage=new CandidateStage;
                $candidate_stage->candidate_id=$candidate_details->id;
                $candidate_stage->stage=$input['stage'];
               /* $candidate_stage->rating=$input['rating'];*/
                $candidate_stage->save();
        }


        $candidateTimeline=new CandidateTimeline;
        $candidateTimeline->candidate_id=$input['candidate_id'];
        $candidateTimeline->user_id=$input['user_id'];
        $candidateTimeline->type='stage changed';
        $candidateTimeline->value=CandidateStageList::find($input['stage'])['name'];
        $candidateTimeline->save();

        return [
                    'candidateTimelines'=>$this->getCandidateTimeline($input['candidate_id']),
                    'status'=>true
                ];
    }
    public function addNotesToCandidate(Request $request){
         $input=$request->all();

        $candidate_note=new CandidateNote;
        $candidate_note->user_id=$input['user_id'];
        $candidate_note->candidate_id=$input['candidate_id'];
        $candidate_note->note_type=isset($input['note_type'])?$input['note_type']:0;
        $candidate_note->notes=$input['notes'];
        $candidate_note->save();

        $candidateTimeline=new CandidateTimeline;
        $candidateTimeline->candidate_id=$input['candidate_id'];
        $candidateTimeline->user_id=$input['user_id'];
        $candidateTimeline->type='note added';
        $candidateTimeline->value=$input['notes'];
        $candidateTimeline->secondary_value=isset($input['note_type'])?$input['note_type']:NULL;
        $candidateTimeline->save();


        $candidate_notes=CandidateNote::where('candidate_id',$input['candidate_id'])
                                        ->leftJoin('users','candidate_notes.user_id','users.id')
                                        ->leftJoin('note_types','note_types.id','candidate_notes.note_type')
                                        ->orderBy('candidate_notes.created_at','desc')
                                        ->select('candidate_notes.*','users.name','note_types.name as note_type_name')
                                        ->get();

        return [
                    'status'=>true,
                    'candidateTimelines'=>$this->getCandidateTimeline($input['candidate_id']),
                    'candidate_notes'=>$candidate_notes
                ];
    }
    public function updateNotesOfCandidate(Request $request){
         $input=$request->all();

        $candidate_note=CandidateNote::find($input['note_id']);
        $candidate_note->note_type=isset($input['note_type'])?$input['note_type']:0;
        $candidate_note->notes=$input['notes'];
        $candidate_note->save();

        $candidateTimeline=new CandidateTimeline;
        $candidateTimeline->candidate_id=$candidate_note->candidate_id;
        $candidateTimeline->user_id=$candidate_note->user_id;
        $candidateTimeline->type='note updated';
        $candidateTimeline->value=$input['notes'];
        $candidateTimeline->secondary_value=isset($input['note_type'])?$input['note_type']:NULL;
        $candidateTimeline->save();


        $candidate_notes=CandidateNote::where('candidate_id',$candidate_note->candidate_id)
                                        ->leftJoin('users','candidate_notes.user_id','users.id')
                                        ->leftJoin('note_types','note_types.id','candidate_notes.note_type')
                                        ->orderBy('candidate_notes.created_at','desc')
                                        ->select('candidate_notes.*','users.name','note_types.name as note_type_name')
                                        ->get();

        return [
                    'status'=>true,
                    'candidateTimelines'=>$this->getCandidateTimeline($candidate_note->candidate_id),
                    'candidate_notes'=>$candidate_notes
                ];
    }
    public function addCallLogsToCandidate(Request $request){
         $input=$request->all();

        $call_log=new CandidateCall;
        $call_log->user_id=$input['user_id'];
        $call_log->candidate_id=$input['candidate_id'];
        $call_log->start_time=$input['start_time'];
        $call_log->end_time=$input['end_time'];
        $call_log->save();


        $candidateTimeline=new CandidateTimeline;
        $candidateTimeline->candidate_id=$input['candidate_id'];
        $candidateTimeline->user_id=$input['user_id'];
        $candidateTimeline->type='call added';
        $candidateTimeline->value=$input['start_time'].' - '.$input['end_time'];
        $candidateTimeline->save();

        $call_logs=CandidateCall::where('candidate_id',$input['candidate_id'])
                                        ->leftJoin('users','candidate_calls.user_id','users.id')
                                        ->orderBy('candidate_calls.created_at','desc')
                                        ->select('candidate_calls.*','users.name')
                                        ->get();
            $call_logs->map(function($log){
                   
                    $log['start_date']=date('Y-m-d H:i:s', strtotime(date('Y-m-d').' '.$log->start_time));
                    $log['end_date']=date('Y-m-d H:i:s', strtotime(date('Y-m-d').' '.$log->end_time));

                });
        return [
                    'status'=>true,
                    'candidateTimelines'=>$this->getCandidateTimeline($input['candidate_id']),
                    'call_logs'=>$call_logs
                ];
    }
    public function updateCallLogOfCandidate(Request $request){
         $input=$request->all();

        $call_log=CandidateCall::find($input['log_id']);
        $call_log->start_time=$input['start_time'];
        $call_log->end_time=$input['end_time'];
        $call_log->save();


        $candidateTimeline=new CandidateTimeline;
        $candidateTimeline->candidate_id=$call_log->candidate_id;
        $candidateTimeline->user_id=$call_log->user_id;
        $candidateTimeline->type='call updated';
        $candidateTimeline->value=$input['start_time'].' - '.$input['end_time'];
        $candidateTimeline->save();

        $call_logs=CandidateCall::where('candidate_id',$call_log->candidate_id)
                                        ->leftJoin('users','candidate_calls.user_id','users.id')
                                        ->orderBy('candidate_calls.created_at','desc')
                                        ->select('candidate_calls.*','users.name')
                                        ->get();
        $call_logs->map(function($log){
                   
                    $log['start_date']=date('Y-m-d H:i:s', strtotime(date('Y-m-d').' '.$log->start_time));
                    $log['end_date']=date('Y-m-d H:i:s', strtotime(date('Y-m-d').' '.$log->end_time));

                });

        return [
                    'status'=>true,
                    'candidateTimelines'=>$this->getCandidateTimeline($call_log->candidate_id),
                    'call_logs'=>$call_logs
                ];
    }
    public function updateRatingReasonOfCandidate(Request $request){
        $input=$request->all();
        $candidate_details=CandidateDetail::find($input['candidate_id']);
        $candidate_details->modified_date=date('Y-m-d H:i:s');
        $candidate_details->rating=$input['rating'];
        $candidate_details->rejection_reason=isset($input['rejection_reason'])?$input['rejection_reason']:'';
        $candidate_details->save();

        $candidate_stage=CandidateStage::where('candidate_id',$candidate_details->id)->orderBy('id','desc')->first();
        $candidate_stage->rating=$input['rating'];
        $candidate_stage->save();

        $candidateReviews=new CandidateReviews;
        $candidateReviews->rating=$input['rating'];
        $candidateReviews->reviews=(isset($input['rejection_reason']) && $input['rejection_reason'])?$input['rejection_reason']:'';
        $candidateReviews->candidate_id=$input['candidate_id'];
        $candidateReviews->user_id=$input['user_id'];
        $candidateReviews->save();


        $candidateTimeline=new CandidateTimeline;
        $candidateTimeline->candidate_id=$input['candidate_id'];
        $candidateTimeline->user_id=$input['user_id'];
        $candidateTimeline->type='rating updated';
        $candidateTimeline->value=$input['rating'];
        $candidateTimeline->save();


        return [
                    'candidateTimelines'=>$this->getCandidateTimeline($input['candidate_id']),
                    'status'=>true
                ];

    }
    public function checkDuplicacyWithEmail(Request $request){
        $input=$request->all();

        if(isset($input['candidate_id'])){
           if(CandidateDetail::where('email',$input['email'])->where('id','<>',$input['candidate_id'])->first()){
                $candidate_found=true;
            }else{
                $candidate_found=false;
            } 
        }else{
            if(CandidateDetail::where('email',$input['email'])->first()){
                $candidate_found=true;
            }else{
                $candidate_found=false;
            }
        }

        

        return ['status'=>true,'candidate_found'=>$candidate_found];
        
    }
    public function checkDuplicacyWithMobileNo(Request $request){
        $input=$request->all();
        if(isset($input['candidate_id'])){
                if(CandidateDetail::where(function ($query) use ($input) { $query->where('mobileNo',$input['mobileNo'])->orWhere('altMobileNo',$input['mobileNo']);})->where('id','<>',$input['candidate_id'])->first()){
                    $candidate_found=true;
                }else{
                    $candidate_found=false;
                }
        }else{
                if(CandidateDetail::where(function ($query) use ($input) { $query->where('mobileNo',$input['mobileNo'])->orWhere('altMobileNo',$input['mobileNo']);})->first()){
                    $candidate_found=true;
                }else{
                    $candidate_found=false;
                }
        }

        return ['status'=>true,'candidate_found'=>$candidate_found];
        
    }
    public function getCandidateLists(Request $request){
        $input=$request->all();
        $candidates=CandidateDetail::get();

        $candidates->map(function($candidate){
            //$candidate['candidate_details']=CandidateDetail::where('candidate_id',$candidate->id)->first();
            $candidate['education_details']=CandidateEducationalDetail::where('candidate_id',$candidate->id)->get();
            $candidate['experience_details']=CandidateExperienceDetail::where('candidate_id',$candidate->id)->get();
            $candidate['candidate_skills']=CandidateSkill::where('candidate_id',$candidate->id)->get();
            $candidate['candidate_stage']=CandidateStage::where('candidate_id',$candidate->id)->orderBy('id','desc')->first();
            $candidate['candidate_source_name']=CandidateSourceList::find($candidate->source)['name'];
            $candidate['modified_date']=date('Y-m-d',strtotime($candidate->modified_date));

            if($candidate['candidate_stage']){
                 $candidate['candidate_stage']['name']=CandidateStageList::find($candidate['stage'])['name'];
            }
           if($candidate['candidate_owner']){
                 $candidate['candidate_owner_name']=User::find($candidate['candidate_owner'])['name'];
            }

        });
        $stages=CandidateStageList::get();
        return ['status'=>true,'candidates'=>$candidates,'stages'=>$stages];
    }
     public function getSubmittedCandidateLists(Request $request){
        $input=$request->all();
        $user=User::find($input['user_id']);

        if($user->user_type=="Manager"){

            $candidate_ids=SubmittedCandidate::where('manager_id',$input['user_id'])->pluck('candidate_id')->toArray();
            $candidates=CandidateDetail::whereIn('id',$candidate_ids)->get();

        }
        else if($user->user_type=="Team Leader"){

            $recruiters=User::where('leader_id',$input['user_id'])->pluck('id')->toArray();
            $candidate_ids=SubmittedCandidate::where('user_id',$recruiters)->orWhere('user_id',$user->id)->pluck('candidate_id')->toArray();
            $candidates=CandidateDetail::whereIn('id',$candidate_ids)->get();

        }else if($user->user_type=="Recruiter"){

             $candidate_ids=SubmittedCandidate::where('user_id',$user->id)->pluck('candidate_id')->toArray();
            $candidates=CandidateDetail::whereIn('id',$candidate_ids)->get();

        }else if($user->user_type=="Admin"){

             $candidate_ids=SubmittedCandidate::pluck('candidate_id')->toArray();
            $candidates=CandidateDetail::whereIn('id',$candidate_ids)->get();
        }
       

        $candidates->map(function($candidate){
            //$candidate['candidate_details']=CandidateDetail::where('candidate_id',$candidate->id)->first();
            $candidate['education_details']=CandidateEducationalDetail::where('candidate_id',$candidate->id)->get();
            $candidate['experience_details']=CandidateExperienceDetail::where('candidate_id',$candidate->id)->get();
            $candidate['candidate_skills']=CandidateSkill::where('candidate_id',$candidate->id)->get();
            $candidate['candidate_stage']=CandidateStage::where('candidate_id',$candidate->id)->orderBy('id','desc')->first();
            $candidate['candidate_source_name']=CandidateSourceList::find($candidate->source)['name'];
            $candidate['modified_date']=date('Y-m-d',strtotime($candidate->modified_date));

            if($candidate['candidate_stage']){
                 $candidate['candidate_stage']['name']=CandidateStageList::find($candidate['stage'])['name'];
            }
           if($candidate['candidate_owner']){
                 $candidate['candidate_owner_name']=User::find($candidate['candidate_owner'])['name'];
            }

        });
        
        return ['status'=>true,'candidates'=>$candidates];
    }
     public function getFilteredCandidateLists(Request $request){
        $input=$request->all();
        $user=User::find($input['user_id']);
        if($user->user_type=="Manager"){

            $recruiters=User::where('manager_id',$input['user_id'])->pluck('id')->toArray();
            $candidates=CandidateDetail::whereIn('candidate_owner',$recruiters)->get();

        }
        else if($user->user_type=="Team Leader"){

            $recruiters=User::where('leader_id',$input['user_id'])->pluck('id')->toArray();
            $candidates=CandidateDetail::whereIn('candidate_owner',$recruiters)->get();

        }else if($user->user_type=="Recruiter"){

             $candidates=CandidateDetail::where('candidate_owner',$input['user_id'])->get();

        }else if($user->user_type=="Admin"){

             $candidates=CandidateDetail::get();
        }
       

        $candidates->map(function($candidate){
            //$candidate['candidate_details']=CandidateDetail::where('candidate_id',$candidate->id)->first();
            $candidate['education_details']=CandidateEducationalDetail::where('candidate_id',$candidate->id)->get();
            $candidate['experience_details']=CandidateExperienceDetail::where('candidate_id',$candidate->id)->get();
            $candidate['candidate_skills']=CandidateSkill::where('candidate_id',$candidate->id)->get();
            $candidate['candidate_stage']=CandidateStage::where('candidate_id',$candidate->id)->orderBy('id','desc')->first();
            $candidate['candidate_source_name']=CandidateSourceList::find($candidate->source)['name'];
            $candidate['modified_date']=date('Y-m-d',strtotime($candidate->modified_date));

            if($candidate['candidate_stage']){
                 $candidate['candidate_stage']['name']=CandidateStageList::find($candidate['stage'])['name'];
            }
           if($candidate['candidate_owner']){
                 $candidate['candidate_owner_name']=User::find($candidate['candidate_owner'])['name'];
            }

        });

        $stage_summary=[];
        $stages=CandidateStageList::get();
        foreach($stages as $stage){
            $stage_item['id']=$stage->id;
            $stage_item['title']=$stage->name;
            $stage_item['name']=$stage->name;
            $stage_item['class']=$stage->name;
            $fcandidates=CandidateDetail::select('*',DB::raw("CONCAT(current_job_title ,' ', current_employer) as title"))->where('stage',$stage->id)->get();
            $fcandidates->map(function($candidate){
                $candidate['education_details']=CandidateEducationalDetail::where('candidate_id',$candidate->id)->get();
                $candidate['experience_details']=CandidateExperienceDetail::where('candidate_id',$candidate->id)->get();
                $candidate['candidate_skills']=CandidateSkill::where('candidate_id',$candidate->id)->get();
                $candidate['candidate_status_name']=CandidateStatusList::find($candidate->candidate_status)['name'];
                $candidate['modified_date']=date('Y-m-d',strtotime($candidate->modified_date));
                if($candidate['candidate_owner']){
                     $candidate['candidate_owner_name']=User::find($candidate['candidate_owner'])['name'];
                }

            });
            $stage_item['cards']=$fcandidates;
            $stage_summary[]=$stage_item;
        } 
        return ['status'=>true,'candidates'=>$candidates,'stages'=>$stage_summary];
    }
    public function changeStatusOfCandidate(Request $request){

        $input=$request->all();

        $candidate_details=CandidateDetail::find($input['candidate_id']);
        $candidate_details->candidate_status=$input['status'];
        $candidate_details->save();

        $candidateTimeline=new CandidateTimeline;
        $candidateTimeline->candidate_id=$input['candidate_id'];
        $candidateTimeline->user_id=$input['user_id'];
        $candidateTimeline->type='candidate status updated';
        $candidateTimeline->value=CandidateStatusList::find($input['status']);
        $candidateTimeline->save();

          return ['status'=>true,'candidateTimelines'=>$this->getCandidateTimeline($input['candidate_id'])];  
    }
    public function updateExistingRating(Request $request){

        $input=$request->all();

        $candidateReview=CandidateReviews::find($input['rating_id']);
        $candidateReview->rating=$input['rating'];
        $candidateReview->reviews=(isset($input['reviews']) && $input['reviews'])?$input['reviews']:'';
        $candidateReview->save();

        $latestReview=CandidateReviews::where('candidate_id',$candidateReview->candidate_id)->orderBy('created_at','desc')->first();

        if($latestReview->id==$input['rating_id']){
            $candidate_details=CandidateDetail::find($candidateReview->candidate_id);
            $candidate_details->rating=$input['rating'];
            $candidate_details->rejection_reason=(isset($input['reviews']) && $input['reviews'])?$input['reviews']:'';
            $candidate_details->save();
        }

        


        $candidateReviews=CandidateReviews::where('candidate_id',$candidateReview->candidate_id)
                ->leftJoin('users','candidate_reviews.user_id','users.id')
                ->orderBy('candidate_reviews.created_at','desc')
                ->select('candidate_reviews.*','users.name')
                ->get();

            $candidateTimeline=new CandidateTimeline;
            $candidateTimeline->candidate_id=$candidateReview->candidate_id;
            $candidateTimeline->user_id=$candidateReview->user_id;
            $candidateTimeline->type='existing rating updated';
            $candidateTimeline->value=$input['rating'];
            $candidateTimeline->save();

          return ['status'=>true,'candidateTimelines'=>$this->getCandidateTimeline($candidateReview->candidate_id),'candidateReviews'=>$candidateReviews,'candidate_details'=>CandidateDetail::find($candidateReview->candidate_id)];
    }
    public function addRatingReviewForCandidate(Request $request){

        $input=$request->all();

        $candidateReviews=new CandidateReviews;
        $candidateReviews->rating=$input['rating'];
        $candidateReviews->reviews=(isset($input['rejection_reason']) && $input['rejection_reason'])?$input['rejection_reason']:'';
        $candidateReviews->candidate_id=$input['candidate_id'];
        $candidateReviews->user_id=$input['user_id'];
        $candidateReviews->save();

        $candidate_details=CandidateDetail::find($input['candidate_id']);
        $candidate_details->rating=$input['rating'];
        $candidate_details->rejection_reason=(isset($input['rejection_reason']) && $input['rejection_reason'])?$input['rejection_reason']:'';
        $candidate_details->save();

        $candidateReviews=CandidateReviews::where('candidate_id',$input['candidate_id'])
                ->leftJoin('users','candidate_reviews.user_id','users.id')
                ->orderBy('candidate_reviews.created_at','desc')
                ->select('candidate_reviews.*','users.name')
                ->get();

            $candidateTimeline=new CandidateTimeline;
            $candidateTimeline->candidate_id=$input['candidate_id'];
            $candidateTimeline->user_id=$input['user_id'];
            $candidateTimeline->type='rating updated';
            $candidateTimeline->value=$input['rating'];
            $candidateTimeline->save();

          return ['status'=>true,'candidateTimelines'=>$this->getCandidateTimeline($input['candidate_id']),'candidateReviews'=>$candidateReviews];
    }
    public function updateAttachmentsForCandidate(Request $request){
         $input=$request->all();
         $batch=sha1(time());
            foreach($input['uploadedFiles'] as $uploadedFiles){
              if(isset($uploadedFiles['response']) ){
                    $candidate_attachment= new CandidateAttachment;
                    $candidate_attachment->batch=$batch;
                    $candidate_attachment->candidate_id=$input['id'];
                    $candidate_attachment->user_id=$input['user_id'];
                    $candidate_attachment->file= '/uploads/attachments/'.$uploadedFiles['response']['filenametostore'];
                    $candidate_attachment->file_name= $uploadedFiles['response']['originalFileName'];
                    $candidate_attachment->save();
                }  
            }
        
            $candidateTimeline=new CandidateTimeline;
            $candidateTimeline->candidate_id=$input['id'];
            $candidateTimeline->user_id=$input['user_id'];
            $candidateTimeline->type='attachments added';
            $candidateTimeline->value=$batch;
            $candidateTimeline->save();

            
            return ['status'=>true,'candidateTimelines'=>$this->getCandidateTimeline($input['id']),'candidateAttachements'=>$this->getCandidateAttachments($input['id'])];
    }
    public function updateExistingAttachmentsForCandidate(Request $request){
        $input=$request->all();
         $batch=$input['batch'];

          CandidateAttachment::where('batch',$batch)->delete();
          foreach($input['uploadedFiles'] as $uploadedFiles){
              
                    $candidate_attachment= new CandidateAttachment;
                    $candidate_attachment->batch=$batch;
                    $candidate_attachment->candidate_id=$input['candidate_id'];
                    $candidate_attachment->user_id=$input['user_id'];

                    if(isset($uploadedFiles['response'])){
                        $candidate_attachment->file= '/uploads/attachments/'.$uploadedFiles['response']['filenametostore'];
                        $candidate_attachment->file_name= $uploadedFiles['response']['originalFileName'];
                    }else{
                        $candidate_attachment->file= $uploadedFiles['file'];
                        $candidate_attachment->file_name= $uploadedFiles['file_name'];
                    }

                    
                    $candidate_attachment->save();
               
            }
        
            $candidateTimeline=new CandidateTimeline;
            $candidateTimeline->candidate_id=$input['candidate_id'];
            $candidateTimeline->user_id=$input['user_id'];
            $candidateTimeline->type='attachments updated';
            $candidateTimeline->value=$batch;
            $candidateTimeline->save();

            
            return ['status'=>true,'candidateTimelines'=>$this->getCandidateTimeline($input['candidate_id']),'candidateAttachements'=>$this->getCandidateAttachments($input['candidate_id'])];
    }
    public function getCandidateAttachments($clientId){

        $batchs=CandidateAttachment::where('candidate_id',$clientId)
                                        ->leftJoin('users','candidate_attachments.user_id','users.id')
                                        ->orderBy('candidate_attachments.created_at','desc')
                                        ->select('batch','users.name as user_name','candidate_attachments.created_at','candidate_attachments.user_id')
                                        ->groupBy('batch')
                                        ->get();
            $candidate_attachments=[];
            foreach($batchs as $batch){
               $files=CandidateAttachment::where('batch',$batch->batch)->pluck('file')->toArray();
               $file_names=CandidateAttachment::where('batch',$batch->batch)->pluck('file_name')->toArray();
               
               $candidate_attachments[]= [
                    'batch'=>$batch->batch,
                    'user_name'=>$batch->user_name,
                    'user_id'=>$batch->user_id,
                    'file'=>$files,
                    'file_name'=>$file_names,
                    'file_obj'=>CandidateAttachment::where('batch',$batch->batch)->select(DB::Raw('file as url'),DB::Raw('file_name as name'))->get(),
                    'created_at'=>date('Y-m-d H:i:s',strtotime($batch->created_at))
                ];
            }

        

        return $candidate_attachments;
    }
    public function updateCandidateDetails(Request $request){
        $input=$request->all();
       /* $user=new User;
        $user->name=$input['name'];
        $user->email=$input['email'];
        $user->company_id=0;
        $user->user_type="Candidate";
        $user->password=Hash::make($input['password']);
        $user->save();
*/
       
            //CandidateDetail
            $candidate_details=CandidateDetail::find($input['id']);
            $candidate_details->user_id=0;
            $candidate_details->name=$input['name'];
            $candidate_details->email=$input['email'];
            $candidate_details->mobileNo=$input['mobileNo'];
            $candidate_details->altMobileNo=(isset($input['altMobileNo']) && $input['altMobileNo'])?$input['altMobileNo']:'';
            $candidate_details->rejection_reason=(isset($input['rejection_reason']) && $input['rejection_reason'])?$input['rejection_reason']:'';
            $candidate_details->street=$input['street'];
            $candidate_details->city=$input['city'];
            $candidate_details->state=$input['state'];
            $candidate_details->country=$input['country'];
            $candidate_details->zip_code=$input['zip_code'];
            $candidate_details->company_id=isset($input['company_id'])?$input['company_id']:0;
            $candidate_details->highest_qualification=$input['highest_qualification'];
            $candidate_details->current_job_title=$input['current_job_title'];
            $candidate_details->current_employer=$input['current_employer'];
            $candidate_details->current_salary=$input['current_salary'];
            $candidate_details->expected_salary=$input['expected_salary'];
            $candidate_details->exp_in_year=$input['exp_in_year'];
            $candidate_details->candidate_status=$input['candidate_status'];
            $candidate_details->source=$input['source'];
            $candidate_details->candidate_owner=$input['candidate_owner'];
            $candidate_details->modified_date=date('Y-m-d H:i:s');
            $candidate_details->stage=$input['candidate_stage'];
            $candidate_details->rating=$input['rating'];

            //$candidate_details->added_by=0;

            /*if($request->hasFile('resume') && $request->file('resume')){
                $image = $request->file('resume');
                $filenamewithextension = $image->getClientOriginalName();
                $filename = pathinfo($filenamewithextension, PATHINFO_FILENAME);
                $extension = $image->getClientOriginalExtension();
                $randname=time().''.mt_rand(10000, 20000);
                $filenametostore = $filename.'_'.$randname.'.'.$extension;
                $destinationPath = public_path('/uploads/resume');
                $image->move($destinationPath, $filenametostore);
                $candidate_details->resume= '/uploads/resume/'.$filenametostore;
            }*/
            if(isset($input['resume_file'][0]['response']) ){
                $candidate_details->resume= '/uploads/resumes/'.$input['resume_file'][0]['response']['filenametostore'];
                $candidate_details->resume_name= $input['resume_file'][0]['response']['originalFileName'];
            }
            $candidate_details->save();

            AppliedJob::where('candidate_id',$candidate_details->id)->delete();
            
            if(isset($input['applied_for'])){
                foreach($input['applied_for'] as $job){
                    $appliedJob=new AppliedJob;
                    $appliedJob->candidate_id=$candidate_details->id;
                    $appliedJob->job_id=$job;
                    $appliedJob->save();
                }
            }


            CandidateEducationalDetail::where('candidate_id',$candidate_details->id)->delete();
            foreach($input['educations'] as $education){
                 //CandidateEducationalDetail
                $education_details=new CandidateEducationalDetail;
                $education_details->candidate_id=$candidate_details->id;
                $education_details->institute=$education['institute'];
                $education_details->department=$education['department'];
                $education_details->degree=$education['degree'];
                $education_details->start_year=date('Y',strtotime($education['duration'][0]));
                $education_details->end_year=date('Y',strtotime($education['duration'][1]));

                $education_details->currently_persuring=(isset($experience['currently_persuring']) && $experience['currently_persuring'])?1:0;
                $education_details->save();
            }

            CandidateExperienceDetail::where('candidate_id',$candidate_details->id)->delete();
            foreach($input['experiences'] as $experience){
                 //CandidateExperienceDetail
                $experience_details=new CandidateExperienceDetail;
                $experience_details->candidate_id=$candidate_details->id;
                $experience_details->title=$experience['title'];
                $experience_details->company=$experience['company'];
                $experience_details->summary=$experience['summary'];
                $experience_details->start_month=date('m',strtotime($experience['duration'][0]));
                $experience_details->start_year=date('Y',strtotime($experience['duration'][0]));
                $experience_details->end_month=date('m',strtotime($experience['duration'][1]));
                $experience_details->end_year=date('Y',strtotime($experience['duration'][1]));
                $experience_details->currently_working=(isset($experience['currently_working']) && $experience['currently_working'])?1:0;
                $experience_details->save();
            }
            CandidateSkill::where('candidate_id',$candidate_details->id)->delete();
            foreach($input['canidateSkills'] as $skills){
                //CandidateSkill
                $candidate_skills=new CandidateSkill;
                $candidate_skills->candidate_id=$candidate_details->id;
                $candidate_skills->skill_id=$skills['skill_id'];
                $candidate_skills->name=$skills['name'];
                $candidate_skills->stage=$skills['stage'];
                $candidate_skills->save();
            }
            if(CandidateStage::where('candidate_id',$candidate_details->id)->orderBy('id','desc')->first()['stage']!=$input['candidate_stage']){
                $candidate_stage=new CandidateStage;
                $candidate_stage->candidate_id=$candidate_details->id;
                $candidate_stage->stage=$input['candidate_stage'];
                $candidate_stage->rating=$input['rating'];
                $candidate_stage->save();
            }
            
            $candidateTimeline=new CandidateTimeline;
            $candidateTimeline->candidate_id=$candidate_details->id;
            $candidateTimeline->user_id=$input['user_id'];
            $candidateTimeline->type='candidate details updated';
            $candidateTimeline->value='';
            $candidateTimeline->save();


            return ['status'=>true];
    }
    public function removeResumeFromCandidate(Request $request){
        $input=$request->all();
        $candidate_details=CandidateDetail::find($input['id']);
        $candidate_details->resume= '';
        $candidate_details->resume_name= '';
        $candidate_details->save();

            $candidateTimeline=new CandidateTimeline;
            $candidateTimeline->candidate_id=$input['id'];
            $candidateTimeline->user_id=$input['user_id'];
            $candidateTimeline->type='resume removed';
            $candidateTimeline->value='';
            $candidateTimeline->save();
        return ['candidateTimelines'=>$this->getCandidateTimeline($input['id']),'status'=>true];
    }
    public function updateResumeForCandidate(Request $request){
        $input=$request->all();

        $candidate_details=CandidateDetail::find($input['id']);
        $candidate_details->resume= $input['filenametostore'];
        $candidate_details->resume_name= $input['originalFileName'];
        $candidate_details->save();

            $candidateTimeline=new CandidateTimeline;
            $candidateTimeline->candidate_id=$input['id'];
            $candidateTimeline->user_id=$input['user_id'];
            $candidateTimeline->type='resume updated';
            $candidateTimeline->value='';
            $candidateTimeline->save();

        return ['candidateTimelines'=>$this->getCandidateTimeline($input['id']),'status'=>true];
    }
    public function saveCandidateDetails(Request $request){
        $input=$request->all();
       /* $user=new User;
        $user->name=$input['name'];
        $user->email=$input['email'];
        $user->company_id=0;
        $user->user_type="Candidate";
        $user->password=Hash::make($input['password']);
        $user->save();
*/
       
            //CandidateDetail
            $candidate_details=new CandidateDetail;
            $candidate_details->user_id=0;
            $candidate_details->name=$input['name'];
            $candidate_details->email=$input['email'];
            $candidate_details->mobileNo=$input['mobileNo'];
            $candidate_details->altMobileNo=(isset($input['altMobileNo']) && $input['altMobileNo'])?$input['altMobileNo']:'';
            $candidate_details->rejection_reason=(isset($input['rejection_reason']) && $input['rejection_reason'])?$input['rejection_reason']:'';
            $candidate_details->street=$input['street'];
            $candidate_details->city=$input['city'];
            $candidate_details->state=$input['state'];
            $candidate_details->country=$input['country'];
            $candidate_details->zip_code=$input['zip_code'];
            $candidate_details->company_id=isset($input['company_id'])?$input['company_id']:0;
            $candidate_details->highest_qualification=$input['highest_qualification'];
            $candidate_details->current_job_title=$input['current_job_title'];
            $candidate_details->current_employer=$input['current_employer'];
            $candidate_details->current_salary=$input['current_salary'];
            $candidate_details->expected_salary=$input['expected_salary'];
            $candidate_details->exp_in_year=$input['exp_in_year'];
            $candidate_details->candidate_status=$input['candidate_status'];
            $candidate_details->source=$input['source'];
            $candidate_details->candidate_owner=$input['candidate_owner'];
            $candidate_details->modified_date=date('Y-m-d H:i:s');
            $candidate_details->stage=$input['candidate_stage'];
            $candidate_details->rating=$input['rating'];

            $candidate_details->added_by=0;

            /*if($request->hasFile('resume') && $request->file('resume')){
                $image = $request->file('resume');
                $filenamewithextension = $image->getClientOriginalName();
                $filename = pathinfo($filenamewithextension, PATHINFO_FILENAME);
                $extension = $image->getClientOriginalExtension();
                $randname=time().''.mt_rand(10000, 20000);
                $filenametostore = $filename.'_'.$randname.'.'.$extension;
                $destinationPath = public_path('/uploads/resume');
                $image->move($destinationPath, $filenametostore);
                $candidate_details->resume= '/uploads/resume/'.$filenametostore;
            }*/
            if(isset($input['resume'][0])){
                $candidate_details->resume= '/uploads/resumes/'.$input['resume'][0]['response']['filenametostore'];
                $candidate_details->resume_name= $input['resume'][0]['response']['originalFileName'];
            }
            $candidate_details->save();
            
            if(isset($input['applied_for'])){
                foreach($input['applied_for'] as $job){
                    $appliedJob=new AppliedJob;
                    $appliedJob->candidate_id=$candidate_details->id;
                    $appliedJob->job_id=$job;
                    $appliedJob->save();
                }
            }
            
            
            
            foreach($input['educations'] as $education){
                 //CandidateEducationalDetail
                $education_details=new CandidateEducationalDetail;
                $education_details->candidate_id=$candidate_details->id;
                $education_details->institute=$education['institute'];
                $education_details->department=$education['department'];
                $education_details->degree=$education['degree'];
                $education_details->start_year=date('Y',strtotime($education['duration'][0]));
                $education_details->end_year=date('Y',strtotime($education['duration'][1]));

                $education_details->currently_persuring=(isset($experience['currently_persuring']) && $experience['currently_persuring'])?1:0;
                $education_details->save();
            }

            foreach($input['experiences'] as $experience){
                 //CandidateExperienceDetail
                $experience_details=new CandidateExperienceDetail;
                $experience_details->candidate_id=$candidate_details->id;
                $experience_details->title=$experience['title'];
                $experience_details->company=$experience['company'];
                $experience_details->summary=$experience['summary'];
                $experience_details->start_month=date('m',strtotime($experience['duration'][0]));
                $experience_details->start_year=date('Y',strtotime($experience['duration'][0]));
                $experience_details->end_month=date('m',strtotime($experience['duration'][1]));
                $experience_details->end_year=date('Y',strtotime($experience['duration'][1]));
                $experience_details->currently_working=(isset($experience['currently_working']) && $experience['currently_working'])?1:0;
                $experience_details->save();
            }

            foreach($input['canidateSkills'] as $skills){
                //CandidateSkill
                $candidate_skills=new CandidateSkill;
                $candidate_skills->candidate_id=$candidate_details->id;
                $candidate_skills->skill_id=$skills['skill_id'];
                $candidate_skills->name=$skills['name'];
                $candidate_skills->stage=$skills['stage'];
                $candidate_skills->save();
            }

            $candidate_stage=new CandidateStage;
            $candidate_stage->candidate_id=$candidate_details->id;
            $candidate_stage->stage=$input['candidate_stage'];
            $candidate_stage->rating=$input['rating'];
            $candidate_stage->save();

            $candidateTimeline=new CandidateTimeline;
            $candidateTimeline->candidate_id=$candidate_details->id;
            $candidateTimeline->user_id=$input['user_id'];
            $candidateTimeline->type='candidate added';
            $candidateTimeline->value='';
            $candidateTimeline->save();

            return ['candidateTimelines'=>$this->getCandidateTimeline($candidate_details->id),'status'=>true];

    }
    public function applyForJobNewUser(Request $request){
         $input=$request->all();
        $user=new User;
        $user->name=$input['name'];
        $user->email=$input['email'];
        $user->company_id=0;
        $user->user_type="Candidate";
        $user->password=Hash::make($input['password']);
        $user->save();


       
            //CandidateDetail
            $candidate_details=new CandidateDetail;
            $candidate_details->user_id=$user->id;
            $candidate_details->name=$input['name'];
            $candidate_details->email=$input['email'];
            $candidate_details->mobileNo=$input['mobileNo'];
            $candidate_details->altMobileNo=$input['altMobileNo'];
            $candidate_details->street=$input['street'];
            $candidate_details->city=$input['city'];
            $candidate_details->state=$input['state'];
            $candidate_details->country=$input['country'];
            $candidate_details->zip_code=$input['zip_code'];
            $candidate_details->company_id=$input['company_id'];
            $candidate_details->highest_qualification=$input['highest_qualification'];
            $candidate_details->current_job_title=$input['current_job_title'];
            $candidate_details->current_employer=$input['current_employer'];
            $candidate_details->current_salary=$input['current_salary'];
            $candidate_details->expected_salary=$input['expected_salary'];
            $candidate_details->candidate_status=$input['candidate_status'];
            $candidate_details->source=$input['source'];
            $candidate_details->added_by=0;

            /*if($request->hasFile('resume') && $request->file('resume')){
                $image = $request->file('resume');
                $filenamewithextension = $image->getClientOriginalName();
                $filename = pathinfo($filenamewithextension, PATHINFO_FILENAME);
                $extension = $image->getClientOriginalExtension();
                $randname=time().''.mt_rand(10000, 20000);
                $filenametostore = $filename.'_'.$randname.'.'.$extension;
                $destinationPath = public_path('/uploads/resume');
                $image->move($destinationPath, $filenametostore);
                $candidate_details->resume= '/uploads/resume/'.$filenametostore;
            }*/
            if(isset($input['resume'][0])){
                $job_details->resume= '/uploads/resumes/'.$input['resume'][0]['response']['filenametostore'];
                $job_details->resume_name= $input['resume'][0]['response']['originalFileName'];
            }
            $candidate_details->save();
            
            foreach($input['educations'] as $education){
                 //CandidateEducationalDetail
                $education_details=new CandidateEducationalDetail;
                $education_details->candidate_id=$candidate_details->id;
                $education_details->institute=$education['institute'];
                $education_details->department=$education['department'];
                $education_details->degree=$education['degree'];
                $education_details->start_year=$education['start_year'];
                $education_details->end_year=$education['end_year'];
                $education_details->currently_persuring=(isset($experience['currently_persuring']) && $experience['currently_persuring'])?1:0;
                $education_details->save();
            }
            
            foreach($input['experiences'] as $experience){
                 //CandidateExperienceDetail
                $experience_details=new CandidateExperienceDetail;
                $experience_details->candidate_id=$candidate_details->id;
                $experience_details->title=$experience['title'];
                $experience_details->company=$experience['company'];
                $experience_details->summary=$experience['summary'];
                $experience_details->start_month=$experience['start_month'];
                $experience_details->start_year=$experience['start_year'];
                $experience_details->end_month=$experience['end_month'];
                $experience_details->end_year=$experience['end_year'];
                $experience_details->currently_working=(isset($experience['currently_working']) && $experience['currently_working'])?1:0;
                $experience_details->save();
            }

            foreach($input['skills'] as $skills){
                //CandidateSkill
                $candidate_skills=new CandidateSkill;
                $candidate_skills->candidate_id=$candidate_details->id;
                $candidate_skills->name=$experience['name'];
                $candidate_skills->stage=$experience['stage'];
                $candidate_skills->save();
            }

            $candidate_skills=new CandidateStage;
            $candidate_skills->candidate_id=$candidate_details->id;
            $candidate_skills->stage=$input['candidate_status'];
            $candidate_skills->rating=5;
            $candidate_skills->save();
        

            $appliedJob=new AppliedJob;
            $appliedJob->candidate_id=$candidate_details->id;
            $appliedJob->job_id=$input['job_id'];
            $appliedJob->save();

            return ['status'=>true];

    }

     public function applyForJobExisingUser(Request $request){
         $input=$request->all();
            $appliedJob=new AppliedJob;
            $appliedJob->candidate_id=$input['candidate_id'];
            $appliedJob->job_id=$input['job_id'];
            $appliedJob->save();

            $candidateTimeline=new CandidateTimeline;
            $candidateTimeline->candidate_id=$input['candidate_id'];
            $candidateTimeline->user_id=$input['user_id'];
            $candidateTimeline->type='job added to candidate';
            $candidateTimeline->value=JobDetail::find($input['job_id'])['posting_title'];
            $candidateTimeline->save();

            return ['candidateTimelines'=>$this->getCandidateTimeline($input['candidate_id']),'status'=>true];
       

    }
    public function getMetadataForCandidateForm(Request $request){

         $input=$request->all();
            $candidateSourceLists=CandidateSourceList::get();
            $candidateStageLists=CandidateStageList::get();
            $candidateStatusLists=CandidateStatusList::get();
            $skillSets=SkillSet::get();
            $departments=Department::get();
            $jobs=JobDetail::get();
            //$recruiters=User::where('user_type','Recruiter')->get();

            $user=User::find($input['user_id']);
            if($user->user_type=="Manager"){

                $recruiters=User::where('manager_id',$input['user_id'])->where('user_type','Recruiter')->get();

            }
            else if($user->user_type=="Team Leader"){

                $recruiters=User::where('leader_id',$input['user_id'])->where('user_type','Recruiter')->get();

            }else if($user->user_type=="Recruiter"){

                 $recruiters=User::where('leader_id',$user->leader_id)->where('user_type','Recruiter')->get();

            }else if($user->user_type=="Admin"){

                 $recruiters=User::where('user_type','Recruiter')->get();
            }




            return [
                'status'=>true,
                'candidateSourceLists'=>$candidateSourceLists,
                'candidateStageLists'=>$candidateStageLists,
                'candidateStatusLists'=>$candidateStatusLists,
                'skillSets'=>$skillSets,
                'departments'=>$departments,
                'recruiters'=>$recruiters,
                'jobs'=>$jobs
            ];
       

    }
    public function getCandidateDetailsForEdit(Request $request){
         $input=$request->all();

            $candidate=CandidateDetail::find($request->all()['id']);

        
            $candidate['education_details']=CandidateEducationalDetail::where('candidate_id',$candidate->id)->get();
            $candidate['experience_details']=CandidateExperienceDetail::where('candidate_id',$candidate->id)->get();
            $candidate['candidate_skills']=CandidateSkill::where('candidate_id',$candidate->id)->get();
            $candidate['skills']=CandidateSkill::where('candidate_id',$candidate->id)->pluck('skill_id')->toArray();

            $candidate['candidate_stage']=CandidateStage::where('candidate_id',$candidate->id)->orderBy('id','desc')->first();
            $candidate['applied_for']=AppliedJob::where('candidate_id',$candidate->id)->pluck('job_id')->toArray();
            $candidate['appliedFor']=AppliedJob::where('candidate_id',$candidate->id)->join('job_details','job_details.id','applied_jobs.job_id')->select(DB::raw('applied_jobs.id as `key`'),'applied_jobs.*','job_details.posting_title')->get();
            $candidate['appliedFor']->map(function($appliedFor){
                $appliedFor['applied_date']=date('Y-m-d',strtotime($appliedFor->created_at));

            });

            $candidateSourceLists=CandidateSourceList::get();
            $candidateStageLists=CandidateStageList::get();
            $candidateStatusLists=CandidateStatusList::get();
            $noteTypes=NoteType::get();
            $interviewTypes=InterviewType::get();
            $skillSets=SkillSet::get();
            $departments=Department::get();
            $jobs=JobDetail::get();
            
            $user=User::find($input['user_id']);

           

            if($user->user_type=="Manager"){

                $recruiters=User::where('manager_id',$input['user_id'])->where('user_type','Recruiter')->get();

                $interviewList=Interview::whereIn('user_id',$recruiters)->where('candidate_id',$input['id'])->orderBy('id','desc')->get();

                 $interviewers=User::where(function ($query) use ($user) {
                                    $query->where('manager_id',$user->id)->whereIn('user_type',['Recruiter','Manager']);
                                })
                            ->orWhere('id',$input['user_id'])
                            ->orWhere('user_type','Admin')
                            ->get();

            }
            else if($user->user_type=="Team Leader"){

                $recruiters=User::where('leader_id',$input['user_id'])->where('user_type','Recruiter')->get();
                $interviewList=Interview::whereIn('user_id',$recruiters)->where('candidate_id',$input['id'])->orderBy('id','desc')->get();
                $interviewers=User::where(function ($query) use ($user) {
                                    $query->where('manager_id',$user->manager_id)->whereIn('user_type',['Recruiter','Manager']);
                                })
                            ->orWhere('id',$user->manager_id) ->orWhere('user_type','Admin')
                            ->get();
               

            }else if($user->user_type=="Recruiter"){

                 $recruiters=User::where('leader_id',$user->leader_id)->where('user_type','Recruiter')->get();
                 $interviewList=Interview::where('user_id',$input['user_id'])->where('candidate_id',$input['id'])->orderBy('id','desc')->get();
                 $interviewers=User::where(function ($query) use ($user) {
                                    $query->where('manager_id',$user->manager_id)->whereIn('user_type',['Recruiter','Manager']);
                                })
                            ->orWhere('id',$user->manager_id) ->orWhere('user_type','Admin')
                            ->get();

            }else if($user->user_type=="Admin"){

                 $recruiters=User::where('user_type','Recruiter')->get();
                 $interviewers=User::get();
                 $interviewList=Interview::orderBy('id','desc')->where('candidate_id',$input['id'])->get();
            }
            $interviewList->map(function($interview){
                   
                    $interview['interviewer_names']=implode(', ',User::whereIn('id',explode(", ",$interview->interviewers))->pluck('name')->toArray());
                    $interview['interview_type_name']=InterviewType::find($interview->interview_type)['name'];
                    $interview['job_title']=JobDetail::find($interview->posting_id)['posting_title'];

                });
             $candidate_notes=CandidateNote::where('candidate_id',$input['id'])
                                        ->leftJoin('users','candidate_notes.user_id','users.id')
                                        ->leftJoin('note_types','note_types.id','candidate_notes.note_type')
                                        ->orderBy('candidate_notes.created_at','desc')
                                        ->select('candidate_notes.*','users.name','note_types.name as note_type_name')
                                        ->get();
            $call_logs=CandidateCall::where('candidate_id',$input['id'])
                ->leftJoin('users','candidate_calls.user_id','users.id')
                ->orderBy('candidate_calls.created_at','desc')
                ->select('candidate_calls.*','users.name')
                ->get();
            $call_logs->map(function($log){
                   
                    $log['start_date']=date('Y-m-d H:i:s', strtotime(date('Y-m-d').' '.$log->start_time));
                    $log['end_date']=date('Y-m-d H:i:s', strtotime(date('Y-m-d').' '.$log->end_time));

                });
             $candidateReviews=CandidateReviews::where('candidate_id',$input['id'])
                ->leftJoin('users','candidate_reviews.user_id','users.id')
                ->orderBy('candidate_reviews.created_at','desc')
                ->select('candidate_reviews.*','users.name')
                ->get();
            
            return [
                'status'=>true,
                'candidate_details'=>$candidate,
                'interviewList'=>$interviewList,
                'interviewers'=>$interviewers,
                'candidateSourceLists'=>$candidateSourceLists,
                'candidateStageLists'=>$candidateStageLists,
                'candidateStatusLists'=>$candidateStatusLists,
                'candidateReviews'=>$candidateReviews,
                'skillSets'=>$skillSets,
                'departments'=>$departments,
                'recruiters'=>$recruiters,
                'jobs'=>$jobs,
                'candidate_notes'=>$candidate_notes,
                'candidateTimelines'=>$this->getCandidateTimeline($input['id']),
                'candidateAttachements'=>$this->getCandidateAttachments($input['id']),
                'call_logs'=>$call_logs,
                'noteTypes'=>$noteTypes,
                'interviewTypes'=>$interviewTypes
            ];
       

    }
    public function getCandidateTimeline($candidate_id){
        $candidate_timelines=CandidateTimeline::where('candidate_id',$candidate_id)
                                    ->leftJoin('users','candidate_timelines.user_id','users.id')
                                    ->leftJoin('note_types','note_types.id','candidate_timelines.secondary_value')
                                    ->orderBy('candidate_timelines.created_at','desc')
                                    ->select('candidate_timelines.*','users.name','note_types.name as note_type_name')
                                    ->get();
        return $candidate_timelines;
    }
    public function uploadTempResumeAttachment(Request $request){
        $input=$request->all();
        $filenametostore="";
        $filenamewithextension="";
        if($request->hasFile('files') && $request->file('files')){
            $image = $request->file('files');
            $filenamewithextension = $image->getClientOriginalName();
            $filename = pathinfo($filenamewithextension, PATHINFO_FILENAME);
            $extension = $image->getClientOriginalExtension();
            $randname=time().''.mt_rand(10000, 20000);
            $filenametostore = $filename.'_'.$randname.'.'.$extension;
            $destinationPath = public_path('/uploads/resumes');
            $image->move($destinationPath, $filenametostore);
            
        }
        
        return ['status'=>true,'filenametostore'=>$filenametostore,'originalFileName'=>$filenamewithextension];
    }
    public function uploadTempAttachments(Request $request){
        $input=$request->all();
        $filenametostore="";
        $filenamewithextension="";
        if($request->hasFile('files') && $request->file('files')){
            $image = $request->file('files');
            $filenamewithextension = $image->getClientOriginalName();
            $filename = pathinfo($filenamewithextension, PATHINFO_FILENAME);
            $extension = $image->getClientOriginalExtension();
            $randname=time().''.mt_rand(10000, 20000);
            $filenametostore = $filename.'_'.$randname.'.'.$extension;
            $destinationPath = public_path('/uploads/attachments');
            $image->move($destinationPath, $filenametostore);
            
        }
        
        return ['status'=>true,'filenametostore'=>$filenametostore,'originalFileName'=>$filenamewithextension];
    }
}
