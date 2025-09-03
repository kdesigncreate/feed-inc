<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    /**
     * Upload thumbnail image
     */
    public function uploadThumbnail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'thumbnail' => [
                'required',
                'file',
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:5120', // 5MB max
                'dimensions:min_width=200,min_height=200,max_width=2000,max_height=2000'
            ]
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid image file',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('thumbnail');
            
            // Generate unique filename
            $extension = $file->getClientOriginalExtension();
            $filename = 'thumbnail_' . time() . '_' . Str::random(10) . '.' . $extension;
            
            // Store in public/images/thumbnails directory
            $path = $file->storeAs('images/thumbnails', $filename, 'public');
            
            // Return the public URL
            $url = Storage::url($path);
            
            return response()->json([
                'message' => 'Thumbnail uploaded successfully',
                'url' => $url,
                'path' => $path
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to upload thumbnail',
                'error' => 'Internal server error'
            ], 500);
        }
    }
}