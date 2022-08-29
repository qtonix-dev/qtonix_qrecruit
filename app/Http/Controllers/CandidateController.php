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

use App\Models\CandidateSourceList;
use App\Models\CandidateStageList;
use App\Models\CandidateStatusList;
use App\Models\SkillSet;
use App\Models\Department;

class CandidateController extends Controller
{
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
                 $candidate['candidate_stage']['name']=CandidateStageList::find($candidate['candidate_stage']['stage'])['name'];
            }
           if($candidate['candidate_owner']){
                 $candidate['candidate_owner_name']=User::find($candidate['candidate_owner'])['name'];
            }

        });
        $stages=CandidateStageList::get();
        return ['status'=>true,'candidates'=>$candidates,'stages'=>$stages];
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
                 $candidate['candidate_stage']['name']=CandidateStageList::find($candidate['candidate_stage']['stage'])['name'];
            }
           if($candidate['candidate_owner']){
                 $candidate['candidate_owner_name']=User::find($candidate['candidate_owner'])['name'];
            }

        });
        $stages=CandidateStageList::get();
        return ['status'=>true,'candidates'=>$candidates,'stages'=>$stages];
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
            

            return ['status'=>true];
    }
    public function removeResumeFromCandidate(Request $request){
        $input=$request->all();
        $candidate_details=CandidateDetail::find($input['id']);
        $candidate_details->resume= '';
        $candidate_details->resume_name= '';
        $candidate_details->save();
        return ['status'=>true];
    }
    public function updateResumeForCandidate(Request $request){
        $input=$request->all();

        $candidate_details=CandidateDetail::find($input['id']);
        $candidate_details->resume= $input['filenametostore'];
        $candidate_details->resume_name= $input['originalFileName'];
        $candidate_details->save();

        return ['status'=>true];
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

            return ['status'=>true];

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

            return ['status'=>true];
       

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
            
            $candidateSourceLists=CandidateSourceList::get();
            $candidateStageLists=CandidateStageList::get();
            $candidateStatusLists=CandidateStatusList::get();
            $skillSets=SkillSet::get();
            $departments=Department::get();
            $jobs=JobDetail::get();
            
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
                'candidate_details'=>$candidate,
                'candidateSourceLists'=>$candidateSourceLists,
                'candidateStageLists'=>$candidateStageLists,
                'candidateStatusLists'=>$candidateStatusLists,
                'skillSets'=>$skillSets,
                'departments'=>$departments,
                'recruiters'=>$recruiters,
                'jobs'=>$jobs
            ];
       

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
}
