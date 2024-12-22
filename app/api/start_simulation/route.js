export async function POST(req) {
    try {
        // リクエストから FormData を取得
        const formData = await req.formData();

        // 受け取ったデータをサーバーサイドで処理（データベース保存、外部API通信など）

        try {
            // 外部API（http://tmp.com/api/test）への POST リクエストを送信
            const response = await fetch('http://localhost:8080/api/open_model_text', {
              method: 'POST',
              body: formData
            });
      
            if (response.ok) {
              return new Response(JSON.stringify({ message: 'データが正常に送信されました' }), { status: 200 });
            } else {
              console.error('APIリクエストに失敗しました');
              return new Response(JSON.stringify({ message: 'APIリクエストに失敗しました' }), { status: response.status });
            }
          } catch (error) {
            console.error('エラーが発生しました:', error);
            return new Response(JSON.stringify({ message: 'エラーが発生しました' }), { status: 500 });
          }

        // 必要な処理後、成功レスポンスを返す
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ message: 'エラーが発生しました' }), { status: 500 });
    }
}