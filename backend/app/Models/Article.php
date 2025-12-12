<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory;
    //HasFactoryを使用するメソッド

    protected $fillable = [
        //protectedはプロパティを指定するメソッド
        //fillableはフィールドを指定するメソッド
        'title',
        //titleはタイトルを指定するメソッド
        'slug',
        //slugはスラッグを指定するメソッド
        'content',
        //contentは内容を指定するメソッド
        'excerpt',
        //excerptは要約を指定するメソッド
        'category',
        //categoryはカテゴリーを指定するメソッド
        'featured_image',
        //featured_imageは画像を指定するメソッド
        'is_published',
        //is_publishedは公開状態を指定するメソッド
        'published_at',
        //published_atは公開日時を指定するメソッド
    ];

    protected $casts = [
        //protectedはプロパティを指定するメソッド
        //castsはキャストを指定するメソッド
        'is_published' => 'boolean',
        //is_publishedは公開状態を指定するメソッド
        //booleanはbooleanの型を指定するメソッド
        'published_at' => 'datetime',
        //published_atは公開日時を指定するメソッド
        //datetimeはdatetimeの型を指定するメソッド
    ];

    protected static function boot()
    //protectedはプロパティを指定するメソッド
    //staticは静的メソッドを指定するメソッド
    //bootはブートを指定するメソッド
    //ブートとはモデルの初期化を行うメソッド
    {
        parent::boot();
        //parent::boot();は親クラスのブートを実行するメソッド
        //parentは親クラスを指定するメソッド
        //bootはブートを指定するメソッド

        static::creating(function ($article) {
            //staticは静的メソッドを指定するメソッド
            //creatingは作成時に実行するメソッド
            //function ($article)は$articleを指定するメソッド
            if (empty($article->slug) && !empty($article->title)) {
                //empty($article->slug)は$article->slugが空ではない場合にtrueを返すメソッド
                //!empty($article->title)は$article->titleが空ではない場合にtrueを返すメソッド
                $baseSlug = Str::slug($article->title);
                //Strは文字列を指定するメソッド
                //Str::slug($article->title)は$article->titleをスラッグ化するメソッド
                if (empty($baseSlug)) {
                    //empty($baseSlug)は$baseSlugが空ではない場合にtrueを返すメソッド
                    $baseSlug = Str::random(8);
                    //Strは文字列を指定するメソッド
                    //Str::random(8)は8文字のランダムな文字列を生成するメソッド
                }
                
                $slug = $baseSlug;
                $count = 1;
                while (static::where('slug', $slug)->exists()) {
                    //whileは条件がtrueの場合に実行するメソッド
                    //static::where('slug', $slug)->はArticleモデルのslugが$slugと一致するデータを取得するメソッド
                    //exists()はスラッグが存在するかどうかを判断するメソッド
                    $slug = $baseSlug . '-' . $count;
                    //baseSlugはスラッグを指定するメソッド
                    //. '-' . はスラッグとカウンターを結合するメソッド
                    //.$countはカウンターを指定するメソッド
                    $count++;
                    //countはカウンターを指定するメソッド
                }
                $article->slug = $slug;
                //article->slug = $slugは$article->slugを$slugに更新するメソッド
            }
            
            if (empty($article->excerpt) && !empty($article->content)) {
                //empty($article->excerpt)は$article->excerptが空ではない場合にtrueを返すメソッド
                //!empty($article->content)は$article->contentが空ではない場合にtrueを返すメソッド
                $article->excerpt = Str::limit(strip_tags($article->content), 197, '...');
                //excerptは要約を指定するメソッド
                //Strは文字列を指定するメソッド
                //limitは文字列を制限するメソッド
                //strip_tags($article->content)は$article->contentをタグを除去するメソッド
                //197は197文字を指定するメソッド
                //...は...を指定するメソッド
            }
        });

        static::updating(function ($article) {
            //staticは静的メソッドを指定するメソッド
            //updatingは更新時に実行するメソッド
            //function ($article)は$articleを指定するメソッド
            if ($article->isDirty('title') && empty($article->slug)) {
                //isDirty('title')はtitleが変更されたかどうかを判断するメソッド
                //empty($article->slug)は$article->slugが空ではない場合にtrueを返すメソッド
                $article->slug = Str::slug($article->title);
                //Strは文字列を指定するメソッド
                //Str::slug($article->title)は$article->titleをスラッグ化するメソッド
            }
            
            if ($article->isDirty('content') && empty($article->excerpt)) {
                //isDirty('content')はcontentが変更されたかどうかを判断するメソッド
                //empty($article->excerpt)は$article->excerptが空ではない場合にtrueを返すメソッド
                $article->excerpt = Str::limit(strip_tags($article->content), 197, '...');
                //excerptは要約を指定するメソッド
                //Strは文字列を指定するメソッド
                //limitは文字列を制限するメソッド
                //strip_tags($article->content)は$article->contentをタグを除去するメソッド
                //197は197文字を指定するメソッド
                //...は...を指定するメソッド
            }
            
            if ($article->isDirty('is_published') && $article->is_published && empty($article->published_at)) {
                //isDirty('is_published')はis_publishedが変更されたかどうかを判断するメソッド
                //is_publishedは公開状態を指定するメソッド
                //empty($article->published_at)は$article->published_atが空ではない場合にtrueを返すメソッド
                //now()は現在の日時を指定するメソッド
                $article->published_at = now();
                //published_atは公開日時を指定するメソッド
                //now()は現在の日時を指定するメソッド
            }
        });
    }

    public function scopePublished($query)
    //scopePublishedは公開状態を指定するメソッド
    //queryはクエリを指定するメソッド
    {
        return $query->where('is_published', true);
        //whereとは条件を指定するメソッド
        //where('is_published', true)はis_publishedがtrueの場合にtrueを返すメソッド
    }

    public function scopeDraft($query)
    //scopeDraftは下書き状態を指定するメソッド
    //queryはクエリを指定するメソッド
    {
        return $query->where('is_published', false);
        //whereとは条件を指定するメソッド
        //where('is_published', false)はis_publishedがfalseの場合にtrueを返すメソッド
    }

    public function scopeSearch($query, $search)
    //scopeSearchは検索を指定するメソッド
    //queryはクエリを指定するメソッド
    //searchは検索ワードを指定するメソッド
    {
        return $query->where(function ($query) use ($search) {
            //whereとは条件を指定するメソッド
            //function ($query) use ($search)はクエリを作成するためのメソッド
            //use ($search)は$searchを使用するメソッド
            $query->where('title', 'LIKE', "%{$search}%")
            //where('title', 'LIKE', "%{$search}%")はtitleが$searchと一致する場合にtrueを返すメソッド
                  ->orWhere('content', 'LIKE', "%{$search}%");
                  //orWhere('content', 'LIKE', "%{$search}%")はcontentが$searchと一致する場合にtrueを返すメソッド
        });
    }

    public function scopeByCategory($query, $category)
    //scopeByCategoryはカテゴリーを指定するメソッド
    //queryはクエリを指定するメソッド
    //categoryはカテゴリーを指定するメソッド
    {
        return $query->where('category', $category);
        //whereとは条件を指定するメソッド
        //where('category', $category)はcategoryが$categoryと一致する場合にtrueを返すメソッド
    }

    public function getRouteKeyName()
    //getRouteKeyNameはルートキー名を指定するメソッド
    //slugはスラッグを指定するメソッド
    {
        return 'slug';
    }
}
