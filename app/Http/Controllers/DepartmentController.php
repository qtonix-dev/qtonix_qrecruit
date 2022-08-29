<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Department;
use DB;
class DepartmentController extends Controller
{
    public function getDepartmentList(Request $request){
        $departments=Department::get();
        return ['status'=>true,'departments'=>$departments];
    }
    public function updateDepartmentDetails(Request $request){

        $input=$request->all();

        $department_details=Department::find($input['id']);
        $department_details->name=$input['name'];
        $department_details->save();

        return ['status'=>true,'department_details'=>$department_details];
    }
    public function saveDepartmentDetails(Request $request){

        $input=$request->all();

        $department_details=new Department;
        $department_details->name=$input['name'];
        $department_details->save();

        return ['status'=>true,'department_details'=>$department_details];
    }
     public function removeDepartment(Request $request){
        $input=$request->all();
        
        Department::where('id',$input['id'])->delete();

            $departments=Department::get();
        return ['status'=>true,'departments'=>$departments];

    }
     public function getDepartmentDetails(Request $request){
        $department_details=Department::find($request->all()['id']);
        return ['status'=>true,'department_details'=>$department_details];
    }
}
