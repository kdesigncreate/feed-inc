<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    
    public function uploadThumbnail(Request $request)
    //uploadThumbnailメソッドはサムネイル画像をアップロードするメソッド
    //Request $requestはリクエストを受け取るメソッド
    {
        $validator = Validator::make($request->all(), [
            //Validator::makeはバリデーションを行うメソッド
            //$request->all()はリクエストのデータを全て取得するメソッド
            'thumbnail' => [
                'required',
                //requiredは必須項目を指定するメソッド
                'file',
                //fileはファイルを指定するメソッド
                'image',
                //imageは画像を指定するメソッド
                'mimes:jpeg,jpg,png,webp',
                //mimes:jpeg,jpg,png,webpは画像の形式を指定するメソッド
                'max:5120', // 5MB max
                //max:5120は画像のサイズを指定するメソッド
                'dimensions:min_width=200,min_height=200,max_width=2000,max_height=2000'
                //dimensions:min_width=200,min_height=200,max_width=2000,max_height=2000は画像のサイズを指定するメソッド
            ]
        ]);

        if ($validator->fails()) {
            //validator->fails()はバリデーションが失敗した場合にtrueを返すメソッド
            return response()->json([
                //response()->jsonはJSONを返すメソッド
                'message' => 'Invalid image file',
                //messageはメッセージを指定するメソッド
                'errors' => $validator->errors()
                //errorsはエラーメッセージを指定するメソッド
            ], 422);
        }

        try {
            $file = $request->file('thumbnail');
            //fileはファイルを指定するメソッド
            
            $extension = $file->getClientOriginalExtension();
            //getClientOriginalExtension()はファイルの拡張子を取得するメソッド
            $filename = 'thumbnail_' . time() . '_' . Str::random(10) . '.' . $extension;
            //thumbnail_はサムネイルのファイル名を指定するメソッド
            //time()は現在の時刻を取得するメソッド
            //Str::random(10)はランダムな文字列を生成するメソッド
            //.$extensionはファイルの拡張子を指定するメソッド
            
            $path = $file->storeAs('images/thumbnails', $filename, 'public');
            //storeAs('images/thumbnails', $filename, 'public')はファイルを保存するメソッド
            //StoreAsはファイルを保存するメソッド
            //images/thumbnailsはファイルを保存するディレクトリを指定するメソッド
            //$filenameはファイル名を指定するメソッド
            //publicはファイルを保存するディレクトリを指定するメソッド
        
            $url = Storage::url($path);
            //Storage::url($path)はファイルのURLを取得するメソッド
            //StorageはStorageファサードを指定するメソッド
            //ファサードとはクラスのインスタンスを生成するためのメソッド
            //.$pathはファイルのパスを指定するメソッド

            return response()->json([
                //response()->jsonはJSONを返すメソッド
                'message' => 'Thumbnail uploaded successfully',
                'url' => $url,
                'path' => $path
            ], 200);
            
        } catch (\Exception $e) {
            //catchはエラーを捕捉するためのメソッド
            //\Exception $eはエラーを指定するメソッド
            return response()->json([
                //response()->jsonはJSONを返すメソッド
                'message' => 'Failed to upload thumbnail',
                'error' => 'Internal server error'
            ], 500);
        }
    }
}