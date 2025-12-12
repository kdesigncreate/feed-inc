<?php

namespace App\Http\Controllers;
//記事のCRUDを管理するコントローラー

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Rules\SafeHtmlContent;
use App\Rules\SafeImagePath;
use App\Rules\CategoryWhitelist;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
//記事のCRUDを管理するコントローラーを定義
{
    public function index(Request $request)
    //記事の一覧を取得するメソッドを定義
    //indexメソッドは記事の一覧を取得するメソッド
    //Request $requestはリクエストを受け取るメソッド
    {
        $validator = Validator::make($request->all(), [
            //Validator::makeはバリデーションを行うメソッド
            //$request->all()はリクエストのデータを全て取得するメソッド
            'category' => ['nullable', 'string', new CategoryWhitelist()],
            //categoryはカテゴリーを指定するメソッド
            'published' => 'nullable|boolean',
            //publishedは公開状態を指定するメソッド
            'search' => 'nullable|string|max:100|regex:/^[a-zA-Z0-9\s\p{Hiragana}\p{Katakana}\p{Han}]+$/u',
            //searchは検索ワードを指定するメソッド
            'page' => 'nullable|integer|min:1|max:1000',
            //pageはページ番号を指定するメソッド
            'per_page' => 'nullable|integer|min:1|max:100',
            //per_pageはページあたりの件数を指定するメソッド
        ]);

        if ($validator->fails()) {
            //validator->fails()はバリデーションが失敗した場合にtrueを返すメソッド
            return response()->json([
                //response()->json()はJSON形式でレスポンスを返すメソッド
                'message' => 'Invalid input parameters',
                //messageはメッセージを指定するメソッド
                'errors' => $validator->errors(),
                //errorsはエラーメッセージを指定するメソッド
            ], 422);
        }

        $query = Article::query();
        //Article::query()はArticleモデルのクエリを作成するメソッド
        //クエリとはSQL文を作成するためのもの

        // フィルタリング（バリデーション済み）
        if ($request->has('category') && $request->category !== 'all') {
            //$request->はリクエストのデータを取得するメソッド
            //has('category')はリクエストにcategoryがあるかどうかを判断するメソッド
            //$request->category !== 'all'はcategoryがallではない場合にtrueを返すメソッド
            //categoryがallではないというのはすべてのカテゴリーを指定する場合を除くということ
            $query->where('category', $request->category);
            //$query->はクエリを作成するためのメソッド
            //where('category', $request->category)はcategoryが$request->categoryと一致する場合にtrueを返すメソッド
        }

        if ($request->has('published')) {
            //$request->はリクエストのデータを取得するメソッド
            //has('published')はリクエストにpublishedがあるかどうかを判断するメソッド
            $query->where('is_published', $request->published);
            //$query->はクエリを作成するためのメソッド
            //where('is_published', $request->published)はis_publishedが$request->publishedと一致する場合にtrueを返すメソッド
        }

        // 検索（サニタイズ済み）
        if ($request->has('search') && !empty($request->search)) {
            //$request->はリクエストのデータを取得するメソッド
            //has('search')はリクエストにsearchがあるかどうかを判断するメソッド
            //!empty($request->search)はsearchが空ではない場合にtrueを返すメソッド
            $search = trim($request->search);
            //$search = trim($request->search)はsearchをトリムするメソッド
            $query->where(function ($q) use ($search) {
                //whereはクエリを作成するためのメソッド
                //function ($q) use ($search)はクエリを作成するためのメソッド
                $q->where('title', 'like', "%{$search}%")
                //q->はクエリを作成するためのメソッド
                //where('title', 'like', "%{$search}%")はtitleが$searchと一致する場合にtrueを返すメソッド
                    ->orWhere('content', 'like', "%{$search}%");
                    //orWhere('content', 'like', "%{$search}%")はcontentが$searchと一致する場合にtrueを返すメソッド
            });
        }

        // 公開済みのみ（フロントエンド用）
        if ($request->has('published_only')) {
            //$request->はリクエストのデータを取得するメソッド
            //has('published_only')はリクエストにpublished_onlyがあるかどうかを判断するメソッド
            //published_onlyとは公開状態のみということ
            $query->published();
            //$query->はクエリを作成するためのメソッド
            //published()は公開状態を指定するメソッド
        }

        $articles = $query->orderBy('published_at', 'desc')
        //query->はクエリを作成するためのメソッド
        //orderBy('published_at', 'desc')は公開日時を降順で並べ替えるメソッド
            ->orderBy('created_at', 'desc')
            //orderBy('created_at', 'desc')は作成日時を降順で並べ替えるメソッド
            ->paginate(10);
            //paginate(10)は10件ずつページングするメソッド

        return response()->json($articles);
        //response()->json($articles)はJSON形式でレスポンスを返すメソッド
    }

    //記事を作成するメソッドを定義
    public function store(Request $request)
    //storeメソッドは記事を作成するメソッド
    //Request $requestはリクエストを受け取るメソッド
    {
        $validator = Validator::make($request->all(), [
            //Validator::makeはバリデーションを行うメソッド
            //$request->all()はリクエストのデータを全て取得するメソッド
            'title' => ['required', 'string', 'min:3', 'max:255', new SafeHtmlContent()],
            //titleはタイトルを指定するメソッド 
            'content' => ['required', 'string', 'min:10', 'max:100000', new SafeHtmlContent()],
            //contentは内容を指定するメソッド
            'excerpt' => ['nullable', 'string', 'max:1000', new SafeHtmlContent()],
            //excerptは要約を指定するメソッド
            'category' => ['required', new CategoryWhitelist()],
            //categoryはカテゴリーを指定するメソッド
            'featured_image' => ['nullable', new SafeImagePath()],
            //featured_imageは画像を指定するメソッド
            'is_published' => 'nullable|boolean',
            //is_publishedは公開状態を指定するメソッド
            'published_at' => 'nullable|date|after_or_equal:today',
            //published_atは公開日時を指定するメソッド
        ]);

        if ($validator->fails()) {
            //validator->fails()はバリデーションが失敗した場合にtrueを返すメソッド
            return response()->json([
                //response()->json()はJSON形式でレスポンスを返すメソッド
                'message' => 'Validation failed',
                //messageはメッセージを指定するメソッド
                'errors' => $validator->errors()
                //errorsはエラーメッセージを指定するメソッド
            ], 422);
        }

        // コンテンツのサニタイズ
        //サニタイズとはセキュリティを確保するための処理
        $sanitizedData = [
            'title' => strip_tags(trim($request->title)),
            //strip_tagsはHTMLタグを除去するメソッド
            //(trim($request->title))はタイトルをトリムするメソッド
            'content' => $this->sanitizeContent($request->content),
            //thisは現在のクラスのメソッドを呼び出すためのキーワード。ここではsanitizeContentメソッドを呼び出す。
            'excerpt' => $request->excerpt ? strip_tags(trim($request->excerpt)) : null,
            //excerptは要約を指定するメソッド。? strip_tags(trim($request->excerpt))はexcerptが空ではない場合にtrueを返すメソッド。
            'category' => trim($request->category),
            //categoryはカテゴリーを指定するメソッド。trim($request->category)はcategoryをトリムするメソッド。
            'featured_image' => $request->featured_image ? trim($request->featured_image) : null,
            //featured_imageは画像を指定するメソッド。? trim($request->featured_image)はfeatured_imageが空ではない場合にtrueを返すメソッド。
            'is_published' => $request->is_published ?? true,
            //is_publishedは公開状態を指定するメソッド。?? trueは公開状態を指定するメソッド。
            'published_at' => $request->published_at ?? now(),
            //published_atは公開日時を指定するメソッド。?? now()は現在の日時を指定するメソッド。
        ];

        $article = Article::create([
            //Article::create()はArticleモデルのデータを作成するメソッド
            //モデルとはデータベースのテーブルを操作するためのもの
            ...$sanitizedData,
            //...$sanitizedDataはsanitizedDataのデータを展開するメソッド。
            'slug' => $this->generateUniqueSlug($sanitizedData['title']),
            //slugはスラッグを指定するメソッド。
            //thisは現在のクラスのメソッドを呼び出すためのキーワード。ここではgenerateUniqueSlugメソッドを呼び出す。
            //generateUniqueSlug($sanitizedData['title'])はスラッグを生成するメソッド。
        ]);

        return response()->json($article, 201);
        //response()->json($article, 201)はJSON形式でレスポンスを返すメソッド。
    }

    //記事を取得するメソッドを定義
    public function show(Request $request, string $slug)
    //showメソッドは記事を取得するメソッド
    //Request $requestはリクエストを受け取るメソッド
    //string $slugはスラッグを指定するメソッド
    {
        $query = Article::where('slug', $slug);
        //Article::where('slug', $slug)はArticleモデルのデータを取得するメソッド
        //whereはクエリを作成するためのメソッド
        //slugはスラッグを指定するメソッド
        //$slugはスラッグを指定するメソッド
        if (!$request->user()) {
            //!request->user()はリクエストにuserがあるかどうかを判断するメソッド
            $query->published();
            //$query->はクエリを作成するためのメソッド
            //published()は公開状態を指定するメソッド
        }
        
        $article = $query->firstOrFail();
        //firstOrFail()はデータを取得するためのメソッド
        //firstOrFail()とはデータが存在しない場合はエラーを返すメソッド。

        return response()->json($article);
        //response()->json($article)はJSON形式でレスポンスを返すメソッド。
    }

    //記事を更新するメソッドを定義
    public function update(Request $request, string $id)
    //updateメソッドは記事を更新するメソッド
    //Request $requestはリクエストを受け取るメソッド
    //string $idはIDを指定するメソッド
    {
        $article = Article::findOrFail($id);
        //Article::findOrFail($id)はArticleモデルのidが$idと一致するデータを取得するメソッド

        $validator = Validator::make($request->all(), [
            //Validator::makeはバリデーションを行うメソッド
            //$request->all()はリクエストのデータを全て取得するメソッド
            'title' => ['required', 'string', 'min:3', 'max:255', new SafeHtmlContent()],
            //titleはタイトルを指定するメソッド
            'content' => ['required', 'string', 'min:10', 'max:100000', new SafeHtmlContent()],
            //contentは内容を指定するメソッド
            'excerpt' => ['nullable', 'string', 'max:1000', new SafeHtmlContent()],
            //excerptは要約を指定するメソッド
            'category' => ['required', new CategoryWhitelist()],
            //categoryはカテゴリーを指定するメソッド
            'featured_image' => ['nullable', new SafeImagePath()],
            //featured_imageは画像を指定するメソッド
            'is_published' => 'nullable|boolean',
            //is_publishedは公開状態を指定するメソッド
            'published_at' => 'nullable|date|after_or_equal:today',
            //published_atは公開日時を指定するメソッド
        ]);

        if ($validator->fails()) {
            //validator->fails()はバリデーションが失敗した場合にtrueを返すメソッド  
            return response()->json([
                //response()->json()はJSON形式でレスポンスを返すメソッド
                'message' => 'Validation failed',
                //messageはメッセージを指定するメソッド
                'errors' => $validator->errors()
                //errorsはエラーメッセージを指定するメソッド
            ], 422);
        }

        $sanitizedData = [
            //サニタイズとはセキュリティを確保するための処理
            'title' => strip_tags(trim($request->title)),
            //strip_tagsはHTMLタグを除去するメソッド
            //(trim($request->title))はタイトルをトリムするメソッド
            'content' => $this->sanitizeContent($request->content),
            //thisは現在のクラスのメソッドを呼び出すためのキーワード。ここではsanitizeContentメソッドを呼び出す。
            'excerpt' => $request->excerpt ? strip_tags(trim($request->excerpt)) : null,
            //excerptは要約を指定するメソッド。? strip_tags(trim($request->excerpt))はexcerptが空ではない場合にtrueを返すメソッド。
            'category' => trim($request->category),
            //categoryはカテゴリーを指定するメソッド。trim($request->category)はcategoryをトリムするメソッド。
            'featured_image' => $request->featured_image ? trim($request->featured_image) : null,
            //featured_imageは画像を指定するメソッド。? trim($request->featured_image)はfeatured_imageが空ではない場合にtrueを返すメソッド。
            'is_published' => $request->is_published ?? true,
            //is_publishedは公開状態を指定するメソッド。?? trueは公開状態を指定するメソッド。
            'published_at' => $request->published_at ?? $article->published_at,
            //published_atは公開日時を指定するメソッド。?? $article->published_atは$articleの公開日時を指定するメソッド。
        ];

        $article->update($sanitizedData);
        //update()はデータを更新するためのメソッド
        //$sanitizedDataはsanitizedDataのデータを更新するメソッド。

        return response()->json($article);
        //response()->json($article)はJSON形式でレスポンスを返すメソッド。
    }

    //記事を削除するメソッドを定義
    public function destroy(string $id)
    //destroyメソッドは記事を削除するメソッド
    //string $idはIDを指定するメソッド
    {
        $article = Article::findOrFail($id);
        //Article::findOrFail($id)はArticleモデルのidが$idと一致するデータを取得するメソッド
        $article->delete();
        //delete()はデータを削除するためのメソッド

        return response()->json(['message' => 'Article deleted successfully']);
        //response()->json(['message' => 'Article deleted successfully'])はJSON形式でレスポンスを返すメソッド。
    }

    //サムネイル画像をアップロードするメソッドを定義
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
                'max:5120', 
                //max:5120は画像のサイズを指定するメソッド
                'dimensions:min_width=200,min_height=200,max_width=2000,max_height=2000'
                //dimensions:min_width=200,min_height=200,max_width=2000,max_height=2000は画像のサイズを指定するメソッド
            ]
        ]);

        if ($validator->fails()) {
            //validator->fails()はバリデーションが失敗した場合にtrueを返すメソッド
            return response()->json([
                //response()->json()はJSON形式でレスポンスを返すメソッド
                'message' => 'Invalid image file',
                //messageはメッセージを指定するメソッド
                'errors' => $validator->errors()
                //errorsはエラーメッセージを指定するメソッド
            ], 422);
        }

        try {
            $file = $request->file('thumbnail');
            //fileはファイルを指定するメソッド
            //request->file('thumbnail')はリクエストのファイルを取得するメソッド
            $extension = $file->getClientOriginalExtension();
            //getClientOriginalExtension()はファイルの拡張子を取得するメソッド
            $filename = 'thumbnail_' . time() . '_' . Str::random(10) . '.' . $extension;
            //thumbnail_はサムネイルのファイル名を指定するメソッド
            //time()は現在の時刻を取得するメソッド
            //Str::random(10)はランダムな文字列を生成するメソッド
            //.$extensionはファイルの拡張子を指定するメソッド
            $path = $file->storeAs('images/thumbnails', $filename, 'public');
            //storeAs('images/thumbnails', $filename, 'public')はファイルを保存するメソッド
            //images/thumbnailsはファイルを保存するディレクトリを指定するメソッド
            //$filenameはファイル名を指定するメソッド
            //publicはファイルを保存するディレクトリを指定するメソッド
            $url = '/storage/' . $path;
            ///storage/はファイルを保存するディレクトリを指定するメソッド
            //.$pathはファイルのパスを指定するメソッド

            return response()->json([
                //response()->json()はJSON形式でレスポンスを返すメソッド
                'message' => 'Thumbnail uploaded successfully',
                //messageはメッセージを指定するメソッド
                'url' => $url,
                //urlはURLを指定するメソッド
                //.$urlはURLを指定するメソッド
                'path' => $path,
                //pathはパスを指定するメソッド
                //.$pathはパスを指定するメソッド
            ], 200);
            
        } catch (\Exception $e) {
            //catchはエラーを捕捉するためのメソッド
            //\Exception $eはエラーを指定するメソッド
            return response()->json([
                //response()->json()はJSON形式でレスポンスを返すメソッド
                'message' => 'Failed to upload thumbnail',
                //messageはメッセージを指定するメソッド
                'error' => 'Internal server error',
                //errorはエラーメッセージを指定するメソッド
            ], 500);
        }
    }

    //カテゴリーを取得するメソッドを定義
    public function categories()
    //categoriesメソッドはカテゴリーを取得するメソッド
    {
        $categories = Article::selectRaw('category, count(*) as count')
        //Article::selectRawはArticleモデルのカテゴリーとカテゴリーの数を取得するメソッド
        //('category, count(*) as count')は
            ->published()
            //published()は公開状態を指定するメソッド
            ->where('category', '!=', 'すべて')
            //where('category', '!=', 'すべて')はcategoryがすべてではない場合にtrueを返すメソッド
            ->groupBy('category')
            //groupBy('category')はcategoryをグループ化するメソッド
            ->get();
            //get()はデータを取得するメソッド

        $allCount = Article::published()->count();
        //Article::published()->count()は公開状態の記事の数を取得するメソッド

        $result = [
            ['key' => 'all', 'label' => 'すべて', 'count' => $allCount],
            //keyはキーを指定するメソッド
            //labelはラベルを指定するメソッド
            //countはカテゴリーの数を指定するメソッド
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
            //foreach ($categories as $category)はcategoriesのデータを１つずつ取得するメソッド
            $key = $categoryMap[$category->category] ?? Str::slug($category->category);
            //categoryMap[$category->category]はcategoryMapのカテゴリーを取得するメソッド
            //?? Str::slug($category->category)はカテゴリーをスラッグ化するメソッド
            $result[] = [
                'key' => $key,
                'label' => $category->category,
                'count' => $category->count,
            ];
        }

        return response()->json($result);
        //response()->json($result)はJSON形式でレスポンスを返すメソッド。
    }

    //記事のコンテンツをサニタイズするメソッドを定義
    private function sanitizeContent(string $content): string
    //sanitizeContentメソッドはコンテンツをサニタイズするメソッド
    //string $contentはコンテンツを指定するメソッド
    //: stringはstringの型を指定するメソッド
    {
        $content = strip_tags($content, '<p><br><strong><em><u><h1><h2><h3><h4><h5><h6><ul><ol><li><blockquote><a><img>');
        //strip_tagsはHTMLタグを除去するメソッド
        //strip_tags($content, $allowedTags)はコンテンツをサニタイズするメソッド
        $content = preg_replace_callback('/<(\w+)([^>]*)>/', function($matches) {
            //preg_replace_callbackは正規表現を置換するメソッド
            //'/<(\w+)([^>]*)>/'は正規表現を指定するメソッド
            //function($matches)は正規表現のマッチを取得するメソッド
            $tag = $matches[1];
            //$matches[1]は正規表現の1番目のマッチを取得するメソッド
            $attributes = $matches[2];
            //$matches[2]は正規表現の2番目のマッチを取得するメソッド
            
            if ($tag === 'a') {
                //$tag === 'a'はaタグの場合にtrueを返すメソッド
                $attributes = preg_replace('/\s(?!href|title|target|rel)[a-zA-Z\-]+="[^"]*"/', '', $attributes);
                $attributes = preg_replace('/\son[a-zA-Z]+="[^"]*"/', '', $attributes); 
                //preg_replaceは正規表現を置換するメソッド
                ///\son[a-zA-Z]+="[^"]*"/は正規表現を指定するメソッド
                //''は空の文字列を指定するメソッド
            }
            
            if ($tag === 'img') {
                $attributes = preg_replace('/\s(?!src|alt|title|width|height)[a-zA-Z\-]+="[^"]*"/', '', $attributes);
                $attributes = preg_replace('/\son[a-zA-Z]+="[^"]*"/', '', $attributes); // Remove event handlers
            }
            
            $attributes = preg_replace('/\son[a-zA-Z]+="[^"]*"/', '', $attributes);
            
            return "<{$tag}{$attributes}>";
            //"<{$tag}{$attributes}>"はタグを指定するメソッド
        }, $content); //$contentはコンテンツを指定するメソッド
        
        return trim($content);
        //trim($content)はコンテンツをトリムするメソッド
    }

    //記事のスラッグを生成するメソッドを定義
    private function generateUniqueSlug(string $title): string
    //generateUniqueSlugメソッドはスラッグを生成するメソッド
    //string $titleはタイトルを指定するメソッド
    //: stringはstringの型を指定するメソッド
    {
        $baseSlug = Str::slug($title);
        //baseSlugはスラッグを指定するメソッド
        //strは文字列を指定するメソッド
        //Str::slug($title)はタイトルをスラッグ化するメソッド
        $slug = $baseSlug;
        //slugはスラッグを指定するメソッド
        $counter = 1;
        //counterはカウンターを指定するメソッド

        while (Article::where('slug', $slug)->exists()) {
            //Article::where('slug', $slug)->はArticleモデルのslugが$slugと一致するデータを取得するメソッド
            //exists()はスラッグが存在するかどうかを判断するメソッド
            $slug = $baseSlug . '-' . $counter;
            //slugはスラッグを指定するメソッド。
            //. '-' . はスラッグとカウンターを結合するメソッド。
            //.$counterはカウンターを指定するメソッド
            $counter++;
            //counterはカウンターを指定するメソッド
        }

        return $slug;
        //return $slugはスラッグを返すメソッド。
    }
}
