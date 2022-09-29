// import React from "react";
import { BrowserRouter as Router, HashRouter, Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./scss/main.scss";

import API from "./api/API";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardNew from "./pages/DashboardNew";

import Candidates from "./pages/Candidate/Candidates";
import SubmittedCandidates from "./pages/Candidate/SubmittedCandidates";
import CreateCandidate from "./pages/Candidate/CreateCandidate";
import EditCandidate from "./pages/Candidate/EditCandidate";
import ViewCandidate from "./pages/Candidate/ViewCandidate";
import CandidatesKanban from "./pages/Candidate/CandidatesKanban";

import ScheduledInterviews from "./pages/Interview/ScheduledInterviews";
import ScheduleAnInterview from "./pages/Interview/ScheduleAnInterview";
import EditInterview from "./pages/Interview/EditInterview";
import ScheduledInterviewsCalender from "./pages/Interview/ScheduledInterviewsCalender";


import JobOpenings from "./pages/JobDetails/JobOpenings";
import JobForm from "./pages/JobDetails/JobForm";
import EditJobForm from "./pages/JobDetails/EditJobForm";

import Departments from "./pages/Department/Departments";
import DepartmentForm from "./pages/Department/DepartmentForm";
import EditDepartmentForm from "./pages/Department/EditDepartmentForm";

import NoteTypes from "./pages/NoteTypes/NoteTypes";
import NoteTypeForm from "./pages/NoteTypes/NoteTypeForm";
import EditNoteTypeForm from "./pages/NoteTypes/EditNoteTypeForm";

import InterviewTypes from "./pages/InterviewTypes/InterviewTypes";
import InterviewTypeForm from "./pages/InterviewTypes/InterviewTypeForm";
import EditInterviewTypeForm from "./pages/InterviewTypes/EditInterviewTypeForm";

import JobOpeningStatus from "./pages/JobOpeningStatus/JobOpeningStatus";
import JobOpeningStatusForm from "./pages/JobOpeningStatus/JobOpeningStatusForm";
import EditJobOpeningStatusForm from "./pages/JobOpeningStatus/EditJobOpeningStatusForm";

import JobTypes from "./pages/JobTypes/JobTypes";
import JobTypeForm from "./pages/JobTypes/JobTypeForm";
import EditJobTypeForm from "./pages/JobTypes/EditJobTypeForm";

import WorkExperiences from "./pages/WorkExperiences/WorkExperiences";
import WorkExperienceForm from "./pages/WorkExperiences/WorkExperienceForm";
import EditWorkExperienceForm from "./pages/WorkExperiences/EditWorkExperienceForm";


import SkillSets from "./pages/SkillSets/SkillSets";
import SkillSetForm from "./pages/SkillSets/SkillSetForm";
import EditSkillSetForm from "./pages/SkillSets/EditSkillSetForm";

import Users from "./pages/Users/Users";
import CreateUsersForm from "./pages/Users/CreateUsersForm";
import EditUserForm from "./pages/Users/EditUserForm";
import EditProfile from "./pages/Users/EditProfile";

import CandidateStage from "./pages/CandidateStage/CandidateStage";
import CandidateStageForm from "./pages/CandidateStage/CandidateStageForm";
import EditCandidateStage from "./pages/CandidateStage/EditCandidateStage";

import CandidateSource from "./pages/CandidateSource/CandidateSource";
import CandidateSourceForm from "./pages/CandidateSource/CandidateSourceForm";
import EditCandidateSource from "./pages/CandidateSource/EditCandidateSource";

import CandidateStatus from "./pages/CandidateStatus/CandidateStatus";
import CandidateStatusForm from "./pages/CandidateStatus/CandidateStatusForm";
import EditCandidateStatus from "./pages/CandidateStatus/EditCandidateStatus";


import PageNotFound from './pages/PageNotFound';
import UnAuthenticated from './pages/UnAuthenticated';

export default function App() {
    return (
        <>
            <Router >
                <Routes>
                    <Route exact="true" path={API.defaults.frontURL+"/"} element={<Home />} />
                    <Route exact="true" path={API.defaults.frontURL+"/login"} element={<Login />} />

                    <Route exact="true" path={API.defaults.frontURL+"/dashboard"} element={<Dashboard />} />

                    <Route exact="true" path={API.defaults.frontURL+"/jobOpenings"} element={<JobOpenings />} />
                    <Route exact="true" path={API.defaults.frontURL+"/postJob"} element={<JobForm />} />
                    <Route exact="true" path={API.defaults.frontURL+"/editJobDetails"} element={<EditJobForm />} />
                    
                    <Route exact="true" path={API.defaults.frontURL+"/candidates"} element={<Candidates />} />
                    <Route exact="true" path={API.defaults.frontURL+"/submittedCandidates"} element={<SubmittedCandidates />} />
                    <Route exact="true" path={API.defaults.frontURL+"/createCandidate"} element={<CreateCandidate />} />
                    <Route exact="true" path={API.defaults.frontURL+"/editCandidate"} element={<EditCandidate />} />
                    <Route exact="true" path={API.defaults.frontURL+"/ViewCandidate"} element={<ViewCandidate />} />
                    <Route exact="true" path={API.defaults.frontURL+"/candidatesKanban"} element={<CandidatesKanban />} />
                    
                    <Route exact="true" path={API.defaults.frontURL+"/candidateStageForm"} element={<CandidateStageForm />} />
                    <Route exact="true" path={API.defaults.frontURL+"/candidateStages"} element={<CandidateStage />} />
                    <Route exact="true" path={API.defaults.frontURL+"/editCandidateStage"} element={<EditCandidateStage />} />

                    <Route exact="true" path={API.defaults.frontURL+"/candidateStatusForm"} element={<CandidateStatusForm />} />
                    <Route exact="true" path={API.defaults.frontURL+"/candidateStatus"} element={<CandidateStatus />} />
                    <Route exact="true" path={API.defaults.frontURL+"/editCandidateStatus"} element={<EditCandidateStatus />} />

                    <Route exact="true" path={API.defaults.frontURL+"/candidateSourceForm"} element={<CandidateSourceForm />} />
                    <Route exact="true" path={API.defaults.frontURL+"/candidateSources"} element={<CandidateSource />} />
                    <Route exact="true" path={API.defaults.frontURL+"/editCandidateSource"} element={<EditCandidateSource />} />

                    <Route exact="true" path={API.defaults.frontURL+"/departments"} element={<Departments />} />
                    <Route exact="true" path={API.defaults.frontURL+"/createDepartment"} element={<DepartmentForm />} />
                    <Route exact="true" path={API.defaults.frontURL+"/editDeparment"} element={<EditDepartmentForm />} />


                    <Route exact="true" path={API.defaults.frontURL+"/noteTypes"} element={<NoteTypes />} />
                    <Route exact="true" path={API.defaults.frontURL+"/createNoteType"} element={<NoteTypeForm />} />
                    <Route exact="true" path={API.defaults.frontURL+"/editNoteType"} element={<EditNoteTypeForm />} />

                    <Route exact="true" path={API.defaults.frontURL+"/interviewTypes"} element={<InterviewTypes />} />
                    <Route exact="true" path={API.defaults.frontURL+"/createInterviewType"} element={<InterviewTypeForm />} />
                    <Route exact="true" path={API.defaults.frontURL+"/editInterviewType"} element={<EditInterviewTypeForm />} />

                    <Route exact="true" path={API.defaults.frontURL+"/scheduledInterviews"} element={<ScheduledInterviews />} />
                    <Route exact="true" path={API.defaults.frontURL+"/scheduleAnInterview"} element={<ScheduleAnInterview />} />
                    <Route exact="true" path={API.defaults.frontURL+"/editInterview"} element={<EditInterview />} />
                    <Route exact="true" path={API.defaults.frontURL+"/interviewCalender"} element={<ScheduledInterviewsCalender />} />
                    
                    

                    <Route exact="true" path={API.defaults.frontURL+"/jobOpeningStatus"} element={<JobOpeningStatus />} />
                    <Route exact="true" path={API.defaults.frontURL+"/createJobOpeningStatus"} element={<JobOpeningStatusForm />} />
                    <Route exact="true" path={API.defaults.frontURL+"/editJobOpeningStatus"} element={<EditJobOpeningStatusForm />} />

                    <Route exact="true" path={API.defaults.frontURL+"/jobTypes"} element={<JobTypes />} />
                    <Route exact="true" path={API.defaults.frontURL+"/createJobType"} element={<JobTypeForm />} />
                    <Route exact="true" path={API.defaults.frontURL+"/editJobType"} element={<EditJobTypeForm />} />
                    
                    <Route exact="true" path={API.defaults.frontURL+"/workExperiences"} element={<WorkExperiences />} />
                    <Route exact="true" path={API.defaults.frontURL+"/createWorkExperience"} element={<WorkExperienceForm />} />
                    <Route exact="true" path={API.defaults.frontURL+"/editWorkExperience"} element={<EditWorkExperienceForm />} />

                    <Route exact="true" path={API.defaults.frontURL+"/skillSets"} element={<SkillSets />} />
                    <Route exact="true" path={API.defaults.frontURL+"/createSkillSet"} element={<SkillSetForm />} />
                    <Route exact="true" path={API.defaults.frontURL+"/editSkillSet"} element={<EditSkillSetForm />} />

                    <Route exact="true" path={API.defaults.frontURL+"/users"} element={<Users />} />
                    <Route exact="true" path={API.defaults.frontURL+"/createUser"} element={<CreateUsersForm />} />
                    <Route exact="true" path={API.defaults.frontURL+"/editUser"} element={<EditUserForm />} />
                    <Route exact="true" path={API.defaults.frontURL+"/editProfile"} element={<EditProfile />} />
                    

                    <Route exact="true" path={API.defaults.frontURL+"/401"} element={<UnAuthenticated />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </Router>
        </>
    );
}


//FIXED RESPONSIVE ISSUES
//FIXED USER API CALL AGAIN AND AGAIN
