<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Article::query();

        // フィルタリング
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('published')) {
            $query->where('is_published', $request->published);
        }

        // 検索
        if ($request->has('search')) {
            $search = $request->search;
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

        $article = Article::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title.'-'.time()),
            'content' => $request->content,
            'excerpt' => $request->excerpt,
            'category' => $request->category,
            'tag' => $request->tag ?? 'promo/insights',
            'author' => $request->author,
            'featured_image' => $request->featured_image,
            'is_published' => $request->is_published ?? true,
            'published_at' => $request->published_at ?? now(),
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
}
