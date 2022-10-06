<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\CandidateDetail;
use App\Models\CandidateEducationalDetail;
use App\Models\CandidateExperienceDetail;
use App\Models\CandidateSkill;
use App\Models\CompanyDetail;
use App\Models\CandidateStage;
use App\Models\CandidateSourceList;
use App\Models\CandidateStageList;
use App\Models\JobDetail;
use App\Models\JobOpeningStatus;
use Illuminate\Support\Facades\Auth;
use Hash;
use DB;

class UserController extends Controller
{
    public function __construct()
    {
       // $this->middleware('auth');
    }
    public function getMetaDataForReport(Request $request){
         $input=$request->all();
         $user=User::find($input['user_id']);

            if($user->user_type=="Manager"){
                $users=User::where('manager_id',$input['user_id'])
                ->where('user_type','<>','Admin')
                ->get();
            }
            else if($user->user_type=="Team Leader"){
                $users=User::where('leader_id',$input['user_id'])
                ->where('user_type','<>','Admin')
                ->get();
            }else if($user->user_type=="Recruiter"){
                $users=User::where('id',$user->id)
                ->where('user_type','<>','Admin')
                ->get();
            }else if($user->user_type=="Admin"){

                 $users=User::whereNotIn('user_type',['Recruiter'])->get();
            }
        return ['status'=>true,'users'=> $users];
    }
    public function getReportOfUser(Request $request){
        $input=$request->all();
        
     
        $stages=CandidateStageList::get();
        $user=User::find($input['user_id']);
         $stages->map(function($stage) use ($user,$input){
               if($user->user_type=="Manager"){

                $recruiters=User::where('manager_id',$input['user_id'])->pluck('id')->toArray();
                $stage['candidates']=CandidateDetail::where('stage',$stage->id)
                        ->where('created_at','>=',date("Y-m-d", strtotime( $input['range'][0])))
                        ->where('created_at','<=',date("Y-m-d", strtotime( $input['range'][1])))
                            ->whereIn('candidate_owner',$recruiters)->get();
            }
            else if($user->user_type=="Team Leader"){

                $recruiters=User::where('leader_id',$input['user_id'])->pluck('id')->toArray();
                $stage['candidates']=CandidateDetail::where('stage',$stage->id)->where('created_at','>=',date("Y-m-d", strtotime( $input['range'][0])))
                        ->where('created_at','<=',date("Y-m-d", strtotime( $input['range'][1])))->whereIn('candidate_owner',$recruiters)->get();

            }else if($user->user_type=="Recruiter"){

                 $stage['candidates']=CandidateDetail::where('stage',$stage->id)->where('created_at','>=',date("Y-m-d", strtotime( $input['range'][0])))
                        ->where('created_at','<=',date("Y-m-d", strtotime( $input['range'][1])))->where('candidate_owner',$input['user_id'])->get();

            }else if($user->user_type=="Admin"){

                 $stage['candidates']=CandidateDetail::where('stage',$stage->id)->where('created_at','>=',date("Y-m-d", strtotime( $input['range'][0])))
                        ->where('created_at','<=',date("Y-m-d", strtotime( $input['range'][1])))->get();
            }

             $stage['candidates']->map(function($candidate){
                   $candidate['candidate_source_name']=CandidateSourceList::find($candidate['source'])?CandidateSourceList::find($candidate['source'])['name']:'';
                });
             });
          if($user->user_type=="Manager"){

                $recruiters=User::where('manager_id',$input['user_id'])->pluck('id')->toArray();
                
                 $candidateCountArray=CandidateDetail::select(DB::raw('count(id) as `data`'), DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') create_date"))
                        ->whereIn('candidate_owner',$recruiters)
                        ->where('created_at','>=',date("Y-m-d", strtotime( $input['range'][0])))
                        ->where('created_at','<=',date("Y-m-d", strtotime( $input['range'][1])))
                        ->groupby('create_date')
                        ->orderBy('created_at','desc')->pluck('data','create_date')->toArray(); 

            }
            else if($user->user_type=="Team Leader"){

                $recruiters=User::where('leader_id',$input['user_id'])->pluck('id')->toArray();
               

                 $candidateCountArray=CandidateDetail::select(DB::raw('count(id) as `data`'), DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') create_date"))
                        ->whereIn('candidate_owner',$recruiters)
                        ->where('created_at','>=',date("Y-m-d", strtotime( $input['range'][0])))
                        ->where('created_at','<=',date("Y-m-d", strtotime( $input['range'][1])))
                        ->groupby('create_date')
                        ->orderBy('created_at','desc')->pluck('data','create_date')->toArray(); 

            }else if($user->user_type=="Recruiter"){

               
                $candidateCountArray=CandidateDetail::select(DB::raw('count(id) as `data`'), DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') create_date"))
                       ->where('candidate_owner',$input['user_id'])
                        ->where('created_at','>=',date("Y-m-d", strtotime( $input['range'][0])))
                        ->where('created_at','<=',date("Y-m-d", strtotime( $input['range'][1])))
                        ->groupby('create_date')
                        ->orderBy('created_at','desc')->pluck('data','create_date')->toArray(); 

            }else if($user->user_type=="Admin"){

                $candidateCountArray=CandidateDetail::select(DB::raw('count(id) as `data`'), DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') create_date"))
                        ->where('created_at','>=',date("Y-m-d", strtotime( $input['range'][0])))
                        ->where('created_at','<=',date("Y-m-d", strtotime( $input['range'][1])))
                        ->groupby('create_date')
                        ->orderBy('created_at','desc')->pluck('data','create_date')->toArray(); 


            }
        $candidate_inflow=[];

         for($i=date_diff(date_create(date("Y-m-d", strtotime( $input['range'][0]))),date_create(date("Y-m-d", strtotime( $input['range'][1]))))->days;$i>0;$i--){
               $candidate_inflow[date("Y-m-d", strtotime( date("Y-m-d", strtotime( $input['range'][1]))." -$i days"))]=0;
        }
        foreach($candidateCountArray as $index=>$candidateArray){

            $candidate_inflow[$index]=$candidateArray;
        }


         return ['status'=>true,'stages'=> $stages,'candidate_inflow'=>$candidate_inflow];


    }
    public function getSearchResults(Request $request){
        $input=$request->all();

        if($input['type']=='all'){
            $results=User::where(function ($query) use ($input) {
                        $query->where('email', 'like', '%'.$input['input'].'%')
                          ->orWhere('name', 'like', '%'.$input['input'].'%')
                          ->orWhere('phone_number', 'like', '%'.$input['input'].'%');
                })->select(DB::Raw('* , \'users\' as resultType'))->get()->toArray();

            $candidates=CandidateDetail::where(function ($query) use ($input) {
                                $query->where('email', 'like', '%'.$input['input'].'%')
                                  ->orWhere('name', 'like', '%'.$input['input'].'%')
                                  ->orWhere('mobileNo', 'like', '%'.$input['input'].'%');
                        })->select(DB::Raw('* , \'candidate\' as resultType'))->get();

            $candidates->map(function($candidate){
                $candidate['candidate_stage']=CandidateStage::where('candidate_id',$candidate->id)->orderBy('id','desc')->first();
                $candidate['candidate_stage_name']=CandidateStageList::find($candidate['candidate_stage']['stage'])['name'];
               
            });
            $candidates=$candidates->toArray();

            $results=array_merge($results,$candidates);

            $jobs=JobDetail::where(function ($query) use ($input) {
                                    $query->where('posting_title', 'like', '%'.$input['input'].'%')
                                      ->orWhere('job_title', 'like', '%'.$input['input'].'%');
                            })->select(DB::Raw('* , \'job\' as resultType'))->get();
            $jobs->map(function($job){
                $job['job_status']=JobOpeningStatus::find($job['job_status_id'])['name'];
                $job['hiring_manager_name']=User::find($job['manager_id'])['name'];
                $job['recruiter_names']=User::whereIn('id',explode(", ",$job['assigned_recruiter_ids']))->pluck('name')->toArray();
            });
            $jobs=$jobs->toArray();

            $results=array_merge($results,$jobs);
        }else if($input['type']=='candidates'){
            $candidates=CandidateDetail::where(function ($query) use ($input) {
                                $query->where('email', 'like', '%'.$input['input'].'%')
                                  ->orWhere('name', 'like', '%'.$input['input'].'%')
                                  ->orWhere('mobileNo', 'like', '%'.$input['input'].'%');
                        })->select(DB::Raw('* , \'candidate\' as resultType'))->get();

            $candidates->map(function($candidate){
                $candidate['candidate_stage']=CandidateStage::where('candidate_id',$candidate->id)->orderBy('id','desc')->first();
                $candidate['candidate_stage_name']=CandidateStageList::find($candidate['candidate_stage']['stage'])['name'];
               
            });
            $results=$candidates->toArray();

        }else if($input['type']=='jobs'){
            $jobs=JobDetail::where(function ($query) use ($input) {
                                    $query->where('posting_title', 'like', '%'.$input['input'].'%')
                                      ->orWhere('job_title', 'like', '%'.$input['input'].'%');
                            })->select(DB::Raw('* , \'job\' as resultType'))->get();
            $jobs->map(function($job){
                $job['job_status']=JobOpeningStatus::find($job['job_status_id'])['name'];
                $job['hiring_manager_name']=User::find($job['manager_id'])['name'];
                $job['recruiter_names']=User::whereIn('id',explode(", ",$job['assigned_recruiter_ids']))->pluck('name')->toArray();
            });
            $results=$jobs->toArray();
        }else if($input['type']=='users'){
            $results=User::where(function ($query) use ($input) {
                        $query->where('email', 'like', '%'.$input['input'].'%')
                          ->orWhere('name', 'like', '%'.$input['input'].'%')
                          ->orWhere('phone_number', 'like', '%'.$input['input'].'%');
                })->select(DB::Raw('* , \'users\' as resultType'))->get()->toArray();
        }
        
        
        
       //$results=User::get()->toArray();
        
        return ['status'=>true,'results'=>$results];
    }
    public function tryLogin(Request $request){
        $credentials = $request->only('email', 'password');
         if (Auth::attempt($credentials)) {
              return ['status'=>true,'userId'=>Auth::Id()];
        }

        return ['status'=>false];

    }
    public function getUserDetails(Request $request){
        $user=User::find($request->all()['id']);

        if(isset($user['id'])){
            if($user['user_type']=='Candidate'){
                $user['candidate_details']=CandidateDetail::where('candidate_id',$user->id)->first();
                $user['education_details']=CandidateEducationalDetail::where('candidate_id',$user->id)->get();
                $user['experience_details']=CandidateExperienceDetail::where('candidate_id',$user->id)->get();
                $user['candidate_skills']=CandidateSkill::where('candidate_id',$user->id)->first();
            }else{
                $user['candidate_details']=[];
                $user['education_details']=[];
                $user['experience_details']=[];
                $user['candidate_skills']=[];
            }
            $user['access']=json_decode($user['access']);

            return ['status'=>true,'message'=>'User found','user_details'=>$user];
        }

        return ['status'=>false,'message'=>'User not found','user_details'=>[]];


    }

    public function getUserDetailsForEdit(Request $request){
        $user=User::find($request->all()['id']);

        if(isset($user['id'])){
            if($user['user_type']=='Candidate'){
                $user['candidate_details']=CandidateDetail::where('candidate_id',$user->id)->first();
                $user['education_details']=CandidateEducationalDetail::where('candidate_id',$user->id)->get();
                $user['experience_details']=CandidateExperienceDetail::where('candidate_id',$user->id)->get();
                $user['candidate_skills']=CandidateSkill::where('candidate_id',$user->id)->first();
            }else{
                $user['candidate_details']=[];
                $user['education_details']=[];
                $user['experience_details']=[];
                $user['candidate_skills']=[];
            }
            $companies=CompanyDetail::get();

            if($user['manager_id']){
                $managers=User::where('user_type','Manager')->where('company_id',$user['company_id'])->get();
                $leaders=User::where('user_type','Team Leader')->where('manager_id',$user['manager_id'])->get();
            }else{
                $managers=User::where('user_type','Manager')->get();
                 $leaders=[];
            }
            $user['access']=json_decode($user['access']);



            return [
                    'status'=>true,
                    'message'=>'User found',
                    'user_details'=>$user,
                    'companies'=>$companies,
                    'managers'=>$managers,
                    'leaders'=>$leaders 
                ];
        }

        return ['status'=>false,'message'=>'User not found','user_details'=>[]];


    }

    public function getUsers(Request $request){
        $users=User::get();

        $users->map(function($user){
             $user['manager_name']='--';
            $user['leader_name']='--';
            if($user->manager_id && User::find($user->manager_id)){

                $user['manager_name']=User::find($user->manager_id)['name'];
            }
            if($user->leader_id && User::find($user->leader_id)){

                 $user['leader_name']=User::find($user->leader_id)['name'];
            }

           if($user['user_type']=='Candidate'){
                $user['candidate_details']=CandidateDetail::where('candidate_id',$user->id)->first();
                $user['education_details']=CandidateEducationalDetail::where('candidate_id',$user->id)->get();
                $user['experience_details']=CandidateExperienceDetail::where('candidate_id',$user->id)->get();
                $user['candidate_skills']=CandidateSkill::where('candidate_id',$user->id)->first();
            }else{
                $user['candidate_details']=[];
                $user['education_details']=[];
                $user['experience_details']=[];
                $user['candidate_skills']=[];
            }

        });

        return ['status'=>true,'users'=>$users];


    }


    public function updateResume(Request $request){
        $input=$request->all();
        
        $candidate_details=CandidateDetail::find($input['candidate_id']);
        if($request->hasFile('resume') && $request->file('resume')){
            $image = $request->file('resume');
            $filenamewithextension = $image->getClientOriginalName();
            $filename = pathinfo($filenamewithextension, PATHINFO_FILENAME);
            $extension = $image->getClientOriginalExtension();
            $randname=time().''.mt_rand(10000, 20000);
            $filenametostore = $filename.'_'.$randname.'.'.$extension;
            $destinationPath = public_path('/uploads/resume');
            $image->move($destinationPath, $filenametostore);
            $candidate_details->resume= '/uploads/resume/'.$filenametostore;
            $candidate_details->save();
        }
        return ['status'=>true,'file'=>$candidate_details->resume];
    }

    public function updateUserDetails(Request $request){

        $input=$request->all();

        //User 
        $UserWithEmail=User::where('email',$input['email'])->first();
        if($UserWithEmail && $UserWithEmail['id']!=$input['id']){
            return ['status'=>false, 'message'=>'User exists with given email ID'];
        }   
        $user=User::find($input['id']);
        $user->name=$input['name'];
        $user->email=$input['email'];
        if(isset($input['access'])){
            $user->access=json_encode($input['access']);
        }
        if(isset($input['company_id'])){
            $user->user_type=$input['company_id'];
        }
        if(isset($input['employee_id'])){
            $user->user_type=$input['employee_id'];
        }
        $user->employee_id=$input['employee_id'];
        $user->personal_email=$input['personal_email'];
        $user->phone_number=$input['phone_number'];
        $user->alt_phone_number=isset($input['alt_phone_number'])?$input['alt_phone_number']:'';
        $user->manager_id=isset($input['manager_id'])?$input['manager_id']:0;
        $user->leader_id=isset($input['leader_id'])?$input['leader_id']:0;
        if(isset($input['user_type'])){
            $user->user_type=$input['user_type'];
        }
        if(isset($input['password'])){
           $user->password=Hash::make($input['password']); 
        }
        
        $user->save();

        if($input['user_type']=='Candidate') {
            //CandidateDetail
            $candidate_details=CandidateDetail::where('user_id',$user->id)->first();
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
            $candidate_details->added_by=$input['added_by'];
            $candidate_details->save();


            CandidateEducationalDetail::where('candidate_id',$candidate_details->id)->delete();
            foreach($input['educations'] as $education){
                 //CandidateEducationalDetail
                $education_details=new CandidateEducationalDetail;
                $education_details->candidate_id=$candidate_details->id;
                $education_details->institute=$education['institute'];
                $education_details->department=$education['department'];
                $education_details->degree=$education['degree'];
                $education_details->start_year=$education['start_year'];
                $education_details->end_year=$education['end_year'];
                $education_details->currently_persuring=$education['currently_persuring'];
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
                $experience_details->start_month=$experience['start_month'];
                $experience_details->start_year=$experience['start_year'];
                $experience_details->end_month=$experience['end_month'];
                $experience_details->end_year=$experience['end_year'];
                $experience_details->currently_working=$experience['currently_working'];
                $experience_details->save();
            }

            CandidateSkill::where('candidate_id',$candidate_details->id)->delete();
            foreach($input['skills'] as $skills){
                //CandidateSkill
                $candidate_skills=new CandidateSkill;
                $candidate_skills->candidate_id=$candidate_details->id;
                $candidate_skills->name=$experience['name'];
                $candidate_skills->stage=$experience['stage'];
                $candidate_skills->save();
            }

            $stage=CandidateStage::where('candidate_id',$candidate_details->id)->orderBy('id','desc')->first();
            
            if($stage->stage!=$input['stage']){
                $candidate_skills=new CandidateStage;
                $candidate_skills->candidate_id=$candidate_details->id;
                $candidate_skills->stage=$input['stage'];
                $candidate_skills->rating=$input['rating'];
                $candidate_skills->save();
            }

            




        }


        


        return ['status'=>true];


    }
    public function createSuperAdmin(Request $request){

        $input=$request->all();

        /*$company_details=new CompanyDetail;
        $company_details->name="Qtonix Software Pvt. Ltd.";
        $company_details->street="Utkal Signature";
        $company_details->city="Bhubaneswar";
        $company_details->state="Odisha";
        $company_details->country="India";
        $company_details->zip_code="752101";
        $company_details->phone_number="9348878088";
        $company_details->official_email="hr@qtonix.com";
        $company_details->save();

        $user=new User;
        $user->name="Biki Mallik";
        $user->email="biki.qtonix1@gmail.com";
        $user->company_id=$company_details->id;
        $user->user_type="Admin";
        $user->password=Hash::make(11111111);
        $user->save();*/
    }
    public function saveUserDetails(Request $request){

        $input=$request->all();

        //User 
        $UserWithEmail=User::where('email',$input['email'])->first();
        if($UserWithEmail){
            return ['status'=>false , 'message'=>'User exists with given email ID'];
        } 
        $user=new User;
        $user->name=$input['name'];
        $user->email=$input['email'];
        $user->company_id=$input['company_id'];
        $user->employee_id=$input['employee_id'];
        $user->personal_email=$input['personal_email'];
        $user->phone_number=$input['phone_number'];
        $user->alt_phone_number=isset($input['alt_phone_number'])?$input['alt_phone_number']:'';
        $user->manager_id=isset($input['manager_id'])?$input['manager_id']:0;
        $user->leader_id=isset($input['leader_id'])?$input['leader_id']:0;
        $user->user_type=$input['user_type'];
        $user->password=Hash::make($input['password']);
        if(isset($input['access'])){
            $user->access=json_encode($input['access']);
        }
        $user->save();


        if($input['user_type']=='Candidate') {
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
            $candidate_details->added_by=$input['added_by'];

            if($request->hasFile('resume') && $request->file('resume')){
                $image = $request->file('resume');
                $filenamewithextension = $image->getClientOriginalName();
                $filename = pathinfo($filenamewithextension, PATHINFO_FILENAME);
                $extension = $image->getClientOriginalExtension();
                $randname=time().''.mt_rand(10000, 20000);
                $filenametostore = $filename.'_'.$randname.'.'.$extension;
                $destinationPath = public_path('/uploads/resume');
                $image->move($destinationPath, $filenametostore);
                $candidate_details->resume= '/uploads/resume/'.$filenametostore;
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
                $education_details->currently_persuring=$education['currently_persuring'];
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
                $experience_details->currently_working=$experience['currently_working'];
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
            $candidate_skills->stage="New";
            $candidate_skills->rating=5;
            $candidate_skills->save();

        }

        


        return ['status'=>true];


    }
    public function removeUsers(Request $request){
        $input=$request->all();
        $user=User::find($input['id']);
        if($user->user_type=='Candidate') {
            $candidate_details=CandidateDetail::where('user_id',$user->id)->first();
            CandidateEducationalDetail::where('candidate_id',$candidate_details->id)->delete();
            CandidateExperienceDetail::where('candidate_id',$candidate_details->id)->delete();
            CandidateSkill::where('candidate_id',$candidate_details->id)->delete();
            CandidateDetail::where('user_id',$input['id'])->delete();
        }
        User::where('user_id',$input['id'])->delete();


        return ['status'=>true];

    }
}
