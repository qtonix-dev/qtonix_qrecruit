<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\HRController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\JobOpeningStatusController;
use App\Http\Controllers\JobTypeController;
use App\Http\Controllers\SkillSetController;
use App\Http\Controllers\WorkExperienceController;
use App\Http\Controllers\CandidateStatusListController;
use App\Http\Controllers\CandidateSourceListController;
use App\Http\Controllers\CandidateStageListController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/*Route::get('/', function () {
    return view('welcome');
});*/
use App\Http\Middleware\ApiKeyMiddleware;


/*Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
*/
Route::get('/', function () {
    return view('welcome');
});
Route::prefix('api')->middleware([ApiKeyMiddleware::class])->group(function () {

    Route::post('getUserDetails', [UserController::class, 'getUserDetails']);
    Route::post('getUsers', [UserController::class, 'getUsers']);
    Route::post('updateResume', [UserController::class, 'updateResume']);
    Route::post('updateUserDetails', [UserController::class, 'updateUserDetails']);
    Route::post('saveUserDetails', [UserController::class, 'saveUserDetails']);
    Route::post('removeUsers', [UserController::class, 'removeUsers']);
    Route::post('tryLogin', [UserController::class, 'tryLogin']);
    Route::post('getUserDetailsForEdit', [UserController::class, 'getUserDetailsForEdit']);
    Route::post('getSearchResults', [UserController::class, 'getSearchResults']);
    
    Route::post('getMyCandidates', [HRController::class, 'getMyCandidates']);
    Route::post('getListsOfRecruiters', [HRController::class, 'getListsOfRecruiters']);
    Route::post('getListsOfManagers', [HRController::class, 'getListsOfManagers']);
    Route::post('getListsOfTeamLeaders', [HRController::class, 'getListsOfTeamLeaders']);
    
    Route::post('saveJobDetails', [JobController::class, 'saveJobDetails']);
    Route::post('updateJobDetails', [JobController::class, 'updateJobDetails']);
    Route::post('updateJobSummaryAttachment', [JobController::class, 'updateJobSummaryAttachment']);
    Route::post('updateOtherAttachment', [JobController::class, 'updateOtherAttachment']);
    Route::post('getJobDetails', [JobController::class, 'getJobDetails']);
    Route::post('getJobDetailsForEdit', [JobController::class, 'getJobDetailsForEdit']);
    Route::post('getJobLists', [JobController::class, 'getJobLists']);
    Route::post('removeJob', [JobController::class, 'removeJob']);
    Route::post('getMetadataForJobForm', [JobController::class, 'getMetadataForJobForm']);
    Route::post('removeAttachmentFromJob', [JobController::class, 'removeAttachmentFromJob']);
    Route::post('updateAttachmentForJob', [JobController::class, 'updateAttachmentForJob']);
    Route::post('getFilteredJobLists', [JobController::class, 'getFilteredJobLists']);
    
    
    Route::post('applyForJobNewUser', [CandidateController::class, 'applyForJobNewUser']);
    Route::post('applyForJobExisingUser', [CandidateController::class, 'applyForJobExisingUser']);
    Route::post('getMetadataForCandidateForm', [CandidateController::class, 'getMetadataForCandidateForm']);
    Route::post('saveCandidateDetails', [CandidateController::class, 'saveCandidateDetails']);
    Route::post('getFilteredCandidateLists', [CandidateController::class, 'getFilteredCandidateLists']);
    Route::post('getCandidateLists', [CandidateController::class, 'getCandidateLists']);
    Route::post('getCandidateDetailsForEdit', [CandidateController::class, 'getCandidateDetailsForEdit']);
    Route::post('updateCandidateDetails', [CandidateController::class, 'updateCandidateDetails']);
    Route::post('removeResumeFromCandidate', [CandidateController::class, 'removeResumeFromCandidate']);
    Route::post('updateResumeForCandidate', [CandidateController::class, 'updateResumeForCandidate']);

        
    Route::post('checkDuplicacyWithEmail', [CandidateController::class, 'checkDuplicacyWithEmail']);
    Route::post('checkDuplicacyWithMobileNo', [CandidateController::class, 'checkDuplicacyWithMobileNo']);
    
    
    Route::post('getCompanyList', [CompanyController::class, 'getCompanyList']);
    Route::post('saveCompanyDetails', [CompanyController::class, 'saveCompanyDetails']);
    Route::post('updateCompanyDetails', [CompanyController::class, 'updateCompanyDetails']);
    Route::post('removeCompany', [CompanyController::class, 'removeCompany']);

    Route::post('getDepartmentList', [DepartmentController::class, 'getDepartmentList']);
    Route::post('saveDepartmentDetails', [DepartmentController::class, 'saveDepartmentDetails']);
    Route::post('updateDepartmentDetails', [DepartmentController::class, 'updateDepartmentDetails']);
    Route::post('removeDepartment', [DepartmentController::class, 'removeDepartment']);
    Route::post('getDepartmentDetails', [DepartmentController::class, 'getDepartmentDetails']);


    Route::post('getJobOpeningStatusList', [JobOpeningStatusController::class, 'getJobOpeningStatusList']);
    Route::post('saveJobOpeningStatus', [JobOpeningStatusController::class, 'saveJobOpeningStatus']);
    Route::post('updateJobOpeningStatus', [JobOpeningStatusController::class, 'updateJobOpeningStatus']);
    Route::post('getJobOpeningStatusDetails', [JobOpeningStatusController::class, 'getJobOpeningStatusDetails']);
    Route::post('removeJobOpeningStatus', [JobOpeningStatusController::class, 'removeJobOpeningStatus']);

    Route::post('getJobTypes', [JobTypeController::class, 'getJobTypes']);
    Route::post('savejobType', [JobTypeController::class, 'savejobType']);
    Route::post('updateJobType', [JobTypeController::class, 'updateJobType']);
    Route::post('removeJobType', [JobTypeController::class, 'removeJobType']);
    Route::post('getJobTypeDetails', [JobTypeController::class, 'getJobTypeDetails']);

    Route::post('getSkillSets', [SkillSetController::class, 'getSkillSets']);
    Route::post('saveSkillSet', [SkillSetController::class, 'saveSkillSet']);
    Route::post('updateSkillSet', [SkillSetController::class, 'updateSkillSet']);
    Route::post('getSkillSetDetails', [SkillSetController::class, 'getSkillSetDetails']);
    Route::post('removeSkillSet', [SkillSetController::class, 'removeSkillSet']);
    
    Route::post('getWorkExperiences', [WorkExperienceController::class, 'getWorkExperiences']);
    Route::post('updateWorkExperience', [WorkExperienceController::class, 'updateWorkExperience']);
    Route::post('saveWorkExperience', [WorkExperienceController::class, 'saveWorkExperience']);
    Route::post('removeWorkExperience', [WorkExperienceController::class, 'removeWorkExperience']);
    Route::post('getWorkExperienceDetails', [WorkExperienceController::class, 'getWorkExperienceDetails']);


    Route::post('getCandidateStatusList', [CandidateStatusListController::class, 'getCandidateStatusList']);
    Route::post('updateCandidateStatus', [CandidateStatusListController::class, 'updateCandidateStatus']);
    Route::post('saveCandidateStatus', [CandidateStatusListController::class, 'saveCandidateStatus']);
    Route::post('removeCandidateStatus', [CandidateStatusListController::class, 'removeCandidateStatus']);
    Route::post('getCandidateStatusDetails', [CandidateStatusListController::class, 'getCandidateStatusDetails']);

    Route::post('getCandidateStageList', [CandidateStageListController::class, 'getCandidateStageList']);
    Route::post('updateCandidateStage', [CandidateStageListController::class, 'updateCandidateStage']);
    Route::post('saveCandidateStage', [CandidateStageListController::class, 'saveCandidateStage']);
    Route::post('removeCandidateStage', [CandidateStageListController::class, 'removeCandidateStage']);
    Route::post('getCandidateStageDetails', [CandidateStageListController::class, 'getCandidateStageDetails']);
    
    Route::post('getCandidateSourceList', [CandidateSourceListController::class, 'getCandidateSourceList']);
    Route::post('updateCandidateSource', [CandidateSourceListController::class, 'updateCandidateSource']);
    Route::post('saveCandidateSource', [CandidateSourceListController::class, 'saveCandidateSource']);
    Route::post('removeCandidateSource', [CandidateSourceListController::class, 'removeCandidateSource']);
    Route::post('getCandidateSourceDetails', [CandidateSourceListController::class, 'getCandidateSourceDetails']);



/*
    Route::get('createSuperAdmin', [UserController::class, 'createSuperAdmin']);*/

    


});

    Route::post('api/uploadTempJobSummaryAttachment', [JobController::class, 'uploadTempJobSummaryAttachment']);
    Route::post('api/uploadTempResumeAttachment', [CandidateController::class, 'uploadTempResumeAttachment']);


Route::post('send-reset-password-link', [ForgotPasswordController::class, 'sendResetPasswordLink'])->name('send-reset-password-link');
Route::post('submit-password', [ForgotPasswordController::class, 'submitPassword']);
Route::post('reset/{token}', [ForgotPasswordController::class, 'resetpass']);







Route::get('/{url}', function ($url) {
    return view('welcome');
});

Route::get('/{url}/{url2}', function ($url,$url2) {
    return view('welcome');
});


Auth::routes();
