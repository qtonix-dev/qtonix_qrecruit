<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CompanyDetail;

class CompanyController extends Controller
{
    public function getCompanyList(Request $request){
        $companies=CompanyDetail::get();
        return ['status'=>true,'companies'=>$companies];
    }
    public function updateCompanyDetails(Request $request){

        $input=$request->all();

        $company_details=CompanyDetail::find($input['id']);
        $company_details->name=$input['name'];
        $company_details->street=$input['street'];
        $company_details->city=$input['city'];
        $company_details->state=$input['state'];
        $company_details->country=$input['country'];
        $company_details->zip_code=$input['zip_code'];
        $company_details->phone_number=$input['phone_number'];
        $company_details->official_email=$input['official_email'];
        $company_details->save();

        return ['status'=>true,'company_details'=>$company_details];
    }
    public function saveCompanyDetails(Request $request){

        $input=$request->all();

        $company_details=new CompanyDetail;
        $company_details->name=$input['name'];
        $company_details->street=$input['street'];
        $company_details->city=$input['city'];
        $company_details->state=$input['state'];
        $company_details->country=$input['country'];
        $company_details->zip_code=$input['zip_code'];
        $company_details->phone_number=$input['phone_number'];
        $company_details->official_email=$input['official_email'];
        $company_details->save();

        return ['status'=>true,'company_details'=>$company_details];
    }
    public function removeCompany(Request $request){
        $input=$request->all();
        
        CompanyDetail::where('id',$input['id'])->delete();
        
        return ['status'=>true];

    }
}
