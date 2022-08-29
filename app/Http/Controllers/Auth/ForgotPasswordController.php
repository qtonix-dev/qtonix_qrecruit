<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;

class ForgotPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset emails and
    | includes a trait which assists in sending these notifications from
    | your application to your users. Feel free to explore this trait.
    |
    */

    //use SendsPasswordResetEmails;
    public function resetpass($token)
    {

        if($user=User::where('remember_token',$token)->first()){
             
            return ['status'=>true,'message'=>'token found'];
        }
      return ['status'=>false,'message'=>'token not found'];
    }

    public function submitPassword(Request $request){
        $input=$request->all();

        if($input['password']!=$input['confirm_new_password']){

            return ['status'=>false,'message'=>'The password confirmation does not match.'];
        }else{
            $user=User::where('remember_token',$input['token'])->first();
            $user->password=Hash::make($input['password']);
            $user->save();

            return ['status'=>true,'message'=>'Your password has been reset successfully.'];
        }
    }
    public function sendResetPasswordLink(Request $request){

        $input=$request->all();
        $user=User::where('email',$input['email'])->first();
        
        if($user){
             $user->remember_token = substr(md5(mt_rand()), 0, 7);
             $user->save();

            $to = $input['email'];
            $subject = "Reset Password link";
            $txt =URL::to('/')."/reset/".$user->remember_token;
               

            $headers = "From: biki.qtonix1@gmail.com";

            mail($to,$subject,$txt,$headers);

            return ['status'=>true,'message'=>'We have sent a link to your email id . Please check your inbox'];
            
        }else{
            return ['status'=>false,'message'=>'We can\'t find a user with that email address.'];
        }
       


    }
}
