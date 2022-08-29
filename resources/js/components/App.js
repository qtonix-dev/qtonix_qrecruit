// import React from "react";
import { BrowserRouter as Router, HashRouter, Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./scss/main.scss";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardNew from "./pages/DashboardNew";

import Candidates from "./pages/Candidate/Candidates";
import CreateCandidate from "./pages/Candidate/CreateCandidate";
import EditCandidate from "./pages/Candidate/EditCandidate";

import JobOpenings from "./pages/JobDetails/JobOpenings";
import JobForm from "./pages/JobDetails/JobForm";
import EditJobForm from "./pages/JobDetails/EditJobForm";

import Departments from "./pages/Department/Departments";
import DepartmentForm from "./pages/Department/DepartmentForm";
import EditDepartmentForm from "./pages/Department/EditDepartmentForm";

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
                    <Route exact="true" path="/" element={<Home />} />
                    <Route exact="true" path="/login" element={<Login />} />

                    <Route exact="true" path="/dashboard" element={<Dashboard />} />

                    <Route exact="true" path="/jobOpenings" element={<JobOpenings />} />
                    <Route exact="true" path="/postJob" element={<JobForm />} />
                    <Route exact="true" path="/editJobDetails" element={<EditJobForm />} />
                    
                    <Route exact="true" path="/candidates" element={<Candidates />} />
                    <Route exact="true" path="/createCandidate" element={<CreateCandidate />} />
                    <Route exact="true" path="/editCandidate" element={<EditCandidate />} />

                    <Route exact="true" path="/candidateStageForm" element={<CandidateStageForm />} />
                    <Route exact="true" path="/candidateStages" element={<CandidateStage />} />
                    <Route exact="true" path="/editCandidateStage" element={<EditCandidateStage />} />

                    <Route exact="true" path="/candidateStatusForm" element={<CandidateStatusForm />} />
                    <Route exact="true" path="/candidateStatus" element={<CandidateStatus />} />
                    <Route exact="true" path="/editCandidateStatus" element={<EditCandidateStatus />} />

                    <Route exact="true" path="/candidateSourceForm" element={<CandidateSourceForm />} />
                    <Route exact="true" path="/candidateSources" element={<CandidateSource />} />
                    <Route exact="true" path="/editCandidateSource" element={<EditCandidateSource />} />

                    <Route exact="true" path="/departments" element={<Departments />} />
                    <Route exact="true" path="/createDepartment" element={<DepartmentForm />} />
                    <Route exact="true" path="/editDeparment" element={<EditDepartmentForm />} />

                    <Route exact="true" path="/jobOpeningStatus" element={<JobOpeningStatus />} />
                    <Route exact="true" path="/createJobOpeningStatus" element={<JobOpeningStatusForm />} />
                    <Route exact="true" path="/editJobOpeningStatus" element={<EditJobOpeningStatusForm />} />

                    <Route exact="true" path="/jobTypes" element={<JobTypes />} />
                    <Route exact="true" path="/createJobType" element={<JobTypeForm />} />
                    <Route exact="true" path="/editJobType" element={<EditJobTypeForm />} />
                    
                    <Route exact="true" path="/workExperiences" element={<WorkExperiences />} />
                    <Route exact="true" path="/createWorkExperience" element={<WorkExperienceForm />} />
                    <Route exact="true" path="/editWorkExperience" element={<EditWorkExperienceForm />} />

                    <Route exact="true" path="/skillSets" element={<SkillSets />} />
                    <Route exact="true" path="/createSkillSet" element={<SkillSetForm />} />
                    <Route exact="true" path="/editSkillSet" element={<EditSkillSetForm />} />

                    <Route exact="true" path="/users" element={<Users />} />
                    <Route exact="true" path="/createUser" element={<CreateUsersForm />} />
                    <Route exact="true" path="/editUser" element={<EditUserForm />} />
                    <Route exact="true" path="/editProfile" element={<EditProfile />} />
                    

                    <Route exact="true" path="/401" element={<UnAuthenticated />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </Router>
        </>
    );
}


//FIXED RESPONSIVE ISSUES
//FIXED USER API CALL AGAIN AND AGAIN
