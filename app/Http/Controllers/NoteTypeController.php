<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NoteType;
use DB;
class NoteTypeController extends Controller
{
    public function getNoteTypes(Request $request){
        $noteTypes=NoteType::get();
        return ['status'=>true,'noteTypes'=>$noteTypes];
    }
    public function updateNoteTypeDetails(Request $request){

        $input=$request->all();

        $note_type_details=NoteType::find($input['id']);
        $note_type_details->name=$input['name'];
        $note_type_details->save();

        return ['status'=>true,'note_type_details'=>$note_type_details];
    }
    public function saveNoteTypeDetails(Request $request){

        $input=$request->all();

        $note_type_details=new NoteType;
        $note_type_details->name=$input['name'];
        $note_type_details->save();

        return ['status'=>true,'note_type_details'=>$note_type_details];
    }
     public function removeNoteType(Request $request){
        $input=$request->all();
        
        NoteType::where('id',$input['id'])->delete();

            $noteTypes=NoteType::get();
        return ['status'=>true,'noteTypes'=>$noteTypes];

    }
     public function getNoteTypeDetails(Request $request){
        $note_type_details=NoteType::find($request->all()['id']);
        return ['status'=>true,'note_type_details'=>$note_type_details];
    }
}
