<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JobDetail;
use App\Models\Department;
use App\Models\User;
use App\Models\AppliedJob;
use App\Models\CompanyDetail;
use App\Models\JobOpeningStatus;
use App\Models\JobType;
use App\Models\WorkExperience;
use App\Models\SkillSet;

use Illuminate\Support\Str;

class JobController extends Controller
{
     public function __construct()
    {
        //$this->middleware('auth');
    }
     public function getMetadataForJobForm(Request $request){

        $departments=Department::get();
        $statusList=JobOpeningStatus::get();
        $managers=User::where('user_type','Manager')->get();
        $jobTypes=JobType::get();
        $workExperiences=WorkExperience::get();
        $skillSets=SkillSet::get();

        return [
                'status'=>true,
                'departments'=>$departments,
                'statusList'=>$statusList,
                'managers'=>$managers,
                'jobTypes'=>$jobTypes,
                'workExperiences'=>$workExperiences,
                'skillSets'=>$skillSets
            ];
    }
    public function saveJobDetails(Request $request){

        $input=$request->all();

        $job_details=new JobDetail;
        $job_details->posting_title=$input['posting_title'];
        $job_details->url=Str::slug($input['posting_title']);
        $job_details->department_id=$input['department_id'];
        $job_details->job_title=$input['job_title'];
        $job_details->manager_id=$input['manager_id'];
        $job_details->assigned_recruiter_ids=implode(", ",$input['assigned_recruiter_ids']);
        $job_details->no_of_positions=$input['no_of_positions'];
        $job_details->target_date=date('Y-m-d',strtotime($input['target_date']));
        $job_details->date_opened=date('Y-m-d',strtotime($input['date_opened']));
        $job_details->job_status_id=$input['job_status_id'];
        $job_details->job_type_id=$input['job_type_id'];
        $job_details->experience_id=$input['experience_id'];
        $job_details->salary=$input['salary'];
        $job_details->skillset_ids=implode(", ",$input['skillset_ids']);
        $job_details->is_remotePosition=(isset($input['is_remotePosition']) && $input['is_remotePosition'])?1:0;
        $job_details->city=isset($input['city'])? $input['city']:'';
        $job_details->state=isset($input['state'])? $input['state']:'';
        $job_details->description=$input['description'];
        $job_details->requirements=$input['requirements'];
        $job_details->benefits=$input['benefits'];
        $job_details->user_id=isset($input['user_id'])?$input['user_id']:0;
        if(isset($input['attachment'][0])){
            $job_details->job_summary_attachment= '/uploads/attachments/'.$input['attachment'][0]['response']['filenametostore'];
            $job_details->job_summary_attachment_name= $input['attachment'][0]['response']['originalFileName'];
        }

        $job_details->save();
        $job_details->job_opening_id='Qtonix_Job_'.$job_details->id;
        $job_details->save();
            


        return ['status'=>true,'job_details'=>$job_details];


    }
    public function updateJobDetails(Request $request){

        $input=$request->all();

        $job_details=JobDetail::find($input['id']);
        $job_details->posting_title=$input['posting_title'];
        $job_details->url=Str::slug($input['posting_title']);
        $job_details->department_id=$input['department_id'];
        $job_details->job_title=$input['job_title'];
        $job_details->manager_id=$input['manager_id'];
        $job_details->assigned_recruiter_ids=implode(", ",$input['assigned_recruiter_ids']);
        $job_details->no_of_positions=$input['no_of_positions'];
        $job_details->target_date=date('Y-m-d',strtotime($input['target_date']));
        $job_details->date_opened=date('Y-m-d',strtotime($input['date_opened']));
        $job_details->job_status_id=$input['job_status_id'];
        $job_details->job_type_id=$input['job_type_id'];
        $job_details->experience_id=$input['experience_id'];
        $job_details->salary=$input['salary'];
        $job_details->skillset_ids=implode(", ",$input['skillset_ids']);
        $job_details->is_remotePosition=(isset($input['is_remotePosition']) && $input['is_remotePosition'])?1:0;
        $job_details->city=isset($input['city'])? $input['city']:'';
        $job_details->state=isset($input['state'])? $input['state']:'';
        $job_details->description=$input['description'];
        $job_details->requirements=$input['requirements'];
        $job_details->benefits=$input['benefits'];
        $job_details->user_id=isset($input['user_id'])?$input['user_id']:0;
        if(isset($input['attachment'][0])){
            $job_details->job_summary_attachment= '/uploads/attachments/'.$input['attachment'][0]['response']['filenametostore'];
            $job_details->job_summary_attachment_name= $input['attachment'][0]['response']['originalFileName'];
        }

        $job_details->save();


        return ['status'=>true,'job_details'=>$job_details];
    }
    public function removeAttachmentFromJob(Request $request){
        $input=$request->all();
        $job_details=JobDetail::find($input['id']);
        $job_details->job_summary_attachment= '';
        $job_details->job_summary_attachment_name= '';
        $job_details->save();
        return ['status'=>true];
    }
    public function updateAttachmentForJob(Request $request){
        $input=$request->all();
        $job_details=JobDetail::find($input['id']);
        $job_details->job_summary_attachment=$input['filenametostore'];
        $job_details->job_summary_attachment_name= $input['originalFileName'];
        $job_details->save();
        return ['status'=>true];
    }
    public function uploadTempJobSummaryAttachment(Request $request){
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
    public function updateJobSummaryAttachment(Request $request){
        $input=$request->all();
        $job_details=JobDetail::find($input['id']);
         $filenametostore="";
        $filenamewithextension="";
        if($request->hasFile('job_summary_attachment') && $request->file('job_summary_attachment')){
                $image = $request->file('job_summary_attachment');
                $filenamewithextension = $image->getClientOriginalName();
                $filename = pathinfo($filenamewithextension, PATHINFO_FILENAME);
                $extension = $image->getClientOriginalExtension();
                $randname=time().''.mt_rand(10000, 20000);
                $filenametostore = $filename.'_'.$randname.'.'.$extension;
                $destinationPath = public_path('/uploads/attachments');
                $image->move($destinationPath, $filenametostore);
                $job_details->job_summary_attachment= '/uploads/attachments/'.$filenametostore;
                $job_details->save();
        }
        return ['status'=>true,'file'=>$job_details->job_summary_attachment,'originalFileName'=>$filenamewithextension];
    }
    public function updateOtherAttachment(Request $request){
        $input=$request->all();
        $job_details=JobDetail::find($input['id']);
         $filenametostore="";
        $filenamewithextension="";
        if($request->hasFile('other_attachment') && $request->file('other_attachment')){
            $image = $request->file('other_attachment');
            $filenamewithextension = $image->getClientOriginalName();
            $filename = pathinfo($filenamewithextension, PATHINFO_FILENAME);
            $extension = $image->getClientOriginalExtension();
            $randname=time().''.mt_rand(10000, 20000);
            $filenametostore = $filename.'_'.$randname.'.'.$extension;
            $destinationPath = public_path('/uploads/attachments');
            $image->move($destinationPath, $filenametostore);
            $job_details->other_attachment= '/uploads/attachments/'.$filenametostore;
            $job_details->save();
        }

        return ['status'=>true,'file'=>$job_details->other_attachment,'originalFileName'=>$filenamewithextension];
    }
    public function getJobLists(Request $request){

        $jobs=JobDetail::get();
        $jobs->map(function($job){
            $job['department_details']=Department::find($job['department_id']);
            $job['department_name']=Department::find($job['department_id'])['name'];
            $job['hiring_manager']=User::find($job['manager_id']);
            $job['hiring_manager_name']=User::find($job['manager_id'])['name'];
            $job['assigned_recruiters']=User::whereIn('id',explode(", ",$job['assigned_recruiter_ids']))->get();
            $job['recruiter_names']=User::whereIn('id',explode(", ",$job['assigned_recruiter_ids']))->pluck('name')->toArray();
            $job['job_status']=JobOpeningStatus::find($job['job_status_id'])['name'];
        });

        return ['status'=>true,'jobs'=>$jobs];
    }
    public function getFilteredJobLists(Request $request){
        $input=$request->all();
        $user=User::find($input['user_id']);
        
        $jobs=JobDetail::get();
       
        $jobs->map(function($job) use ($user){

            $job['editable']=false;
            $assigned_recruiter_ids=explode(", ",$job['assigned_recruiter_ids']);
            
            if($user->user_type=="Admin"){
                
                 $job['editable']=true;
            }else if($user->user_type=="Manager"){

                if($job['manager_id']==$user->id){

                     $job['editable']=true;
                }
                
            }else if($user->user_type=="Team Leader"){

                $recruiters=User::where('leader_id',$input['user_id'])->pluck('id')->toArray();
                
                foreach($recruiters as $recruiter){
                   if(in_array($recruiter, $assigned_recruiter_ids)){

                        $job['editable']=true;
                    } 
                }
                

            }else if($user->user_type=="Recruiter"){

                if(in_array($user->id, $assigned_recruiter_ids)){
                    $job['editable']=true;
                } 


            } 

            $job['department_details']=Department::find($job['department_id']);
            $job['department_name']=Department::find($job['department_id'])['name'];
            $job['hiring_manager']=User::find($job['manager_id']);
            $job['hiring_manager_name']=User::find($job['manager_id'])['name'];
            $job['assigned_recruiters']=User::whereIn('id',explode(", ",$job['assigned_recruiter_ids']))->get();
            $job['recruiter_names']=User::whereIn('id',explode(", ",$job['assigned_recruiter_ids']))->pluck('name')->toArray();
            $job['job_status']=JobOpeningStatus::find($job['job_status_id'])['name'];
        });

        return ['status'=>true,'jobs'=>$jobs];
    }
    public function getJobDetailsForEdit(Request $request){

        $job_details=JobDetail::find($request->all()['id']);
        $job_details['department_details']=Department::find($job_details['department_id']);
        $job_details['department_name']=Department::find($job_details['department_id'])['name'];
        $job_details['hiring_manager']=User::find($job_details['manager_id']);
        $job_details['hiring_manager_name']=User::find($job_details['manager_id'])['name'];
        $job_details['assigned_recruiters']=User::whereIn('id',explode(", ",$job_details['assigned_recruiter_ids']))->get();
        $job_details['recruiter_names']=User::whereIn('id',explode(", ",$job_details['assigned_recruiter_ids']))->pluck('name')->toArray();
        $job_details['job_status']=JobOpeningStatus::find($job_details['job_status_id'])['name'];


        $departments=Department::get();
        $statusList=JobOpeningStatus::get();
        $managers=User::where('user_type','Manager')->get();
        $jobTypes=JobType::get();
        $workExperiences=WorkExperience::get();
        $skillSets=SkillSet::get();
        $recruiters=[];
        if(isset($job_details['manager_id'])){
            $recruiters=User::where('user_type','Recruiter')->where('manager_id',$job_details['manager_id'])->get();

        }
        

        return [ 
            'status'=>true,
            'job_details'=>$job_details,
            'departments'=>$departments,
            'recruiters'=>$recruiters,
            'statusList'=>$statusList,
            'managers'=>$managers,
            'jobTypes'=>$jobTypes,
            'workExperiences'=>$workExperiences,
            'skillSets'=>$skillSets
        ];
    }
    public function getJobDetails(Request $request){

        $job_details=JobDetail::find($request->all()['job_id']);
        $job_details['department_details']=Department::find($job['department_id']);
        $job_details['department_name']=Department::find($job['department_id'])['name'];
        $job_details['hiring_manager']=User::find($job['manager_id']);
        $job_details['hiring_manager_name']=User::find($job['manager_id'])['name'];
        $job_details['assigned_recruiters']=User::whereIn('id',explode(", ",$job['assigned_recruiter_ids']))->get();
        $job_details['recruiter_names']=User::whereIn('id',explode(", ",$job['assigned_recruiter_ids']))->pluck('name')->toArray();
        $job_details['applied']=AppliedJob::where('candidate_id',$request->all()['candidate_id'])->where('job_id',$request->all()['job_id'])->first()?true:false;
        $job_details['job_status']=JobOpeningStatus::find($job['job_status_id'])['name'];

        return ['status'=>true,'job_details'=>$job_details];
    }
    public function removeJob(Request $request){
        $input=$request->all();
        
        JobDetail::where('id',$input['id'])->delete();
        
        $jobs=JobDetail::get();

        $jobs->map(function($job){
            $job['editable']=false;
            $assigned_recruiter_ids=explode(", ",$job['assigned_recruiter_ids']);
            
            if($user->user_type=="Admin"){
                
                 $job['editable']=true;
            }else if($user->user_type=="Manager"){

                if($job['manager_id']==$user->id){

                     $job['editable']=true;
                }
                
            }else if($user->user_type=="Team Leader"){

                $recruiters=User::where('leader_id',$input['user_id'])->pluck('id')->toArray();
                
                foreach($recruiters as $recruiter){
                   if(in_array($recruiter, $assigned_recruiter_ids)){

                        $job['editable']=true;
                    } 
                }
                

            }else if($user->user_type=="Recruiter"){

                if(in_array($user->id, $assigned_recruiter_ids)){
                    $job['editable']=true;
                } 


            } 
            $job['department_details']=Department::find($job['department_id']);
            $job['department_name']=Department::find($job['department_id'])['name'];
            $job['hiring_manager']=User::find($job['manager_id']);
            $job['hiring_manager_name']=User::find($job['manager_id'])['name'];
            $job['assigned_recruiters']=User::whereIn('id',explode(", ",$job['assigned_recruiter_ids']))->get();
            $job['recruiter_names']=User::whereIn('id',explode(", ",$job['assigned_recruiter_ids']))->pluck('name')->toArray();
            $job['job_status']=JobOpeningStatus::find($job['job_status_id'])['name'];
        });
        return ['status'=>true,'jobs'=>$jobs];

    }
}
