<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Rules\SafeHtmlContent;
use App\Rules\SafeImagePath;
use App\Rules\CategoryWhitelist;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Validate input parameters
        $validator = Validator::make($request->all(), [
            'category' => ['nullable', 'string', new CategoryWhitelist()],
            'published' => 'nullable|boolean',
            'search' => 'nullable|string|max:100|regex:/^[a-zA-Z0-9\s\p{Hiragana}\p{Katakana}\p{Han}]+$/u',
            'page' => 'nullable|integer|min:1|max:1000',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid input parameters',
                'errors' => $validator->errors()
            ], 422);
        }

        $query = Article::query();

        // フィルタリング（バリデーション済み）
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('published')) {
            $query->where('is_published', $request->published);
        }

        // 検索（サニタイズ済み）
        if ($request->has('search') && !empty($request->search)) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // 公開済みのみ（フロントエンド用）
        if ($request->has('published_only')) {
            $query->published();
        }

        $articles = $query->orderBy('published_at', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($articles);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'min:3', 'max:255', new SafeHtmlContent()],
            'content' => ['required', 'string', 'min:10', 'max:100000', new SafeHtmlContent()],
            'excerpt' => ['nullable', 'string', 'max:1000', new SafeHtmlContent()],
            'category' => ['required', new CategoryWhitelist()],
            'tag' => 'nullable|string|max:100|regex:/^[a-zA-Z0-9\s\/\-_,]+$/',
            'author' => 'required|string|min:2|max:100|regex:/^[a-zA-Z\s\p{Hiragana}\p{Katakana}\p{Han}]+$/u',
            'featured_image' => ['nullable', new SafeImagePath()],
            'is_published' => 'nullable|boolean',
            'published_at' => 'nullable|date|after_or_equal:today',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Additional content sanitization
        $sanitizedData = [
            'title' => strip_tags(trim($request->title)),
            'content' => $this->sanitizeContent($request->content),
            'excerpt' => $request->excerpt ? strip_tags(trim($request->excerpt)) : null,
            'category' => trim($request->category),
            'tag' => $request->tag ? trim($request->tag) : 'promo/insights',
            'author' => trim($request->author),
            'featured_image' => $request->featured_image ? trim($request->featured_image) : null,
            'is_published' => $request->is_published ?? true,
            'published_at' => $request->published_at ?? now(),
        ];

        $article = Article::create([
            ...$sanitizedData,
            'slug' => $this->generateUniqueSlug($sanitizedData['title']),
        ]);

        return response()->json($article, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $slug)
    {
        $query = Article::where('slug', $slug);
        
        // Only return published articles for public access
        if (!$request->user()) {
            $query->published();
        }
        
        $article = $query->firstOrFail();

        return response()->json($article);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $article = Article::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:100000',
            'excerpt' => 'nullable|string|max:1000',
            'category' => 'required|string|max:255',
            'tag' => 'nullable|string|max:255',
            'author' => 'required|string|max:255',
            'featured_image' => 'nullable|string|max:255',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $article->update([
            'title' => $request->title,
            'slug' => $request->title !== $article->title ? Str::slug($request->title.'-'.time()) : $article->slug,
            'content' => $request->content,
            'excerpt' => $request->excerpt,
            'category' => $request->category,
            'tag' => $request->tag ?? 'promo/insights',
            'author' => $request->author,
            'featured_image' => $request->featured_image,
            'is_published' => $request->is_published ?? true,
            'published_at' => $request->published_at ?? $article->published_at,
        ]);

        return response()->json($article);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $article = Article::findOrFail($id);
        $article->delete();

        return response()->json(['message' => 'Article deleted successfully']);
    }

    /**
     * Upload thumbnail image
     */
    public function uploadThumbnail(Request $request)
    {
        // Debug: Log request details
        \Log::info('Upload request received', [
            'files' => $request->files->all(),
            'data' => $request->all(),
            'headers' => $request->headers->all(),
        ]);

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
            \Log::error('Validation failed', ['errors' => $validator->errors()]);
            return response()->json([
                'message' => 'Invalid image file',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('thumbnail');
            \Log::info('File validated successfully', [
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType()
            ]);
            
            // Generate unique filename
            $extension = $file->getClientOriginalExtension();
            $filename = 'thumbnail_' . time() . '_' . Str::random(10) . '.' . $extension;
            \Log::info('Generated filename', ['filename' => $filename]);
            
            // Store in public/images/thumbnails directory
            $path = $file->storeAs('images/thumbnails', $filename, 'public');
            \Log::info('File stored', ['path' => $path]);
            
            // Return the public storage URL
            $url = '/storage/' . $path;
            \Log::info('Upload successful', ['url' => $url, 'path' => $path]);
            
            return response()->json([
                'message' => 'Thumbnail uploaded successfully',
                'url' => $url,
                'path' => $path
            ], 200);
            
        } catch (\Exception $e) {
            \Log::error('Upload failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Failed to upload thumbnail',
                'error' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get categories with counts
     */
    public function categories()
    {
        $categories = Article::selectRaw('category, count(*) as count')
            ->published()
            ->groupBy('category')
            ->get();

        $allCount = Article::published()->count();

        $result = [
            ['key' => 'all', 'label' => 'すべて', 'count' => $allCount],
        ];

        $categoryMap = [
            '店頭販促' => 'store',
            'デザイン' => 'design',
            'キャンペーン' => 'campaign',
            'イベント' => 'event',
            'デジタルプロモーション' => 'digital',
            '営業ツール' => 'sales',
            'ノベルティ' => 'novelty',
        ];

        foreach ($categories as $category) {
            $key = $categoryMap[$category->category] ?? Str::slug($category->category);
            $result[] = [
                'key' => $key,
                'label' => $category->category,
                'count' => $category->count,
            ];
        }

        return response()->json($result);
    }

    /**
     * Sanitize content while preserving safe HTML tags
     */
    private function sanitizeContent(string $content): string
    {
        // Allow only safe HTML tags for article content
        $allowedTags = '<p><br><strong><em><u><h1><h2><h3><h4><h5><h6><ul><ol><li><blockquote><a><img>';
        
        // Strip dangerous tags first
        $content = strip_tags($content, $allowedTags);
        
        // Remove dangerous attributes from allowed tags
        $content = preg_replace_callback('/<(\w+)([^>]*)>/', function($matches) {
            $tag = $matches[1];
            $attributes = $matches[2];
            
            // For links, allow only href, title, target, rel
            if ($tag === 'a') {
                $attributes = preg_replace('/\s(?!href|title|target|rel)[a-zA-Z\-]+="[^"]*"/', '', $attributes);
                $attributes = preg_replace('/\son[a-zA-Z]+="[^"]*"/', '', $attributes); // Remove event handlers
            }
            
            // For images, allow only src, alt, title, width, height
            if ($tag === 'img') {
                $attributes = preg_replace('/\s(?!src|alt|title|width|height)[a-zA-Z\-]+="[^"]*"/', '', $attributes);
                $attributes = preg_replace('/\son[a-zA-Z]+="[^"]*"/', '', $attributes); // Remove event handlers
            }
            
            // Remove all event handlers from any tag
            $attributes = preg_replace('/\son[a-zA-Z]+="[^"]*"/', '', $attributes);
            
            return "<{$tag}{$attributes}>";
        }, $content);
        
        return trim($content);
    }

    /**
     * Generate unique slug for article
     */
    private function generateUniqueSlug(string $title): string
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug;
        $counter = 1;

        while (Article::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
