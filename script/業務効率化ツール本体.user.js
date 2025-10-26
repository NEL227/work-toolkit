// ==UserScript==
// @name         業務効率化ツール本体
// @namespace    http://tampermonkey.net/
// @version      1.9.0
// @description  各種スクリプトのセット
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @connect      plus-nao.com
// @connect      starlight.plusnao.co.jp
// @connect      work-toolkit.vercel.app
// @connect      tk2-217-18298.vs.sakura.ne.jp
// @updateURL    https://raw.githubusercontent.com/NEL227/work-toolkit/main/script/%E6%A5%AD%E5%8B%99%E5%8A%B9%E7%8E%87%E5%8C%96%E3%83%84%E3%83%BC%E3%83%AB%E6%9C%AC%E4%BD%93.user.js
// @downloadURL  https://raw.githubusercontent.com/NEL227/work-toolkit/main/script/%E6%A5%AD%E5%8B%99%E5%8A%B9%E7%8E%87%E5%8C%96%E3%83%84%E3%83%BC%E3%83%AB%E6%9C%AC%E4%BD%93.user.js
// ==/UserScript==

(async function () {

    // === 本番ログ抑止: =============
    const DEBUG_LOG = false; // 調査時 true
    const dbg = DEBUG_LOG ? console.log.bind(console) : () => {};
    const err = DEBUG_LOG ? console.error.bind(console) : () => {};
    // ==============================

    const settingsKeys = [
        "modifyHelpLinks", "enhanceTitleEditor", "titleInputHelper", "costCalculator",
        "directoryCheck", "setupShipping", "enhanceRemarksEditor", "presetTextHelper",
        "autoInsertColor", "enhanceStockTable", "copyMakerStockTable", "enhanceAxisCodeManager",
        "personalMemo", "removeUnwantedImgs","loadAllImages", "dlMergedImgs", "imgSizeCheck", "enhanceNewAlpha",
        "orderStatusCheck", "bulkOrderCheck", "axisReminder", "nonColorSizeReminder",
        "axisCodeErrorCheck", "autoReplaceAxisCode","denpyoUpdateGuard","applyTagStyle","denpyoAutoReflect",
        "jyuchuDateCheck", "freeStockCheck", "autoLogin", "denpyoBunkatsuAutoReflect", "doukonCheck",
        "deliveryNoteTemplateSupport", "messageTemplateSupport", "enable1688GuestView",
    ];

    const settings = {};

    for (const key of settingsKeys) {
        settings[key] = await GM_getValue(key, true);
    }

    GM_registerMenuCommand("設定パネルを表示", () => {
        const oldPanel = document.getElementById("userscript-settings");
        if (oldPanel) oldPanel.remove();

        const host = document.createElement('div');
        host.id = 'tm-shadow-host';
        document.body.appendChild(host);

        const shadow = host.attachShadow({ mode: 'open' });

        const style = document.createElement("style");
        style.textContent = `
    #userscript-settings input[type="checkbox"] {
      margin: 0 10px 0 0;
      vertical-align: middle;
    }

    #userscript-settings label {
      font-size: 16px;
      font-weight: normal;
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
    }

    #userscript-settings button {
      background-color: #3498db;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }

    #userscript-settings button:hover {
      background-color: #2980b9;
    }

    #userscript-settings button:active {
      background-color: #1f6391;
    }
  `;

        const wrapper = document.createElement("div");
        wrapper.id = "userscript-settings";
        wrapper.style.cssText = `
            position: fixed;
            inset: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
          `;

        function createCheckboxAndDetails(id, labelText, detailsText) {
            return `
      <div style="display: flex; align-items: center; margin-top: 10px; color: #f0f0f0;">
        <label for="${id}" style="margin-right: 10px; display: flex; align-items: center; cursor: pointer;">
          <input type="checkbox" id="${id}" style="margin-right: 5px;">
          ${labelText}
        </label>
        <span class="toggleHelpDetails" style="cursor: pointer; color: #aaa;">(?)</span>
      </div>
      <details id="${id}Details" style="font-size: 12px; color: #ccc; margin-left: 1.5em;">
        <summary style="display: none;">詳細</summary>
        <div>${detailsText}</div>
      </details>
    `;
        }

        wrapper.innerHTML = `
          <div style="
            background: #1e1e1e;
            color: #f0f0f0;
            padding: 20px;
            border-radius: 10px;
            width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
          ">
            <h2 style="margin-top: 0;">スクリプト設定</h2>

            <section style="margin-bottom: 16px;">
              <details id="listingTeam">
                <summary style="font-weight: bold; cursor: pointer;">出品チーム向け</summary>
                <div style="padding-left: 20px; margin-top: 10px;">
${createCheckboxAndDetails( 'modifyHelpLinks', 'ヘルプリンク更新', 'ヘルプリンクの更新と追加<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%84%E6%98%93%E3%81%8F%E3%81%99%E3%82%8B#:~:text=%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82-,%E3%83%98%E3%83%AB%E3%83%97%E3%83%AA%E3%83%B3%E3%82%AF%E5%A4%89%E6%9B%B4,-%E4%B8%80%E9%83%A8%E3%83%98%E3%83%AB%E3%83%97%E3%81%AE" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('enhanceTitleEditor', 'タイトルの機能拡張', '入力されている全文をポップアップ表示<br>不要なスペースと重複ワードの検出・削除<br>全角スペースの半角化<br>文字数カウンターを追加<br>ブラウザタブタイトルにコードを記載<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%84%E6%98%93%E3%81%8F%E3%81%99%E3%82%8B#%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E3%81%AE%E6%94%B9%E8%89%AF" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('titleInputHelper', 'タイトル入力補助', '本登録時にタイトルを送信し収集<br>収集されたデータからワード候補を表示<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%84%E6%98%93%E3%81%8F%E3%81%99%E3%82%8B#%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E5%85%A5%E5%8A%9B%E8%A3%9C%E5%8A%A9" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('costCalculator', '原価計算', '仕入れ原価(元)の入力欄に電卓機能を追加<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%84%E6%98%93%E3%81%8F%E3%81%99%E3%82%8B#%E5%8E%9F%E4%BE%A1%E8%A8%88%E7%AE%97" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('directoryCheck', 'ディレクトリチェック', 'ディレクトリの検索機能を追加<br>現在入力されているディレクトリの詳細を表示<br>存在しないIDや数字以外が入力されている場合は赤枠で表示<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%84%E6%98%93%E3%81%8F%E3%81%99%E3%82%8B#%E3%83%87%E3%82%A3%E3%83%AC%E3%82%AF%E3%83%88%E3%83%AA%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('setupShipping', '重量と送料設定サポート', '重量欄と送料設定の初期設定を変更<br>送料設定を優先順に並び替え<br>重量欄で計算可能に<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%84%E6%98%93%E3%81%8F%E3%81%99%E3%82%8B#%E9%80%81%E6%96%99" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('enhanceRemarksEditor', '備考欄の機能拡張', '入力されている全文をポップアップで表示<br>文字数カウンターを追加<br>備考欄にヘルプを追加<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%84%E6%98%93%E3%81%8F%E3%81%99%E3%82%8B#%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E3%81%AE%E6%94%B9%E8%89%AF" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('presetTextHelper', '定型文入力補助', '定型文を各入力欄にペーストする機能<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%84%E6%98%93%E3%81%8F%E3%81%99%E3%82%8B#%E5%AE%9A%E5%9E%8B%E6%96%87%E5%85%A5%E5%8A%9B%E8%A3%9C%E5%8A%A9" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('autoInsertColor', 'カラー欄定型文自動入力', 'ページロード時に自動入力<br><span style="color:#aaa;">※詳しい説明は現在準備中です</span>')}
${createCheckboxAndDetails('enhanceStockTable', '在庫表機能拡張', '入力中にEnterで下に移動<br>コピペ時の改行に対応<br>各行をナンバリング<br>文字数チェック<br>重複コードチェック<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%84%E6%98%93%E3%81%8F%E3%81%99%E3%82%8B#%E5%9C%A8%E5%BA%AB%E8%A1%A8%E3%81%AE%E6%94%B9%E8%89%AF" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('copyMakerStockTable', '在庫表一括コピー(アリババ用)', 'メーカーの在庫表を一括コピーできるボタンを右上に追加<br>おまけ：重量情報を画面右の見やすいところに配置<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%84%E6%98%93%E3%81%8F%E3%81%99%E3%82%8B#%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC%E5%9C%A8%E5%BA%AB%E8%A1%A8%E3%82%92%E4%B8%80%E6%8B%AC%E3%82%B3%E3%83%94%E3%83%BC" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('enhanceAxisCodeManager', '縦横軸コード管理の機能拡張', '改行を含むペーストに対応<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%84%E6%98%93%E3%81%8F%E3%81%99%E3%82%8B#%E7%B8%A6%E6%A8%AA%E8%BB%B8%E3%82%B3%E3%83%BC%E3%83%89%E7%AE%A1%E7%90%86%E3%81%AE%E6%94%B9%E8%89%AF" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('personalMemo', 'メモ欄', '自分用のメモ欄をメインページに表示<br>縦横軸管理にも商品コード毎にメモを共有<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%84%E6%98%93%E3%81%8F%E3%81%99%E3%82%8B#%E3%83%A1%E3%83%A2%E6%AC%84" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('removeUnwantedImgs', '不要画像削除(アリババ用)', '類似商品やオススメ商品の画像を削除<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%84%E6%98%93%E3%81%8F%E3%81%99%E3%82%8B#%E4%B8%8D%E8%A6%81%E7%94%BB%E5%83%8F%E5%89%8A%E9%99%A4%E3%82%A2%E3%83%AA%E3%83%90%E3%83%90%E7%94%A8" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('loadAllImages', '全画像ロード(アリババ用)', '全画像をスクロールする前にロード<br><span style="color:#aaa;">※詳しい説明は現在準備中です</span>')}
${createCheckboxAndDetails('dlMergedImgs', '結合画像ダウンロード(アリババ用)', '画像を順番に結合してダウンロードするボタンを追加<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%84%E6%98%93%E3%81%8F%E3%81%99%E3%82%8B#%E7%B5%90%E5%90%88%E7%94%BB%E5%83%8F%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('imgSizeCheck', 'New α版の画像サイズチェック', '画像の横幅と縦幅を表示<br>サイズに問題がある場合は赤枠で表示<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%84%E6%98%93%E3%81%8F%E3%81%99%E3%82%8B#New-%CE%B1%E7%89%88%E3%81%AE%E6%94%B9%E8%89%AF" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('enhanceNewAlpha', 'New α版の機能拡張', 'テンプレ画像をリストから選べるボタンを追加<br>画像拡大機能とその設定機能を歯車としてページ右下に追加<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%84%E6%98%93%E3%81%8F%E3%81%99%E3%82%8B#New-%CE%B1%E7%89%88%E3%81%AE%E6%94%B9%E8%89%AF" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('orderStatusCheck', '受発注可不可チェックリマインダー', '自己チェック用のチェックボックスをメインページ在庫表上部に配置<br>受発注可不可設定画面にリマインダーとして表示<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%84%E6%98%93%E3%81%8F%E3%81%99%E3%82%8B#%E5%8F%97%E7%99%BA%E6%B3%A8%E5%8F%AF%E4%B8%8D%E5%8F%AF%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%83%AA%E3%83%9E%E3%82%A4%E3%83%B3%E3%83%80%E3%83%BC" target="_blank" style="color:#4baaf5;text-decoration:underline;">Examp詳しい説明はこちらle</a>')}
${createCheckboxAndDetails('bulkOrderCheck', '一括受発注チェック', '条件に基づいてチェックボックスを一括操作<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%84%E6%98%93%E3%81%8F%E3%81%99%E3%82%8B#%E4%B8%80%E6%8B%AC%E5%8F%97%E7%99%BA%E6%B3%A8%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('axisReminder', '縦横軸設定リマインダー', '受発注チェック画面で縦横軸コード管理に飛ぶ新たなボタンを追加<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%84%E6%98%93%E3%81%8F%E3%81%99%E3%82%8B#%E7%B8%A6%E6%A8%AA%E8%BB%B8%E8%A8%AD%E5%AE%9A%E3%83%AA%E3%83%9E%E3%82%A4%E3%83%B3%E3%83%80%E3%83%BC" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('nonColorSizeReminder', 'カラーとサイズ以外リマインダー', '項目名をカラーとサイズ以外にした場合、登録後に通知を表示<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%84%E6%98%93%E3%81%8F%E3%81%99%E3%82%8B#%E3%82%AB%E3%83%A9%E3%83%BC%E3%81%A8%E3%82%B5%E3%82%A4%E3%82%BA%E4%BB%A5%E5%A4%96%E3%83%AA%E3%83%9E%E3%82%A4%E3%83%B3%E3%83%80%E3%83%BC" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('enable1688GuestView', '新1688 ログイン制限解除', 'リニューアルされた1688サイトにて、未ログインでも制限なく閲覧できるようにする<br><a href="https://github.com/NEL227/work-toolkit/releases/tag/v1.8.0" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
                </div>
              </details>
            </section>

            <section style="margin-bottom: 16px;">
              <details id="fixTeam">
                <summary style="font-weight: bold; cursor: pointer;">修正チーム向け</summary>
                <div style="padding-left: 20px; margin-top: 10px;">
${createCheckboxAndDetails('axisCodeErrorCheck', '縦横軸コード管理エラーチェック', 'byte数やスペース・記号・機種依存文字を検出<br>いずれかに該当する場合はSKUを追加できないようにする<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E4%BF%AE%E6%AD%A3%E3%83%81%E3%83%BC%E3%83%A0%E7%94%A8%E3%83%9E%E3%83%8B%E3%83%A5%E3%82%A2%E3%83%AB#%E6%9C%80%E5%BE%8C%E3%81%AB:~:text=%E2%98%85Websystem%E3%81%8B%E3%82%89SKU%E8%BF%BD%E5%8A%A0%E6%99%82%E3%81%AB%E3%82%A8%E3%83%A9%E3%83%BC%E3%81%8C%E5%87%BA%E3%82%8B%E3%82%88%E3%81%86%E3%81%AB%E3%81%99%E3%82%8B" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('autoReplaceAxisCode', '縦横軸コード管理のコード自動置換', 'SKU追加時に項目名の入力からコードに自動置換<br><a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E4%BF%AE%E6%AD%A3%E3%83%81%E3%83%BC%E3%83%A0%E7%94%A8%E3%83%9E%E3%83%8B%E3%83%A5%E3%82%A2%E3%83%AB#%E6%9C%80%E5%BE%8C%E3%81%AB:~:text=%E2%98%85Websystem%E3%81%8B%E3%82%89SKU%E8%BF%BD%E5%8A%A0%E6%99%82%E3%81%AB%E3%82%B3%E3%83%BC%E3%83%89%E8%87%AA%E5%8B%95%E5%A4%89%E6%8F%9B" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
                </div>
              </details>
            </section>

            <section style="margin-bottom: 16px;">
              <details id="conciergeTeam">
                <summary style="font-weight: bold; cursor: pointer;">コンシェルジュ向け</summary>
                <div style="padding-left: 20px; margin-top: 10px;">
${createCheckboxAndDetails('denpyoUpdateGuard', '伝票更新警告機能', '誤操作防止のため納品書印刷済み・印刷待ちの伝票に対して<br>更新前に警告を表示<br><span style="color:#aaa;">※詳しい説明は現在準備中です</span>')}
${createCheckboxAndDetails('applyTagStyle', '旧伝票タグ整列', '旧伝票のタグの見た目を整えてトラディショナルのようにする<br>よく使用するものに色を付ける<br>編集でクリックから個別選択解除<br><a href="https://github.com/NEL227/work-toolkit/releases/tag/v1.03.02" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('denpyoAutoReflect', '複写伝票処理自動化', '複写後にボタンを表示<br>ワンクリックで売単価0、支払方法を支払済みに設定<br>新規登録押下時、元伝票と複写伝票の作業欄に伝票番号を記載し「自動送信メール停止処理」にチェックを入れて登録<br><a href="https://github.com/NEL227/work-toolkit/releases/tag/v1.02.00" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('jyuchuDateCheck', '受注日チェック', '受注日が6ヶ月以上前の場合は警告を表示<br>再検索ボタンで最新の受注日を検索して開き直す<br><span style="color:#aaa;">※詳しい説明は現在準備中です</span>')}
${createCheckboxAndDetails('freeStockCheck', 'フリー在庫数チェック', '商品コードをダブルクリックで、その他情報にフリー在庫数を記載<br><a href="https://github.com/NEL227/work-toolkit/releases/tag/v1.01.00" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('autoLogin', '自動ログイン', '楽天系モールへの自動ログイン<br>前提条件としてWebsystemへのログインと楽天IDとパスワードへの事前入力が必須<br><a href="https://github.com/NEL227/work-toolkit/releases/tag/v1.03.00" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('denpyoBunkatsuAutoReflect', '分割伝票処理自動化', '伝票分割時に元伝票・分割先に伝票番号を作業用欄へ自動反映<br>入荷待ちタグの挿入と確認チェックの自動化<br><a href="https://github.com/NEL227/work-toolkit/releases/tag/v1.4.0" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('doukonCheck', '同梱チェックサポート', '受注画面で同梱可否を自動判定し、実行操作をサポート<br><a href="https://github.com/NEL227/work-toolkit/releases/tag/v1.5.0" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('deliveryNoteTemplateSupport', '納品書特記事項 定型文入力補助', '納品書特記事項の横に「定型文」ボタンを追加<br>クリックで定型文の一覧を表示<br><a href="https://github.com/NEL227/work-toolkit/releases/tag/v1.6.0" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
${createCheckboxAndDetails('messageTemplateSupport', 'メッセージ 定型文入力補助', 'メッセージ横に「定型文」ボタンを追加<br>クリックで定型文の一覧を表示<br><a href="https://github.com/NEL227/work-toolkit/releases/tag/v1.7.0" target="_blank" style="color:#4baaf5;text-decoration:underline;">詳しい説明はこちら</a>')}
                </div>
              </details>
            </section>

            <div style="text-align: right; margin-top: 20px;">
              <button id="saveSettings">保存</button>
              <button id="closeSettings" style="margin-left: 10px;">閉じる</button>
            </div>
          </div>
        `;

        const modal = wrapper.querySelector("div");

        wrapper.addEventListener("click", function (e) {
            if (!modal.contains(e.target)) {
                wrapper.remove();
            }
        });

        shadow.appendChild(style);
        shadow.appendChild(wrapper);

        shadow.querySelectorAll('.toggleHelpDetails').forEach((btn) => {
            btn.addEventListener('click', () => {
                const parentDiv = btn.closest('div');
                const input = parentDiv?.querySelector('input[type="checkbox"]');
                if (input && input.id) {
                    const details = shadow.getElementById(`${input.id}Details`);
                    if (details) {
                        details.toggleAttribute('open');
                    }
                }
            });
        });

        settingsKeys.forEach(key => {
            const el = shadow.getElementById(key);
            if (el) el.checked = settings[key];
        });

        const saveBtn = shadow.getElementById("saveSettings");
        if (saveBtn) {
            saveBtn.onclick = async () => {
                for (const key of settingsKeys) {
                    const el = shadow.getElementById(key);
                    if (el) {
                        await GM_setValue(key, el.checked);
                    }
                }
                alert("設定を保存しました。\nページリロード後に反映されます。");
            };
        }

        const closeBtn = shadow.getElementById("closeSettings");
        if (closeBtn) {
            closeBtn.onclick = () => host.remove();
        }
    });

    window.addEventListener("message", async (e) => {
        if (e.data?.type === "saveSettings") {
            const newSettings = e.data.data;
            for (const key in newSettings) {
                await GM_setValue(key, newSettings[key]);
            }
        }
    });

    const pageScriptList = [
        {
            pageName: "受発注可不可設定ページ(check)",
            urlPattern: /:\/\/plus-nao\.com\/forests\/[^\/]+\/sku_check\/[^\/]+/,
            scripts: [
                {
                    name: '縦横軸リマインダー',
                    isEnabled: () => settings.axisReminder,
                    run: axisReminder,
                },
                {
                    name: '受発注可不可チェックリマインダー',
                    isEnabled: () => settings.orderStatusCheck,
                    run: orderStatusCheck,
                },
                {
                    name: '一括受発注チェック',
                    isEnabled: () => settings.bulkOrderCheck,
                    run: bulkOrderCheck,
                },
                {
                    name: 'カラーとサイズ以外リマインダー',
                    isEnabled: () => settings.nonColorSizeReminder,
                    run: nonColorSizeReminder,
                },
            ],
        },
        {
            pageName: "受発注可不可設定ページ(edit)",
            urlPattern: /:\/\/plus-nao\.com\/forests\/[^\/]+\/sku_edit\/[^\/]+/,
            scripts: [
                {
                    name: '一括受発注チェック',
                    isEnabled: () => settings.bulkOrderCheck,
                    run: bulkOrderCheck,
                },
            ],
        },
        {
            pageName: "出品用メインページ(出品前)",
            urlPattern: /^https?:\/\/plus-nao\.com\/forests\/[^/]+\/mainedit\/[^/]*$/,
            scripts: [
                {
                    name: 'ヘルプリンク更新',
                    isEnabled: () => settings.modifyHelpLinks,
                    run: modifyHelpLinks,
                },
                {
                    name: 'タイトル機能拡張',
                    isEnabled: () => settings.enhanceTitleEditor,
                    run: enhanceTitleEditor,
                },
                {
                    name: 'タイトル入力補助',
                    isEnabled: () => settings.titleInputHelper,
                    run: titleInputHelper,
                },
                {
                    name: '原価計算',
                    isEnabled: () => settings.costCalculator,
                    run: costCalculator,
                },
                {
                    name: 'ディレクトリチェック',
                    isEnabled: () => settings.directoryCheck,
                    run: directoryCheck,
                },
                {
                    name: '重量と送料設定サポート',
                    isEnabled: () => settings.setupShipping,
                    run: setupShipping,
                },
                {
                    name: '備考欄機能拡張',
                    isEnabled: () => settings.enhanceRemarksEditor,
                    run: enhanceRemarksEditor,
                },
                {
                    name: '定型文入力補助',
                    isEnabled: () => settings.presetTextHelper,
                    run: presetTextHelper,
                },
                {
                    name: 'カラー欄定型文自動入力',
                    isEnabled: () => settings.autoInsertColor,
                    run: autoInsertColor,
                },
                {
                    name: '在庫表機能拡張',
                    isEnabled: () => settings.enhanceStockTable,
                    run: enhanceStockTable,
                },
                {
                    name: 'メモ欄',
                    isEnabled: () => settings.personalMemo,
                    run: personalMemo,
                },
                {
                    name: '受発注可不可チェックリマインダー',
                    isEnabled: () => settings.orderStatusCheck,
                    run: orderStatusCheck,
                },
                {
                    name: 'カラーとサイズ以外リマインダー',
                    isEnabled: () => settings.nonColorSizeReminder,
                    run: nonColorSizeReminder,
                },
            ],
        },
        {
            pageName: "出品用メインページ(出品後)",
            urlPattern: /^https?:\/\/plus-nao\.com\/forests\/[^/]+\/registered_mainedit\/.*$/,
            scripts: [
                {
                    name: 'ヘルプリンク更新',
                    isEnabled: () => settings.modifyHelpLinks,
                    run: modifyHelpLinks,
                },
                {
                    name: 'タイトル機能拡張',
                    isEnabled: () => settings.enhanceTitleEditor,
                    run: enhanceTitleEditor,
                },
                {
                    name: 'タイトル入力補助',
                    isEnabled: () => settings.titleInputHelper,
                    run: titleInputHelper,
                },
                {
                    name: '原価計算',
                    isEnabled: () => settings.costCalculator,
                    run: costCalculator,
                },
                {
                    name: 'ディレクトリチェック',
                    isEnabled: () => settings.directoryCheck,
                    run: directoryCheck,
                },
                {
                    name: '重量と送料設定サポート',
                    isEnabled: () => settings.setupShipping,
                    run: setupShipping,
                },
                {
                    name: '備考欄機能拡張',
                    isEnabled: () => settings.enhanceRemarksEditor,
                    run: enhanceRemarksEditor,
                },
                {
                    name: '定型文入力補助',
                    isEnabled: () => settings.presetTextHelper,
                    run: presetTextHelper,
                },
                {
                    name: 'カラー欄定型文自動入力',
                    isEnabled: () => settings.autoInsertColor,
                    run: autoInsertColor,
                },
                {
                    name: '在庫表機能拡張',
                    isEnabled: () => settings.enhanceStockTable,
                    run: enhanceStockTable,
                },
                {
                    name: 'メモ欄',
                    isEnabled: () => settings.personalMemo,
                    run: personalMemo,
                },
                {
                    name: '受発注可不可チェックリマインダー',
                    isEnabled: () => settings.orderStatusCheck,
                    run: orderStatusCheck,
                },
                {
                    name: 'カラーとサイズ以外リマインダー',
                    isEnabled: () => settings.nonColorSizeReminder,
                    run: nonColorSizeReminder,
                },
            ],
        },
        {
            pageName: "仮登録ページ",
            urlPattern: /^https?:\/\/plus-nao\.com\/forests\/[^/]+\/interim_registration$/,
            scripts: [
                {
                    name: 'modifyHelpLinks',
                    isEnabled: () => settings.modifyHelpLinks,
                    run: modifyHelpLinks,
                },
            ],
        },
        {
            pageName: "縦横軸管理ページ",
            urlPattern: /https?:\/\/starlight\.plusnao\.co\.jp\/goods\/axisCode.*/,
            scripts: [
                {
                    name: '縦横軸コード管理の機能拡張',
                    isEnabled: () => settings.enhanceAxisCodeManager,
                    run: enhanceAxisCodeManager,
                },
                {
                    name: 'メモ欄',
                    isEnabled: () => settings.personalMemo,
                    run: personalMemo,
                },
                {
                    name: '縦横軸コード管理エラーチェック',
                    isEnabled: () => settings.axisCodeErrorCheck,
                    run: axisCodeErrorCheck,
                },
                {
                    name: '縦横軸コード管理のコード自動置換',
                    isEnabled: () => settings.autoReplaceAxisCode,
                    run: autoReplaceAxisCode,
                },
            ],
        },
        {
            pageName: "商品画像設定 (New α)",
            urlPattern: /https?:\/\/starlight\.plusnao\.co\.jp\/goods\/image\/edit\/.*/,
            scripts: [
                {
                    name: 'New α版の画像サイズチェック',
                    isEnabled: () => settings.imgSizeCheck,
                    run: imgSizeCheck,
                },
                {
                    name: 'New α版の機能拡張',
                    isEnabled: () => settings.enhanceNewAlpha,
                    run: enhanceNewAlpha,
                },
            ],
        },
        {
            pageName: "アリババ",
            urlPattern: /https?:\/\/detail\.1688\.com\/offer\/.*/,
            scripts: [
                {
                    name: '在庫表を一括コピー',
                    isEnabled: () => settings.copyMakerStockTable,
                    run: copyMakerStockTable,
                },
                {
                    name: '不要画像削除(アリババ用)',
                    isEnabled: () => settings.removeUnwantedImgs,
                    run: removeUnwantedImgs,
                },
                {
                    name: '全画像ロード(アリババ用)',
                    isEnabled: () => settings.loadAllImages,
                    run: loadAllImages,
                },
                {
                    name: '結合画像ダウンロード(アリババ用)',
                    isEnabled: () => settings.dlMergedImgs,
                    run: dlMergedImgs,
                },
                {
                    name: '新1688 ログイン制限解除',
                    isEnabled: () => settings.enable1688GuestView,
                    run: enable1688GuestView,
                },
            ],
        },
        {
            pageName: "伝票管理",
            urlPattern: /https?:\/\/main\.next-engine\.com\/Userjyuchu\/jyuchuInp.*/,
            scripts: [
                {
                    name: '伝票更新警告機能',
                    isEnabled: () => settings.denpyoUpdateGuard,
                    run: denpyoUpdateGuard,
                },
                {
                    name: '旧伝票タグ整列',
                    isEnabled: () => settings.applyTagStyle,
                    run: applyTagStyle,
                },
                {
                    name: '複写伝票処理自動化',
                    isEnabled: () => settings.denpyoAutoReflect,
                    run: denpyoAutoReflect,
                },
                {
                    name: '受注日チェック',
                    isEnabled: () => settings.jyuchuDateCheck,
                    run: jyuchuDateCheck,
                },
                {
                    name: 'フリー在庫数チェック',
                    isEnabled: () => settings.freeStockCheck,
                    run: freeStockCheck,
                },
                {
                    name: '自動ログイン',
                    isEnabled: () => settings.autoLogin,
                    run: autoLogin,
                },
                {
                    name: '分割伝票処理自動化',
                    isEnabled: () => settings.denpyoBunkatsuAutoReflect,
                    run: denpyoBunkatsuAutoReflect,
                },
                {
                    name: '同梱チェックサポート',
                    isEnabled: () => settings.doukonCheck,
                    run: doukonCheck,
                },
                {
                    name: '納品書特記事項 定型文入力補助',
                    isEnabled: () => settings.deliveryNoteTemplateSupport,
                    run: deliveryNoteTemplateSupport,
                },
                {
                    name: 'メッセージ 定型文入力補助',
                    isEnabled: () => settings.messageTemplateSupport,
                    run: messageTemplateSupport,
                },
            ],
        },
        {
            pageName: "楽天受注伝票詳細ページ",
            urlPattern: /:\/\/order\-rp\.rms\.rakuten\.co\.jp\/order\-rb\/individual\-order\-detail\-sc\/init.*/,
            scripts: [
                {
                    name: '自動ログイン',
                    isEnabled: () => settings.autoLogin,
                    run: autoLogin,
                },
            ],
        },
        {
            pageName: "楽天メインメニューページ",
            urlPattern: /:\/\/mainmenu\.rms\.rakuten\.co\.jp\/.*/,
            scripts: [
                {
                    name: '自動ログイン',
                    isEnabled: () => settings.autoLogin,
                    run: autoLogin,
                },
            ],
        },
        {
            pageName: "楽天グローバルログインページ",
            urlPattern: /:\/\/glogin\.rms\.rakuten\.co\.jp\/.*/,
            scripts: [
                {
                    name: '自動ログイン',
                    isEnabled: () => settings.autoLogin,
                    run: autoLogin,
                },
            ],
        },
        {
            pageName: "Shopify伝票検索完全一致",
            urlPattern: /^https:\/\/admin\.shopify\.com\/store\/eh8nfp\-gh\/orders\?start=MQ%3D%3D$/,
            scripts: [
                {
                    name: '自動ログイン',
                    isEnabled: () => settings.autoLogin,
                    run: autoLogin,
                },
            ],
        },
    ];

    function runPageScripts() {
        const url = window.location.href;
        for (const page of pageScriptList) {
            if (page.urlPattern.test(url)) {
                // dbg(`[ページ検出] ${page.pageName}`);
                page.scripts.forEach(script => {
                    if (script.isEnabled()) {
                        // dbg(`実行: ${script.name}`);
                        script.run();
                    } else {
                        // dbg(`無効: ${script.name}`);
                    }
                });
                break;
            }
        }
    }

    // 各スクリプト機能
    function modifyHelpLinks() {

        const linksToReplace = [
            {
                oldLink: "http://tk2-217-18298.vs.sakura.ne.jp/boards/5/topics/765",
                newLink: "http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E7%99%BA%E9%80%81%E6%96%B9%E6%B3%95%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6"
            },
            {
                oldLink: "http://tk2-217-18298.vs.sakura.ne.jp/boards/5/topics/45",
                newLink: "http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E7%B4%A0%E6%9D%90%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6"
            },
            {
                oldLink: "http://tk2-217-18298.vs.sakura.ne.jp/boards/5/topics/89",
                newLink: "http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E4%BD%9C%E6%88%90%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6"
            }
        ];

        const anchors = document.getElementsByTagName('a');

        for (let i = 0; i < anchors.length; i++) {
            for (let j = 0; j < linksToReplace.length; j++) {
                if (anchors[i].href === linksToReplace[j].oldLink) {
                    anchors[i].href = linksToReplace[j].newLink;
                }
            }
        }

        function createHelpLink(url, text) {
            const container = document.createElement('span');
            container.style.display = 'inline-flex';
            container.style.alignItems = 'center';

            const openingText = document.createTextNode('(=> ');
            const closingText = document.createTextNode(' )');

            const helpLink = document.createElement('a');
            helpLink.href = url;
            helpLink.textContent = text;
            helpLink.target = '_blank';

            container.appendChild(openingText);
            container.appendChild(helpLink);
            container.appendChild(closingText);

            return container;
        }

        if (window.location.href.includes('interim_registration')) {
            const productMasterCodeElement = document.evaluate(
                "//h4[text()='商品マスターコード']",
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (productMasterCodeElement) {
                const helpContainer = createHelpLink(
                    'http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E5%95%86%E5%93%81%E3%82%B3%E3%83%BC%E3%83%89%E4%B8%80%E8%A6%A7',
                    '商品コード一覧'
                );
                productMasterCodeElement.appendChild(helpContainer);
            }
        }

        const table = document.querySelector('table.hontoroku');
        if (table) {
            const targetCell = document.evaluate(
                '//table[@class="hontoroku"]//th[@width="20%" and @scope="row" and contains(., "仕入れ原価(元")]',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (targetCell) {
                const helpContainer = createHelpLink(
                    'http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E4%BB%95%E5%85%A5%E3%82%8C%E4%BE%A1%E6%A0%BC%E3%83%98%E3%83%AB%E3%83%97',
                    'ヘルプ'
                );
                targetCell.appendChild(helpContainer);
            }
        }
    }

    function enhanceTitleEditor() {
        document.title += "/" + window.location.href.split("/").pop();

        const MAX_LENGTH = 255;
        let isEditingPopup = false;

        const style = document.createElement("style");
        style.textContent = `
        .cursor-warning {
            color: red;
        }
    `;

        document.head.appendChild(style);

        function main() {
            const targetTd = document.querySelector(
                'td[colspan="3"]:has(input[name="data[TbMainproduct][daihyo_syohin_name]"])'
            );
            if (targetTd) {
                const computedStyle = window.getComputedStyle(targetTd);
                const paddingTop = computedStyle.paddingTop;

                if (paddingTop === "7px") {
                    targetTd.style.position = "relative";
                    targetTd.style.paddingTop = "30px";
                }
            }

            const inputFieldId = "TbMainproductDaihyoSyohinName";
            const inputField = document.getElementById(inputFieldId);
            if (!inputField) return;

            const wrapperDiv = document.createElement("div");
            wrapperDiv.style.position = "relative";
            inputField.parentNode.insertBefore(wrapperDiv, inputField);
            wrapperDiv.appendChild(inputField);
            inputField.style.width = "calc(100% - 60px)";

            const popupStyle = `
            position: absolute;
            background-color: white;
            border: 2px solid #ccc;
            border-radius: 5px;
            padding: 4px 10px;
            z-index: 1000;
            display: none;
            overflow: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
            box-sizing: border-box;
            width: calc(100% - 60px);
        `;

            const popup = document.createElement("div");
            popup.className = "title-popup";
            popup.style.cssText = popupStyle;
            popup.contentEditable = true;
            wrapperDiv.appendChild(popup);

            function syncPopupToInput() {
                const updatedText = popup.textContent.replace(/\n/g, " ");
                inputField.value = updatedText;
                updateButtonVisibility();
                updateCursorPosition(true);
            }

            function updatePopup() {
                if (
                    inputField === document.activeElement &&
                    inputField.value.trim() !== ""
                ) {
                    popup.textContent = inputField.value;
                    popup.style.display = "block";
                    updatePopupText();
                } else {
                    popup.style.display = "none";
                }
            }

            function updatePopupText() {
                const text = inputField.value;
                popup.textContent = text;
            }

            const popupElement = document.querySelector("#popup");

            const observer = new MutationObserver(function (mutationsList) {
                for (const mutation of mutationsList) {
                    if (
                        mutation.type === "attributes" &&
                        mutation.attributeName === "style"
                    ) {
                        if (popupElement.style.display === "none") {
                            popup.style.display = "none";
                        }
                    }
                }
            });

            if (popupElement) {
                observer.observe(popupElement, { attributes: true });
            }

            document.addEventListener("click", function (event) {
                if (
                    popup.style.display === "block" &&
                    !popup.contains(event.target) &&
                    !inputField.contains(event.target) &&
                    !event.target.closest(".suggest-popup")
                ) {
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        const startContainer = range.startContainer;
                        const endContainer = range.endContainer;

                        if (
                            wrapperDiv.contains(startContainer) ||
                            wrapperDiv.contains(endContainer)
                        ) {
                            return;
                        }
                    }

                    popup.style.display = "none";
                    inputField.blur();
                    updateButtonVisibility();
                    updateCursorPosition(false);
                }
            });

            const textObserver = new MutationObserver(() => {
                const updatedText = popup.textContent.replace(/\n/g, " ");
                inputField.value = updatedText;
                updateCursorPosition(true);
            });

            if (popup) {
                textObserver.observe(popup, {
                    childList: true,
                    subtree: true,
                    characterData: true,
                });
            }

            popup.addEventListener("mouseup", () => {
                updateCursorPosition(true);
            });

            popup.addEventListener("focus", function () {
                isEditingPopup = true;
                updateCursorPosition(true);
            });

            popup.addEventListener("blur", function () {
                if (popup.textContent.length > MAX_LENGTH) {
                    alert(`入力可能な文字数を超えています。256字以降は切り捨てられます。`);
                }

                const updatedText = popup.textContent.replace(/\n/g, " ");
                popup.textContent = updatedText;
                inputField.value = updatedText;
                validatePopupInput();
                isEditingPopup = false;
                updateCursorPosition(false);
            });

            popup.addEventListener("keydown", function (event) {
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const cursorOffset = range.startOffset;

                if (event.key === "Enter") {
                    const beforeCursor = popup.textContent.slice(0, cursorOffset);
                    const afterCursor = popup.textContent.slice(cursorOffset);

                    popup.textContent = beforeCursor + " " + afterCursor;

                    const newRange = document.createRange();
                    const firstChild = popup.firstChild;

                    if (firstChild && firstChild.nodeType === 3) {
                        const newCursorPosition = beforeCursor.length + 1;
                        newRange.setStart(firstChild, newCursorPosition);
                        newRange.collapse(true);

                        selection.removeAllRanges();
                        selection.addRange(newRange);

                        setTimeout(() => {
                            updateCursorPosition(
                                document.activeElement === popup,
                                newCursorPosition
                            );
                        }, 0);
                    }

                    inputField.value = popup.textContent;

                    event.preventDefault();
                } else {
                    setTimeout(() => {
                        updateCursorPosition(document.activeElement === popup);
                    }, 0);
                }
            });

            popup.addEventListener("paste", function (event) {
                event.preventDefault();

                const clipboardData = event.clipboardData || window.clipboardData;
                const pasteText = clipboardData.getData("text/plain");

                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const cursorOffset = range.startOffset;

                range.deleteContents();

                const beforeCursor = popup.textContent.slice(0, cursorOffset);
                const afterCursor = popup.textContent.slice(cursorOffset);

                const updatedPasteText = pasteText.replace(/\n/g, " ");

                popup.textContent = beforeCursor + updatedPasteText + afterCursor;

                const newCursorPosition = beforeCursor.length + updatedPasteText.length;

                const newRange = document.createRange();
                newRange.setStart(popup.firstChild, newCursorPosition);
                newRange.collapse(true);

                selection.removeAllRanges();
                selection.addRange(newRange);

                inputField.value = popup.textContent;

                updateButtonVisibility();
                updateCursorPosition(true);
            });

            popup.addEventListener("input", () => {
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const startOffset = range.startOffset;
                const startNode = range.startContainer;

                const text = popup.textContent;

                const updatedText = text.replace(/\n/g, " ");
                inputField.value = updatedText;

                updateButtonVisibility();
                updateCursorPosition(true);

                const newRange = document.createRange();
                newRange.setStart(startNode, Math.min(startOffset, text.length));
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);
            });

            let lastCursorPosition = null;

            const suggestPopupElements = document.querySelectorAll(".suggest-popup");

            suggestPopupElements.forEach((suggestPopup) => {
                suggestPopup.addEventListener("mousedown", (e) => {
                    if (!isEditingPopup) return;
                    e.preventDefault();

                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        lastCursorPosition = {
                            node: range.startContainer,
                            offset: range.startOffset,
                        };
                    }
                });

                suggestPopup.addEventListener("click", (e) => {
                    if (!isEditingPopup) return;
                    if (e.target.classList.contains("add-word-button")) return;

                    if (lastCursorPosition) {
                        const selection = window.getSelection();
                        const newRange = document.createRange();
                        newRange.setStart(lastCursorPosition.node, lastCursorPosition.offset);
                        newRange.collapse(true);

                        selection.removeAllRanges();
                        selection.addRange(newRange);

                        updateCursorPosition(true);
                    }
                });
            });

            function updateInputField() {
                inputField.value = popup.textContent;
                updateButtonVisibility();
                updateCursorPosition(true);
            }

            function updateInputFieldCursorFromPopup() {
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const offset = range.startOffset;
                const text = popup.textContent;
                const cursorPos = getCharacterOffsetFromPopup(text, offset);
                inputField.setSelectionRange(cursorPos, cursorPos);
                inputField.focus();
                updateCursorPosition(true);
            }

            function getCharacterOffsetFromPopup(text, offset) {
                return offset;
            }

            const spaceFixButton = createButton("スペース修正");
            const removeDuplicatesButton = createButton("重複削除");
            const cursorPosition = createCursorPosition();
            wrapperDiv.appendChild(cursorPosition);

            addHighlightStyles();

            if (isRegisteredEditPage()) {
                const buttonContainer = document.createElement("div");
                buttonContainer.style.position = "absolute";
                buttonContainer.style.top = "-29px";
                buttonContainer.style.right = "55px";
                buttonContainer.style.display = "flex";
                buttonContainer.style.flexDirection = "row";
                buttonContainer.style.gap = "10px";
                buttonContainer.style.zIndex = "1000";

                inputField.parentNode.style.position = "relative";
                inputField.parentNode.appendChild(buttonContainer);

                setButtonStyles(removeDuplicatesButton, {
                    backgroundColor: "transparent",
                    color: "#000000",
                    border: "1px solid #ccc",
                    padding: "0px 7px",
                    marginLeft: "5px",
                    marginTop: "4px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "12px",
                    visibility: "hidden",
                    transition: "background-color 0.3s, transform 0.1s",
                });

                setButtonStyles(spaceFixButton, {
                    backgroundColor: "transparent",
                    color: "#000000",
                    border: "1px solid #ccc",
                    padding: "0px 7px",
                    marginLeft: "5px",
                    marginTop: "4px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "12px",
                    visibility: "hidden",
                    transition: "background-color 0.3s, transform 0.1s",
                });

                buttonContainer.appendChild(spaceFixButton);
                buttonContainer.appendChild(removeDuplicatesButton);

                updateButtonVisibility();
            } else if (isMainEditPage()) {
                const buttonContainer = document.createElement("div");
                buttonContainer.style.position = "absolute";
                buttonContainer.style.top = "-29px";
                buttonContainer.style.right = "55px";
                buttonContainer.style.display = "flex";
                buttonContainer.style.flexDirection = "row";
                buttonContainer.style.gap = "10px";
                buttonContainer.style.zIndex = "1000";

                inputField.parentNode.style.position = "relative";
                inputField.parentNode.appendChild(buttonContainer);

                setButtonStyles(removeDuplicatesButton, {
                    backgroundColor: "transparent",
                    color: "#000000",
                    border: "1px solid #ccc",
                    padding: "0px 7px",
                    marginLeft: "5px",
                    marginTop: "4px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "12px",
                    visibility: "hidden",
                    transition: "background-color 0.3s, transform 0.1s",
                });

                setButtonStyles(spaceFixButton, {
                    backgroundColor: "transparent",
                    color: "#000000",
                    border: "1px solid #ccc",
                    padding: "0px 7px",
                    marginLeft: "5px",
                    marginTop: "4px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "12px",
                    visibility: "hidden",
                    transition: "background-color 0.3s, transform 0.1s",
                });

                buttonContainer.appendChild(spaceFixButton);
                buttonContainer.appendChild(removeDuplicatesButton);

                updateButtonVisibility();
            }

            inputField.addEventListener("blur", function () {
                updateCursorPosition(false);
            });
            inputField.addEventListener("focus", function () {
                updatePopup();
                updateCursorPosition(true);
            });
            inputField.addEventListener("input", function () {
                updatePopup();
            });

            inputField.addEventListener("keyup", function () {
                updateCursorPosition(true);
            });
            inputField.addEventListener("click", function () {
                updateCursorPosition(true);
            });

            spaceFixButton.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                handleSpaceFixClick(inputField, spaceFixButton);
                addClickFeedback(spaceFixButton);
            });

            removeDuplicatesButton.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                handleRemoveDuplicatesClick(inputField, removeDuplicatesButton);
                addClickFeedback(removeDuplicatesButton);
            });

            removeDuplicatesButton.addEventListener("mouseover", function () {
                const duplicates = getDuplicateWords(inputField.value);
                if (duplicates.length > 0) {
                    removeDuplicatesButton.title = `重複ワード: ${duplicates.join(", ")}`;
                } else {
                    removeDuplicatesButton.title = "";
                }
            });

            function addClickFeedback(button) {
                button.style.transform = "scale(0.9)";
                setTimeout(() => {
                    button.style.transform = "scale(1)";
                }, 100);
            }

            function attachContainerToElement(container, selector) {
                const targetButton = document.querySelector(selector);
                if (targetButton) {
                    const wrapper = document.createElement("div");
                    wrapper.style.display = "inline-flex";
                    wrapper.style.alignItems = "flex-end";

                    targetButton.parentNode.insertBefore(wrapper, targetButton.nextSibling);
                    wrapper.appendChild(targetButton);
                    wrapper.appendChild(container);
                }
            }

            function createButton(textContent) {
                const btn = document.createElement("button");
                btn.textContent = textContent;
                return btn;
            }

            function createCursorPosition() {
                const span = document.createElement("span");
                span.style.marginLeft = "3px";
                span.style.fontSize = "11px";
                span.style.verticalAlign = "middle";
                return span;
            }

            function addHighlightStyles() {
                const style = document.createElement("style");
                style.innerHTML = `
                .highlight {
                    border: 2px solid #ff0000;
                    background-color: #fff5f5;
                }
            `;
                document.head.appendChild(style);
            }

            function isRegisteredEditPage() {
                return (
                    window.location.href.includes(
                        "/forests/TbMainproducts/registered_mainedit/"
                    ) ||
                    window.location.href.includes(
                        "/forests/tb_mainproducts/registered_mainedit/"
                    )
                );
            }

            function isMainEditPage() {
                return (
                    window.location.href.includes("/forests/TbMainproducts/mainedit/") ||
                    window.location.href.includes("/forests/tb_mainproducts/mainedit/")
                );
            }

            function setButtonStyles(button, styles) {
                Object.assign(button.style, styles);

                button.addEventListener("mouseover", function () {
                    button.style.backgroundColor = "#f0f0f0";
                });
                button.addEventListener("mouseout", function () {
                    button.style.backgroundColor = "transparent";
                });

                button.addEventListener("mousedown", function () {
                    button.style.transform = "scale(0.95)";
                });
                button.addEventListener("mouseup", function () {
                    button.style.transform = "scale(1)";
                });
            }

            function attachButtonToElement(button, selector, callback) {
                const targetButton = document.querySelector(selector);
                if (targetButton) {
                    targetButton.parentNode.insertBefore(button, targetButton.nextSibling);
                    callback();
                }
            }

            function attachButtonToElementInTd(
            button,
             tagName,
             includeText1,
             includeText2,
             callback
            ) {
                const parentTd = inputField.closest("td");
                if (!parentTd) {
                    return;
                }

                const targetElements = parentTd.getElementsByTagName(tagName);
                for (let i = 0; i < targetElements.length; i++) {
                    if (
                        targetElements[i].innerHTML.includes(includeText1) &&
                        targetElements[i].innerHTML.includes(includeText2)
                    ) {
                        targetElements[i].appendChild(button);
                        callback();
                        return;
                    }
                }
            }

            function updateCursorPosition(focused, customPosition = null) {
                let position;
                let totalLength;

                if (focused && inputField === document.activeElement) {
                    position = inputField.selectionStart;
                    totalLength = inputField.value.length;
                } else if (focused && popup === document.activeElement) {
                    const selection = window.getSelection();
                    position =
                        customPosition !== null ? customPosition : selection.anchorOffset;
                    totalLength = popup.textContent.length;
                } else {
                    position = 0;
                    totalLength = inputField.value.length;
                }

                cursorPosition.textContent = focused
                    ? `${position}/${totalLength}`
        : `${totalLength}`;

                if (totalLength > MAX_LENGTH) {
                    cursorPosition.classList.add("cursor-warning");
                } else {
                    cursorPosition.classList.remove("cursor-warning");
                }
            }

            function validatePopupInput() {
                let currentText = popup.textContent;
                currentText = currentText.replace(/\n/g, " ");
                if (currentText.length > MAX_LENGTH) {
                    currentText = currentText.substring(0, MAX_LENGTH);
                    popup.textContent = currentText;
                    inputField.value = currentText;
                }
            }

            function updateButtonVisibility() {
                if (isEditingPopup) {
                    return;
                }

                const value = inputField.value;
                const hasSpaceIssues = value.match(/\s{2,}|　|^[\s　]+|[\s　]+$/);
                const hasDuplicates = hasDuplicateWords(value);

                if (hasSpaceIssues) {
                    spaceFixButton.style.visibility = "visible";
                    inputField.classList.add("highlight");
                } else {
                    spaceFixButton.style.visibility = "hidden";
                }

                if (hasDuplicates) {
                    removeDuplicatesButton.style.visibility = "visible";
                    inputField.classList.add("highlight");
                } else {
                    removeDuplicatesButton.style.visibility = "hidden";
                    if (!hasSpaceIssues) {
                        inputField.classList.remove("highlight");
                    }
                }

                updateCursorPosition(document.activeElement === inputField);
            }

            function handleSpaceFixClick(inputField, button) {
                const trimmedValue = inputField.value.trim();
                let processedValue = trimmedValue.replace(/\s{2,}/g, " ");
                processedValue = processedValue.replace(/　/g, " ");
                inputField.value = processedValue;
                button.style.visibility = "hidden";
                updateButtonVisibility();
                updatePopupContent();
                updateCursorPosition(document.activeElement === inputField);
            }

            function updatePopupContent() {
                const text = inputField.value;
                popup.textContent = text;
            }

            function handleRemoveDuplicatesClick(inputField, button) {
                const value = inputField.value;
                const words = value.split(/\s+/);
                const uniqueWords = [...new Set(words)];
                const processedValue = uniqueWords.join(" ");
                if (value !== processedValue) {
                    inputField.value = processedValue;
                    inputField.classList.add("highlight");
                    updatePopupContent();
                } else {
                    inputField.classList.remove("highlight");
                }
                button.style.visibility = "hidden";
                updateButtonVisibility();
                updateCursorPosition(document.activeElement === inputField);
            }

            function hasDuplicateWords(value) {
                const words = value.split(/\s+/).filter((word) => word.trim() !== "");
                const uniqueWords = new Set(words);
                return uniqueWords.size < words.length;
            }

            function getDuplicateWords(value) {
                const words = value.split(/\s+/).filter((word) => word.trim() !== "");
                const wordCount = {};
                const duplicates = [];

                words.forEach((word) => {
                    wordCount[word] = (wordCount[word] || 0) + 1;
                });

                for (const word in wordCount) {
                    if (wordCount[word] > 1) {
                        duplicates.push(word);
                    }
                }

                return duplicates;
            }
        }
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", main);
        } else {
            main();
        }
    }

    async function titleInputHelper() {
        const url = 'https://raw.githubusercontent.com/NEL227/work-toolkit/main/data/NGwords.txt';
        const dbName = 'ngWordsDB';
        const storeName = 'ngWordsStore';
        const keyName = 'ngWords';

        let ngWords = [];

        const db = await openDatabase();

        try {
            const cachedData = await getFromDB(db, storeName, keyName);
            const oneDayInMillis = 24 * 60 * 60 * 1000;
            const now = new Date();

            if (cachedData && now - new Date(cachedData.timestamp) <= oneDayInMillis) {
                ngWords = cachedData.words;
            }
        } catch (error) {}

        initMainScript(ngWords);

        try {
            const response = await fetch(url);
            if (response.ok) {
                const text = await response.text();
                const newWords = text.split('\n').map(word => word.trim()).filter(word => word);

                if (JSON.stringify(newWords) !== JSON.stringify(ngWords)) {
                    ngWords = newWords;
                    await saveToDB(db, storeName, { id: keyName, words: ngWords, timestamp: new Date() });
                }
            }
        } catch (error) {}

        function openDatabase() {
            return new Promise((resolve) => {
                const request = indexedDB.open(dbName, 1);
                request.onsuccess = () => resolve(request.result);
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, { keyPath: 'id' });
                    }
                };
            });
        }

        function getFromDB(db, store, key) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([store], 'readonly');
                const objectStore = transaction.objectStore(store);
                const request = objectStore.get(key);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject();
            });
        }

        function saveToDB(db, store, data) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([store], 'readwrite');
                const objectStore = transaction.objectStore(store);
                const request = objectStore.put(data);
                request.onsuccess = () => resolve();
                request.onerror = () => reject();
            });
        }

        function initMainScript(ngWords) {
            (function() {
                'use strict';

                const jsonURL = 'https://raw.githubusercontent.com/NEL227/work-toolkit/main/data/sorted_data.json';

                GM_addStyle(`
#popup {
    position: fixed;
    top: 1%;
    left: 0.5%;
    width: 400px;
    height: 800px;
    max-width: 100%;
    max-height: 98%;
    background: white;
    border: 1px solid black;
    padding: 10px;
    padding-left: 15px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    z-index: 10000;
    overflow-y: auto;
    display: none;
    border-radius: 5px;
    box-sizing: border-box;
}

#popup-header {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    height: 20px;
    position: sticky;
    top: -11px;
    background-color: white;
    z-index: 10;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

#popup-content {
    height: auto;
    overflow-y: visible;
    box-sizing: border-box;
}

#popup-close {
    cursor: pointer;
    background: transparent;
    color: black;
    border: none;
    font-size: 24px;
    padding: 10px;
    position: absolute;
    top: -11px;
    left: 1px;
    line-height: 1;
    border-radius: 5px;
    position: sticky;
    z-index: 11;
}

#popup-content ul {
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    margin: 0;
}

#popup-content ul li {
    padding: 3px;
    padding-right: 5px;
    font-size: 14px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.add-word-button {
    background-color: #ffffff;
    color: #4CAF50;
    border: 1px solid #4CAF50;
    padding: 3px;
    cursor: pointer;
    font-size: 12px;
    margin-left: 5px;
    border-radius: 6px;
    transition: background-color 0.2s ease, transform 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    position: relative;
}

.add-word-button::before {
    content: '📑';
    font-size: 14px;
    display: block;
    position: relative;
    top: -1px;
    left: 1px;
}

.add-word-button::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    width: 34px;
    height: 34px;
    z-index: 0;
}

.add-word-button:hover {
    background-color: #4CAF50;
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.add-word-button:active {
    background-color: #388E3C;
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

#show-subwords-button {
    background-color: #4CAF50;
    color: #fff;
    border: none;
    padding: 3px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    margin-top: 5px;
    display: block;
    width: 100px;
    text-align: center;
    transition: background-color 0.2s ease, transform 0.2s ease;
}

#show-subwords-button:hover:not(.disabled) {
    background-color: #388E3C;
}

#show-subwords-button:active:not(.disabled) {
    transform: translateY(2px);
}

#show-subwords-button.disabled {
    background-color: #ccc;
    cursor: default;
}

#show-subwords-button.active {
    background-color: #4CAF50;
    color: #ffffff;
    cursor: default;
}

#settings-button {
    background-color: #ffffff;
    color: #4CAF50;
    border: 1px solid #4CAF50;
    padding: 3px;
    cursor: pointer;
    font-size: 12px;
    border-radius: 6px;
    transition: background-color 0.2s ease, transform 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-left: 5px;
    margin-top: 5.5px;
}
#settings-button::before {
    content: '⚙️';
    font-size: 14px;
    display: block;
    position: relative;
    top: -0.5px;

}

#settings-button:hover {
    background-color: #4CAF50;
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

#settings-button:active {
    background-color: #388E3C;
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

#settings-popup {
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    background: white;
    border: 1px solid black;
    padding: 10px;
    padding-left: 30px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    z-index: 10001;
    display: none;
    border-radius: 5px;
    box-sizing: border-box;
}

#settings-popup label {
    display: block;
    margin-bottom: 5px;
}

#settings-popup input,
#settings-popup button {
    box-sizing: border-box;
    width: calc(100% - 20px);
    padding: 5px;
    margin-bottom: 10px;
    display: block;
}

#settings-popup button {
    background-color: #4CAF50;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    transition: background-color 0.2s ease, transform 0.2s ease;
    display: block;
}

#settings-popup button:hover {
    background-color: #388E3C;
}

#settings-popup button:active {
    transform: translateY(2px);
}

td[colspan="3"]:has(input[name="data[TbMainproduct][daihyo_syohin_name]"]) {
    position: relative;
    padding-top: 30px;
}

.button-container {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 5px;
    position: absolute;
    left: 0;
    bottom: 0;
    transform: scale(0.9);
    z-index: 999;
}

#show-subwords-button.disabled.active {
    background-color: #388E3C;
}
    `);

                const popup = document.createElement('div');
                popup.id = 'popup';
                popup.className = 'suggest-popup';
                popup.innerHTML = `
    <button id="popup-close">×</button>
    <div id="popup-header"></div>
    <div id="popup-content"><ul></ul></div>
`;
                document.body.appendChild(popup);

                const settingsButton = document.createElement('button');
                settingsButton.id = 'settings-button';
                settingsButton.title = '設定';
                settingsButton.className = 'add-word-button';

                const settingsPopup = document.createElement('div');
                settingsPopup.id = 'settings-popup';
                settingsPopup.innerHTML = `
    <label for="popup-width">横幅 (px):</label>
    <input type="number" id="popup-width" value="400" step="10" />
    <label for="popup-height">高さ (px):</label>
    <input type="number" id="popup-height" value="800" step="10" />
    <button id="apply-settings">適用</button>
`;
                document.body.appendChild(settingsPopup);

                function fetchJSON(callback) {
                    const cacheLifetime = 24 * 60 * 60 * 1000;

                    getFromIndexedDB()
                        .then(cachedData => {
                        const now = new Date().getTime();

                        if (cachedData && (now - cachedData.timestamp < cacheLifetime)) {
                            callback(cachedData.data);
                        } else {
                            fetch(jsonURL, {
                                method: 'GET',
                                cache: 'no-cache'
                            })
                                .then(response => response.json())
                                .then(data => {
                                saveToIndexedDB(data)
                                    .catch(error => err('データの保存中にエラーが発生しました:', error));

                                callback(data);
                            })
                                .catch(error => err('JSONデータの取得中にエラーが発生しました:', error));
                        }
                    })
                        .catch(error => err('IndexedDBからのデータ取得中にエラーが発生しました:', error));
                }

                function handleData(data) {
                    const inputField = document.querySelector('input[name="data[TbMainproduct][daihyo_syohin_name]"]');
                    const inputField2A = document.querySelector('input[name="data[TbMainproduct][daihyo_syohin_name]"]');
                    const inputField2B = document.querySelector('[contenteditable="true"]');
                    let activeInputField2 = inputField2A || inputField2B;
                    const button = document.getElementById('show-subwords-button');

                    const setActiveInputField2 = (field) => {
                        activeInputField2 = field;
                    };

                    [inputField2A, inputField2B].forEach(field => {
                        if (field) {
                            field.addEventListener('focus', () => setActiveInputField2(field));
                        }
                    });

                    if (inputField) {
                        let inputValue = activeInputField2.textContent?.trim() || activeInputField2.value.trim();
                        let words = inputValue.split(/\s+/);
                        let mainWord = '';

                        if (words.length > 0) {
                            mainWord = words[0];

                            if (mainWord.endsWith('用') && words.length > 1) {
                                let secondWord = words[1];

                                if (!secondWord.endsWith('用')) {
                                    mainWord = mainWord + secondWord.replace(/\s+/g, '');
                                }
                            }
                        }

                        if (data[mainWord]) {
                            const popupHeader = document.getElementById('popup-header');
                            if (popupHeader) {
                                popupHeader.textContent = `「${mainWord}」`;
                            }

                            const popupContent = document.getElementById('popup-content').querySelector('ul');

                            const updateSubwords = (currentInputValue) => {
                                const inputWords = currentInputValue.split(/\s+/);

                                const subwords = Object.entries(data[mainWord])
                                .filter(([subword]) => !ngWords.includes(subword))
                                .sort(([, aCount], [, bCount]) => bCount - aCount)
                                .map(([subword]) => {
                                    const existsInInput = inputWords.includes(subword);
                                    return `
                            <li style="color: ${existsInInput ? 'green' : 'black'};">
                                ${subword}
                                <button class="add-word-button" data-word="${subword}"></button>
                            </li>
                        `;
                                })
                                .join('');

                                popupContent.innerHTML = subwords;

                                document.querySelectorAll('.add-word-button').forEach(button => {
                                    button.addEventListener('click', (event) => {
                                        const word = event.target.getAttribute('data-word');

                                        const text = activeInputField2.textContent || activeInputField2.value || '';
                                        const selection = window.getSelection();
                                        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

                                        let start = 0, end = 0;
                                        if (range && activeInputField2.isContentEditable) {
                                            start = range.startOffset;
                                            end = range.endOffset;
                                        } else if (activeInputField2.selectionStart !== undefined) {
                                            start = activeInputField2.selectionStart;
                                            end = activeInputField2.selectionEnd;
                                        }

                                        const before = text.slice(0, start) || '';
                                        const after = text.slice(end) || '';

                                        const needsSpaceBefore = (before && before.length > 0 && before[before.length - 1] !== ' ') || false;
                                        const needsSpaceAfter = (after && after.length > 0 && after[0] !== ' ') || false;

                                        const newValue = before + (needsSpaceBefore ? ' ' : '') + word + (needsSpaceAfter ? ' ' : '') + after;

                                        if (activeInputField2.isContentEditable) {
                                            activeInputField2.textContent = newValue;

                                            const newRange = document.createRange();
                                            newRange.setStart(activeInputField2.firstChild, start + word.length + (needsSpaceBefore ? 1 : 0));
                                            newRange.setEnd(activeInputField2.firstChild, start + word.length + (needsSpaceBefore ? 1 : 0));
                                            selection.removeAllRanges();
                                            selection.addRange(newRange);
                                        } else {
                                            activeInputField2.value = newValue;
                                            activeInputField2.setSelectionRange(start + word.length + (needsSpaceBefore ? 1 : 0), start + word.length + (needsSpaceBefore ? 1 : 0));
                                        }

                                        activeInputField2.focus();
                                        updateSubwords(activeInputField2.textContent?.trim() || activeInputField2.value.trim());
                                    });
                                });
                            };

                            updateSubwords(inputValue);

                            activeInputField2.addEventListener('input', () => {
                                updateSubwords(activeInputField2.textContent?.trim() || activeInputField2.value.trim());
                            });

                            const popup = document.getElementById('popup');
                            if (popup) {
                                popup.style.display = 'block';
                                if (button) {
                                    button.textContent = '表示中';
                                    button.classList.add('disabled', 'active');
                                    button.disabled = true;
                                }
                            }
                        } else {
                            if (button) {
                                button.textContent = '登録なし';
                                button.classList.add('disabled');
                                button.classList.remove('active');
                                button.disabled = true;
                            }
                        }
                    }
                }

                function initDB() {
                    return new Promise((resolve, reject) => {
                        const request = indexedDB.open('jsonCacheDB', 1);

                        request.onupgradeneeded = (event) => {
                            const db = event.target.result;
                            if (!db.objectStoreNames.contains('jsonData')) {
                                db.createObjectStore('jsonData', { keyPath: 'id' });
                            }
                        };

                        request.onsuccess = (event) => {
                            resolve(event.target.result);
                        };

                        request.onerror = (event) => {
                            reject('IndexedDBの初期化に失敗しました');
                        };
                    });
                }

                function saveToIndexedDB(data) {
                    return initDB().then(db => {
                        return new Promise((resolve, reject) => {
                            const transaction = db.transaction(['jsonData'], 'readwrite');
                            const store = transaction.objectStore('jsonData');
                            const cacheData = {
                                id: 'jsonData',
                                timestamp: new Date().getTime(),
                                data: data
                            };
                            store.put(cacheData);

                            transaction.oncomplete = () => resolve();
                            transaction.onerror = () => reject('データの保存に失敗しました');
                        });
                    });
                }

                function getFromIndexedDB() {
                    return initDB().then(db => {
                        return new Promise((resolve, reject) => {
                            const transaction = db.transaction(['jsonData'], 'readonly');
                            const store = transaction.objectStore('jsonData');
                            const request = store.get('jsonData');

                            request.onsuccess = (event) => {
                                resolve(event.target.result);
                            };

                            request.onerror = () => reject('データの取得に失敗しました');
                        });
                    });
                }

                function adjustButtonContainerStyle() {
                    const url = window.location.href;
                    const buttonContainer = document.querySelector('.button-container');

                    if (buttonContainer) {
                        if (url.includes('registered_mainedit')) {
                            buttonContainer.style.bottom = '31.5px';
                            buttonContainer.style.left = `1px`;
                        } else {
                            buttonContainer.style.bottom = '51px';
                            buttonContainer.style.left = `1px`;
                        }
                    }
                }

                function addShowSubwordsButton() {
                    const tdElement = document.querySelector('td[colspan="3"][scope="row"]');
                    const inputField = document.querySelector('input[name="data[TbMainproduct][daihyo_syohin_name]"]');

                    if (tdElement && inputField) {
                        const buttonContainer = document.createElement('div');
                        buttonContainer.className = 'button-container';

                        const showSubwordsButton = document.createElement('button');
                        showSubwordsButton.id = 'show-subwords-button';
                        showSubwordsButton.textContent = 'ワード候補';

                        const settingsButton = document.createElement('button');
                        settingsButton.id = 'settings-button';
                        settingsButton.title = '設定';
                        settingsButton.className = 'settings-button';

                        buttonContainer.appendChild(showSubwordsButton);
                        buttonContainer.appendChild(settingsButton);

                        tdElement.appendChild(buttonContainer);

                        adjustButtonContainerStyle();

                        showSubwordsButton.addEventListener('click', (event) => {
                            if (event.isTrusted) {
                                if (!showSubwordsButton.classList.contains('disabled')) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    fetchJSON(data => handleData(data));
                                }
                            }
                        });

                        settingsButton.addEventListener('click', (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            toggleSettingsPopup();
                        });
                    }
                }

                function toggleSettingsPopup() {
                    const settingsPopup = document.getElementById('settings-popup');
                    if (settingsPopup) {
                        settingsPopup.style.display = settingsPopup.style.display === 'block' ? 'none' : 'block';
                    }
                }

                function closePopup() {
                    const popup = document.getElementById('popup');
                    const showSubwordsButton = document.getElementById('show-subwords-button');
                    if (popup) {
                        popup.style.display = 'none';
                        if (showSubwordsButton) {
                            showSubwordsButton.textContent = 'ワード候補';
                            showSubwordsButton.classList.remove('disabled', 'active');
                            showSubwordsButton.disabled = false;
                        }
                    }
                }

                function applySettings() {
                    const width = document.getElementById('popup-width').value || 400;
                    const height = document.getElementById('popup-height').value || 800;

                    const popup = document.getElementById('popup');
                    if (popup) {
                        popup.style.width = `${width}px`;
                        popup.style.height = `${height}px`;
                    }

                    localStorage.setItem('popupWidth', width);
                    localStorage.setItem('popupHeight', height);
                }

                function closeSettingsOnClickOutside(event) {
                    const settings = document.getElementById('settings-popup');
                    const settingsButton = document.getElementById('settings-button');
                    if (settings && !settings.contains(event.target) && event.target !== settingsButton) {
                        settings.style.display = 'none';
                    }
                }

                document.addEventListener('keydown', function(event) {
                    if (event.key === 'Escape') {
                        closePopup();
                    }
                });

                document.addEventListener('click', function(event) {
                    if (event.target.id === 'popup-close') {
                        closePopup();
                    } else if (event.target.id === 'apply-settings') {
                        applySettings();
                    }
                });

                settingsButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    toggleSettingsPopup();
                });

                document.addEventListener('click', closeSettingsOnClickOutside);

                const inputField = document.querySelector('input[name="data[TbMainproduct][daihyo_syohin_name]"]');
                if (inputField) {
                    inputField.addEventListener('input', () => {
                        const button = document.getElementById('show-subwords-button');
                        const popup = document.getElementById('popup');

                        if (button && button.textContent === '登録なし') {
                            button.textContent = 'ワード候補';
                            button.classList.remove('disabled');
                            button.disabled = false;
                        }

                        if (popup && popup.style.display === 'block') {
                            button.textContent = '表示中（更新）';
                            button.classList.remove('disabled');
                            button.classList.add('active');
                            button.disabled = false;
                        }
                    });
                }

                const observer = new MutationObserver((mutationsList, observer) => {
                    mutationsList.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE && node.matches('.title-popup[contenteditable="true"]')) {

                                const checkButtonExistence = () => {
                                    const button = document.getElementById('show-subwords-button');
                                    if (button) {
                                        const popup = document.getElementById('popup');

                                        if (button && button.textContent === '登録なし') {
                                            button.textContent = 'ワード候補';
                                            button.classList.remove('disabled');
                                            button.disabled = false;
                                        }

                                        if (popup && popup.style.display === 'block') {
                                            button.textContent = '表示中（更新）';
                                            button.classList.remove('disabled');
                                            button.classList.add('active');
                                            button.disabled = false;
                                        }

                                        node.addEventListener('input', () => {
                                            if (button && button.textContent === '登録なし') {
                                                button.textContent = 'ワード候補';
                                                button.classList.remove('disabled');
                                                button.disabled = false;
                                            }

                                            if (popup && popup.style.display === 'block') {
                                                button.textContent = '表示中（更新）';
                                                button.classList.remove('disabled');
                                                button.classList.add('active');
                                                button.disabled = false;
                                            }
                                        });

                                        observer.disconnect();
                                    } else {
                                        setTimeout(checkButtonExistence, 100);
                                    }
                                };

                                checkButtonExistence();
                            }
                        });
                    });
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                function mainPopupInit() {
                    addShowSubwordsButton();

                    const savedWidth = localStorage.getItem('popupWidth');
                    const savedHeight = localStorage.getItem('popupHeight');

                    if (savedWidth && savedHeight) {
                        const popup = document.getElementById('popup');
                        if (popup) {
                            popup.style.width = `${savedWidth}px`;
                            popup.style.height = `${savedHeight}px`;
                            document.getElementById('popup-width').value = savedWidth;
                            document.getElementById('popup-height').value = savedHeight;
                        }
                    }

                    fetchJSON(data => {});
                }

                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', mainPopupInit);
                } else {
                    mainPopupInit();
                }

                //送信機能
                const API_URL = 'https://work-toolkit.vercel.app/api/github-proxy';

                const INPUT_SELECTOR = '#TbMainproductDaihyoSyohinName';
                const BUTTON_SELECTOR = '#saveAndSkuStock';

                function getFileShaAndContent(callback) {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `${API_URL}`,
                        onload: function(response) {
                            if (response.status === 200) {
                                const data = JSON.parse(response.responseText);
                                const sha = data.sha;
                                const existingContent = data.content;
                                callback(sha, existingContent);
                            } else {
                                err("ファイルの取得に失敗しました:", response.responseText);
                                callback(null, null);
                            }
                        },
                        onerror: function(error) {
                            err("エラーが発生しました:", error);
                            callback(null, null);
                        }
                    });
                }

                function uploadData(retryCount = 0) {
                    const inputElement = document.querySelector(INPUT_SELECTOR);
                    if (inputElement) {
                        const newData = inputElement.value;

                        getFileShaAndContent(function(sha, existingContent) {
                            if (sha !== null) {
                                const updatedContent = existingContent + "\n" + newData;

                                GM_xmlhttpRequest({
                                    method: "PUT",
                                    url: API_URL,
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    data: JSON.stringify({
                                        sha: sha,
                                        newData: updatedContent
                                    }),
                                    onload: function(response) {
                                        if (response.status === 200) {
                                        } else if (response.status === 422 && retryCount < 3) {
                                            console.warn("競合確認...リトライ中");
                                            setTimeout(() => uploadData(retryCount + 1), 1000);
                                        } else {
                                            err("データ送信失敗:", response.responseText);
                                        }
                                    },
                                    onerror: function(error) {
                                        err("Error:", error);
                                        if (retryCount < 3) {
                                            setTimeout(() => uploadData(retryCount + 1), 1000);
                                        }
                                    }
                                });
                            }
                        });
                    }
                }

                function setupButtonListener() {
                    const buttonElement = document.querySelector(BUTTON_SELECTOR);
                    if (buttonElement) {
                        buttonElement.addEventListener('click', uploadData);
                    }
                }

                setupButtonListener();

            })();
        }
    }

    function costCalculator() {

        const genkaGenInput = document.querySelector('input[name="data[TbMainproduct][genka_tnk_rmb]"]');

        function evaluateExpression(expr) {
            let result = NaN;

            if (expr.trim() === '') return result;

            expr = expr.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
            expr = expr.replace(/＋/g, '+')
                .replace(/－/g, '-')
                .replace(/[×＊]/g, '*')
                .replace(/[÷／]/g, '/')
                .replace(/．/g, '.');

            if (!/^[\d+\-*/().\s]+$/.test(expr)) return result;

            try {
                const maxDecimalPlaces = (expr.match(/\.\d+/g) || []).reduce((max, num) => Math.max(max, num.length - 1), 0);
                const scale = Math.pow(10, maxDecimalPlaces);
                const scaledExpr = `(${expr}) * ${scale}`;
                result = new Function(`return ${scaledExpr}`)() / scale;
                result = Math.round(result * 100) / 100;
            } catch (e) {
                err('式の評価に失敗:', e);
            }

            return result;
        }

        if (genkaGenInput) {
            genkaGenInput.placeholder = '原価を計算';
            genkaGenInput.addEventListener('focusout', () => {
                const expr = genkaGenInput.value.trim();
                const result = evaluateExpression(expr);
                if (!isNaN(result)) {
                    genkaGenInput.value = result;
                    genkaGenInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
        }
    }

    function directoryCheck() {

        GM_addStyle(`
    .paste-button-directory {
        background-color: #ffffff;
        color: #4CAF50;
        border: 1px solid #4CAF50;
        padding: 3px;
        cursor: pointer;
        font-size: 12px;
        border-radius: 6px;
        transition: background-color 0.2s ease, transform 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        margin-left: 5px;
        position: relative;
        vertical-align: middle;
        transform: scale(0.95);
    }

    .paste-button-directory::before {
        content: '📑';
        font-size: 14px;
        display: block;
        position: relative;
        top: -1px;
        left: 1px;
    }

    .paste-button-directory:hover {
        background-color: #4CAF50;
        color: #ffffff;
        transform: scale(0.95) translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .paste-button-directory:active {
        background-color: #388E3C;
        transform: scale(0.95) translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .paste-button-directory::after {
        content: '';
        position: absolute;
        top: -5px;
        right: -5px;
        bottom: -5px;
        left: -5px;
        z-index: 0;
    }
    .help-icon {
    font-size: 13px;
    margin-left: 0;
    cursor: pointer;
    vertical-align: super;
   }
   .help-icon:hover {
       color: #000;
   }
        `);

        const targetInputSelector1 = 'input[name="data[TbMainproduct][YAHOOディレクトリID]"]';
        const targetInputSelector2 = 'input[name="data[TbMainproduct][NEディレクトリID]"]';

        const popupStyle = `
        position: absolute;
        background-color: #f9f9f9;
        border: 2px solid #ccc;
        border-radius: 5px;
        padding: 4px 10px;
        z-index: 1001;
        display: none;
    `;

        const createPopup = () => {
            const popup = document.createElement('div');
            popup.setAttribute('style', popupStyle);

            const contentDiv = document.createElement('div');
            popup.appendChild(contentDiv);
            document.body.appendChild(popup);
            return { popup, contentDiv };
        };

        const { popup: popup1, contentDiv: contentDiv1 } = createPopup();
        const { popup: popup2, contentDiv: contentDiv2 } = createPopup();

        const checkInputValue = (inputElement, dataMap) => {
            const value = inputElement.value;
            const isNumeric = /^\d+$/.test(value);
            const hasSpaces = /(^\s|\s$)/.test(value);
            const matches = dataMap[value.trim()] || [];

            if (value !== '' && (hasSpaces || !isNumeric || (matches.length === 0 && value !== ''))) {
                inputElement.style.border = '2px solid red';
            } else {
                inputElement.style.border = '';
            }
        };

        const addInputListener = (selector, dataMap, popup, contentDiv) => {
            const inputElement = document.querySelector(selector);
            if (!inputElement) return;

            const updatePopup = (value) => {
                const matches = dataMap[value.trim()] || [];
                if (matches.length > 0) {
                    contentDiv.innerHTML = matches.map(description => `<div>${description}</div>`).join('');
                    popup.style.display = 'flex';
                    const rect = inputElement.getBoundingClientRect();
                    const popupHeight = popup.offsetHeight;

                    if (selector === targetInputSelector1) {
                        popup.style.top = `${rect.bottom + window.scrollY}px`;
                    } else if (selector === targetInputSelector2) {
                        popup.style.top = `${rect.top + window.scrollY - popupHeight}px`;
                    }
                    popup.style.left = `${rect.left + window.scrollX}px`;
                } else {
                    contentDiv.innerHTML = '';
                    popup.style.display = 'none';
                }
            };

            checkInputValue(inputElement, dataMap);
            let blurTimeout;

            inputElement.addEventListener('focus', function(event) {
                if (blurTimeout) clearTimeout(blurTimeout);
                updatePopup(event.target.value);
            });

            inputElement.addEventListener('input', function(event) {
                updatePopup(event.target.value);
            });

            inputElement.addEventListener('blur', function(event) {
                blurTimeout = setTimeout(() => {
                    popup.style.display = 'none';
                }, 800);
                checkInputValue(event.target, dataMap);
            });

            document.addEventListener('click', function(event) {
                if (!popup.contains(event.target) && !inputElement.contains(event.target)) {
                    popup.style.display = 'none';
                }
            });

            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    popup.style.display = 'none';
                }
            });
        };

        const openIndexedDB = () => {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open('DirectoryDB', 1);
                request.onupgradeneeded = function(event) {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains('directories')) {
                        db.createObjectStore('directories', { keyPath: 'id' });
                    }
                };
                request.onsuccess = function(event) {
                    resolve(event.target.result);
                };
                request.onerror = function(event) {
                    err('IndexedDBエラー: ' + event.target.errorCode);
                    reject('IndexedDBエラー: ' + event.target.errorCode);
                };
            });
        };

        const getDataFromIndexedDB = (db) => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['directories'], 'readonly');
                const objectStore = transaction.objectStore('directories');
                const request = objectStore.get('directoryData');
                request.onsuccess = function(event) {
                    resolve(event.target.result);
                };
                request.onerror = function(event) {
                    err('IndexedDBからデータ取得中にエラーが発生しました');
                    reject('IndexedDBからデータ取得中にエラーが発生しました');
                };
            });
        };

        const saveDataToIndexedDB = (db, data) => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['directories'], 'readwrite');
                const objectStore = transaction.objectStore('directories');

                const dataWithId = { id: 'directoryData', ...data };

                const request = objectStore.put({ id: 'directoryData', ...data });

                request.onsuccess = () => {
                    resolve();
                };
                request.onerror = (event) => {
                    err('IndexedDB保存失敗', event.target.error);
                    reject(event.target.error);
                };
                transaction.onerror = (event) => {
                    err('IndexedDBトランザクションエラー', event.target.error);
                    reject(event.target.error);
                };
            });
        };

        const needsUpdate = (record) => {
            const fetchedAt = record?.fetchedAt ?? record?.lastUpdated ?? null;
            if (!fetchedAt) return true;

            const d = new Date(typeof fetchedAt === 'number' ? fetchedAt : String(fetchedAt).replace(/\//g, '-'));
            if (isNaN(d.getTime())) return true;

            const now = new Date();
            const toDateKey = (dt) => `${dt.getFullYear()}-${(dt.getMonth()+1).toString().padStart(2,'0')}-${dt.getDate().toString().padStart(2,'0')}`;
            return toDateKey(d) !== toDateKey(now);
        };

        const fetchAndUpdateData = async (db, fallbackData) => {
            try {
                const response = await fetch('https://nel227.github.io/work-toolkit/directories.json', { cache: 'no-cache' });
                const data = await response.json();

                const sourceLastUpdated = typeof data.lastUpdated === 'string' ? data.lastUpdated : '';

                const payload = {
                    data,
                    sourceLastUpdated,
                    fetchedAt: Date.now(),
                    id: 'directoryData'
                };

                await saveDataToIndexedDB(db, payload);
                return payload;
            } catch (error) {
                err("新しいデータの取得に失敗しました。以前のデータを使用します:", error);
                return fallbackData || null;
            }
        };

        const fetchData = async () => {
            try {
                const db = await openIndexedDB();
                let directoryData = await getDataFromIndexedDB(db);

                if (!directoryData || needsUpdate(directoryData)) {
                    directoryData = await fetchAndUpdateData(db, directoryData);
                }

                if (directoryData && directoryData.data) {
                    const yahooDirectory = directoryData.data.YahooDirectory || {};
                    const neDirectory = directoryData.data.NEDirectory || {};
                    addInputListener(targetInputSelector1, yahooDirectory, popup1, contentDiv1);
                    addInputListener(targetInputSelector2, neDirectory, popup2, contentDiv2);
                } else {
                    err('有効なデータがありません。デフォルトの空データを使用します。');
                    const emptyData = {};
                    addInputListener(targetInputSelector1, emptyData, popup1, contentDiv1);
                    addInputListener(targetInputSelector2, emptyData, popup2, contentDiv2);
                }
            } catch (error) {
                err('fetchData全体でエラーが発生しました:', error);
            }
        };

        fetchData();

        const createSearchWindow = () => {
            const searchWindow = document.createElement('div');
            searchWindow.setAttribute('style', `
        position: fixed;
        top: 50%;
        left: 50%;
        width: 85vw;
        height: 90vh;
        background-color: #fff;
        border: 2px solid #ccc;
        border-radius: 5px;
        padding: 2vh;
        z-index: 10001;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        display: none;
        overflow: hidden;
        transform: translate(-50%, -50%);
    `);

            const idDisplay = document.createElement('div');
            idDisplay.setAttribute('style', `
        font-size: 14px;
        color: #555;
        padding-top: 8.5vh;
        padding-bottom: 2vh;
    `);

            searchWindow.appendChild(idDisplay);

            const getDetailsById = async (id) => {
                const db = await openIndexedDB();
                const directoryData = await getDataFromIndexedDB(db);

                const neDirectory = directoryData.data.NEDirectory || {};
                const yahooDirectory = directoryData.data.YahooDirectory || {};
                const trimmedId = id.trim();

                for (const [key, descriptions] of Object.entries(neDirectory)) {
                    if (key === trimmedId) {
                        return descriptions;
                    }
                }
                for (const [key, descriptions] of Object.entries(yahooDirectory)) {
                    if (key === trimmedId) {
                        return descriptions;
                    }
                }
                return null;
            };

            const updateIdDisplay = async () => {
                const neIdInput = document.querySelector('input[name="data[TbMainproduct][NEディレクトリID]"]');
                const yahooIdInput = document.querySelector('input[name="data[TbMainproduct][YAHOOディレクトリID]"]');

                const neId = neIdInput ? neIdInput.value : '未入力';
                const yahooId = yahooIdInput ? yahooIdInput.value : '未入力';

                const neDetails = await getDetailsById(neId);
                const yahooDetails = await getDetailsById(yahooId);

                const formatDetails = (details, id) => {
                    return details ? details.map(path => path.split(' > ').join(' > ')).join('<br>') + ` (ID: ${id})` : '未入力、またはIDが見つかりません。';
                };

                idDisplay.innerHTML = `
        <div class="search-result NE-result" style="border-bottom: 0.5px solid #ddd; padding: 5px; margin-bottom: 5px;">
            NE: ${formatDetails(neDetails, neId)}
        </div>
        <div class="search-result Yahoo-result" style="border-bottom: 0.5px solid #ddd; padding: 5px; margin-bottom: 5px;">
            Ya: ${formatDetails(yahooDetails, yahooId)}
        </div>
    `;
            };

            const addInputListenersNeYahoo = () => {
                const neIdInput = document.querySelector('input[name="data[TbMainproduct][NEディレクトリID]"]');
                const yahooIdInput = document.querySelector('input[name="data[TbMainproduct][YAHOOディレクトリID]"]');

                if (neIdInput) {
                    neIdInput.addEventListener('input', updateIdDisplay);
                }
                if (yahooIdInput) {
                    yahooIdInput.addEventListener('input', updateIdDisplay);
                }
            };

            const closeButton = document.createElement('button');
            closeButton.textContent = '×';
            closeButton.setAttribute('style', `
        position: absolute;
        top: -5px;
        right: 0;
        cursor: pointer;
        background: transparent;
        color: black;
        border: none;
        font-size: 24px;
        padding: 10px;
        line-height: 1;
        border-radius: 5px;
        z-index: 1001;
        margin: 0;
        display: block;
    `);

            searchWindow.appendChild(closeButton);

            closeButton.addEventListener('click', () => {
                searchWindow.style.display = 'none';
            });

            const lastUpdatedElement = document.createElement('div');
            lastUpdatedElement.id = 'lastUpdated';
            lastUpdatedElement.setAttribute('style', 'margin-bottom: 10px; font-size: 14px; color: #555;');
            searchWindow.appendChild(lastUpdatedElement);

            const searchInput = document.createElement('input');
            searchInput.setAttribute('type', 'text');
            searchInput.setAttribute('placeholder', '検索キーワード (半角スペースでアンド検索)');
            searchInput.setAttribute('id', 'search-input');
            searchInput.setAttribute('style', `
        position: absolute;
        top: 4.5vh;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 50px);
        padding: 1vh;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-bottom: 1vh;
        background: #fff;
        z-index: 1002;
    `);

            searchInput.addEventListener('input', (event) => {
                const query = event.target.value;
                updateSearchResults(query);

            });

            const filterContainer = document.createElement('div');
            filterContainer.setAttribute('style', `
        position: absolute;
        top: 9.5vh;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        margin-bottom: 1vh;
        z-index: 1001;
        background: #fff;
        padding: 1vh;
    `);

            const neCheckboxLabel = document.createElement('label');
            neCheckboxLabel.setAttribute('style', `
        display: flex;
        align-items: center;
        position: relative;
        cursor: pointer;
        padding: 3px;
    `);

            const neCheckbox = document.createElement('input');
            neCheckbox.setAttribute('type', 'checkbox');
            neCheckbox.setAttribute('id', 'ne-directory-checkbox');
            neCheckbox.setAttribute('style', 'margin-right: 10px;');
            neCheckbox.checked = true;

            const neLabelText = document.createElement('span');
            neLabelText.textContent = 'NEディレクトリを表示';
            neLabelText.setAttribute('style', `
        position: relative;
        transform: translateY(-3px);
    `);

            neCheckboxLabel.appendChild(neCheckbox);
            neCheckboxLabel.appendChild(neLabelText);

            const yahooCheckboxLabel = document.createElement('label');
            yahooCheckboxLabel.setAttribute('style', `
        display: flex;
        align-items: center;
        position: relative;
        cursor: pointer;
        padding: 3px;
    `);

            const yahooCheckbox = document.createElement('input');
            yahooCheckbox.setAttribute('type', 'checkbox');
            yahooCheckbox.setAttribute('id', 'yahoo-directory-checkbox');
            yahooCheckbox.setAttribute('style', 'margin-right: 10px;');
            yahooCheckbox.checked = true;

            const yahooLabelText = document.createElement('span');
            yahooLabelText.textContent = 'Yahooディレクトリを表示';
            yahooLabelText.setAttribute('style', `
        position: relative;
        transform: translateY(-3px);
    `);

            yahooCheckboxLabel.appendChild(yahooCheckbox);
            yahooCheckboxLabel.appendChild(yahooLabelText);

            filterContainer.appendChild(neCheckboxLabel);
            filterContainer.appendChild(yahooCheckboxLabel);

            neCheckbox.addEventListener('change', () => {
                const searchQuery = document.getElementById('search-input').value;
                updateSearchResults(searchQuery);
            });

            yahooCheckbox.addEventListener('change', () => {
                const searchQuery = document.getElementById('search-input').value;
                updateSearchResults(searchQuery);
            });

            const searchResults = document.createElement('div');
            searchResults.setAttribute('style', `
        position: relative;
        max-height: 66vh;
        font-size: 14px;
        top: -1.2vh;
        left: 0;
        right: 0;
        bottom: 0;
        background: #fff;
        overflow-y: auto;
        z-index: 1000;
    `);

            searchWindow.appendChild(closeButton);
            searchWindow.appendChild(searchInput);
            searchWindow.appendChild(filterContainer);
            searchWindow.appendChild(idDisplay);
            searchWindow.appendChild(searchResults);
            document.body.appendChild(searchWindow);

            const applyFilters = () => {
                const neResults = searchResults.querySelectorAll('.NE-result');
                const yahooResults = searchResults.querySelectorAll('.Yahoo-result');
                const neChecked = neCheckbox.checked;
                const yahooChecked = yahooCheckbox.checked;

                let neVisible = false;
                let yahooVisible = false;

                neResults.forEach(result => {
                    if (neChecked) {
                        result.style.display = 'block';
                        neVisible = true;
                    } else {
                        result.style.display = 'none';
                    }
                });

                yahooResults.forEach(result => {
                    if (yahooChecked) {
                        result.style.display = 'block';
                        yahooVisible = true;
                    } else {
                        result.style.display = 'none';
                    }
                });

                const neTitle = searchResults.querySelector('.NE-title');
                if (neTitle) {
                    neTitle.style.display = neVisible ? 'block' : 'none';
                }

                const yahooTitle = searchResults.querySelector('.Yahoo-title');
                if (yahooTitle) {
                    yahooTitle.style.display = yahooVisible ? 'block' : 'none';
                }
            };

            neCheckbox.addEventListener('change', applyFilters);
            yahooCheckbox.addEventListener('change', applyFilters);

            searchResults.addEventListener('click', (event) => {
                if (event.target.classList.contains('paste-button-directory')) {
                    const value = event.target.getAttribute('data-value');
                    const directoryType = event.target.getAttribute('data-directory');

                    let inputSelector = '';

                    if (directoryType === 'yahoo') {
                        inputSelector = 'input[name="data[TbMainproduct][YAHOOディレクトリID]"]';
                    } else if (directoryType === 'ne') {
                        inputSelector = 'input[name="data[TbMainproduct][NEディレクトリID]"]';
                    }

                    const input = document.querySelector(inputSelector);
                    if (input) {
                        input.value = value;

                        let message = event.target.nextElementSibling;
                        if (!message || !message.classList.contains('paste-message')) {
                            message = document.createElement('span');
                            message.className = 'paste-message';
                            message.setAttribute('style', `
                        margin-left: 10px;
                        color: green;
                        font-size: 14px;
                        display: inline-block;
                    `);
                            event.target.parentNode.insertBefore(message, event.target.nextSibling);
                        }
                        updateIdDisplay();
                        message.textContent = 'ペーストが完了しました！'

                        setTimeout(() => {
                            message.textContent = '';
                        }, 1700);
                    }
                }
            });

            return {
                searchWindow,
                searchInput,
                searchResults,
                applyFilters,
                lastUpdatedElement,
                updateIdDisplay,
                addInputListenersNeYahoo
            };
        };

        const { searchWindow, searchInput, searchResults, applyFilters, lastUpdatedElement, updateIdDisplay, addInputListenersNeYahoo } = createSearchWindow();

        const fetchDataAndUpdateUI = async () => {
            const db = await openIndexedDB();
            const directoryData = await getDataFromIndexedDB(db);

            const tooltip = document.createElement('div');
            tooltip.setAttribute('style', `
    position: absolute;
    background: #333;
    color: #fff;
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 12px;
    display: none;
    z-index: 10002;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `);

            const getSrcLUText = (data) => data?.sourceLastUpdated || data?.data?.lastUpdated || 'データなし';

            tooltip.innerHTML = `
    <div style="margin-bottom:6px;">
      ディレクトリ最終更新日時:
      <span id="dir-src-lu">${getSrcLUText(directoryData)}</span>
    </div>
    <div style="display:flex; align-items:center; gap:8px;">
      <button id="dir-refresh-btn"
        style="
          background:#0d6efd; color:#fff; border:none; border-radius:4px;
          padding:4px 8px; cursor:pointer; font-size:12px;
        "
      >最新データ取得</button>
      <span id="dir-refresh-status" style="font-size:12px; color:#ccc;"></span>
    </div>
  `;
            document.body.appendChild(tooltip);

            lastUpdatedElement.textContent = '？';
            lastUpdatedElement.style.fontSize = "12px";
            lastUpdatedElement.style.cursor = "pointer";
            lastUpdatedElement.style.display = 'inline-block';
            lastUpdatedElement.style.width = 'auto';
            lastUpdatedElement.style.height = 'auto';
            lastUpdatedElement.style.padding = '0';

            lastUpdatedElement.addEventListener('click', () => {
                const rect = lastUpdatedElement.getBoundingClientRect();
                tooltip.style.top = `${rect.bottom + window.scrollY}px`;
                tooltip.style.left = `${rect.left + window.scrollX}px`;
                tooltip.style.display = 'block';
            });

            document.addEventListener('click', (event) => {
                if (!lastUpdatedElement.contains(event.target) && !tooltip.contains(event.target)) {
                    tooltip.style.display = 'none';
                }
            });

            const refreshBtn = tooltip.querySelector('#dir-refresh-btn');
            const statusEl = tooltip.querySelector('#dir-refresh-status');
            const luEl = tooltip.querySelector('#dir-src-lu');

            refreshBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                dbg('[Directory] 手動更新を開始します…');
                const originalText = refreshBtn.textContent;
                refreshBtn.disabled = true;
                refreshBtn.textContent = '取得中…';
                statusEl.textContent = '';

                const before = await getDataFromIndexedDB(db);
                const beforeSLU = (before?.sourceLastUpdated || before?.data?.lastUpdated || '').trim();

                const result = await fetchAndUpdateData(db, before);
                if (result && result.data) {
                    const afterSLU = (result?.sourceLastUpdated || result?.data?.lastUpdated || '').trim();

                    if (beforeSLU && afterSLU && beforeSLU === afterSLU) {
                        dbg('[Directory] ソース最終更新は同一のため、更新なし:', afterSLU);
                        statusEl.textContent = '更新はありません（最新です）';
                        alert('更新はありません（最新のデータが反映済みです）');
                        refreshBtn.disabled = false;
                        refreshBtn.textContent = originalText;
                        return;
                    }

                    luEl.textContent = afterSLU || 'データなし';
                    dbg('[Directory] 手動更新に成功しました。sourceLastUpdated =', luEl.textContent);

                    refreshBtn.disabled = false;
                    refreshBtn.textContent = originalText;

                    if (confirm('最新のディレクトリを取得しました。ページを再読み込みしますか？')) {
                        location.reload();
                    } else {
                        alert('最新データの反映にはページの再読み込みが必要です。');
                    }
                } else {
                    err('[Directory] 手動更新に失敗しました。前回のデータを継続利用します。');
                    statusEl.textContent = '取得に失敗しました';
                    alert('取得に失敗しました。前回のデータを継続利用します。');
                    refreshBtn.disabled = false;
                    refreshBtn.textContent = originalText;
                }
            });
        };

        const openSearchWindow = async () => {
            searchWindow.style.display = 'block';
            await fetchDataAndUpdateUI();
            await updateIdDisplay();
            addInputListenersNeYahoo();
        };

        const closeSearchWindow = () => {
            searchWindow.style.display = 'none';
        };

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeSearchWindow();
            }
        });

        const performSearch = async (queries, directoryData) => {
            const results = [];
            const lowercaseQueries = queries.map(query => query.toLowerCase().trim());

            for (const [key, descriptions] of Object.entries(directoryData)) {
                descriptions.forEach(description => {
                    if (lowercaseQueries.every(query => description.toLowerCase().includes(query))) {
                        results.push({ key, description: description.trim() });
                    }
                });
            }

            return results;
        };

        const updateSearchResults = async (query) => {
            try {
                const db = await openIndexedDB();
                const directoryData = await getDataFromIndexedDB(db);

                searchResults.innerHTML = '';

                if (directoryData && directoryData.data) {
                    const yahooDirectory = directoryData.data.YahooDirectory || {};
                    const neDirectory = directoryData.data.NEDirectory || {};

                    const queries = query.split(/\s+/).map(q => q.trim()).filter(q => q.length > 0);
                    const excludeQueries = queries.filter(q => q.startsWith('-') && q.length > 1).map(q => q.substring(1));
                    const includeQueries = queries.filter(q => !q.startsWith('-'));

                    const yahooResults = await performSearch(includeQueries, yahooDirectory);
                    const neResults = await performSearch(includeQueries, neDirectory);

                    let isFilteringFullData = false;

                    const filteredYahooResults = yahooResults.filter(result =>
                                                                     !excludeQueries.some(exclude => result.description.includes(exclude))
                                                                    );
                    const filteredNeResults = neResults.filter(result =>
                                                               !excludeQueries.some(exclude => result.description.includes(exclude))
                                                              );

                    let totalResults = 0;

                    const neCheckbox = document.querySelector('#ne-directory-checkbox');
                    const yahooCheckbox = document.querySelector('#yahoo-directory-checkbox');

                    const createClickablePath = (description, isYahooFiltering, highlightPartIndex = null) => {
                        const pathParts = description.split(' > ');

                        const displayPathParts = isYahooFiltering ? pathParts.slice(1) : pathParts;

                        return displayPathParts.map((part, index) => `
        <span class="path-part" data-part="${part}" data-index="${index}" data-description="${description}"
              style="cursor: pointer; ${highlightPartIndex !== null && index <= highlightPartIndex ? 'color: #007bff; font-weight: bold;' : ''}"
              title="ダブルクリックで絞り込み">
            ${part}
        </span>
        ${index < displayPathParts.length - 1 ? ' > ' : ''}
    `).join('');
                    };

                    const addPathClickHandlers = () => {
                        const pathParts = searchResults.querySelectorAll('.path-part');
                        pathParts.forEach(part => {
                            part.addEventListener('dblclick', (event) => {
                                const clickedPart = event.target.getAttribute('data-part');
                                const fullDescription = event.target.getAttribute('data-description');
                                const directory = event.target.closest('.search-result').classList.contains('NE-result') ? 'ne' : 'yahoo';
                                let partIndex = parseInt(event.target.getAttribute('data-index'));

                                if (directory === 'yahoo' && !isFilterActive) {
                                    partIndex -= 1;
                                }

                                filterResultsByPart(clickedPart, fullDescription, partIndex, directory);
                            });
                        });
                    };

                    let isFilterActive = false;

                    const addClearFilterButton = (parentElement, query) => {
                        const clearFilterButton = document.createElement('button');
                        clearFilterButton.innerText = '解除';
                        clearFilterButton.classList.add('clear-filter-button');
                        clearFilterButton.addEventListener('click', () => {
                            updateSearchResults(query);
                            isFilterActive = false;
                        });

                        clearFilterButton.style.backgroundColor = 'rgba(255, 255, 255, 0)';
                        clearFilterButton.style.border = '1px solid #007bff';
                        clearFilterButton.style.color = '#007bff';
                        clearFilterButton.style.fontSize = '0.85em';
                        clearFilterButton.style.padding = '5px 10px';
                        clearFilterButton.style.cursor = 'pointer';
                        clearFilterButton.style.marginLeft = '15px';
                        clearFilterButton.style.borderRadius = '3px';
                        clearFilterButton.style.transition = 'background-color 0.3s ease, border-color 0.3s ease';

                        clearFilterButton.addEventListener('mouseover', () => {
                            clearFilterButton.style.backgroundColor = 'rgba(230, 230, 250, 0.9)';
                            clearFilterButton.style.borderColor = '#007bff';
                        });
                        clearFilterButton.addEventListener('mouseout', () => {
                            clearFilterButton.style.backgroundColor = 'rgba(255, 255, 255, 0)';
                            clearFilterButton.style.borderColor = '#007bff';
                        });

                        parentElement.appendChild(clearFilterButton);
                        isFilterActive = true;
                    };

                    const addToggleFilterButton = (parentElement, query, part, fullDescription, partIndex, directory) => {
                        const toggleFilterButton = document.createElement('button');
                        toggleFilterButton.innerText = isFilteringFullData ? '全体から絞り込み中' : '検索結果から絞り込み中';
                        toggleFilterButton.classList.add('toggle-filter-button');

                        toggleFilterButton.style.backgroundColor = 'rgba(255, 255, 255, 0)';
                        toggleFilterButton.style.border = '1px solid #007bff';
                        toggleFilterButton.style.color = '#007bff';
                        toggleFilterButton.style.fontSize = '0.85em';
                        toggleFilterButton.style.padding = '5px 10px';
                        toggleFilterButton.style.cursor = 'pointer';
                        toggleFilterButton.style.marginLeft = '15px';
                        toggleFilterButton.style.borderRadius = '3px';
                        toggleFilterButton.style.transition = 'background-color 0.3s ease, border-color 0.3s ease';

                        toggleFilterButton.addEventListener('mouseover', () => {
                            toggleFilterButton.style.backgroundColor = 'rgba(230, 230, 250, 0.9)';
                            toggleFilterButton.style.borderColor = '#007bff';
                        });
                        toggleFilterButton.addEventListener('mouseout', () => {
                            toggleFilterButton.style.backgroundColor = 'rgba(255, 255, 255, 0)';
                            toggleFilterButton.style.borderColor = '#007bff';
                        });

                        toggleFilterButton.addEventListener('click', () => {
                            isFilteringFullData = !isFilteringFullData;
                            toggleFilterButton.innerText = isFilteringFullData ? '全体から絞り込み中' : '検索結果から絞り込み中';
                            filterResultsByPart(part, fullDescription, partIndex, directory);
                        });

                        parentElement.appendChild(toggleFilterButton);
                    };

                    const filterResultsByPart = async (part, fullDescription, partIndex, directory) => {
                        const allResults = isFilteringFullData
                        ? (directory === 'ne' ? await performSearch([], neDirectory) : await performSearch([], yahooDirectory))
                        : (directory === 'ne' ? neResults : yahooResults);

                        const pathParts = fullDescription.split(' > ');

                        const filteredPathParts = directory === 'yahoo'
                        ? pathParts.slice(1, parseInt(partIndex) + 2)
                        : pathParts.slice(0, parseInt(partIndex) + 1);

                        const fullPathToMatch = filteredPathParts.join(' > ');

                        const matchingResults = allResults.filter(result => {
                            const resultPathParts = result.description.split(' > ');
                            const adjustedDescription = directory === 'yahoo'
                            ? resultPathParts.slice(1).join(' > ')
                            : result.description;

                            if (directory === 'yahoo') {
                                return adjustedDescription.startsWith(fullPathToMatch);
                            } else {
                                return adjustedDescription.startsWith(fullPathToMatch) &&
                                    (adjustedDescription.length === fullPathToMatch.length || adjustedDescription[fullPathToMatch.length] === ' ');
                            }
                        });

                        if (matchingResults.length > 2000) {
                            searchResults.innerHTML = '<div>検索結果が多すぎるため、表示できません。</div>';
                            const messageElement = searchResults.querySelector('div');
                            addClearFilterButton(messageElement, query);
                            return;
                        }

                        searchResults.innerHTML = `
        ${directory === 'ne' && matchingResults.length > 0 ? `
            <div class="sticky-title NE-title">
                NE ディレクトリの検索結果 (${matchingResults.length}件)
            </div>
            ${matchingResults.map(result => `
                <div class="search-result NE-result" style="border-bottom: 0.5px solid #ddd; padding-bottom: 1px; margin-bottom: 1px;">
                    ${createClickablePath(result.description, false, parseInt(partIndex))} (ID: ${result.key})
                    <button class="paste-button-directory" data-value="${result.key}" data-directory="ne"></button>
                </div>
            `).join('')}
        ` : ''}
${directory === 'yahoo' && matchingResults.length > 0 ? `
    <div class="sticky-title Yahoo-title">
        Yahoo ディレクトリの検索結果 (${matchingResults.length}件)
        <span class="help-icon" title="Yahooディレクトリでは、ダブルクリックで絞り込み中、比較がしやすいように一列目が非表示になります。\n一列目をダブルクリックすると、検索結果に影響を与えず、一列目のみを非表示にできます。\nこの機能でディレクトリの意味が伝わらなくなるケースがあればご報告ください。">?</span>
    </div>
    ${matchingResults.map(result => `
        <div class="search-result Yahoo-result" style="border-bottom: 0.5px solid #ddd; padding-bottom: 1px; margin-bottom: 1px;">
            ${createClickablePath(result.description, true, parseInt(partIndex))} (ID: ${result.key})
            <button class="paste-button-directory" data-value="${result.key}" data-directory="yahoo"></button>
        </div>
    `).join('')}
` : ''}
`;

                        addPathClickHandlers();

                        const titleElement = document.querySelector(`.${directory === 'ne' ? 'NE-title' : 'Yahoo-title'}`);
                        if (titleElement) {
                            addToggleFilterButton(titleElement, query, part, fullDescription, partIndex, directory);
                            addClearFilterButton(titleElement, query);
                        }
                    };

                    if (filteredNeResults.length > 0 && neCheckbox && neCheckbox.checked) {
                        totalResults += filteredNeResults.length;
                    }

                    if (filteredYahooResults.length > 0 && yahooCheckbox && yahooCheckbox.checked) {
                        totalResults += filteredYahooResults.length;
                    }

                    if (totalResults === 0) {
                        searchResults.innerHTML = '<div>検索結果が見つかりませんでした。</div>';
                    } else if (totalResults > 2000) {
                        searchResults.innerHTML = '<div>検索結果が多すぎるため、表示できません。</div>';
                    } else {
                        searchResults.innerHTML = `
                ${filteredNeResults.length > 0 && neCheckbox && neCheckbox.checked ? `
                    <div class="sticky-title NE-title">NE ディレクトリの検索結果 (${filteredNeResults.length}件)</div>
                    ${filteredNeResults.map(result => `
                        <div class="search-result NE-result" style="border-bottom: 0.5px solid #ddd; padding-bottom: 1px; margin-bottom: 1px;">
                            ${createClickablePath(result.description)} (ID: ${result.key})
                            <button class="paste-button-directory" data-value="${result.key}" data-directory="ne"></button>
                        </div>
                    `).join('')}` : ''}
${filteredYahooResults.length > 0 && yahooCheckbox && yahooCheckbox.checked ? `
                    <div class="sticky-title Yahoo-title">
        Yahoo ディレクトリの検索結果 (${filteredYahooResults.length}件)
        <span class="help-icon" title="Yahooディレクトリでは、ダブルクリックで絞り込み中、比較がしやすいように一列目が非表示になります。\n一列目をダブルクリックすると、検索結果に影響を与えず、一列目のみを非表示にできます。\nこの機能でディレクトリの意味が伝わらなくなるケースがあればご報告ください。">?</span>
    </div>
                    ${filteredYahooResults.map(result => `
                        <div class="search-result Yahoo-result" style="border-bottom: 0.5px solid #ddd; padding-bottom: 1px; margin-bottom: 1px;">
                            ${createClickablePath(result.description)} (ID: ${result.key})
                            <button class="paste-button-directory" data-value="${result.key}" data-directory="yahoo"></button>
                        </div>
                    `).join('')}` : ''}
`;

                        addPathClickHandlers();
                    }
                } else {
                    searchResults.innerHTML = '<div>データが正しく取得されませんでした。</div>';
                }
            } catch (error) {
                err('検索中にエラーが発生しました:', error);
            }
        };

        GM_addStyle(`
    .sticky-title {
        position: sticky;
        top: -10px;
        left: 0;
        width: calc(100% + 0px);
        box-sizing: border-box;
        border-bottom: 1px solid #ddd;
        background: #fff;
        z-index: 1001;
        padding: 0.5em 20px;
        font-weight: normal;
        margin: 0;
        color: #993;
        font-family: 'Gill Sans', 'Lucida Grande', Helvetica, Arial, sans-serif;
        font-size: 150%;
        display: block;
        text-align: center;
    }

.sticky-title::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% + 10px)
    height: 100%;
    background: #fff;
    z-index: -1;
}
`);

        const inputElement = document.querySelector('input[name="data[TbMainproduct][NEディレクトリID]"]');

        const tdElement = inputElement.closest('td');

        const inputDivs = tdElement.querySelectorAll('div.input.text');

        const containerDiv = document.createElement('div');
        containerDiv.setAttribute('style', `
    position: relative;
`);

        inputDivs.forEach(inputDiv => {
            inputDiv.setAttribute('style', `
    width: calc(100% - 40px);
display: inline-block;
`);
            containerDiv.appendChild(inputDiv);
        });

        const searchButton = document.createElement('button');
        searchButton.textContent = '🔍';

        searchButton.setAttribute('style', `
   position: absolute;
top: 50%;
transform: translateY(-50%);
                      right: -2px;
                      background: rgba(255, 255, 255, 0.1);
color: #ffffff;
border: none;
border-radius: 5px;
padding: 10px;
font-size: 16px;
font-weight: bold;
text-align: center;
cursor: pointer;
z-index: 999;
transition: all 0.3s ease-in-out;
`);

        searchButton.addEventListener('mouseover', () => {
            searchButton.style.background = 'rgba(0, 123, 255, 0.3)';
            searchButton.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
            searchButton.style.transform = 'scale(1.05) translateY(-50%)';
        });

        searchButton.addEventListener('mouseout', () => {
            searchButton.style.background = 'rgba(255, 255, 255, 0)';
            searchButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0)';
            searchButton.style.transform = 'translateY(-50%)';
        });

        searchButton.addEventListener('mousedown', () => {
            searchButton.style.background = 'rgba(0, 123, 255, 0.5)';
            searchButton.style.transform = 'scale(0.95) translateY(-50%)';
        });

        searchButton.addEventListener('mouseup', () => {
            searchButton.style.background = 'rgba(0, 123, 255, 0.3)';
            searchButton.style.transform = 'scale(1.05) translateY(-50%)';
        });

        searchButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            openSearchWindow();
            updateIdDisplay();
        });

        containerDiv.appendChild(searchButton);

        tdElement.innerHTML = '';
        tdElement.appendChild(containerDiv);
    }

    function setupShipping() {

        const DB_NAME = 'ShippingDB';
        const STORE_NAME = 'ShippingSettings';
        let db;

        function initialize() {
            const shippingSelect = document.getElementById("TbMainproduct送料設定");
            const weightInput = document.getElementById("TbMainproductWeight");
            const saveButton = document.getElementById("saveAndSkuStock");

            if (shippingSelect) {
                customizeDropDown(shippingSelect);
            }

            if (weightInput && saveButton) {
                initializeMainEditPage(shippingSelect, weightInput, saveButton);
            }
        }

        function initializeMainEditPage(shippingSelect, weightInput, saveButton) {
            const productId = window.location.pathname.split('/').pop();

            const emptyOption = document.createElement('option');
            emptyOption.value = "";
            emptyOption.text = "送料を選択";
            shippingSelect.insertBefore(emptyOption, shippingSelect.firstChild);
            shippingSelect.value = "";

            managePlaceholder(weightInput, '重量を入力');

            function changeButtonStyle() {
                if (shippingSelect.value === "") {
                    saveButton.disabled = true;
                    saveButton.style.cursor = 'not-allowed';
                    saveButton.value = "送料を選択してください";
                } else {
                    saveButton.disabled = false;
                    saveButton.style.cursor = '';
                    saveButton.value = "保存してSKU在庫の設定";
                }
            }

            function loadSavedShipping() {
                getShippingSetting(productId).then(savedShipping => {
                    if (savedShipping) {
                        shippingSelect.value = savedShipping;
                    }

                    changeButtonStyle();

                    if (shippingSelect.value === "") {
                        setTimeout(loadSavedShipping, 200);
                    }
                });
            }

            loadSavedShipping();

            shippingSelect.addEventListener('change', function () {
                changeButtonStyle();
                saveShippingSetting(productId, shippingSelect.value);
            });
        }

        function managePlaceholder(inputElement, placeholder) {
            if (!inputElement) return;

            inputElement.placeholder = placeholder;

            if (inputElement.value === '0') {
                inputElement.value = '';
            }

            inputElement.addEventListener('blur', function () {
                let value = inputElement.value.trim();

                if (value.endsWith('kg')) {
                    value = value.slice(0, -2).trim();
                    let numberValue = parseFloat(value) * 1000;
                    numberValue = Math.ceil(numberValue);
                    inputElement.value = numberValue.toString();
                } else if (value.endsWith('g')) {
                    value = value.slice(0, -1).trim();
                    inputElement.value = value;
                } else {
                    const evaluatedValue = evaluateExpression(value);
                    if (!isNaN(evaluatedValue)) {
                        inputElement.value = evaluatedValue.toString();
                    }
                }
            });
        }

        function evaluateExpression(expr) {
            let result = NaN;

            if (expr.trim() === '') {
                return result;
            }

            expr = expr.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
            expr = expr.replace(/＋/g, '+')
                .replace(/－/g, '-')
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/．/g, '.');

            if (!/^[\d+\-*/().]+$/.test(expr)) {
                return result;
            }

            try {
                const maxDecimalPlaces = (expr.match(/\.\d+/g) || []).reduce((max, num) => {
                    return Math.max(max, num.length - 1);
                }, 0);

                const scalingFactor = Math.pow(10, maxDecimalPlaces);
                const scaledExpr = `(${expr}) * ${scalingFactor}`;
                result = new Function('return ' + scaledExpr)() / scalingFactor;

                result = Math.ceil(result * 100) / 100;

            } catch (error) {
                err('無効な式です:', error);
            }
            return result;
        }

        function openDatabase() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, 1);

                request.onupgradeneeded = function (event) {
                    db = event.target.result;
                    db.createObjectStore(STORE_NAME, { keyPath: 'productId' });
                };

                request.onsuccess = function (event) {
                    db = event.target.result;
                    resolve(db);
                };

                request.onerror = function (event) {
                    reject('Database error: ' + event.target.errorCode);
                };
            });
        }

        function saveShippingSetting(productId, shippingValue) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.put({ productId: productId, shippingValue: shippingValue });

                request.onsuccess = function () {
                    resolve();
                };

                request.onerror = function (event) {
                    reject('Save error: ' + event.target.errorCode);
                };
            });
        }

        function getShippingSetting(productId) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(productId);

                request.onsuccess = function (event) {
                    resolve(event.target.result ? event.target.result.shippingValue : null);
                };

                request.onerror = function (event) {
                    reject('Fetch error: ' + event.target.errorCode);
                };
            });
        }

        function customizeDropDown(shippingSelect) {
            const order = [
                "24", "25", "26", "5", "27", "4", "29", "10",
                "11", "12", "13", "22", "14", "15", "16", "17",
                "18", "19", "20", "21", "23", "8", "28", "9"
            ];
            const unusedOptions = ["23", "8", "28", "9"];
            const tooltips = {
                "24": "12cm×23.5cm以内、厚さ1cm以内\n重さ50g以内",
                "25": "3辺の合計が60cm以内、1辺の最長は34cm以内、厚さ2cm以内\n重さ1kg以内",
                "26": "34×25cm以内、厚さ3cm以内\n重さ50g以内",
                "5": "3辺の合計が60cm以内、1辺の最長は34cm以内、厚さ3cm以内\n重さ1kg以内",
                "27": "3辺の合計が90cm以内、1辺の最長は60cm以内\n重さ50g以内",
                "4": "3辺の合計が90cm以内、1辺の最長は60cm以内\n重さ100g以内",
                "29": "3辺の合計が90cm以内、1辺の最長は60cm以内\n重さ150g以内",
                "10": "3辺の合計が90cm以内、1辺の最長は60cm以内\n重さ250g以内",
                "11": "3辺の合計が60cm以内\n重さ20kg以内",
                "12": "3辺の合計が80cm以内\n重さ20kg以内",
                "13": "3辺の合計が100cm以内\n重さ20kg以内",
                "22": "3辺の合計が120cm以内\n重さ20kg以内",
                "14": "3辺の合計が140cm以内\n重さ20kg以内",
                "15": "3辺の合計が160cm以内\n重さ20kg以内",
                "16": "3辺の合計が170cm以内\n重さ20kg以内",
                "17": "3辺の合計が180cm以内\n重さ20kg以内",
                "18": "3辺の合計が200cm以内\n重さ20kg以内",
                "19": "3辺の合計が220cm以内\n重さ20kg以内",
                "20": "3辺の合計が240cm以内\n重さ20kg以内",
                "21": "3辺の合計が260cm以内\n重さ20kg以内"
            };

            const options = Array.from(shippingSelect.options);
            const orderedOptions = order.map(value => options.find(option => option.value === value)).filter(Boolean);

            shippingSelect.innerHTML = '';
            for (let option of orderedOptions) {
                shippingSelect.add(option);
            }

            for (let option of shippingSelect.options) {
                if (tooltips[option.value]) {
                    option.title = tooltips[option.value];
                }

                if (unusedOptions.includes(option.value)) {
                    option.style.color = "#8B0000";
                    option.title = `${tooltips[option.value] || ""} 現在使われていません`.trim();
                }
            }
        }

        function mainShipping() {
            openDatabase().then(() => {
                initialize();
            }).catch(error => {
                err(error);
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', mainShipping);
        } else {
            mainShipping();
        }
    }

    function enhanceRemarksEditor(){

        const helpLinkHTML = `
        (=> <a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E5%82%99%E8%80%83%E6%AC%84%E3%83%98%E3%83%AB%E3%83%97" target="_blank">ヘルプ</a> )
    `;

        const MAX_LENGTH = 255;

        const style = document.createElement('style');
        style.textContent = `
        .cursor-warning {
            color: red;
        }
        .space-settings-button {
            position: absolute;
            font-size: 12px;
            top: -12px;
            right: -10px;
            background: transparent;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px 5px;
            cursor: pointer;
        }
        .space-settings-popup {
            position: absolute;
            top: 50px;
            right: 10px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            z-index: 1000;
            display: none;
        }
        .space-settings-popup label {
            display: block;
        }
    `;
        document.head.appendChild(style);

        function main() {
            const remarksHeader = [...document.querySelectorAll('th[scope="row"]')].find(th => th.textContent.includes("備考"));

            if (remarksHeader) {
                const helpLinkSpan = document.createElement('span');
                helpLinkSpan.innerHTML = helpLinkHTML;
                remarksHeader.appendChild(helpLinkSpan);
            }

            const inputField = document.getElementById('TbMainproduct備考');
            if (!inputField) return;

            const wrapperDiv = document.createElement('div');
            wrapperDiv.style.position = 'relative';
            inputField.parentNode.insertBefore(wrapperDiv, inputField);
            wrapperDiv.appendChild(inputField);
            inputField.style.width = 'calc(100% - 60px)';

            const popupStyle = `
            position: absolute;
            background-color: white;
            border: 2px solid #ccc;
            border-radius: 5px;
            padding: 4px 10px;
            z-index: 1000;
            display: none;
            overflow: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
            box-sizing: border-box;
            width: calc(100% - 60px);
        `;

            const popup = document.createElement('div');
            popup.className = 'remarks-popup';
            popup.style.cssText = popupStyle;
            popup.contentEditable = true;
            wrapperDiv.appendChild(popup);

            const cursorPosition = createCursorPosition();
            wrapperDiv.appendChild(cursorPosition);

            const settingsButton = document.createElement('button');
            settingsButton.className = 'space-settings-button';
            settingsButton.textContent = '⚙️';
            wrapperDiv.appendChild(settingsButton);

            const settingsPopup = document.createElement('div');
            settingsPopup.className = 'space-settings-popup';
            settingsPopup.innerHTML = `
            <label title="チェックを入れると、入力欄の半角スペースをポップアップ内で改行として表示します。">
            <input type="checkbox" id="spaceAsNewlineToggle">
            半角スペースを改行として表示
            </label>
        `;
            wrapperDiv.appendChild(settingsPopup);

            const spaceAsNewlineToggle = document.getElementById('spaceAsNewlineToggle');
            let spaceAsNewline = localStorage.getItem('spaceAsNewline') === 'true';
            spaceAsNewlineToggle.checked = spaceAsNewline;

            settingsButton.addEventListener('click', (event) => {
                event.preventDefault();
                settingsPopup.style.display = settingsPopup.style.display === 'block' ? 'none' : 'block';
            });

            spaceAsNewlineToggle.addEventListener('change', () => {
                spaceAsNewline = spaceAsNewlineToggle.checked;
                localStorage.setItem('spaceAsNewline', spaceAsNewline);
                updatePopup();
            });

            function updatePopup() {
                if (inputField === document.activeElement && inputField.value.trim() !== '') {
                    popup.textContent = spaceAsNewline
                        ? inputField.value.replace(/ /g, '\n')
                    : inputField.value;
                    popup.style.display = 'block';
                } else {
                    popup.style.display = 'none';
                }
            }

            function updateCursorPosition(focused, customPosition = null) {
                let position;
                let totalLength;

                if (focused && inputField === document.activeElement) {
                    position = inputField.selectionStart;
                    totalLength = inputField.value.length;
                } else if (focused && popup === document.activeElement) {
                    const selection = window.getSelection();
                    position = customPosition !== null ? customPosition : selection.anchorOffset;
                    totalLength = popup.textContent.length;
                } else {
                    position = 0;
                    totalLength = inputField.value.length;
                }

                cursorPosition.textContent = focused ? `${position}/${totalLength}` : `${totalLength}`;

                if (totalLength > MAX_LENGTH) {
                    cursorPosition.classList.add('cursor-warning');
                } else {
                    cursorPosition.classList.remove('cursor-warning');
                }
            }

            updateCursorPosition(false);

            function createCursorPosition() {
                const span = document.createElement('span');
                span.style.marginLeft = '3px';
                span.style.fontSize = '11px';
                span.style.verticalAlign = 'middle';
                return span;
            }

            function validatePopupInput() {
                let currentText = popup.textContent;
                currentText = currentText.replace(/\n/g, ' ');
                if (currentText.length > MAX_LENGTH) {
                    currentText = currentText.substring(0, MAX_LENGTH);
                    popup.textContent = currentText;
                    inputField.value = currentText;
                }
            }

            let isComposing = false;

            popup.addEventListener('compositionstart', function() {
                isComposing = true;
            });

            popup.addEventListener('compositionupdate', function(event) {
                const updatedText = popup.textContent.replace(/\n/g, ' ');
                inputField.value = updatedText;

                setTimeout(() => {
                    updateCursorPosition(true);
                }, 0);
            });

            popup.addEventListener('compositionend', function(event) {
                isComposing = false;

                const updatedText = popup.textContent.replace(/\n/g, ' ');
                inputField.value = updatedText;

                setTimeout(() => {
                    updateCursorPosition(true);
                }, 0);
            });


            inputField.addEventListener('blur', function() {
                updateCursorPosition(false);
            });

            inputField.addEventListener('keyup', function() {
                updateCursorPosition(true);
            });

            inputField.addEventListener('click', function() {
                updateCursorPosition(true);
            });

            inputField.addEventListener('focus', updatePopup);

            inputField.addEventListener('input', function() {
                updatePopup();
                updateCursorPosition(true);
            });

            let shouldRedraw = false;

            popup.addEventListener('mouseup', () => {
                updateCursorPosition(true);
            });

            popup.addEventListener('focus', function() {
                updateCursorPosition(true);
            });

            popup.addEventListener('blur', function() {
                if (popup.textContent.length > MAX_LENGTH) {
                    alert(`入力可能な文字数を超えています。256字以降は切り捨てられます。`);
                }

                const updatedText = popup.textContent.replace(/\n/g, ' ');
                popup.textContent = updatedText;
                inputField.value = updatedText;
                validatePopupInput();
                updateCursorPosition(false);
            });

            popup.addEventListener('keydown', function (event) {
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const cursorOffset = range.startOffset;
                const isPopupActive = document.activeElement === popup;
                const targetElement = isPopupActive ? popup : inputField;
                const isLastCharacter = cursorOffset === targetElement.textContent.length;

                if (event.key === 'Enter') {
                    let beforeCursor = targetElement.textContent.slice(0, cursorOffset);
                    let afterCursor = targetElement.textContent.slice(cursorOffset);

                    if (isLastCharacter && !targetElement.textContent.endsWith('\n')) {
                        if (isPopupActive) {
                            targetElement.textContent = beforeCursor + '\n\n' + afterCursor;
                        } else {
                            targetElement.value = beforeCursor + '  ' + afterCursor;
                        }
                    } else {
                        if (isPopupActive) {
                            targetElement.textContent = beforeCursor + '\n' + afterCursor;
                        } else {
                            targetElement.value = beforeCursor + ' ' + afterCursor;
                        }
                    }

                    const newRange = document.createRange();
                    const firstChild = targetElement.firstChild;

                    if (firstChild && firstChild.nodeType === 3) {
                        const newCursorPosition = beforeCursor.length + (isPopupActive ? 1 : 0);
                        newRange.setStart(firstChild, newCursorPosition);
                        newRange.collapse(true);

                        selection.removeAllRanges();
                        selection.addRange(newRange);

                        setTimeout(() => updateCursorPosition(isPopupActive, newCursorPosition), 0);
                    }

                    event.preventDefault();
                } else {
                    setTimeout(() => updateCursorPosition(isPopupActive), 0);
                }
            });

            popup.addEventListener('input', () => {
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const startOffset = range.startOffset;
                const startNode = range.startContainer;

                const text = popup.textContent;

                const updatedText = text.replace(/\n/g, ' ');
                inputField.value = updatedText;

                updateCursorPosition(true);

                const newRange = document.createRange();
                newRange.setStart(startNode, Math.min(startOffset, text.length));
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);
            });

            popup.addEventListener('click', function() {
                updateCursorPosition(true);
            });

            document.addEventListener('click', event => {
                if (window.getSelection().type === "Range") {
                    return;
                }

                if (!popup.contains(event.target) && !inputField.contains(event.target)) {
                    popup.style.display = 'none';
                    inputField.blur();
                }
            });
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', main);
        } else {
            main();
        }
    }

    function presetTextHelper(){

        GM_addStyle(`
.template-list {
    background-color: #fff;
    border: 1px solid #ccc;
    padding: 5px 10px;
    z-index: 10000;
    position: absolute;
    top: 117px;
    left: -8px;
    width: 480px;
    max-height: 350px;
    overflow: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: none;
}

.template-list div {
    word-break: break-word;
}

.template-div {
    padding-top: 300px;
    padding: 3px 0;
    border-top: 1px solid #ddd;
}

.template-div:first-child {
    border-top: none;
}

.short-text-div {
        flex-grow: 1;
        cursor: pointer;
}

    .template-content {
        height: 0;
        opacity: 0;
        overflow: hidden;
        transition: height 0.3s ease, opacity 0.3s ease;
        font-size: 12px;
        padding-left: 10px;
        color: #333;
    }

    .template-content.show {
        height: auto;
        opacity: 1;
        padding: 5px 0;
    }


.short-text-div, .paste-button-template {
    display: inline-block;

}

.paste-button-template {
    background-color: #ffffff;
    color: #4CAF50;
    border: 1px solid #4CAF50;
    padding: 5px;
    cursor: pointer;
    font-size: 12px;
    margin-left: 5px;
    border-radius: 6px;
    transition: background-color 0.2s ease, transform 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    position: relative;
    vertical-align: middle;
    transform: scale(0.95);
    text-align: center;
}

.paste-button-template::before {
    content: '📑';
    font-size: 14px;
    display: block;
    position: relative;
    top: -1px;
    left: 1px;
}

.paste-button-template::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    width: 34px;
    height: 34px;
    z-index: 0;
}

.paste-button-template:hover {
    background-color: #4CAF50;
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.paste-button-template:active {
    background-color: #388E3C;
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.template-button {
    background-color: transparent;
    color: #333;
    border: 1px solid #ccc;
    padding: 4px 10px;
    cursor: pointer;
    font-size: 12px;
    border-radius: 5px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: auto;
    width: auto;
    position: absolute;
    bottom: 0;
    left: -170px;
    margin: 0;
}

.template-button::before {
    content: '';
}

.template-button::after {
    content: attr(data-text);
    display: block;
    font-weight: bold;
}

.template-button:hover {
    background-color: #f0f0f0;
    color: #000;
    border-color: #bbb;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.template-button:active {
    background-color: #e0e0e0;
    color: #000;
    border-color: #aaa;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

#content {
    overflow: visible;
}

`);

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const templateListDivs = document.querySelectorAll('.template-list');
                templateListDivs.forEach(function(templateListDiv) {
                    if (templateListDiv.style.display === 'block') {
                        templateListDiv.style.display = 'none';
                    }
                });
            }
        });

        document.addEventListener('click', function(event) {
            const templateListDivs = document.querySelectorAll('.template-list');
            templateListDivs.forEach(function(templateListDiv) {
                if (templateListDiv.style.display === 'block' && !templateListDiv.contains(event.target)) {
                    templateListDiv.style.display = 'none';
                }
            });
        });

        function addTemplateButton(targetTextareaId, templates) {

            const targetTextarea = document.getElementById(targetTextareaId);
            if (!targetTextarea) {
                return;
            }

            const container = targetTextarea.parentElement;
            if (!container) {
                return;
            }

            container.style.position = 'relative';

            if (container.querySelector(`button[data-target="${targetTextareaId}"]`)) {
                return;
            }

            const templateButton = document.createElement('button');
            templateButton.textContent = '定型文一覧を表示';
            templateButton.dataset.target = targetTextareaId;
            templateButton.className = 'template-button';

            const templateListDiv = document.createElement('div');
            templateListDiv.className = 'template-list';
            templateListDiv.dataset.target = targetTextareaId;

            templates.forEach(template => {
                const templateDiv = document.createElement('div');
                templateDiv.className = 'template-div';

                const shortTextDiv = document.createElement('div');
                shortTextDiv.className = 'short-text-div';
                shortTextDiv.textContent = template.shortText;

                const templateContentDiv = document.createElement('div');
                templateContentDiv.className = 'template-content';
                templateContentDiv.textContent = template.fullText;
                templateContentDiv.style.whiteSpace = 'pre-wrap';

                shortTextDiv.addEventListener('click', function() {
                    const isVisible = templateContentDiv.classList.contains('show');
                    if (isVisible) {
                        templateContentDiv.classList.remove('show');
                    } else {
                        templateContentDiv.classList.add('show');
                    }
                });

                const pasteButton = document.createElement('button');
                pasteButton.className = 'paste-button-template';

                pasteButton.addEventListener('click', function(event) {
                    event.stopPropagation();
                    event.preventDefault();

                    const existingText = targetTextarea.value;
                    if (existingText) {
                        targetTextarea.value += '\n' + template.fullText;
                    } else {
                        targetTextarea.value += template.fullText;
                    }

                    templateListDiv.style.display = 'none';
                });

                templateDiv.appendChild(shortTextDiv);
                templateDiv.appendChild(pasteButton);

                templateListDiv.appendChild(templateDiv);
                templateListDiv.appendChild(templateContentDiv);
            });

            function adjustScrollPosition(templateListDiv) {
                const rect = templateListDiv.getBoundingClientRect();
                const viewportHeight = window.innerHeight;

                if (rect.top < 0) {
                    window.scrollBy(0, rect.top);
                }

                if (rect.bottom > viewportHeight) {
                    window.scrollBy(0, rect.bottom - viewportHeight);
                }
            }

            templateButton.addEventListener('click', function(event) {
                event.stopPropagation();
                event.preventDefault();

                const isVisible = templateListDiv.style.display === 'block';
                templateListDiv.style.display = isVisible ? 'none' : 'block';

                if (!isVisible) {
                    adjustScrollPosition(templateListDiv);
                }

            });

            container.appendChild(templateButton);
            container.appendChild(templateListDiv);
        }

        function adjustTemplateListSize() {
            const templateListDiv = document.querySelector('.template-list');
            const maxWidth = 480;

            const templateDivs = templateListDiv.querySelectorAll('div');
            let maxWidthNeeded = maxWidth;

            templateDivs.forEach(div => {
                const divWidth = div.offsetWidth;
                if (divWidth > maxWidthNeeded) {
                    maxWidthNeeded = divWidth;
                }
            });

            templateListDiv.style.width = `${Math.min(maxWidthNeeded, maxWidth)}px`;
        }

        function main() {
            const sizeTemplates = [
                { shortText: '【サイズ表提示】', fullText: '画像をご参照ください。' },
                { shortText: '【メンズインナー】', fullText: '商品のタグ表記や在庫表は海外サイズとなっておりますが、\n在庫表の【】内が一般的な日本サイズでございます。' },
                { shortText: '【カップが共通のブラジャー】', fullText: 'カップサイズは〜まで共通です。\nアンダーバストのサイズでお選びください。\n各カップサイズは選択できませんのでご注意ください。' }
            ];

            const colorTemplates = [
                { shortText: '【カラーが選べない場合】', fullText: '※カラーはランダムとなります。色の指定はできませんのでご注意ください。\n　セット商品や複数ご注文いただいた場合でも、全て同じ色の場合もございます。' }
            ];

            const supplementTemplates = [
                { shortText: '【ニット、レース製品、下着、ブラ等】', fullText: '※商品の性質上、手洗いでのお洗濯をお勧めしております。' },
                { shortText: '【色落ちについて】', fullText: '※色落ちする場合がございます。\n　手洗い後、ご着用くださいますようお願い致します。' },
                { shortText: '【タイツ・ストッキング】', fullText: '※稀に織傷がある場合がございます。' },
                { shortText: '【肌に直接貼るアイテム】', fullText: '※肌の弱い方はご使用をお控えください。' },
                { shortText: '【組み立て式／①絶対組み立てる必要があるとき】', fullText: '※ご自身で組み立てる必要がございます※' },
                { shortText: '【組み立て式／②もしかしたら組み立て式かもしれない時】', fullText: '※ご自身での組み立てが必要になる場合もございます※' },
                { shortText: '【透明なプラスチック製品について】', fullText: '傷防止のため、ビニールコーティングしている場合がございますので、\n剥がしてからご使用お願いいたします。' },
                { shortText: '【大型商品】', fullText: '【北海道、沖縄、離島地域にお届けの際は、別途送料が必要になりますので、\n　ご注文前にお問い合わせお願いいたします】' },
                { shortText: '【IQOS製品のアクセサリー】', fullText: '※IQOS本体は付属いたしません。\n※IQOSはフィリップモリスプロダクツS.A.が所有する商標です。\n　本製品は、IQOS純正部品ではありません。\n　純正部品に該当しないアクセサリーは、フィリップモリスプロダクツS.A.の推奨、\n　精査又は支持を一切受けておらず、当該製品に関する一切の責任は、\n　当該製品の販売業者、流通業者、製造業者にあります。\n※無許諾の電子アクセサリーを使用すると、\n　純正IQOSブランド製品の保証が無効になることがあります。' },
                { shortText: '【電池使用商品／簡単に電池を外せる場合】', fullText: '※電池は付属しておりません。' },
                { shortText: '【電池使用商品／簡単に電池を外せない場合】', fullText: '※テスト用電池が入っております。' },
                { shortText: '【殻付き卵の保管用商品】', fullText: '※こちらの製品は、殻付き卵の保管目的でご使用ください。' },
                { shortText: '【対象年齢について／12歳以上】', fullText: '※対象年齢：12歳以上' },
                { shortText: '【対象年齢について／6歳以上】', fullText: '※対象年齢：6歳以上' },
                { shortText: '【火傷しそうな商品について】', fullText: '完全断熱素材ではありませんので、ご使用の際は火傷にご注意ください。' }
            ];

            addTemplateButton('TbMainproductサイズについて', sizeTemplates);
            addTemplateButton('TbMainproductカラーについて', colorTemplates);
            addTemplateButton('TbMainproduct補足説明PC', supplementTemplates);

            adjustTemplateListSize();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', main);
        } else {
            main();
        }
    }

    function autoInsertColor(){

        const targetTextAreaId = 'TbMainproductカラーについて';
        const inputText = `生産ロットにより柄の出方や色の濃淡が異なる場合がございます。
お使いのモニターや撮影時の光の加減などにより
画像と実際の商品のカラーが異なる場合もございます。
予告なしにカラーやデザインなどの変更がある場合もございます。`;

        function setTextIfEmpty() {
            const textArea = document.getElementById(targetTextAreaId);
            if (textArea) {
                if (textArea.value.trim() === '') {
                    textArea.value = inputText;
                }
            } else {

            }
        }

        setTimeout(setTextIfEmpty, 1000);

        let skipDialog = false;

        function main() {
            const inputs = document.querySelectorAll('input[type="text"]:not(#daihyo_syohin_code):not(#TbMainproductWeight), input[type="checkbox"]');
            const selects = document.querySelectorAll('select:not(#TbMainproduct送料設定)');
            const textareas = document.querySelectorAll('textarea:not([data-index="0"]):not([data-index="1"]):not([data-index="2"]):not([data-index="3"]):not(#TbMainproductカラーについて)');


            inputs.forEach(input => {
                if (input.type === 'checkbox') {
                    input.dataset.initialValue = input.checked;
                } else {
                    input.dataset.initialValue = input.value;
                }
            });

            selects.forEach(select => {
                select.dataset.initialValue = select.value;
            });

            textareas.forEach(textarea => {
                textarea.dataset.initialValue = textarea.value;
            });

            const buttonIds = ['tempSaveButton', 'saveAndSkuStock', 'registeredSaveAndSkuStock', 'registeredSaveButton'];
            buttonIds.forEach(id => {
                const button = document.getElementById(id);
                if (button) {
                    button.addEventListener('click', () => {
                        skipDialog = true;
                    });
                }
            });

            window.onbeforeunload = function(event) {
                if (skipDialog) {
                    skipDialog = false;
                    return;
                }

                let hasChanges = false;

                for (let input of inputs) {
                    if (input.type === 'checkbox') {
                        if (input.checked !== (input.dataset.initialValue === 'true')) {
                            hasChanges = true;
                            break;
                        }
                    } else {
                        if (input.value !== input.dataset.initialValue) {
                            hasChanges = true;
                            break;
                        }
                    }
                }

                if (!hasChanges) {
                    for (let select of selects) {
                        if (select.value !== select.dataset.initialValue) {
                            hasChanges = true;
                            break;
                        }
                    }
                }

                if (!hasChanges) {
                    for (let textarea of textareas) {
                        if (textarea.value !== textarea.dataset.initialValue) {
                            hasChanges = true;
                            break;
                        }
                    }
                }

                if (hasChanges) {
                    event.preventDefault();
                    event.returnValue = '';
                }
            };
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', main);
        } else {
            main();
        }
    }

    function enhanceStockTable(){

        function countByteLength(str) {
            let length = 0;
            for (let char of str) {
                length += (char.match(/[^\x00-\xff]/)) ? 2 : 1;
            }
            return length;
        }

        function highlightInputIfExceedsMaxLength(input, maxLength) {
            if (!input) return;
            const isOverLimit = countByteLength(input.value) > maxLength;

            if (isOverLimit) {
                input.classList.add('error-maxlength');
            } else {
                input.classList.remove('error-maxlength');
            }
        }

        function attachEventListeners(input, maxLength) {
            if (!input) return;
            input.addEventListener('input', () => {
                highlightInputIfExceedsMaxLength(input, maxLength);
                updateButtonState();
            });
            input.addEventListener('paste', () => {
                highlightInputIfExceedsMaxLength(input, maxLength);
                updateButtonState();
            });
        }

        function highlightDuplicateCodes() {
            const stockSettingTable = document.getElementById('stockSettingTable');
            if (!stockSettingTable) return;

            const codeInputsFirstColumn = stockSettingTable.querySelectorAll('tr td:nth-child(3) input[type="text"]');
            const valuesFirstColumn = {};
            const duplicatesFirstColumn = new Set();

            const codeInputsSecondColumn = stockSettingTable.querySelectorAll('tr td:nth-child(6) input[type="text"]');
            const valuesSecondColumn = {};
            const duplicatesSecondColumn = new Set();

            codeInputsFirstColumn.forEach(input => input.classList.remove('error-duplicate'));

            codeInputsFirstColumn.forEach(input => {
                const value = input.value.trim();
                if (value) {
                    if (valuesFirstColumn[value]) {
                        duplicatesFirstColumn.add(value);
                    } else {
                        valuesFirstColumn[value] = true;
                    }
                }
            });

            codeInputsFirstColumn.forEach(input => {
                if (duplicatesFirstColumn.has(input.value.trim())) {
                    input.classList.add('error-duplicate');
                }
            });

            codeInputsSecondColumn.forEach(input => input.classList.remove('error-duplicate'));

            codeInputsSecondColumn.forEach(input => {
                const value = input.value.trim();
                if (value) {
                    if (valuesSecondColumn[value]) {
                        duplicatesSecondColumn.add(value);
                    } else {
                        valuesSecondColumn[value] = true;
                    }
                }
            });

            codeInputsSecondColumn.forEach(input => {
                if (duplicatesSecondColumn.has(input.value.trim())) {
                    input.classList.add('error-duplicate');
                }
            });
        }

        function initHighlighting() {
            const maxLength = 32;
            const verticalAxisInput = document.getElementById('TbMainproduct縦軸項目名');
            const horizontalAxisInput = document.getElementById('TbMainproduct横軸項目名');
            const inputs = document.querySelectorAll('.hontoroku tr td:nth-child(3) input[type="text"], .hontoroku tr td:nth-child(6) input[type="text"]');

            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    highlightDuplicateCodes();
                });
            });

            attachEventListeners(verticalAxisInput, maxLength);
            attachEventListeners(horizontalAxisInput, maxLength);

            highlightInputIfExceedsMaxLength(verticalAxisInput, maxLength);
            highlightInputIfExceedsMaxLength(horizontalAxisInput, maxLength);

            highlightDuplicateCodes();
        }

        const style = document.createElement('style');
        style.textContent = `
        .error-maxlength {
            border: 2px solid red !important;
        }
        .error-duplicate {
            border: 2px solid #ffa600 !important;
        }
    `;

        document.head.appendChild(style);

        function attachEventListenersForStockSettingTable(input, maxLength, columnType) {
            if (!input) return;

            const performDuplicateCheck = () => {
                if (columnType === 'first') {
                    highlightDuplicateCodes();
                } else if (columnType === 'second') {
                    highlightDuplicateCodes();
                }
            };

            input.addEventListener('input', () => {
                highlightInputIfExceedsMaxLength(input, maxLength);
                performDuplicateCheck();
                updateButtonState();
            });

            input.addEventListener('focus', () => {
                highlightInputIfExceedsMaxLength(input, maxLength);
                performDuplicateCheck();
                updateButtonState();
            });

            input.addEventListener('blur', () => {
                highlightInputIfExceedsMaxLength(input, maxLength);
                performDuplicateCheck();
                updateButtonState();
            });

            input.addEventListener('change', () => {
                highlightInputIfExceedsMaxLength(input, maxLength);
                performDuplicateCheck();
                updateButtonState();
            });

            input.addEventListener('paste', () => {
                highlightInputIfExceedsMaxLength(input, maxLength);
                performDuplicateCheck();
                updateButtonState();
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initHighlighting);
        } else {
            initHighlighting();
        }


        function highlightInputsInStockSettingTable() {
            const rows = document.querySelectorAll('#stockSettingTable table.hontoroku tr');
            const maxLength = 32;

            rows.forEach((row, index) => {
                if (index > 0 && index <= 20) {
                    const secondColInput = row.querySelector('td:nth-child(2) input');
                    const fifthColInput = row.querySelector('td:nth-child(5) input');

                    attachEventListenersForStockSettingTable(secondColInput, maxLength, 'first');
                    attachEventListenersForStockSettingTable(fifthColInput, maxLength, 'second');

                    highlightInputIfExceedsMaxLength(secondColInput, maxLength);
                    highlightInputIfExceedsMaxLength(fifthColInput, maxLength);
                }
            });

        }

        const getByteLength = (str) => {
            let byteLength = 0;
            for (let i = 0; i < str.length; i++) {
                const charCode = str.charCodeAt(i);
                byteLength += (charCode > 0x7F) ? 2 : 1;
            }
            return byteLength;
        };

        const highlightInput = (input, headerByteLength) => {
            const inputByteLength = getByteLength(input.value);
            const isOverLimit = (headerByteLength + inputByteLength > 19);
            input.style.border = isOverLimit ? '2px solid red' : '';
            return isOverLimit;
        };

        const highlightInputsBasedOnByteLength = (headerByteLength) => {
            const stockSettingTable = document.getElementById('stockSettingTable');
            if (!stockSettingTable) return;

            const rows = stockSettingTable.querySelectorAll('tr');
            let hasRedBorder = false;

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 6) {
                    const thirdColInput = cells[1].querySelector('input');
                    const sixthColInput = cells[4].querySelector('input');

                    if (thirdColInput) {
                        hasRedBorder = highlightInput(thirdColInput, headerByteLength) || hasRedBorder;
                    }

                    if (sixthColInput) {
                        hasRedBorder = highlightInput(sixthColInput, headerByteLength) || hasRedBorder;
                    }
                }
            });

            return hasRedBorder;
        };

        const updateButtonState = () => {
            const verticalAxisInput = document.getElementById('TbMainproduct縦軸項目名');
            const horizontalAxisInput = document.getElementById('TbMainproduct横軸項目名');
            const thirdColInputs = document.querySelectorAll('#stockSettingTable table.hontoroku tr td:nth-child(3) input');
            const sixthColInputs = document.querySelectorAll('#stockSettingTable table.hontoroku tr td:nth-child(6) input');

            const maxLength = 32;
            const headerTextElement = document.querySelector('h2');
            const headerTextMatch = headerTextElement ? headerTextElement.textContent.match(/\[(.*?)\]/) : null;
            const headerByteLength = headerTextMatch ? getByteLength(headerTextMatch[1]) : 0;

            let hasRedBorder = false;
            let buttonMessage = '';

            const inputsToCheck1 = [verticalAxisInput, horizontalAxisInput];
            inputsToCheck1.forEach(input => {
                if (input && countByteLength(input.value) > maxLength) {
                    hasRedBorder = true;
                    buttonMessage = "項目名を全角16(半角32)文字以内にしてください";
                }
            });

            if (!hasRedBorder) {
                const inputsToCheck2 = [...thirdColInputs, ...sixthColInputs];
                inputsToCheck2.forEach(input => {
                    if (input && (headerByteLength + getByteLength(input.value) > 19)) {
                        hasRedBorder = true;
                        buttonMessage = "商品コード+SKUを20文字以内にしてください";
                    }
                });
            }

            const saveButton = document.getElementById('saveAndSkuStock');
            if (saveButton && saveButton.value !== "送料を選択してください") {
                saveButton.disabled = hasRedBorder;
                saveButton.style.cursor = hasRedBorder ? 'not-allowed' : '';
                saveButton.value = hasRedBorder ? buttonMessage : '保存してSKU在庫の設定';
            }

            const registeredSaveButton = document.getElementById('registeredSaveAndSkuStock');
            if (registeredSaveButton && registeredSaveButton.value !== "送料を選択してください") {
                registeredSaveButton.disabled = hasRedBorder;
                registeredSaveButton.style.cursor = hasRedBorder ? 'not-allowed' : '';
                registeredSaveButton.value = hasRedBorder ? buttonMessage : '保存してSKU在庫の設定';
            }
        };

        const stockSettingTable = document.getElementById('stockSettingTable');
        if (stockSettingTable) {
            stockSettingTable.addEventListener('focusout', () => {
                setTimeout(() => {
                    const headerTextElement = document.querySelector('h2');
                    const headerTextMatch = headerTextElement ? headerTextElement.textContent.match(/\[(.*?)\]/) : null;
                    const headerByteLength = headerTextMatch ? getByteLength(headerTextMatch[1]) : 0;
                    highlightInputsBasedOnByteLength(headerByteLength);
                    updateButtonState();
                }, 10);
            });
        }

        const observer = new MutationObserver(() => {
            initHighlighting();
            highlightInputsInStockSettingTable();
            highlightDuplicateCodes();
            const headerTextElement = document.querySelector('h2');
            const headerTextMatch = headerTextElement ? headerTextElement.textContent.match(/\[(.*?)\]/) : null;
            const headerByteLength = headerTextMatch ? getByteLength(headerTextMatch[1]) : 0;

            highlightInputsBasedOnByteLength(headerByteLength);
            updateButtonState();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        initHighlighting();
        highlightInputsInStockSettingTable();
        const headerTextElement = document.querySelector('h2');
        const headerTextMatch = headerTextElement ? headerTextElement.textContent.match(/\[(.*?)\]/) : null;
        const headerByteLength = headerTextMatch ? getByteLength(headerTextMatch[1]) : 0;

        highlightInputsBasedOnByteLength(headerByteLength);
        updateButtonState();

        const divs = document.querySelectorAll('div');
        for (const div of divs) {
            if (div.textContent.includes("この商品は在庫表の設定変更ができません")) {
                return;
            }
        }

        const columns = {
            many: {
                inputIndex: 1,
                codeOffset: 1
            },
            few: {
                inputIndex: 4,
                codeOffset: 1
            }
        };

        let startIndex, endIndex;

        const url = window.location.href;

        if (url.includes("/forests/TbMainproducts/mainedit/") || url.includes("/forests/tb_mainproducts/mainedit/")) {
            startIndex = 30;
            endIndex = 51;
        } else if (url.includes("/forests/TbMainproducts/registered_mainedit/") || url.includes("/forests/tb_mainproducts/registered_mainedit/")) {
            startIndex = 51;
            endIndex = 72;
        } else {
            return;
        }

        function getInputs(column) {
            return Array.from(document.querySelectorAll(`table.hontoroku tr td:nth-child(${column.inputIndex}) input[type="text"]:not([readonly])`));
        }

        function handleEnterKey(inputs) {
            return function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const currentIndex = inputs.indexOf(this);
                    const nextInput = inputs[currentIndex + 1];
                    if (nextInput) {
                        nextInput.focus();
                    }
                    const event = new Event('change', { bubbles: true });
                    inputs[currentIndex].dispatchEvent(event);
                }
            };
        }

        function handlePaste(inputs) {
            return function(e) {
                e.preventDefault();
                const pasteData = (e.clipboardData || window.clipboardData).getData('text');
                const lines = pasteData.split('\n').filter(line => line.trim() !== '');
                let currentIndex = inputs.indexOf(this);

                if (lines.length === 0) {
                    return;
                }

                if (lines.length > 1) {
                    setTimeout(() => {
                        lines.forEach((line, i) => {
                            if (currentIndex + i < inputs.length) {
                                const currentInput = inputs[currentIndex + i];
                                currentInput.value = line;

                                currentInput.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                        });

                        const lastIndex = Math.min(currentIndex + lines.length - 1, inputs.length - 1);
                        inputs[lastIndex].focus();
                    }, 0);
                } else {
                    const currentInput = inputs[currentIndex];
                    const currentText = currentInput.value;
                    const selectionStart = currentInput.selectionStart;
                    const selectionEnd = currentInput.selectionEnd;

                    const newText = currentText.substring(0, selectionStart) + lines[0] + currentText.substring(selectionEnd);
                    currentInput.value = newText;

                    const newCursorPosition = selectionStart + lines[0].length;
                    currentInput.setSelectionRange(newCursorPosition, newCursorPosition);

                    currentInput.dispatchEvent(new Event('change', { bubbles: true }));
                }

                if (lines.length === 1 && pasteData.endsWith('\n')) {
                    return;
                }
                inputs[Math.min(currentIndex + lines.length - 1, inputs.length - 1)].focus();
            };
        }

        function addEventListenersToInputs(inputs) {
            inputs.forEach(input => {
                input.addEventListener('keydown', handleEnterKey(inputs));
                input.addEventListener('paste', handlePaste(inputs));
            });
        }

        function addRowNumbers(startIndex, endIndex) {
            const tableRows = document.querySelectorAll('table.hontoroku tbody tr');
            tableRows.forEach((row, index) => {
                const th = document.createElement('th');
                th.scope = 'row';
                th.style.textAlign = 'center';
                if (index >= startIndex && index <= endIndex) {
                    if (index === startIndex) {
                        th.innerText = '';
                    } else if (index <= endIndex - 1) {
                        th.innerText = index - startIndex;
                    } else {
                        th.innerText = '';
                    }
                } else {
                    th.style.display = 'none';
                }
                row.insertAdjacentElement('afterbegin', th);
            });
        }

        function focusFirstInput() {
            const firstInput = document.querySelector('table.hontoroku tr td:nth-child(2) input[type="text"]');
            if (firstInput) {
                firstInput.focus();
            }
        }

        function addEnterKeyListener() {
            const verticalInput = document.getElementById('TbMainproduct縦軸項目名');
            if (verticalInput) {
                verticalInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        focusFirstInput();
                    }
                });
            }
        }

        addEnterKeyListener();

        Object.values(columns).forEach(column => {
            const inputs = getInputs(column);
            addEventListenersToInputs(inputs);
        });

        addRowNumbers(startIndex, endIndex);
    }

    function copyMakerStockTable(){

        const SELECTOR_VARIANTS = [
            {
                name: 'selector-table-adv',
                detect: () => {
                    const root = document.querySelector('.selector-table');
                    if (!root) return false;
                    const header = root.querySelector('.next-table-header-inner thead tr');
                    const body = root.querySelector('.next-table-body tbody');
                    return !!(header && body);
                },
                skuSection: '.selector-table .next-table-header-inner thead tr th',
                groupTitle: '', // 特殊処理で取得
                labelNames: '', // 未使用
                itemTitles: '' // 未使用
            },
            {
                name: 'classic',
                detect: () => document.querySelector('#skuSelection .feature-item'),
                skuSection: '#skuSelection .feature-item',
                groupTitle: 'h3',
                labelNames: '.transverse-filter .label-name',
                itemTitles: '.expand-view-item .item-label[title]'
            },
            {
                name: 'pc-sku-wrapper',
                detect: () => document.querySelector('.pc-sku-wrapper .sku-module-wrapper'),
                skuSection: '.pc-sku-wrapper .sku-module-wrapper',
                groupTitle: '.sku-prop-module-name',
                labelNames: '.prop-name[title], .sku-item-name',
                itemTitles: ''
            },
            {
                name: 'gyp-sku-selector',
                detect: () => document.querySelector('.gyp-sku-selector-wrap .sku-selector-flex-box'),
                skuSection: '.gyp-sku-selector-wrap .sku-selector-flex-box',
                groupTitle: '.sku-selector-name',
                labelNames: '.prop-item-text, .sku-item-name-text',
                itemTitles: ''
            },
            {
                name: 'table-sku',
                detect: () => document.querySelector('.next-table .next-table-body'),
                skuSection: '.next-table .next-table-body tbody tr',
                groupTitle: '',
                labelNames: 'td .normal-text[title]',
                itemTitles: ''
            },
            {
                name: 'next-table-header',
                detect: () => document.querySelector('.next-table-header-inner thead tr'),
                skuSection: '.next-table-header-inner thead tr th',
                groupTitle: '',
                labelNames: '.label-content[title]',
                itemTitles: ''
            }
        ];

        let SELECTOR = null;
        let cleanupProximity = null;

        GM_addStyle(`
  .copyButtonsContainer {
    position: fixed; top: 20px; right: 10px; z-index: 1000;
    display: flex; flex-direction: column; align-items: flex-end; gap: 6px;
    transition: opacity .18s ease, transform .18s ease;
    opacity: .08; transform: translateY(-2px); pointer-events: none;
  }
  .copyButtonsContainer.visible, .copyButtonsContainer.pinned { opacity: 1; transform: translateY(0); pointer-events: auto; }
  .copyButtonsContainer.hidden { display: none !important; }

  .copyButtonsContainer .copyButton {
    background-color: #007bff; color: #fff; border: none; padding: 9px 10px;
    border-radius: 6px; cursor: pointer; font: 12px/1 Arial, sans-serif;
    white-space: nowrap; width: max-content; box-shadow: 0 2px 6px rgba(0,0,0,.12);
                box-shadow: 0 4px 6px rgba(0,0,0,.12);

  }
  .copyButtonsContainer .masterCopyButton { background-color: #228d3a !important; }

  .copyButtonsContainer .row { display: flex; gap: 6px; align-items: center; width: 100%; justify-content: flex-end; }
  .copyButtonsContainer .pinToggle,
  .copyButtonsContainer .hideToggle {
    font: 12px/1 Arial, sans-serif; padding: 6px 8px; border-radius: 6px;
    border: 1px solid #ddd; background: #fff; cursor: pointer;
  }

  .reopenHandle {
    position: fixed; top: 20px; right: -2px; z-index: 1001;
    padding: 6px 10px 6px 12px; font: 12px/1 Arial, sans-serif;
    color: #fff; background: rgba(102,102,102,.9);
    border-radius: 6px 0 0 6px; cursor: pointer; opacity: .6;
    box-shadow: 0 2px 6px rgba(0,0,0,.12); user-select: none;
  }
  .reopenHandle:hover { opacity: 1; right: 0; }

  .checkboxList {
    position: fixed; top: 30px; right: 10px; background-color: white; border: 1px solid #ccc;
    padding: 20px 15px 15px 15px; max-height: 90vh; overflow-y: auto; z-index: 2000;
    font-size: 15px; min-width: 230px; box-shadow: 0 0 10px rgba(0,0,0,0.2);
  }
  .checkboxList label { display: block; white-space: nowrap; }
  .button-container {
    display: flex; justify-content: space-between; align-items: center; position: sticky; bottom: -15px;
    background-color: white; padding-top: 10px; padding-bottom: 10px; border-top: 1px solid #ccc; gap: 10px;
  }
  .selectToggleButton, .okButton, .closeButton {
    background-color: #007bff !important; color: white !important; padding: 5px 8px;
    border: none; border-radius: 3px; cursor: pointer; font-family: Arial, sans-serif;
  }
  .closeButton { background-color: #dc3545 !important; }
  `);

        function textFromCell(cell) {
            const t = cell?.querySelector('.normal-text[title]')?.getAttribute('title')?.trim();
            if (t) return t;
            const p = cell?.querySelector('.price')?.textContent?.trim();
            if (p) return p;
            const raw = cell?.textContent?.trim();
            return raw || '';
        }

        function getHeaderColIndex(th) {
            const w = th.querySelector('.next-table-cell-wrapper[data-next-table-col]');
            if (w && w.getAttribute('data-next-table-col')) return parseInt(w.getAttribute('data-next-table-col'), 10);
            const tr = th.closest('tr');
            const ths = tr ? Array.from(tr.children) : [];
            return Math.max(0, ths.indexOf(th));
        }

        function getNearestTableInner(el) {
            return el.closest('.next-table-inner') || document.querySelector('.selector-table .next-table-inner');
        }

        function collectFromTableColumn(th) {
            const col = getHeaderColIndex(th);
            const inner = getNearestTableInner(th);
            const rows = inner?.querySelectorAll('.next-table-body tbody tr') || [];
            const set = new Set();
            rows.forEach(row => {
                const td = row.querySelector(`td[data-next-table-col="${col}"] .next-table-cell-wrapper`) ||
                      row.querySelector(`td[data-next-table-col="${col}"]`);
                const v = textFromCell(td);
                if (v) set.add(v);
            });
            return Array.from(set);
        }

        function headerText(th) {
            const price = th.querySelector('.price-title');
            if (price) return '价格';
            const span = th.querySelector('.label-content[title]');
            if (span?.getAttribute('title')) return span.getAttribute('title').trim();
            return th.textContent.trim();
        }

        function isSkuHeaderCell(th) {
            if (th.querySelector('.price-title')) return false;
            const t = headerText(th);
            if (!t) return false;
            const banned = ['价格', '库存', '进货数量'];
            return !banned.some(b => t.includes(b));
        }

        function collectTitlesFromFeatureItem(item) {
            if (SELECTOR?.name === 'selector-table-adv') {
                return collectFromTableColumn(item);
            }
            const titles = new Set();
            if (SELECTOR?.labelNames) {
                item.querySelectorAll(SELECTOR.labelNames).forEach(el => {
                    const text = el.getAttribute('title')?.trim() || el.textContent.trim();
                    if (text) titles.add(text);
                });
            }
            if (SELECTOR?.itemTitles) {
                item.querySelectorAll(SELECTOR.itemTitles).forEach(el => {
                    const text = el.getAttribute('title')?.trim();
                    if (text) titles.add(text);
                });
            }
            return Array.from(titles);
        }

        function getFeatureTitle(item, index = 0) {
            if (SELECTOR?.name === 'selector-table-adv') {
                return headerText(item) || `列 ${index + 1}`;
            }
            if (SELECTOR?.name === 'table-sku' || SELECTOR?.name === 'next-table-header') {
                const span = item.querySelector('.label-content[title]');
                return span?.getAttribute('title')?.trim() || item.textContent.trim() || `列 ${index + 1}`;
            }
            const el = item.querySelector(SELECTOR?.groupTitle);
            return el ? el.textContent.trim() : `SKU${index + 1}`;
        }

        function createCopyButton(label, items) {
            const btn = document.createElement('button');
            btn.className = 'copyButton';
            btn.innerText = `${label}をコピー（${items.length}件）`;
            btn.title = '左クリック: 選択コピー / 右クリック: 全コピー';

            btn.addEventListener('click', () => {
                showCheckboxList(items, selected => {
                    GM_setClipboard(selected.join('\n'));
                    btn.innerText = `${label}をコピー（${selected.length}件）✔`;
                    setTimeout(() => { btn.innerText = `${label}をコピー（${items.length}件）`; }, 1500);
                });
            });

            btn.addEventListener('contextmenu', e => {
                e.preventDefault();
                GM_setClipboard(items.join('\n'));
                btn.innerText = `${label}をコピー（${items.length}件）✔`;
                setTimeout(() => { btn.innerText = `${label}をコピー（${items.length}件）`; }, 1500);
            });

            return btn;
        }

        function createMasterCopyButton(allItems) {
            const label = '一括コピー';
            const btn = document.createElement('button');
            btn.className = 'copyButton masterCopyButton';
            btn.innerText = `${label}（${allItems.length}件）`;
            btn.title = '左クリック: 選択して一括コピー / 右クリック: 全件一括コピー';

            btn.addEventListener('click', () => {
                showCheckboxList(allItems, selected => {
                    GM_setClipboard(selected.join('\n'));
                    btn.innerText = `${label}（${selected.length}件）✔`;
                    setTimeout(() => { btn.innerText = `${label}（${allItems.length}件）`; }, 1500);
                });
            });

            btn.addEventListener('contextmenu', e => {
                e.preventDefault();
                GM_setClipboard(allItems.join('\n'));
                btn.innerText = `${label}（${allItems.length}件）✔`;
                setTimeout(() => { btn.innerText = `${label}（${allItems.length}件）`; }, 1500);
            });

            return btn;
        }

        function showCheckboxList(items, callback) {
            document.querySelector('.checkboxList')?.remove();

            const listContainer = document.createElement('div');
            listContainer.className = 'checkboxList';

            const checkboxes = items.map((text, index) => {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = true;
                checkbox.value = text;
                label.append(`${index + 1}. `, checkbox, text);
                listContainer.appendChild(label);
                return checkbox;
            });

            let allSelected = true;

            const toggleButton = document.createElement('button');
            toggleButton.className = 'selectToggleButton';
            toggleButton.innerText = '全解除';
            toggleButton.onclick = () => {
                allSelected = !allSelected;
                checkboxes.forEach(cb => cb.checked = allSelected);
                toggleButton.innerText = allSelected ? '全解除' : '全選択';
            };

            const okButton = document.createElement('button');
            okButton.className = 'okButton';
            okButton.innerText = 'OK';
            okButton.onclick = () => {
                const selected = checkboxes.filter(cb => cb.checked).map(cb => cb.value);
                listContainer.remove();
                callback(selected);
            };

            const closeButton = document.createElement('button');
            closeButton.className = 'closeButton';
            closeButton.innerText = '✕';
            closeButton.onclick = () => listContainer.remove();

            const btnWrapper = document.createElement('div');
            btnWrapper.className = 'button-container';
            btnWrapper.append(toggleButton, okButton, closeButton);

            listContainer.appendChild(btnWrapper);
            document.body.appendChild(listContainer);
        }

        function createReopenHandle() {
            document.querySelector('.reopenHandle')?.remove();
            const handle = document.createElement('div');
            handle.className = 'reopenHandle';
            handle.textContent = '表示';
            handle.addEventListener('click', () => {
                localStorage.setItem('cc_hidden', '0');
                handle.remove();
                buildWhenReady(true);
            });
            document.body.appendChild(handle);
        }

        function buildContainer(flash = false) {
            document.querySelector('.copyButtonsContainer')?.remove();
            document.querySelector('.checkboxList')?.remove();
            document.querySelector('.reopenHandle')?.remove();

            const container = document.createElement('div');
            container.className = 'copyButtonsContainer';
            if (localStorage.getItem('cc_pinned') === '1') container.classList.add('pinned', 'visible');
            if (flash) {
                container.classList.add('visible');
                setTimeout(() => {
                    if (!container.classList.contains('pinned')) container.classList.remove('visible');
                }, 2000);
            }

            const tools = document.createElement('div');
            tools.className = 'row';

            const pinBtn = document.createElement('button');
            pinBtn.className = 'pinToggle';
            pinBtn.title = 'ピン留めで常時表示';
            syncPinLabel();
            pinBtn.addEventListener('click', togglePinned);

            const hideBtn = document.createElement('button');
            hideBtn.className = 'hideToggle';
            hideBtn.textContent = '非表示';
            hideBtn.addEventListener('click', () => {
                localStorage.setItem('cc_hidden', '1');
                cleanupProximity?.(); cleanupProximity = null;
                container.remove();
                document.querySelector('.checkboxList')?.remove();
                createReopenHandle();
            });

            tools.append(pinBtn, hideBtn);
            container.appendChild(tools);

            const allValuesSet = new Set();

            if (SELECTOR?.name === 'selector-table-adv') {
                const ths = Array.from(document.querySelectorAll(SELECTOR.skuSection))
                .filter(isSkuHeaderCell);
                ths.forEach((th, idx) => {
                    const label = getFeatureTitle(th, idx);
                    const values = collectTitlesFromFeatureItem(th);
                    values.forEach(v => allValuesSet.add(v));
                    if (values.length > 0) container.appendChild(createCopyButton(label, values));
                });
            } else {
                const featureItems = document.querySelectorAll(SELECTOR.skuSection);
                featureItems.forEach((item, index) => {
                    const label = getFeatureTitle(item, index);
                    const values = collectTitlesFromFeatureItem(item);
                    values.forEach(v => allValuesSet.add(v));
                    if (values.length > 0) container.appendChild(createCopyButton(label, values));
                });
            }

            const allValues = Array.from(allValuesSet);
            if (allValues.length > 0) container.appendChild(createMasterCopyButton(allValues));

            document.body.appendChild(container);
            cleanupProximity = setupProximityReveal(container);

            function togglePinned() {
                const isPinned = container.classList.toggle('pinned');
                if (isPinned) container.classList.add('visible');
                localStorage.setItem('cc_pinned', isPinned ? '1' : '0');
                syncPinLabel();
            }
            function syncPinLabel() {
                const pinned = localStorage.getItem('cc_pinned') === '1';
                pinBtn.textContent = pinned ? '📍' : '📌';
            }
        }

        function setupProximityReveal(container) {
            const NEAR_X = 160, NEAR_Y = 220, HIDE_DELAY = 0;

            let rafId = 0;
            let lastMove = { x: 0, y: 0 };
            let hideTimer = 0;

            const isPinned = () => container.classList.contains('pinned');

            function onMouseMove(e) {
                lastMove = { x: e.clientX, y: e.clientY };
                if (!rafId) rafId = requestAnimationFrame(tick);
            }
            function onScroll() {
                if (isPinned()) return;
                if (!container.matches(':hover,:focus-within')) container.classList.remove('visible');
            }
            function tick() {
                rafId = 0;
                if (isPinned()) return;
                const nearRight = (window.innerWidth - lastMove.x) <= NEAR_X;
                const nearTop = lastMove.y <= NEAR_Y;
                const show = nearRight && nearTop;

                if (show || container.matches(':hover,:focus-within')) {
                    container.classList.add('visible');
                    clearTimeout(hideTimer);
                } else {
                    clearTimeout(hideTimer);
                    hideTimer = setTimeout(() => container.classList.remove('visible'), HIDE_DELAY);
                }
            }

            window.addEventListener('mousemove', onMouseMove, { passive: true });
            window.addEventListener('scroll', onScroll, { passive: true });

            return () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('scroll', onScroll);
                clearTimeout(hideTimer);
                if (rafId) cancelAnimationFrame(rafId);
            };
        }

        function buildWhenReady(flash = false) {
            let tries = 0;
            (function loop() {
                if (!SELECTOR) {
                    for (const v of SELECTOR_VARIANTS) { if (v.detect()) { SELECTOR = v; break; } }
                }
                const ready = SELECTOR && document.querySelectorAll(SELECTOR.skuSection).length > 0;
                if (ready) {
                    if (localStorage.getItem('cc_hidden') === '1') {
                        createReopenHandle();
                    } else {
                        buildContainer(flash);
                    }
                } else if (tries++ < 50) {
                    setTimeout(loop, 200);
                } else {
                    console.warn('[SKU Copy] build timeout, fallback UI');
                    SELECTOR = SELECTOR || SELECTOR_VARIANTS[0];
                    buildContainer(flash);
                }
            })();
        }

        function waitForDom() {
            for (const variant of SELECTOR_VARIANTS) {
                if (variant.detect()) { SELECTOR = variant; break; }
            }
            const ok = SELECTOR && document.querySelectorAll(SELECTOR.skuSection).length > 0;
            if (ok) {
                if (localStorage.getItem('cc_hidden') === '1') {
                    createReopenHandle();
                } else {
                    buildContainer();
                }
            } else {
                setTimeout(waitForDom, 500);
            }
        }

        if (localStorage.getItem('cc_hidden') === '1') {
            createReopenHandle();
            waitForDom();
        } else {
            waitForDom();
        }

    }

    function enhanceAxisCodeManager(){

        function triggerInputEvent(element) {
            element.dispatchEvent(new Event('input', { bubbles: true }));
        }

        function processPastedText(inputElement, pastedText) {
            const lines = pastedText.split('\n').filter(line => line.trim() !== "");

            if (lines.length === 1) {
                const currentPosition = inputElement.selectionStart;
                const currentValue = inputElement.value;

                if (inputElement.selectionStart === 0 && inputElement.selectionEnd === currentValue.length) {
                    inputElement.value = pastedText;
                    inputElement.setSelectionRange(pastedText.length, pastedText.length);
                } else {
                    const newValue = currentValue.slice(0, currentPosition) + pastedText + currentValue.slice(currentPosition);
                    inputElement.value = newValue;
                    inputElement.setSelectionRange(currentPosition + pastedText.length, currentPosition + pastedText.length);
                }
                triggerInputEvent(inputElement);
            } else {
                inputElement.value = lines[0];
                triggerInputEvent(inputElement);

                const columnIndex = Array.from(inputElement.closest('tr').children).indexOf(inputElement.closest('td'));

                for (let i = 1; i < lines.length; i++) {
                    const nextRow = inputElement.closest('tr').nextElementSibling;
                    if (nextRow) {
                        const nextInput = nextRow.children[columnIndex].querySelector('input.form-control');
                        if (nextInput) {
                            nextInput.value = lines[i];
                            triggerInputEvent(nextInput);
                            inputElement = nextInput;
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }
        }

        function handlePaste(event) {
            const pastedText = (event.clipboardData || window.clipboardData).getData('text');

            if (pastedText.includes('\n')) {
                event.preventDefault();
                processPastedText(event.target, pastedText);
            }
        }

        function addPasteListeners() {
            document.querySelectorAll('input.form-control').forEach(input => {
                input.addEventListener('paste', handlePaste);
            });
        }

        function observeDynamicElements() {
            new MutationObserver(() => addPasteListeners()).observe(document.getElementById('axisCode'), { childList: true, subtree: true });
        }

        function main() {
            addPasteListeners();
            observeDynamicElements();
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', main);
        } else {
            main();
        }
    }

    function personalMemo(){

        let memoBoxChanged = false;
        let otherChanges = false;
        let memoVisible = localStorage.getItem('memoVisible') === 'true';
        const isStarlight = window.location.hostname === 'starlight.plusnao.co.jp';

        if (isStarlight) {
            memoVisible = false;
        }

        let splitMode = localStorage.getItem('splitMode') || 'none';

        const memoDiv = document.createElement('div');
        memoDiv.style.position = 'fixed';
        memoDiv.style.bottom = isStarlight ? '0' : '25px';
        memoDiv.style.right = '5px';
        memoDiv.style.zIndex = '1000';
        memoDiv.style.border = '1px solid #ccc';
        memoDiv.style.backgroundColor = '#EEF7FF';
        memoDiv.style.resize = 'both';
        memoDiv.style.overflow = 'hidden';
        memoDiv.style.borderRadius = '5px';
        memoDiv.style.transform = 'scale(-1)';
        memoDiv.style.display = memoVisible ? 'flex' : 'none';
        memoDiv.style.flexDirection = 'column-reverse';
        memoDiv.style.boxSizing = 'border-box';

        const savedWidth = localStorage.getItem('memoBoxWidth') || '500px';
        const savedHeight = localStorage.getItem('memoBoxHeight') || '500px';
        memoDiv.style.width = savedWidth;
        memoDiv.style.height = savedHeight;

        const memoHeader = document.createElement('div');
        memoHeader.textContent = 'Memo';
        memoHeader.style.fontWeight = 'bold';
        memoHeader.style.textAlign = 'center';
        memoHeader.style.position = 'relative';
        memoHeader.style.padding = isStarlight ? '5px 0' : '5px 0';
        memoHeader.style.cursor = 'default';
        memoHeader.style.transform = 'scale(-1)';

        const memoContainer = document.createElement('div');
        memoContainer.style.flex = '1';
        memoContainer.style.display = 'flex';
        memoContainer.style.flexDirection = 'column';
        memoContainer.style.overflow = 'hidden';
        memoContainer.style.transform = 'scale(-1)';

        function simulatePaste(inputElement, text) {
            if (!text.includes('\n')) {
                text += '\n';
            }

            navigator.clipboard.writeText(text).then(() => {
                inputElement.focus();

                const pasteEvent = new ClipboardEvent('paste', {
                    clipboardData: new DataTransfer()
                });
                pasteEvent.clipboardData.setData('text', text);
                inputElement.dispatchEvent(pasteEvent);
            }).catch(err => {
                err('Clipboardへの書き込みに失敗しました:', err);
            });
        }

        function createTextarea(index) {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.marginBottom = '5px';

            const textarea = document.createElement('textarea');
            textarea.style.width = '100%';
            textarea.style.height = '100%';
            textarea.style.resize = 'none';
            textarea.style.boxSizing = 'border-box';

            textarea.style.padding = '3px';
            textarea.placeholder = `Area ${index}`;
            textarea.dataset.index = index;

            let productId;
            if (window.location.hostname === 'starlight.plusnao.co.jp') {
                const params = new URLSearchParams(window.location.search);
                productId = params.get('code');
            } else {
                productId = window.location.pathname.split('/').pop();
            }

            let value;

            if (window.location.hostname === 'starlight.plusnao.co.jp') {
                if (index === 0) {
                    value = GM_getValue(`personalMemo-${productId}`, '');
                } else {
                    value = GM_getValue(`personalMemo-${productId}-@${index}`, '');
                }
            } else {
                if (index === 0) {
                    value = localStorage.getItem(`personalMemo-${productId}`) || '';
                    if (value === '') {
                        value = GM_getValue(`personalMemo-@${productId}`, '');
                    }
                } else {
                    value = localStorage.getItem(`personalMemo-${productId}-${index}`) || '';
                    if (value === '') {
                        value = GM_getValue(`personalMemo-${productId}-@${index}`, '');
                    }
                }
            }
            textarea.value = value;

            textarea.addEventListener('input', () => {
                if (window.location.hostname !== 'starlight.plusnao.co.jp') {
                    if (index === 0) {
                        localStorage.setItem(`personalMemo-${productId}`, textarea.value);
                        GM_setValue(`personalMemo-${productId}`, textarea.value);
                    } else {
                        localStorage.setItem(`personalMemo-${productId}-@${index}`, textarea.value);
                        GM_setValue(`personalMemo-${productId}-@${index}`, textarea.value);
                    }
                }
                memoBoxChanged = true;
            });

            textarea.addEventListener('mousedown', (event) => {
                event.stopPropagation();
            });

            const copyButton = document.createElement('button');
            copyButton.textContent = 'コピー';
            copyButton.style.marginTop = '5px';
            copyButton.style.padding = '9px 6px';
            copyButton.style.fontSize = '12px';
            copyButton.style.border = 'none';
            copyButton.style.backgroundColor = '#007bff';
            copyButton.style.color = 'white';
            copyButton.style.borderRadius = '3px';
            copyButton.style.cursor = 'pointer';
            copyButton.style.alignSelf = 'flex-start';

            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(textarea.value).then(() => {
                    copyButton.textContent = 'コピーしました';
                    setTimeout(() => {
                        copyButton.textContent = 'コピー';
                    }, 1500);
                }).catch(err => {
                    err('コピーに失敗しました: ', err);
                });
            });

            const pasteHorizontalButton = document.createElement('button');
            pasteHorizontalButton.textContent = '横軸ペースト';
            pasteHorizontalButton.style.marginTop = '5px';
            pasteHorizontalButton.style.padding = '9px 6px';
            pasteHorizontalButton.style.fontSize = '12px';
            pasteHorizontalButton.style.border = 'none';
            pasteHorizontalButton.style.backgroundColor = '#28a745';
            pasteHorizontalButton.style.color = 'white';
            pasteHorizontalButton.style.borderRadius = '3px';
            pasteHorizontalButton.style.cursor = 'pointer';
            pasteHorizontalButton.style.alignSelf = 'flex-start';

            pasteHorizontalButton.addEventListener('click', () => {
                const targetHorizontalInput = document.querySelector('table:nth-of-type(1) tbody tr td:nth-child(4) input.form-control');
                if (targetHorizontalInput) {
                    const textToPaste = textarea.value;
                    simulatePaste(targetHorizontalInput, textToPaste);

                    pasteHorizontalButton.textContent = 'ペーストしました';
                    setTimeout(() => {
                        pasteHorizontalButton.textContent = '横軸ペースト';
                    }, 1500);
                }
            });

            const pasteVerticalButton = document.createElement('button');
            pasteVerticalButton.textContent = '縦軸ペースト';
            pasteVerticalButton.style.marginTop = '5px';
            pasteVerticalButton.style.padding = '9px 6px';
            pasteVerticalButton.style.fontSize = '12px';
            pasteVerticalButton.style.border = 'none';
            pasteVerticalButton.style.backgroundColor = '#28a745';
            pasteVerticalButton.style.color = 'white';
            pasteVerticalButton.style.borderRadius = '3px';
            pasteVerticalButton.style.cursor = 'pointer';
            pasteVerticalButton.style.alignSelf = 'flex-start';

            pasteVerticalButton.addEventListener('click', () => {
                const verticalTable = document.querySelectorAll('table')[2];
                const targetVerticalInputs = verticalTable.querySelectorAll('tbody tr td:nth-child(4) input.form-control');

                if (targetVerticalInputs.length > 0) {
                    const textToPaste = textarea.value;

                    targetVerticalInputs.forEach((input, index) => {
                        if (index === 0) {
                            simulatePaste(input, textToPaste);
                        }
                    });

                    pasteVerticalButton.textContent = 'ペーストしました';
                    setTimeout(() => {
                        pasteVerticalButton.textContent = '縦軸ペースト';
                    }, 1500);
                }
            });

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '10px';
            buttonContainer.style.marginTop = '1px';

            container.appendChild(textarea);
            if (isStarlight) {
                buttonContainer.appendChild(copyButton);
                buttonContainer.appendChild(pasteHorizontalButton);
                buttonContainer.appendChild(pasteVerticalButton);
                container.appendChild(textarea);
                container.appendChild(buttonContainer);
            }
            return container;
        }

        memoDiv.addEventListener('mouseup', () => {
            if (memoVisible) {
                localStorage.setItem('memoBoxWidth', memoDiv.style.width);
                localStorage.setItem('memoBoxHeight', memoDiv.style.height);
                memoBoxChanged = true;
            }
        });

        function updateMemoLayout() {
            memoContainer.innerHTML = '';
            let textareas;

            switch (splitMode) {
                case 'vertical': {
                    memoContainer.style.flexDirection = 'column';
                    textareas = [createTextarea(0), createTextarea(1)];
                    textareas.forEach((container) => {
                        container.style.flex = '1';
                        memoContainer.appendChild(container);
                    });
                    break;
                }
                case 'horizontal': {
                    memoContainer.style.flexDirection = 'row';
                    textareas = [createTextarea(0), createTextarea(1)];
                    textareas.forEach((container) => {
                        container.style.flex = '1';
                        memoContainer.appendChild(container);
                    });
                    break;
                }
                case 'grid': {
                    memoContainer.style.flexDirection = 'column';
                    const row1 = document.createElement('div');
                    row1.style.display = 'flex';
                    row1.style.flex = '1';
                    row1.style.flexDirection = 'row';
                    row1.style.overflow = 'hidden';

                    const row2 = document.createElement('div');
                    row2.style.display = 'flex';
                    row2.style.flex = '1';
                    row2.style.flexDirection = 'row';
                    row2.style.overflow = 'hidden';

                    textareas = [createTextarea(0), createTextarea(1), createTextarea(2), createTextarea(3)];
                    textareas.forEach((container, index) => {
                        container.style.flex = '1';
                        if (index < 2) row1.appendChild(container);
                        else row2.appendChild(container);
                    });

                    memoContainer.appendChild(row1);
                    memoContainer.appendChild(row2);
                    break;
                }
                default: {
                    const container = createTextarea(0);
                    container.style.height = '100%';
                    container.style.width = '100%';
                    memoContainer.appendChild(container);
                    break;
                }
            }
        }

        const splitButton = document.createElement('button');
        splitButton.textContent = '田';
        splitButton.style.position = 'fixed';
        splitButton.style.top = '5px';
        splitButton.style.right = '30px';
        splitButton.style.zIndex = '1001';
        splitButton.style.padding = '0px 6px';
        splitButton.style.fontSize = '12px';
        splitButton.style.border = 'none';
        splitButton.style.backgroundColor = '#66CCFF';
        splitButton.style.color = '#fff';
        splitButton.style.borderRadius = '3px';
        splitButton.style.cursor = 'pointer';

        splitButton.addEventListener('click', () => {
            switch (splitMode) {
                case 'none':
                    splitMode = 'vertical';
                    break;
                case 'vertical':
                    splitMode = 'horizontal';
                    break;
                case 'horizontal':
                    splitMode = 'grid';
                    break;
                case 'grid':
                    splitMode = 'none';
                    break;
            }
            localStorage.setItem('splitMode', splitMode);
            updateMemoLayout();
        });

        const buttonStyle = `
    #buttonWrapper {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 80px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        pointer-events: none;
    }

    #showButton {
        width: 40px;
        height: 40px;
        background: rgba(102, 204, 102, 0.5);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(102, 204, 102, 0.4);
        border-radius: 50%;
        font-size: 26px;
        font-weight: bold;
        font-family: monospace;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        pointer-events: auto;
        transform-origin: center;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        opacity: 0;
        animation: fadeIn 0.5s forwards;
    }

    #showButton:hover {
        width: 60px;
        height: 60px;
        background: rgba(102, 204, 102, 0.6);
        font-size: 32px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    #showButton:active {
        transform: scale(0.9);
        background: rgba(102, 204, 102, 0.8);
        transition: transform 0.05s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.5); }
        to { opacity: 1; transform: scale(1); }
    }

    @keyframes buttonPop {
        0% { transform: scale(1); }
        50% { transform: scale(1.4) rotate(10deg); }
        100% { transform: scale(1); }
    }

    @keyframes fadeInMemo {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    #showButton.fadeOut {
        animation: fadeOut 0.5s forwards;
    }

    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.5); }
    }
`;

        const styleElement = document.createElement('style');
        styleElement.innerHTML = buttonStyle;
        document.head.appendChild(styleElement);

        const wrapper = document.createElement('div');
        wrapper.id = 'buttonWrapper';

        const showButton = document.createElement('button');
        showButton.id = 'showButton';
        showButton.textContent = '＋';
        wrapper.appendChild(showButton);

        const hideButton = document.createElement('button');
        hideButton.textContent = '‐';
        hideButton.style.position = 'fixed';
        hideButton.style.top = '5px';
        hideButton.style.right = '5px';
        hideButton.style.zIndex = '1001';
        hideButton.style.transform = 'scale(-1)';
        hideButton.style.padding = '0px 6px';
        hideButton.style.fontSize = '12px';
        hideButton.style.border = 'none';
        hideButton.style.backgroundColor = '#FF6666';
        hideButton.style.color = '#fff';
        hideButton.style.borderRadius = '3px';
        hideButton.style.cursor = 'pointer';
        hideButton.style.display = memoVisible ? 'block' : 'none';

        memoDiv.style.display = memoVisible ? 'flex' : 'none';
        showButton.style.display = memoVisible ? 'none' : 'block';

        hideButton.addEventListener('click', () => {
            memoVisible = false;
            memoDiv.style.display = 'none';
            hideButton.style.display = 'none';
            showButton.style.display = 'block';
            localStorage.setItem('memoVisible', memoVisible);
            document.body.removeEventListener('click', handleClickOutside);
        });

        showButton.addEventListener('click', () => {
            showButton.style.animation = 'buttonPop 0.5s';

            setTimeout(() => {
                memoVisible = !memoVisible;

                setTimeout(() => {
                    memoDiv.style.display = memoVisible ? 'flex' : 'none';
                }, 70);

                hideButton.style.display = memoVisible ? 'block' : 'none';

                if (memoVisible) {
                    showButton.classList.add('fadeOut');
                    setTimeout(() => {
                        showButton.style.display = 'none';
                    }, 70);

                    document.body.addEventListener('click', handleClickOutside);
                } else {
                    showButton.classList.remove('fadeOut');
                    showButton.style.display = 'block';
                    showButton.style.opacity = '1';

                    document.body.removeEventListener('click', handleClickOutside);
                }

                localStorage.setItem('memoVisible', memoVisible);
            }, 70);
        });


        hideButton.addEventListener('click', () => {
            memoVisible = false;
            memoDiv.style.display = 'none';
            hideButton.style.display = 'none';

            showButton.style.display = 'block';
            showButton.classList.remove('fadeOut');
            showButton.style.opacity = '1';

            localStorage.setItem('memoVisible', memoVisible);

            if (isStarlight) {
                if (memoVisible) {
                    document.body.addEventListener('click', handleClickOutside);
                } else {
                    document.body.removeEventListener('click', handleClickOutside);
                }
            }
        });

        memoHeader.appendChild(splitButton);
        memoHeader.appendChild(hideButton);
        memoDiv.appendChild(memoHeader);
        memoDiv.appendChild(memoContainer);

        document.body.appendChild(memoDiv);
        document.body.appendChild(wrapper);

        updateMemoLayout();

        window.addEventListener('resize', () => {
            if (memoVisible) {
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                const newWidth = Math.min(parseInt(memoDiv.style.width), windowWidth - 20) + 'px';
                const newHeight = Math.min(parseInt(memoDiv.style.height), windowHeight - 50) + 'px';

                memoDiv.style.width = newWidth;
                memoDiv.style.height = newHeight;
            }
        });

        document.body.addEventListener('input', (event) => {
            if (event.target.closest('textarea')) {
                memoBoxChanged = true;
            } else {
                otherChanges = true;
            }
        });

        const buttonIds = ['tempSaveButton', 'saveAndSkuStock', 'registeredSaveAndSkuStock', 'registeredSaveButton'];
        buttonIds.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => {
                });
            }
        });

        if (isStarlight) {
            let productId = new URLSearchParams(window.location.search).get('code');

            const observer = new MutationObserver(() => {
                const params = new URLSearchParams(window.location.search);
                const newProductId = params.get('code');

                if (newProductId !== productId) {
                    productId = newProductId;
                    updateMemoLayout();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }

        function handleClickOutside(event) {
            if (isStarlight && memoVisible && !memoDiv.contains(event.target) && !showButton.contains(event.target)) {
                memoVisible = false;
                memoDiv.style.display = 'none';
                hideButton.style.display = 'none';

                showButton.style.display = 'block';
                showButton.classList.remove('fadeOut');
                showButton.style.opacity = '1';

                localStorage.setItem('memoVisible', memoVisible);

                document.removeEventListener('click', handleClickOutside);
                document.addEventListener('click', handleClickOutside);
            }
        }

        document.addEventListener('click', handleClickOutside);
    }

    function removeUnwantedImgs() {
        'use strict';

        let isScriptActive = false;
        let isHighlightActive = true;

        const LS_KEYS = {
            PINNED: 'rui_pinned',
            HIDDEN: 'rui_hidden',
        };

        const selectorsToRemove = [
            '.sdmap-dynamic-offer-list',
            '.od-pc-offer-recommend',
            '.od-pc-offer-combi-recommend',
            '.od-pc-offer-top-sales',
            '.cht-recommends-detail',
            '.m-auto',
            '.activity-banner-img',
            'div[data-darksite-inline-background-image]',
            'div[style*="background-color: #ffffff;"]',
            'div[id="hd_0_container_0"] > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2)',
            'div[align="hunpi-bf-3690"][style*="width: 790px;"]',
            'a[href^="http://detail.1688.com/offer/"]',
            'div[style*="border-radius: 30px"][style*="width: 60px"][style*="height: 60px"]',
            'map',
            'area[href]',
            'div[style*="width: 164px;"][style*="height: 108px;"][style*="position: absolute;"][style*="top: 22px;"][style*="right: -82px;"][style*="z-index: 1;"]',
            'div[style*="height: 82px;"][style*="width: 162px;"]',
            'img[style*="height: 14px"][style*="margin: 0px"][style*="padding: 0px"]',

            '#shopProductRecommend',
        ];

        (function injectStylesOnce() {
            if (document.getElementById('rui-style')) return;
            const css = `
        .rui-container {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            transition: opacity .2s ease, transform .2s ease;
            pointer-events: auto;
        }
        .rui-container.hidden { display: none; }

        .rui-btn {
            padding: 10px 12px;
            border: none;
            border-radius: 10px;
            color: #fff;
            font:14px/1 Arial, sans-serif;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,.12);
            opacity: .08;
            transform: translateY(0);
            transition: opacity .18s ease, filter .18s ease, box-shadow .18s ease, transform .18s ease;
        }
        .rui-btn:disabled { cursor: not-allowed; }
        #toggleButton { background-color: #4CAF50; }
        #highlightButton { background-color: #FF9800; }

        .rui-container.near .rui-btn,
        .rui-container.pinned .rui-btn,
        .rui-btn:hover,
        .rui-btn:focus {
            opacity: 1;
            filter: saturate(1.1);
            box-shadow: 0 8px 18px rgba(0,0,0,.18);
            transform: translateY(-1px);
        }

        .rui-icon {
            width: 25px; height: 25px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: #333;
            background: #fff;
            border: 1px solid rgba(0,0,0,.08);
            box-shadow: 0 2px 6px rgba(0,0,0,.08);
            cursor: pointer;
            opacity: .4;
            transition: opacity .18s ease, transform .18s ease, box-shadow .18s ease;
        }
        .rui-icon:hover { opacity: .9; transform: translateY(-1px); box-shadow: 0 6px 12px rgba(0,0,0,.12); }
        .rui-toolbar {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
        }
        .rui-pin.active { color: #e91e63; border-color: rgba(233,30,99,.25); }
        .rui-show-chip {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 10000;
            background:#666666e6;
            color: #fff;
            border-radius: 999px;
            padding: 8px 12px;
            font:12px/1 Arial, sans-serif;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,.2);
            opacity: .6;
            transition: opacity .2s ease, transform .2s ease;
        }
        .rui-show-chip:hover { opacity: 1; transform: translateY(-1px); }

        .highlight-overlay {
            position: absolute !important;
            inset: 0;
            background-color: rgba(255, 0, 0, 0.3);
            pointer-events: none;
        }
        `;
            const style = document.createElement('style');
            style.id = 'rui-style';
            style.textContent = css;
            document.head.appendChild(style);
        })();

        function removeElements() {
            if (!isScriptActive) return;

            const tables = document.querySelectorAll('table[border="0"]');
            tables.forEach((table) => {
                const productImages = table.querySelectorAll('.desc-img-loaded');
                let shouldRemoveTable = false;
                productImages.forEach((img) => {
                    const width = img.offsetWidth;
                    if (width <= 301) shouldRemoveTable = true;
                });
                if (shouldRemoveTable) table.remove();
            });

            selectorsToRemove.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach((element) => {
                    if (
                        !element.closest('div.sku-item-wrapper') &&
                        !element.closest('div[style="width: 790px; position: relative;"]')
                    ) {
                        element.remove();
                    }
                });
            });

            const descImages = document.querySelectorAll('.desc-img-loaded');
            descImages.forEach((img) => {
                const width = img.offsetWidth;
                const height = img.offsetHeight;
                if (width <= 200 && height <= 200) img.remove();
            });

            const specialDivs = document.querySelectorAll('div[style*="background: url"][style*="width: 164px"][style*="height: 108px"]');
            specialDivs.forEach((div) => div.remove());

            const toggleButton = document.getElementById('toggleButton');
            if (toggleButton) {
                toggleButton.innerText = '削除済み';
                toggleButton.style.backgroundColor = '#B0BEC5';
                toggleButton.style.cursor = 'default';
                toggleButton.disabled = true;
            }
        }

        function highlightElements() {
            if (!isHighlightActive) return;

            const tables = document.querySelectorAll('table[border="0"]');
            tables.forEach((table) => {
                const productImages = table.querySelectorAll('.desc-img-loaded');
                let shouldHighlightTable = false;
                productImages.forEach((img) => {
                    const width = img.offsetWidth;
                    if (width <= 301) shouldHighlightTable = true;
                });
                if (shouldHighlightTable) {
                    table.style.position = 'relative';
                    const overlay = document.createElement('div');
                    overlay.classList.add('highlight-overlay');
                    table.appendChild(overlay);
                }
            });

            selectorsToRemove.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach((element) => {
                    if (!element.classList.contains('highlight-overlay')) {
                        element.style.position = element.style.position || 'relative';
                        const overlay = document.createElement('div');
                        overlay.classList.add('highlight-overlay');
                        element.appendChild(overlay);
                    }
                });
            });

            const imgElements = document.querySelectorAll('img[usemap]');
            imgElements.forEach((imgElement) => {
                if (!imgElement.classList.contains('highlight-overlay')) {
                    imgElement.style.position = imgElement.style.position || 'relative';
                    const overlay = document.createElement('div');
                    overlay.classList.add('highlight-overlay');
                    overlay.style.backgroundColor = 'rgba(0, 0, 255, 0.3)';
                    imgElement.appendChild(overlay);
                }
            });

            highlightMapAreas();
        }

        function highlightMapAreas() {
            const areas = document.querySelectorAll('area[href]');
            areas.forEach((area) => {
                const coords = area.coords.split(',').map(Number);
                const mapName = area.parentElement && area.parentElement.name;
                const img = mapName ? document.querySelector(`img[usemap="#${mapName}"]`) : null;

                if (img && coords.length === 4) {
                    const overlay = document.createElement('div');
                    overlay.style.position = 'absolute';
                    overlay.style.top = `${coords[1]}px`;
                    overlay.style.left = `${coords[0]}px`;
                    overlay.style.width = `${coords[2] - coords[0]}px`;
                    overlay.style.height = `${coords[3] - coords[1]}px`;
                    overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
                    overlay.style.pointerEvents = 'none';
                    overlay.classList.add('highlight-overlay');
                    img.parentElement.style.position = img.parentElement.style.position || 'relative';
                    img.parentElement.appendChild(overlay);
                }
            });
        }

        function removeHighlight() {
            document.querySelectorAll('.highlight-overlay').forEach(el => el.remove());
        }

        function toggleScript() {
            isScriptActive = !isScriptActive;
            if (isScriptActive) removeElements();
        }

        function toggleHighlight() {
            isHighlightActive = !isHighlightActive;
            const highlightButton = document.getElementById('highlightButton');
            if (isHighlightActive) {
                if (highlightButton) highlightButton.innerText = 'ハイライト停止';
                highlightElements();
            } else {
                if (highlightButton) highlightButton.innerText = 'ハイライト開始';
                removeHighlight();
            }
        }

        let ui = {
            container: null,
            toolbar: null,
            toggleBtn: null,
            highlightBtn: null,
            pinBtn: null,
            hideBtn: null,
            showChip: null,
        };

        function createUI() {
            ui.container = document.createElement('div');
            ui.container.className = 'rui-container';
            document.body.appendChild(ui.container);

            ui.toolbar = document.createElement('div');
            ui.toolbar.className = 'rui-toolbar';
            ui.container.appendChild(ui.toolbar);

            ui.pinBtn = document.createElement('button');
            ui.pinBtn.className = 'rui-icon rui-pin';
            ui.pinBtn.title = 'ピン留め';
            ui.pinBtn.setAttribute('aria-pressed', 'false');
            ui.pinBtn.textContent = '📌';
            ui.toolbar.appendChild(ui.pinBtn);

            ui.hideBtn = document.createElement('button');
            ui.hideBtn.className = 'rui-icon rui-hide';
            ui.hideBtn.title = '隠す';
            ui.hideBtn.textContent = '⤫';
            ui.toolbar.appendChild(ui.hideBtn);

            ui.toggleBtn = document.createElement('button');
            ui.toggleBtn.id = 'toggleButton';
            ui.toggleBtn.className = 'rui-btn';
            ui.toggleBtn.textContent = '画像を削除';
            ui.toggleBtn.disabled = true;
            ui.container.appendChild(ui.toggleBtn);

            ui.highlightBtn = document.createElement('button');
            ui.highlightBtn.id = 'highlightButton';
            ui.highlightBtn.className = 'rui-btn';
            ui.highlightBtn.textContent = 'ハイライト停止';
            ui.highlightBtn.disabled = true;
            ui.container.appendChild(ui.highlightBtn);

            ui.showChip = document.createElement('div');
            ui.showChip.className = 'rui-show-chip';
            ui.showChip.textContent = '表示';
            ui.showChip.style.display = 'none';
            document.body.appendChild(ui.showChip);

            ui.toggleBtn.addEventListener('click', toggleScript);
            ui.highlightBtn.addEventListener('click', toggleHighlight);
            ui.pinBtn.addEventListener('click', onTogglePinned);
            ui.hideBtn.addEventListener('click', onHideUI);
            ui.showChip.addEventListener('click', onShowUI);

            restorePinnedHiddenState();

            initProximity();
        }

        function isPinned() { return localStorage.getItem(LS_KEYS.PINNED) === '1'; }
        function setPinned(v) { localStorage.setItem(LS_KEYS.PINNED, v ? '1' : '0'); }
        function isHidden() { return localStorage.getItem(LS_KEYS.HIDDEN) === '1'; }
        function setHidden(v) { localStorage.setItem(LS_KEYS.HIDDEN, v ? '1' : '0'); }

        function updatePinUI() {
            const pinned = isPinned();
            ui.pinBtn.textContent = pinned ? '📍' : '📌';
            ui.pinBtn.title = pinned ? 'ピン解除' : 'ピン留め';
            ui.pinBtn.setAttribute('aria-pressed', pinned ? 'true' : 'false');
            ui.pinBtn.classList.toggle('active', pinned);
            ui.container.classList.toggle('pinned', pinned);
        }

        function restorePinnedHiddenState() {
            updatePinUI();
            if (isHidden()) {
                ui.container.classList.add('hidden');
                ui.showChip.style.display = 'block';
            } else {
                ui.container.classList.remove('hidden');
                ui.showChip.style.display = 'none';
            }
        }

        function onTogglePinned() {
            const next = !isPinned();
            setPinned(next);
            restorePinnedHiddenState();
        }

        function onHideUI() {
            setHidden(true);
            restorePinnedHiddenState();
        }

        function onShowUI() {
            setHidden(false);
            restorePinnedHiddenState();
            ui.container.classList.add('near');
            setTimeout(() => ui.container.classList.remove('near'), 1200);
        }

        function initProximity() {
            const THRESHOLD = 160;
            let raf = null;

            function measureNear(mouseX, mouseY) {
                if (!ui.container || isHidden() || isPinned()) {
                    if (ui.container && isPinned()) ui.container.classList.add('near');
                    return;
                }
                const rect = ui.container.getBoundingClientRect();
                const dx = (mouseX < rect.left) ? rect.left - mouseX : (mouseX > rect.right) ? mouseX - rect.right : 0;
                const dy = (mouseY < rect.top) ? rect.top - mouseY : (mouseY > rect.bottom) ? mouseY - rect.bottom : 0;
                const dist = Math.hypot(dx, dy);
                if (dist <= THRESHOLD) ui.container.classList.add('near');
                else ui.container.classList.remove('near');
            }

            function onMove(e) {
                if (raf) cancelAnimationFrame(raf);
                const x = e.clientX, y = e.clientY;
                raf = requestAnimationFrame(() => measureNear(x, y));
            }

            window.addEventListener('mousemove', onMove, { passive: true });
            ui.container.classList.toggle('near', isPinned());
        }

        function enableMainButtons() {
            if (ui.toggleBtn) {
                ui.toggleBtn.disabled = false;
                ui.toggleBtn.style.cursor = 'pointer';
            }
            if (ui.highlightBtn) {
                ui.highlightBtn.disabled = false;
                ui.highlightBtn.style.cursor = 'pointer';
            }
        }

        createUI();

        window.addEventListener('load', () => {
            highlightElements();
            enableMainButtons();
        });
    }

    function loadAllImages() {
        (function () {
            'use strict';

            function deepQueryAll(root, selector) {
                const out = Array.from(root.querySelectorAll(selector));
                for (const el of root.querySelectorAll('*')) {
                    if (el.shadowRoot) out.push(...deepQueryAll(el.shadowRoot, selector));
                }
                return out;
            }

            function getRoots() {
                const roots = [];
                const classic = document.querySelector('.content-detail');
                if (classic) roots.push(classic);

                document.querySelectorAll('.html-description').forEach(h => {
                    if (h.shadowRoot) roots.push(h.shadowRoot);
                    else roots.push(h);
                });

                document.querySelectorAll('template[shadowrootmode="open"]').forEach(tpl => {
                    if (tpl.content) roots.push(tpl.content);
                });

                if (!roots.length) roots.push(document);
                return roots;
            }

            function pickFromSrcset(srcset) {
                try {
                    const items = srcset.split(',').map(s => s.trim()).map(s => {
                        const [url, desc] = s.split(/\s+/);
                        const score = desc?.endsWith('x') ? parseFloat(desc)
                        : desc?.endsWith('w') ? parseFloat(desc)
                        : 1;
                        return { url, score: isNaN(score) ? 1 : score };
                    }).sort((a,b)=>b.score-a.score);
                    return items[0]?.url || '';
                } catch { return ''; }
            }

            function resolveUrl(img) {
                const dataAttrs = [
                    'data-lazyload-src',
                    'data-src',
                    'data-origin',
                    'data-lazysrc',
                    'data-original',
                ];
                for (const a of dataAttrs) {
                    const v = img.getAttribute(a);
                    if (v) return { url: v, via: 'data' };
                }
                const srcset = img.getAttribute('srcset');
                if (srcset) {
                    const best = pickFromSrcset(srcset);
                    if (best) return { url: best, via: 'srcset' };
                }
                if (img.currentSrc) return { url: img.currentSrc, via: 'currentSrc' };
                if (img.src)       return { url: img.src, via: 'src' };
                return { url: '', via: 'none' };
            }

            function fixImage(img) {
                img.loading = 'eager';
                img.decoding = 'async';
                try { img.fetchPriority = 'high'; } catch(_) {}

                const { url: finalUrl, via } = resolveUrl(img);
                if (!finalUrl) return;

                if (via === 'srcset') {
                    img.setAttribute('src', finalUrl);
                    if (img.hasAttribute('srcset')) img.removeAttribute('srcset');
                    if (img.hasAttribute('sizes'))  img.removeAttribute('sizes');
                } else {
                    img.setAttribute('src', finalUrl);
                    if (img.hasAttribute('srcset')) img.removeAttribute('srcset');
                    if (img.hasAttribute('sizes'))  img.removeAttribute('sizes');
                }

                ['data-lazyload-src','data-src','data-origin','data-lazysrc','data-original']
                    .forEach(a => img.removeAttribute(a));

                img.style.setProperty('width', 'auto', 'important');
                img.style.setProperty('height', 'auto', 'important');
                img.style.setProperty('opacity', '1', 'important');
                img.style.setProperty('visibility', 'visible', 'important');

                const obs = new MutationObserver(muts => {
                    for (const m of muts) {
                        if (m.type === 'attributes') {
                            if (m.attributeName === 'src' && img.getAttribute('src') !== finalUrl) {
                                img.setAttribute('src', finalUrl);
                            }
                            if (m.attributeName === 'srcset' && img.hasAttribute('srcset')) {
                                img.removeAttribute('srcset');
                            }
                        }
                    }
                });
                obs.observe(img, { attributes: true, attributeFilter: ['src','srcset'] });
            }

            function run() {
                const roots = getRoots();
                const imgs = [];
                for (const r of roots) imgs.push(...deepQueryAll(r, 'img'));
                const uniq = Array.from(new Set(imgs));
                uniq.forEach(fixImage);
            }

            if (document.readyState === 'complete') run();
            else window.addEventListener('load', run, { once: true });
        })();
    }

    function dlMergedImgs() {
        'use strict';

        (function injectStylesOnce() {
            if (document.getElementById('mgi-style')) return;
            const css = `
      .mgi-container{
        position:fixed; left:20px; bottom:20px; z-index:10000;
        display:flex; flex-direction:column; gap:10px; align-items:flex-start;
        transition:opacity .18s ease, transform .18s ease; pointer-events:auto;
      }
      .mgi-container.hidden{ display:none; }
      .mgi-toolbar{ display:flex; gap:8px; justify-content:flex-start; }

      .mgi-icon{
        width:25px;height:25px;border-radius:50%;
        display:inline-flex;align-items:center;justify-content:center;
        font-size:16px;color:#333;background:#fff;border:1px solid rgba(0,0,0,.08);
        box-shadow:0 2px 6px rgba(0,0,0,.08); cursor:pointer; opacity:.4;
        transition:opacity .18s ease, transform .18s ease, box-shadow .18s ease;
      }
      .mgi-icon:hover{ opacity:.9; transform:translateY(-1px); box-shadow:0 6px 12px rgba(0,0,0,.12); }
      .mgi-pin.active{ color:#e91e63; border-color:rgba(233,30,99,.25); }

      .mgi-btn{
        display:inline-flex; align-items:center; justify-content:center;
        width:auto; white-space:nowrap; align-self:flex-start;
        padding:10px 12px; border:none; border-radius:10px;
        color:#fff; font:14px/1 Arial, sans-serif; cursor:pointer;
        box-shadow:0 4px 6px rgba(0,0,0,.12); background:#4CAF50;
        opacity:.08; transform:translateY(0);
        transition:opacity .18s ease, filter .18s ease, box-shadow .18s ease, transform .18s ease, background-color .18s ease;
      }
      .mgi-btn:hover, .mgi-btn:focus{ filter:saturate(1.05); transform:translateY(-1px); }
      .mgi-container.near .mgi-btn, .mgi-container.pinned .mgi-btn{ opacity:1; }
      .mgi-btn.processing{ background:#FFA500; cursor:not-allowed; }
      .mgi-btn.complete{ background:#008CBA; }

      .mgi-show-chip{
        position:fixed; left:20px; bottom:20px; z-index:10000;
        background:#666666e6;color:#fff;border-radius:999px;padding:8px 12px;
        font:12px/1 Arial, sans-serif; cursor:pointer; box-shadow:0 4px 8px rgba(0,0,0,.2); opacity:.6;
        transition:opacity .18s ease, transform .18s ease;
      }
      .mgi-show-chip:hover{ opacity:1; transform:translateY(-1px); }
    `;
            const style = document.createElement('style');
            style.id = 'mgi-style';
            style.textContent = css;
            document.head.appendChild(style);
        })();

        const LS_KEYS = { PINNED: 'mgi_pinned', HIDDEN: 'mgi_hidden' };
        const isPinned = () => localStorage.getItem(LS_KEYS.PINNED) === '1';
        const setPinned = (v) => localStorage.setItem(LS_KEYS.PINNED, v ? '1' : '0');
        const isHidden = () => localStorage.getItem(LS_KEYS.HIDDEN) === '1';
        const setHidden = (v) => localStorage.setItem(LS_KEYS.HIDDEN, v ? '1' : '0');

        const ui = {
            container: document.createElement('div'),
            toolbar: document.createElement('div'),
            pinBtn: document.createElement('button'),
            hideBtn: document.createElement('button'),
            showChip: document.createElement('div'),
            mergeBtn: document.createElement('button'),
        };

        ui.container.className = 'mgi-container';
        ui.toolbar.className = 'mgi-toolbar';

        ui.pinBtn.className = 'mgi-icon mgi-pin';
        ui.pinBtn.title = 'ピン留め';
        ui.pinBtn.setAttribute('aria-pressed', 'false');
        ui.pinBtn.textContent = '📌';

        ui.hideBtn.className = 'mgi-icon mgi-hide';
        ui.hideBtn.title = '隠す';
        ui.hideBtn.textContent = '⤫';

        ui.mergeBtn.id = 'mgi-download-btn';
        ui.mergeBtn.className = 'mgi-btn';
        ui.mergeBtn.textContent = '結合画像 ⬇️';

        ui.showChip.className = 'mgi-show-chip';
        ui.showChip.textContent = '表示';
        ui.showChip.style.display = 'none';

        ui.toolbar.appendChild(ui.pinBtn);
        ui.toolbar.appendChild(ui.hideBtn);
        ui.container.appendChild(ui.toolbar);
        ui.container.appendChild(ui.mergeBtn);
        document.body.appendChild(ui.container);
        document.body.appendChild(ui.showChip);

        function updatePinUI() {
            const pinned = isPinned();
            ui.pinBtn.textContent = pinned ? '📍' : '📌';
            ui.pinBtn.title = pinned ? 'ピン解除' : 'ピン留め';
            ui.pinBtn.setAttribute('aria-pressed', pinned ? 'true' : 'false');
            ui.pinBtn.classList.toggle('active', pinned);
            ui.container.classList.toggle('pinned', pinned);
        }

        function restorePinnedHiddenState() {
            updatePinUI();
            if (isHidden()) {
                ui.container.classList.add('hidden');
                ui.showChip.style.display = 'block';
            } else {
                ui.container.classList.remove('hidden');
                ui.showChip.style.display = 'none';
            }
        }
        function onTogglePinned(){ setPinned(!isPinned()); restorePinnedHiddenState(); }
        function onHideUI(){ setHidden(true); restorePinnedHiddenState(); }
        function onShowUI(){
            setHidden(false); restorePinnedHiddenState();
            ui.container.classList.add('near'); setTimeout(()=>ui.container.classList.remove('near'), 1200);
        }
        ui.pinBtn.addEventListener('click', onTogglePinned);
        ui.hideBtn.addEventListener('click', onHideUI);
        ui.showChip.addEventListener('click', onShowUI);
        restorePinnedHiddenState();

        (function initProximity(){
            const THRESHOLD = 160;
            let raf = null;
            function measureNear(x, y){
                if (!ui.container || isHidden() || isPinned()){
                    if (ui.container && isPinned()) ui.container.classList.add('near');
                    return;
                }
                const r = ui.container.getBoundingClientRect();
                const dx = (x < r.left) ? r.left - x : (x > r.right) ? x - r.right : 0;
                const dy = (y < r.top) ? r.top - y : (y > r.bottom) ? y - r.bottom : 0;
                const dist = Math.hypot(dx, dy);
                if (dist <= THRESHOLD) ui.container.classList.add('near');
                else ui.container.classList.remove('near');
            }
            function onMove(e){
                if (raf) cancelAnimationFrame(raf);
                const x = e.clientX, y = e.clientY;
                raf = requestAnimationFrame(()=>measureNear(x, y));
            }
            window.addEventListener('mousemove', onMove, { passive:true });
            ui.container.classList.toggle('near', isPinned());
        })();

        function pickFromSrcset(srcset){
            try{
                const items = srcset.split(',').map(s=>s.trim()).map(s=>{
                    const [url, desc] = s.split(/\s+/);
                    const score = desc?.endsWith('x') ? parseFloat(desc) :
                    (desc?.endsWith('w') ? parseFloat(desc) : 1);
                    return { url, score: isNaN(score) ? 1 : score };
                }).sort((a,b)=>b.score-a.score);
                return items[0]?.url || '';
            }catch{ return ''; }
        }
        function resolveImgUrl(img){
            return (
                img.currentSrc ||
                img.src ||
                img.getAttribute('data-src') ||
                img.getAttribute('data-original') ||
                img.getAttribute('data-lazy') ||
                (img.getAttribute('srcset') ? pickFromSrcset(img.getAttribute('srcset')) : '') ||
                ''
            );
        }
        function loadImage(url){
            return new Promise((resolve, reject)=>{
                const im = new Image();
                im.crossOrigin = 'anonymous';
                im.onload = ()=>resolve(im);
                im.onerror = reject;
                im.src = url;
            });
        }
        function mergeImages(images){
            if (!images.length) return null;
            const maxW = Math.max(...images.map(i => i.naturalWidth || i.width || 0));
            const totalH = images.reduce((s,i)=> s + (i.naturalHeight || i.height || 0), 0);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = maxW; canvas.height = totalH;
            let y = 0;
            for (const i of images){
                const w = i.naturalWidth || i.width;
                const h = i.naturalHeight || i.height;
                ctx.drawImage(i, 0, y, w, h);
                y += h;
            }
            return canvas;
        }
        function deepQueryAll(root, selector){
            const out = Array.from(root.querySelectorAll(selector));
            for (const el of root.querySelectorAll('*')){
                if (el.shadowRoot) out.push(...deepQueryAll(el.shadowRoot, selector));
            }
            return out;
        }
        function getCandidateRoots(){
            const roots = [];
            const classic = document.querySelector('.content-detail');
            if (classic) roots.push(classic);
            document.querySelectorAll('.html-description').forEach(h=>{
                if (h.shadowRoot) roots.push(h.shadowRoot);
                else roots.push(h);
            });
            document.querySelectorAll('template[shadowrootmode="open"]').forEach(tpl=>{
                if (tpl.content) roots.push(tpl.content);
            });
            if (!roots.length) roots.push(document);
            return roots;
        }
        async function collectAndLoadImages(){
            const roots = getCandidateRoots();
            const imgEls = [];
            for (const r of roots) imgEls.push(...deepQueryAll(r, 'img'));
            const uniq = Array.from(new Set(imgEls));
            const loaded = [];
            for (const el of uniq){
                const url = resolveImgUrl(el);
                if (!url) continue;
                try{
                    const im = await loadImage(url);
                    if (im.naturalWidth && im.naturalHeight) loaded.push(im);
                }catch{ /* skip */ }
            }
            return loaded;
        }

        ui.mergeBtn.addEventListener('click', async ()=>{
            if (ui.mergeBtn.classList.contains('processing')) return;
            ui.mergeBtn.textContent = '処理中…';
            ui.mergeBtn.classList.add('processing');

            try{
                const images = await collectAndLoadImages();
                if (!images.length){
                    ui.mergeBtn.textContent = '画像が見つかりません';
                    ui.mergeBtn.classList.remove('processing');
                    return;
                }
                const canvas = mergeImages(images);
                if (!canvas){
                    ui.mergeBtn.textContent = '結合失敗';
                    ui.mergeBtn.classList.remove('processing');
                    return;
                }
                const a = document.createElement('a');
                a.download = 'merged_image.jpg';
                a.href = canvas.toDataURL('image/jpeg');
                a.click();
                ui.mergeBtn.textContent = 'ダウンロード開始！';
                ui.mergeBtn.classList.remove('processing');
                ui.mergeBtn.classList.add('complete');
            }catch(e){
                ui.mergeBtn.textContent = 'エラー';
                ui.mergeBtn.classList.remove('processing');
            }
            setTimeout(()=>{
                ui.mergeBtn.textContent = '結合画像 ⬇️';
                ui.mergeBtn.classList.remove('complete');
            }, 3000);
        }, { passive:true });
    }

    function imgSizeCheck(){

        var allImages = [];
        var targetElement = document.querySelector('.col-xs-4.col-sm-6.col-md-5.col-lg-4');
        var hasRedBorder = false;

        function checkForImages(node) {
            if (node.nodeType === 1 && node.tagName === 'IMG') {
                if (node.complete) {
                    processImage(node);
                } else {
                    node.addEventListener('load', function() {
                        processImage(node);
                    });
                }
            } else if (node.nodeType === 1 && node.hasChildNodes()) {
                node.childNodes.forEach(checkForImages);
            }
        }

        function processImage(img) {
            if (img.naturalWidth === 0 || img.naturalHeight === 0) {
                setTimeout(() => processImage(img), 100);
                return;
            }

            if (isExcludedStructure(img)) {
                return;
            }

            removeExistingSizeInfo(img);
            displayImageSize(img);
            updateImageList();
            addRedBorderIfNeeded();
            updateButtonDisplay();
        }

        function isExcludedStructure(img) {
            return img.closest('ul.list-group') !== null;
        }

        function removeExistingSizeInfo(img) {
            var parent = img.parentNode;
            var existingSizeInfo = parent.querySelector('.size-info');
            if (existingSizeInfo) {
                parent.removeChild(existingSizeInfo);
            }
        }

        function displayImageSize(img) {
            var sizeInfo = document.createElement('div');
            sizeInfo.className = 'size-info';
            sizeInfo.textContent = img.naturalWidth + '×' + img.naturalHeight;

            var parent = img.parentNode;
            parent.style.position = 'relative';
            parent.appendChild(sizeInfo);
        }

        function updateImageList() {
            allImages = [];
            var images = targetElement.querySelectorAll('img');
            images.forEach(img => {
                if (img.naturalWidth !== 0 && img.naturalHeight !== 0) {
                    allImages.push({
                        element: img,
                        width: img.naturalWidth,
                        height: img.naturalHeight
                    });
                }
            });
        }

        function addRedBorderIfNeeded() {
            hasRedBorder = false;

            if (allImages.length < 2) {
                allImages.forEach(img => {
                    var redBorder = img.width < 500 || img.height / img.width > 1.5;
                    img.element.style.border = redBorder ? '2px solid red' : 'none';
                    if (redBorder) hasRedBorder = true;
                });
                return;
            }

            var minWidth = Math.min(...allImages.map(img => img.width));
            var maxWidth = Math.max(...allImages.map(img => img.width));
            var widthDifference = maxWidth / minWidth > 2;

            allImages.forEach(img => {
                var redBorder = img.width < 500 ||
                    (widthDifference && (img.width === minWidth || img.width === maxWidth)) ||
                    (img.height / img.width > 1.5);
                img.element.style.border = redBorder ? '2px solid red' : 'none';
                if (redBorder) hasRedBorder = true;
            });
        }

        function updateButtonDisplay() {
            const targetButton = document.querySelector('button.btn.btn-primary.btn-lg.fullWidth.vMiddle.mb10');
            if (!targetButton) return;

            if (hasRedBorder) {
                targetButton.innerHTML = `⚠️注意⚠️ サイズ修正が必要な画像があります<br><i class="fa fa-floppy-o"></i> 強制的に保存する`;

                const originalClickHandler = targetButton.onclick;
                const existingOverlayButton = targetButton.parentElement.querySelector('.overlay-button');
                if (existingOverlayButton) {
                    existingOverlayButton.remove();
                }

                const overlayButton = document.createElement('button');
                overlayButton.classList.add('overlay-button');
                targetButton.parentElement.appendChild(overlayButton);

                overlayButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    showCustomAlert(
                        'サイズの修正が必要な画像がありますが、本当にこのまま保存しますか？',
                        function() {
                            if (originalClickHandler) {
                                originalClickHandler.call(targetButton);
                            } else {
                                targetButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                            }
                        }
                    );
                }, true);
            } else {
                targetButton.innerHTML = '<i class="fa fa-floppy-o"></i> 保存';
                const overlayButton = targetButton.parentElement.querySelector('.overlay-button');
                if (overlayButton) {
                    overlayButton.remove();
                }
            }
        }

        function showCustomAlert(message, onConfirm) {
            const overlay = document.createElement('div');
            overlay.classList.add('custom-alert-overlay');

            const alertBox = document.createElement('div');
            alertBox.classList.add('custom-alert-box');

            const title = document.createElement('div');
            title.classList.add('custom-alert-title');
            title.textContent = '⚠️ 警告 ⚠️';
            alertBox.appendChild(title);

            const alertMessage = document.createElement('div');
            alertMessage.classList.add('custom-alert-message');
            alertMessage.textContent = message;
            alertBox.appendChild(alertMessage);

            const confirmButton = document.createElement('button');
            confirmButton.classList.add('custom-alert-button');
            confirmButton.textContent = 'このまま保存する';
            confirmButton.addEventListener('click', function() {
                document.body.removeChild(overlay);
                if (onConfirm) onConfirm();
            });
            alertBox.appendChild(confirmButton);

            const cancelButton = document.createElement('button');
            cancelButton.classList.add('custom-alert-button');
            cancelButton.textContent = 'キャンセル';
            cancelButton.addEventListener('click', function() {
                document.body.removeChild(overlay);
            });
            alertBox.appendChild(cancelButton);

            overlay.appendChild(alertBox);
            document.body.appendChild(overlay);
        }

        function init() {
            targetElement.querySelectorAll('img').forEach(checkForImages);

            updateImageList();
            addRedBorderIfNeeded();
            updateButtonDisplay();

            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach(function(node) {
                            checkForImages(node);
                        });
                    }
                    if (mutation.removedNodes.length || mutation.type === 'attributes') {
                        updateImageList();
                        addRedBorderIfNeeded();
                        if (mutation.target.tagName === 'IMG') {
                            processImage(mutation.target);
                        }
                        updateButtonDisplay();
                    }
                });
            });

            observer.observe(targetElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
        }

        const style = document.createElement('style');
        style.textContent = `
        .col-lg-1-5.col-md-3.col-sm-4.col-xs-12.mb10.grid-img { margin-bottom: 1px !important; }
        .size-info {
            position: absolute;
            bottom: 35px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            font-size: 12px;
            padding: 1px 4px;
            text-align: center;
            pointer-events: none;
            border-radius: 5px;
        }
        .custom-alert-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        .custom-alert-box {
            background-color: #cccccc;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            font-family: sans-serif;
            width: 300px;
        }
        .custom-alert-title {
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 10px;
        }
        .custom-alert-message {
            margin-bottom: 20px;
            font-size: 14px;
        }
        .custom-alert-button {
            padding: 8px 16px;
            margin: 5px;
            border: 1px solid #000;
            border-radius: 5px;
            background-color: #f0f0f0;
            font-size: 14px;
            cursor: pointer;
        }
        .custom-alert-button:hover { background-color: #e0e0e0; }
        .overlay-button {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: transparent;
            z-index: 10001;
            cursor: pointer;
            border: none;
            outline: none;
        }
    `;
        document.head.appendChild(style);

        if (targetElement) {
            init();
        }
    }

    function enhanceNewAlpha(){

        const css = `
        .zoomed-image {
            position: absolute;
            border: 7px solid #191919;
            z-index: 10000;
            pointer-events: none;
            display: none;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            transition: opacity 0.3s;
        }

        .settings-icon {
            position: fixed;
            right: 20px;
            bottom: 20px;
            font-size: 24px;
            cursor: pointer;
            z-index: 1001;
        }

        .settings-menu {
            position: fixed;
            right: 20px;
            bottom: 60px;
            border: 1px solid #ccc;
            background: white;
            padding: 10px;
            box-shadow: 0px 0px 5px rgba(0,0,0,0.5);
            display: none;
            z-index: 1002;
            max-width: 300px;
        }

        .settings-label {
            margin-bottom: 10px;
            font-weight: bold;
        }

        .settings-input-label {
            font-weight: normal;
            margin-right: 10px;
            white-space: nowrap;
        }

        .settings-input-label.shift-right {
            margin-right: 18.5px;
        }

        .settings-input {
            width: 80px;
            padding: 5px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            vertical-align: middle;
        }

        .mode-option {
            cursor: pointer;
            padding: 5px;
            border: 1px solid #ccc;
            margin-bottom: 5px;
            text-align: center;
            background: #fff;
            color: black;
            transition: background 0.3s;
        }

        .mode-option.hover {
            background: #f1f1f1;
        }

        .mode-option.selected {
            background: #007bff;
            color: white;
        }

        .zoom-position-option {
            cursor: pointer;
            padding: 5px;
            border: 1px solid #ccc;
            margin-bottom: 5px;
            text-align: center;
            background: #fff;
            color: black;
            transition: background 0.3s;
        }

        .zoom-position-option.hover {
            background: #f1f1f1;
        }

        .zoom-position-option.selected {
            background: #007bff;
            color: white;
        }

        .settings-input {
            width: 60px;
            padding: 5px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            margin-right: 5px;
        }

        .settings-input-label {
            font-weight: normal;
            margin-right: 20px;
        }

        .transparency-slider {
            width: 100%;
            margin-top: 10px;
        }

        .reset-button {
            cursor: pointer;
            padding: 10px;
            border: 1px solid;
            background: #4CAF50;
            color: white;
            text-align: center;
            margin-top: 10px;
            transition: background 0.3s, border 0.3s;
        }

        .reset-button:hover {
            background: #45a049;
            border-color: #45a049;
        }

        .reset-button.disabled {
            background: #e0e0e0;
            border-color: #bbb;
            color: #555;
            cursor: default;
        }

        .reset-button.enabled {
            background: #4CAF50;
            border-color: #4CAF50;
        }

    `;

        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);

        let path = window.location.pathname;
        let productID = path.split('/').pop();
        document.title = `${productID} / Plusnao Web System`;

        var newButton = document.createElement('button');
        newButton.type = 'button';
        newButton.className = 'btn btn-sm btn-default';
        newButton.innerHTML = '<i class="fa fa-new-icon"></i>テンプレート画像';

        var defaultStyles = {
            webkitTextSizeAdjust: '100%',
            webkitTapHighlightColor: 'rgba(0,0,0,0)',
            boxSizing: 'border-box',
            margin: '0 5px',
            font: 'inherit',
            overflow: 'visible',
            textTransform: 'none',
            webkitAppearance: 'button',
            fontFamily: 'inherit',
            display: 'inline-block',
            marginBottom: '0',
            fontWeight: '400',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            verticalAlign: 'middle',
            touchAction: 'manipulation',
            cursor: 'pointer',
            userSelect: 'none',
            backgroundImage: 'none',
            border: '1px solid transparent',
            color: '#333',
            backgroundColor: '#fff',
            borderColor: '#ccc',
            padding: '5px 10px',
            fontSize: '12px',
            lineHeight: '1.5',
            borderRadius: '3px',
            outline: 'none'
        };

        var pressedStyles = {
            backgroundColor: '#e6e6e6',
            borderColor: '#adadad',
            outline: '5px auto -webkit-focus-ring-color',
            outlineOffset: '-2px'
        };

        function applyStyles(element, styles) {
            for (var property in styles) {
                if (styles.hasOwnProperty(property)) {
                    element.style[property] = styles[property];
                }
            }
        }

        function handleEscKey(event) {
            if (event.key === 'Escape') {
                var existingModal = document.querySelector('#image-modal');
                if (existingModal) {
                    document.body.removeChild(existingModal);
                    applyStyles(newButton, defaultStyles);
                }
            }
        }

        function showModalWithImages(imageUrls) {
            var existingModal = document.querySelector('#image-modal');
            if (existingModal) {
                document.body.removeChild(existingModal);
                applyStyles(newButton, defaultStyles);
                return;
            }

            var modal = document.createElement('div');
            modal.id = 'image-modal';
            modal.style.position = 'fixed';
            modal.style.top = '50%';
            modal.style.right = '10px';
            modal.style.transform = 'translateY(-50%)';
            modal.style.width = '400px';
            modal.style.backgroundColor = '#fff';
            modal.style.padding = '20px';
            modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            modal.style.zIndex = '1000';
            modal.style.borderRadius = '5px';
            modal.style.overflowY = 'auto';
            modal.style.maxHeight = '90%';
            modal.style.display = 'grid';
            modal.style.gridTemplateColumns = 'repeat(4, 1fr)';
            modal.style.gap = '10px';
            modal.style.border = '2px solid #ccc';

            imageUrls.forEach(function(url) {
                var img = document.createElement('img');
                img.src = url;
                img.draggable = true;
                img.className = 'w80 img-thumbnail';
                img.title = '';
                img.style.display = 'block';
                img.style.marginBottom = '10px';
                img.style.cursor = 'pointer';
                modal.appendChild(img);

                img.addEventListener('dblclick', function() {
                    var uploadArea = document.querySelector('#uploadArea');
                    if (uploadArea) {
                        fetch(url)
                            .then(res => res.blob())
                            .then(blob => {
                            var file = new File([blob], url.split('/').pop(), { type: blob.type });

                            var dataTransfer = new DataTransfer();
                            dataTransfer.items.add(file);

                            ['dragenter', 'dragover', 'drop'].forEach(eventType => {
                                var event = new DragEvent(eventType, {
                                    bubbles: true,
                                    cancelable: true,
                                    dataTransfer: dataTransfer
                                });
                                uploadArea.dispatchEvent(event);
                            });
                        });
                    }
                });
            });

            var closeButton = document.createElement('button');
            closeButton.innerText = 'Close';
            closeButton.style.gridColumn = 'span 4';
            closeButton.style.marginTop = '10px';
            closeButton.style.padding = '5px 10px';
            closeButton.style.border = 'none';
            closeButton.style.backgroundColor = '#c9302c';
            closeButton.style.color = '#fff';
            closeButton.style.borderRadius = '3px';
            closeButton.style.cursor = 'pointer';

            closeButton.addEventListener('click', function() {
                document.body.removeChild(modal);
                applyStyles(newButton, defaultStyles);
            });

            modal.appendChild(closeButton);
            document.body.appendChild(modal);
            applyStyles(newButton, pressedStyles);

            window.addEventListener('keydown', handleEscKey);
        }

        newButton.addEventListener('click', function() {
            var existingModal = document.querySelector('#image-modal');
            if (existingModal) {
                document.body.removeChild(existingModal);
                applyStyles(newButton, defaultStyles);
                return;
            }

            var repoOwner = 'NEL227';
            var repoName = 'work-toolkit';
            var directoryPath = 'images';

            fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${directoryPath}`)
                .then(response => response.json())
                .then(data => {
                var imageUrls = data.filter(file => file.type === 'file' && file.name.match(/\.jpg$/i))
                .map(file => file.download_url);
                showModalWithImages(imageUrls);
            });
        });

        var uploadSpan = document.querySelector('.panel-heading .clearfix .pull-left.inputHeight');
        uploadSpan.parentNode.insertBefore(newButton, uploadSpan.nextSibling);

        //画像拡大機能
        let zoomMode = localStorage.getItem('zoomMode') || 'ctrlHover';
        let zoomPosition = localStorage.getItem('zoomPosition') || 'mouse';
        let maxWidth = localStorage.getItem('maxWidth') || 600;
        let maxHeight = localStorage.getItem('maxHeight') || 600;
        let zoomOpacity = localStorage.getItem('zoomOpacity') || 100;
        let delay = localStorage.getItem('delay') || 350;
        const defaultWidth = 600;
        const defaultHeight = 600;
        const defaultOpacity = 100;
        let ctrlPressed = false;
        let hoveredImage = null;
        let lastMouseEvent = null;
        let zoomTimeout = null;
        let mouseOnImage = false;
        let currentImage = null;
        let lastImage = null;
        let clickHandled = false;
        let clickDuringDelay = false;
        let firstZoom = false;

        const zoomedImage = document.createElement('img');
        zoomedImage.className = 'zoomed-image';
        zoomedImage.style.opacity = zoomOpacity / 100;
        document.body.appendChild(zoomedImage);

        function createSettingsMenu() {
            const settingsIcon = document.createElement('div');
            settingsIcon.innerHTML = '⚙️';
            settingsIcon.className = 'settings-icon';
            document.body.appendChild(settingsIcon);

            const settingsMenu = document.createElement('div');
            settingsMenu.className = 'settings-menu';
            settingsMenu.style.display = 'none';
            document.body.appendChild(settingsMenu);

            const zoomModeLabel = document.createElement('div');
            zoomModeLabel.innerText = '拡大モード';
            zoomModeLabel.className = 'settings-label';
            settingsMenu.appendChild(zoomModeLabel);

            const modes = [
                { id: 'always', text: '常に拡大（Ctrlやクリックで非表示）' },
                { id: 'ctrlHover', text: 'Ctrlを押しながら拡大' },
                { id: 'noZoom', text: '拡大しない' }
            ];

            modes.forEach(mode => {
                const modeOption = document.createElement('div');
                modeOption.innerText = mode.text;
                modeOption.className = 'mode-option';
                modeOption.dataset.mode = mode.id;

                if (mode.id === zoomMode) {
                    modeOption.classList.add('selected');
                }

                modeOption.onmouseover = () => {
                    modeOption.classList.add('hover');
                };

                modeOption.onmouseout = () => {
                    modeOption.classList.remove('hover');
                };

                modeOption.onclick = () => {
                    zoomMode = mode.id;
                    localStorage.setItem('zoomMode', zoomMode);
                    updateZoomMode();
                    updateSelectedOptions();
                };

                settingsMenu.appendChild(modeOption);
            });

            const zoomPositionLabel = document.createElement('div');
            zoomPositionLabel.innerText = '拡大画像の表示位置';
            zoomPositionLabel.className = 'settings-label';
            zoomPositionLabel.style.marginTop = '10px';
            zoomPositionLabel.style.marginBottom = '10px';
            settingsMenu.appendChild(zoomPositionLabel);

            const positions = [
                { id: 'mouse', text: 'カーソル' },
                { id: 'right', text: '画面隅' }
            ];

            positions.forEach(position => {
                const positionOption = document.createElement('div');
                positionOption.innerText = position.text;
                positionOption.className = 'zoom-position-option';
                positionOption.dataset.position = position.id;

                if (position.id === zoomPosition) {
                    positionOption.classList.add('selected');
                }

                positionOption.onmouseover = () => {
                    positionOption.classList.add('hover');
                };

                positionOption.onmouseout = () => {
                    positionOption.classList.remove('hover');
                };

                positionOption.onclick = () => {
                    zoomPosition = position.id;
                    localStorage.setItem('zoomPosition', zoomPosition);
                    updateSelectedOptions();
                };

                settingsMenu.appendChild(positionOption);
            });

            const maxSizeLabel = document.createElement('div');
            maxSizeLabel.innerText = '拡大サイズ（最大）';
            maxSizeLabel.className = 'settings-label';
            maxSizeLabel.style.marginTop = '10px';
            settingsMenu.appendChild(maxSizeLabel);

            const sizeContainer = document.createElement('div');
            sizeContainer.style.display = 'flex';
            sizeContainer.style.marginTop = '10px';

            const maxWidthLabel = document.createElement('span');
            maxWidthLabel.innerText = '横：';
            maxWidthLabel.className = 'settings-input-label';
            maxWidthLabel.style.paddingTop = '6px';
            sizeContainer.appendChild(maxWidthLabel);

            const maxWidthInput = document.createElement('input');
            maxWidthInput.type = 'number';
            maxWidthInput.value = maxWidth;
            maxWidthInput.className = 'settings-input';
            maxWidthInput.min = '50';
            maxWidthInput.max = '3000';
            maxWidthInput.step = '50';
            maxWidthInput.addEventListener('input', () => {
                maxWidth = maxWidthInput.value;
                localStorage.setItem('maxWidth', maxWidth);
                updateZoomSize();
                zoomedImage.style.display = 'none';
            });
            sizeContainer.appendChild(maxWidthInput);

            const maxHeightLabel = document.createElement('span');
            maxHeightLabel.innerText = '縦：';
            maxHeightLabel.className = 'settings-input-label';
            maxHeightLabel.style.paddingTop = '6px';
            maxHeightLabel.style.marginLeft = '13px';
            sizeContainer.appendChild(maxHeightLabel);

            const maxHeightInput = document.createElement('input');
            maxHeightInput.type = 'number';
            maxHeightInput.value = maxHeight;
            maxHeightInput.className = 'settings-input';
            maxHeightInput.min = '50';
            maxHeightInput.max = '3000';
            maxHeightInput.step = '50';
            maxHeightInput.addEventListener('input', () => {
                maxHeight = maxHeightInput.value;
                localStorage.setItem('maxHeight', maxHeight);
                updateZoomSize();
                zoomedImage.style.display = 'none';
            });
            sizeContainer.appendChild(maxHeightInput);

            settingsMenu.appendChild(sizeContainer);

            const delayContainer = document.createElement('div');
            delayContainer.style.display = 'flex';
            delayContainer.style.marginTop = '10px';
            const delayLabel = document.createElement('span');
            delayLabel.innerText = '拡大までの遅延（ms）：';
            delayLabel.style.fontWeight = 'bold';
            delayLabel.className = 'settings-input-label';
            delayLabel.style.paddingTop = '6px';
            delayContainer.appendChild(delayLabel);

            const delayInput = document.createElement('input');
            delayInput.type = 'number';
            delayInput.value = delay;
            delayInput.className = 'settings-input';
            delayInput.min = '0';
            delayInput.max = '5000';
            delayInput.step = '50';
            delayInput.addEventListener('input', () => {
                delay = delayInput.value;
                localStorage.setItem('delay', delay);
            });
            delayContainer.appendChild(delayInput);

            settingsMenu.appendChild(delayContainer);

            const transparencyLabel = document.createElement('div');
            transparencyLabel.innerText = '拡大画像の不透明度';
            transparencyLabel.className = 'settings-label';
            transparencyLabel.style.marginTop = '10px';
            settingsMenu.appendChild(transparencyLabel);

            const transparencySlider = document.createElement('input');
            transparencySlider.type = 'range';
            transparencySlider.className = 'transparency-slider';
            transparencySlider.min = '0';
            transparencySlider.max = '100';
            transparencySlider.value = zoomOpacity;

            const tooltip = document.createElement('div');
            tooltip.className = 'slider-tooltip';
            tooltip.style.position = 'absolute';
            tooltip.style.background = 'rgba(0, 0, 0, 0.7)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '2px 5px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '12px';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.display = 'none';
            tooltip.style.zIndex = '10000';
            document.body.appendChild(tooltip);

            transparencySlider.addEventListener('input', (event) => {
                zoomOpacity = transparencySlider.value;
                localStorage.setItem('zoomOpacity', zoomOpacity);
                zoomedImage.style.opacity = zoomOpacity / 100;

                const rect = transparencySlider.getBoundingClientRect();
                tooltip.style.left = `${rect.left + window.scrollX + (transparencySlider.value / transparencySlider.max) * rect.width - 15}px`;
                tooltip.style.top = `${rect.top + window.scrollY - 25}px`;
                tooltip.innerText = `${zoomOpacity}%`;
                tooltip.style.display = 'block';
            });

            transparencySlider.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });

            settingsMenu.appendChild(transparencySlider);

            const defaultWidth = 600;
            const defaultHeight = 600;
            const defaultDelay = 350;

            const resetButton = document.createElement('div');
            resetButton.innerText = '拡大サイズと遅延をデフォルトに戻す';
            resetButton.className = 'reset-button';

            function updateResetButtonState() {
                const currentWidth = parseInt(maxWidthInput.value, 10);
                const currentHeight = parseInt(maxHeightInput.value, 10);
                const currentDelay = parseInt(delayInput.value, 10);

                if (currentWidth !== defaultWidth || currentHeight !== defaultHeight || currentDelay !== defaultDelay) {
                    resetButton.classList.remove('disabled');
                    resetButton.classList.add('enabled');
                } else {
                    resetButton.classList.remove('enabled');
                    resetButton.classList.add('disabled');
                }
            }

            resetButton.onclick = () => {
                maxWidth = defaultWidth;
                maxHeight = defaultHeight;
                delay = defaultDelay;
                localStorage.setItem('maxWidth', maxWidth);
                localStorage.setItem('maxHeight', maxHeight);
                localStorage.setItem('delay', delay);
                maxWidthInput.value = maxWidth;
                maxHeightInput.value = maxHeight;
                delayInput.value = delay;
                updateZoomSize();
                zoomedImage.style.opacity = zoomOpacity / 100;
                updateResetButtonState();
            };

            maxWidthInput.addEventListener('input', updateResetButtonState);
            maxHeightInput.addEventListener('input', updateResetButtonState);
            delayInput.addEventListener('input', updateResetButtonState);

            settingsMenu.appendChild(resetButton);
            updateResetButtonState();

            updateSelectedOptions();
            settingsIcon.onclick = () => {
                settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
            };

            document.addEventListener('mouseenter', () => {
                if (zoomMode === 'always') {
                    zoomTimeout = setTimeout(() => {
                        if (!clickDuringDelay) {
                            zoomedImage.style.display = 'block';
                        }
                    }, delay);
                }
            });

            document.addEventListener('mousedown', (event) => {
                if (zoomMode === 'always' && event.button === 0) {
                    clearTimeout(zoomTimeout);
                    clickDuringDelay = true;

                    zoomedImage.style.display = 'none';
                }
            });

            document.addEventListener('mouseup', (event) => {
                if (zoomMode === 'always' && event.button === 0) {
                    zoomedImage.style.display = 'none';
                }
            });

            document.addEventListener('mouseleave', () => {
                clearTimeout(zoomTimeout);
                clickDuringDelay = false;
                zoomedImage.style.display = 'none';
            });

            document.addEventListener('mousemove', () => {
                if (clickDuringDelay) {
                    clickDuringDelay = false;
                }
            });

            document.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('keyup', onKeyUp);
            document.addEventListener('mouseout', onMouseOut);
        }

        function updateZoomMode() {
            if (zoomMode === 'noZoom') {
                zoomedImage.style.display = 'none';
            } else {
                zoomedImage.style.display = 'block';
            }
        }

        function updateZoomSize() {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            const maxAllowedWidth = windowWidth * 0.9;
            const maxAllowedHeight = windowHeight * 0.98;

            const finalWidth = Math.min(maxWidth, maxAllowedWidth);
            const finalHeight = Math.min(maxHeight, maxAllowedHeight);

            zoomedImage.style.maxWidth = finalWidth + 'px';
            zoomedImage.style.maxHeight = finalHeight + 'px';
        }

        function updateSelectedOptions() {
            const modeOptions = document.querySelectorAll('.mode-option');
            modeOptions.forEach(option => {
                if (option.dataset.mode === zoomMode) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            });

            const inputs = document.querySelectorAll('.settings-input, .settings-label, .transparency-slider, .reset-button');
            const positionOptions = document.querySelectorAll('.zoom-position-option');
            positionOptions.forEach(option => {
                if (option.dataset.position === zoomPosition) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            });

            const labels = document.querySelectorAll('.settings-input-label');
            let delayLabel, delayInput;

            labels.forEach(label => {
                if (label.textContent.includes('拡大までの遅延（ms）：')) {
                    delayLabel = label;
                    delayInput = label.nextElementSibling;
                }
            });

            if (zoomMode === 'noZoom') {
                labels.forEach(label => {
                    if (label.innerText !== '拡大モード') {
                        label.style.display = 'none';
                    }
                });

                positionOptions.forEach(option => {
                    option.style.display = 'none';
                });

                inputs.forEach(input => {
                    input.style.display = 'none';
                });

            } else {
                labels.forEach(label => {
                    label.style.display = 'block';
                });

                positionOptions.forEach(option => {
                    option.style.display = 'block';
                });

                inputs.forEach(input => {
                    input.style.display = 'block';
                });

                if (zoomMode === 'ctrlHover') {
                    labels.forEach(label => {
                        if (label.textContent.includes('拡大までの遅延（ms）：')) {
                            label.style.display = 'none';
                            label.nextElementSibling.style.display = 'none';
                        }
                    });
                }
            }

            updateZoomMode();
            updateZoomPosition();

            zoomedImage.style.display = 'none';
        }

        function onMouseMove(event) {
            lastMouseEvent = event;

            if (zoomMode === 'always') {
                if (ctrlPressed || event.buttons !== 0) {
                    clearTimeout(zoomTimeout);
                    zoomedImage.style.display = 'none';
                    if (currentImage) {
                        currentImage.style.opacity = '';
                    }
                    currentImage = null;
                    return;
                }

                if (!firstZoom) {
                    clearTimeout(zoomTimeout);
                    if (event.target.tagName === 'IMG') {
                        currentImage = event.target;
                        hoveredImage = event.target;
                        zoomedImage.src = event.target.src;
                        event.target.style.opacity = '0.5';

                        zoomTimeout = setTimeout(() => {
                            zoomedImage.style.display = 'block';
                            updateZoomPosition();
                            if (zoomPosition === 'mouse') {
                                adjustZoomPosition(event);
                            }
                            currentImage.style.opacity = '';
                            firstZoom = true;
                        }, delay);
                    } else {
                        zoomedImage.style.display = 'none';
                        if (currentImage) {
                            currentImage.style.opacity = '';
                        }
                        currentImage = null;
                    }
                } else {
                    if (event.target.tagName === 'IMG') {
                        currentImage = event.target;
                        hoveredImage = event.target;
                        zoomedImage.src = event.target.src;
                        zoomedImage.style.display = 'block';
                        updateZoomPosition();
                        if (zoomPosition === 'mouse') {
                            adjustZoomPosition(event);
                        }
                        currentImage.style.opacity = '';
                    } else {
                        zoomedImage.style.display = 'none';
                        if (currentImage) {
                            currentImage.style.opacity = '';
                        }
                        currentImage = null;
                    }
                }
                return;
            }

            if (zoomMode === 'ctrlHover' && ctrlPressed) {
                if (event.target.tagName === 'IMG') {
                    clearTimeout(zoomTimeout);
                    currentImage = event.target;
                    hoveredImage = event.target;
                    zoomedImage.src = event.target.src;
                    event.target.style.opacity = '0.5';

                    zoomedImage.style.display = 'block';
                    updateZoomPosition();
                    if (zoomPosition === 'mouse') {
                        adjustZoomPosition(event);
                    }
                    currentImage.style.opacity = '';
                } else {
                    zoomedImage.style.display = 'none';
                    if (currentImage) {
                        currentImage.style.opacity = '';
                    }
                    currentImage = null;
                }
                return;
            }

            if (zoomMode === 'ctrlHover' && !ctrlPressed) {
                clearTimeout(zoomTimeout);
                zoomedImage.style.display = 'none';
                if (currentImage) {
                    currentImage.style.opacity = '';
                }
                currentImage = null;
                return;
            }

            if (zoomMode === 'always' || (zoomMode === 'ctrlHover' && ctrlPressed)) {
                if (event.target.tagName === 'IMG') {
                    if (clickHandled) {
                        if (lastImage !== event.target) {
                            clearTimeout(zoomTimeout);
                            currentImage = event.target;
                            hoveredImage = event.target;
                            zoomedImage.src = event.target.src;
                            event.target.style.opacity = '0.5';

                            zoomTimeout = setTimeout(() => {
                                zoomedImage.style.display = 'block';
                                updateZoomPosition();
                                if (zoomPosition === 'mouse') {
                                    adjustZoomPosition(event);
                                }
                                currentImage.style.opacity = '';
                                lastImage = event.target;
                                clickHandled = false;
                                firstZoom = false;
                            }, firstZoom ? delay : 0);

                        }
                    } else {
                        if (currentImage !== event.target) {
                            clearTimeout(zoomTimeout);
                            currentImage = event.target;
                            hoveredImage = event.target;
                            zoomedImage.src = event.target.src;
                            event.target.style.opacity = '0.5';

                            zoomTimeout = setTimeout(() => {
                                zoomedImage.style.display = 'block';
                                updateZoomPosition();
                                if (zoomPosition === 'mouse') {
                                    adjustZoomPosition(event);
                                }
                                currentImage.style.opacity = '';
                            }, firstZoom ? delay : 0);
                        } else {
                            if (zoomMode === 'always' && !ctrlPressed && event.buttons === 0) {
                                mouseOnImage = true;
                                clearTimeout(zoomTimeout);
                                zoomTimeout = setTimeout(() => {
                                    zoomedImage.style.display = 'block';
                                    updateZoomPosition();
                                    if (zoomPosition === 'mouse') {
                                        adjustZoomPosition(event);
                                    }
                                    currentImage.style.opacity = '';
                                }, firstZoom ? delay : 0);
                            } else if (zoomMode === 'ctrlHover' && ctrlPressed) {
                                zoomedImage.style.display = 'block';
                                updateZoomPosition();
                                if (zoomPosition === 'mouse') {
                                    adjustZoomPosition(event);
                                }
                                currentImage.style.opacity = '';
                            }
                        }
                    }
                } else {
                    clearTimeout(zoomTimeout);
                    zoomedImage.style.display = 'none';
                    if (currentImage) {
                        currentImage.style.opacity = '';
                    }
                    currentImage = null;
                    mouseOnImage = false;
                }

                if (ctrlPressed && zoomMode === 'always' && currentImage) {
                    currentImage.style.opacity = '';
                }

                if (zoomedImage.style.display === 'block') {
                    updateZoomPosition();
                    if (zoomPosition === 'mouse') {
                        adjustZoomPosition(event);
                    }
                }
            } else {
                clearTimeout(zoomTimeout);
                zoomedImage.style.display = 'none';
                if (currentImage) {
                    currentImage.style.opacity = '';
                }
                currentImage = null;
                mouseOnImage = false;
            }
        }

        function adjustZoomPosition(event) {
            if (zoomPosition === 'right') {
                return;
            }

            const zoomWidth = zoomedImage.clientWidth;
            const zoomHeight = zoomedImage.clientHeight;

            let top = event.pageY + 15;
            let left = event.pageX + 25;

            const maxTop = window.innerHeight - zoomHeight - 20;
            const maxLeft = window.innerWidth - zoomWidth - 20;

            if (left + zoomWidth > window.innerWidth) {
                left = event.pageX - zoomWidth - 25;
            }

            if (top > maxTop) {
                top = maxTop;
            }
            if (top < 0) {
                top = 0;
            }
            if (left > maxLeft) {
                left = maxLeft;
            }
            if (left < 0) {
                left = 0;
            }

            zoomedImage.style.top = top + 'px';
            zoomedImage.style.left = left + 'px';
            zoomedImage.style.right = 'auto';
        }

        const imageModal = document.getElementById('image-modal');

        let isMouseOverModal = false;

        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.id === 'image-modal') {
                        setupImageModalEvents(node);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        function setupImageModalEvents(imageModal) {
            imageModal.addEventListener('mouseenter', () => {
                isMouseOverModal = true;
                updateZoomPosition();
            });

            imageModal.addEventListener('mouseleave', () => {
                isMouseOverModal = false;
                updateZoomPosition();
            });
        }

        function updateZoomPosition() {
            if (zoomPosition === 'right') {
                if (isMouseOverModal) {
                    zoomedImage.style.left = '10px';
                    zoomedImage.style.right = 'auto';
                    zoomedImage.style.top = '10px';
                    zoomedImage.style.bottom = 'auto';
                } else {
                    zoomedImage.style.left = 'auto';
                    zoomedImage.style.right = '10px';
                    zoomedImage.style.top = '10px';
                    zoomedImage.style.bottom = 'auto';
                }
            } else if (zoomPosition === 'mouse') {
                zoomedImage.style.left = '0';
                zoomedImage.style.right = 'auto';
                zoomedImage.style.top = 'auto';
                zoomedImage.style.bottom = 'auto';
            }
        }

        function onMouseDown(event) {
            if (zoomMode === 'always') {
                firstZoom = false;
                event.target.style.opacity = '';
            }
        }

        function onMouseOut(event) {
            if (event.target.tagName === 'IMG') {
                event.target.style.opacity = '';
                clearTimeout(zoomTimeout);
                zoomedImage.style.display = 'none';
            }
        }

        function onKeyDown(event) {
            if (event.key === 'Control') {
                ctrlPressed = true;
                if (zoomMode === 'always') {
                    zoomedImage.style.display = 'none';
                    clearTimeout(zoomTimeout);
                } else if (zoomMode === 'ctrlHover' && lastMouseEvent && lastMouseEvent.target.tagName === 'IMG') {
                    onMouseMove(lastMouseEvent);
                }
            }
        }

        function onKeyUp(event) {
            if (event.key === 'Control') {
                ctrlPressed = false;
                if (zoomMode === 'always' && hoveredImage) {
                    zoomedImage.src = hoveredImage.src;
                    zoomedImage.style.display = 'block';
                    if (lastMouseEvent) {
                        onMouseMove(lastMouseEvent);
                    }
                } else if (zoomMode === 'ctrlHover') {
                    zoomedImage.style.display = 'none';
                }
            }
        }

        createSettingsMenu();
        updateZoomMode();
        updateZoomSize();
        updateZoomPosition();
    }

    function orderStatusCheck(){

        const url = window.location.href;
        const codeMatch = url.match(/\/([^\/]+)$/);
        const code = codeMatch ? codeMatch[1] : null;
        if (!code) return;

        const stockStatusKey = 'outOfStockStatus_' + code;

        if (url.includes('/mainedit/') || url.includes('/registered_mainedit/')) {
            const targetTable = document.getElementById('stockSettingTable');
            if (!targetTable) return;

            const container = document.createElement('div');
            container.style.marginBottom = '10px';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.gap = '10px';

            const checkbox1 = document.createElement('input');
            checkbox1.type = 'checkbox';
            checkbox1.id = 'outOfStock';
            checkbox1.style.transform = 'scale(1.1)';
            checkbox1.style.margin = '0';

            const label1 = document.createElement('label');
            label1.htmlFor = 'outOfStock';
            label1.textContent = '欠品あり';
            label1.style.fontSize = '1.1em';

            const checkbox2 = document.createElement('input');
            checkbox2.type = 'checkbox';
            checkbox2.id = 'inStock';
            checkbox2.style.transform = 'scale(1.1)';
            checkbox2.style.margin = '0';

            const label2 = document.createElement('label');
            label2.htmlFor = 'inStock';
            label2.textContent = '欠品なし';
            label2.style.fontSize = '1.1em';

            container.appendChild(checkbox1);
            container.appendChild(label1);
            container.appendChild(checkbox2);
            container.appendChild(label2);

            targetTable.parentNode.insertBefore(container, targetTable);

            const savedStatus = sessionStorage.getItem(stockStatusKey);
            if (savedStatus === 'true') checkbox1.checked = true;
            if (savedStatus === 'false') checkbox2.checked = true;

            checkbox1.addEventListener('change', () => {
                if (checkbox1.checked) {
                    checkbox2.checked = false;
                    sessionStorage.setItem(stockStatusKey, 'true');
                } else if (!checkbox2.checked) {
                    sessionStorage.removeItem(stockStatusKey);
                }
            });

            checkbox2.addEventListener('change', () => {
                if (checkbox2.checked) {
                    checkbox1.checked = false;
                    sessionStorage.setItem(stockStatusKey, 'false');
                } else if (!checkbox1.checked) {
                    sessionStorage.removeItem(stockStatusKey);
                }
            });
        }

        if (url.includes('/sku_check/')) {
            const saved = sessionStorage.getItem(stockStatusKey);
            const formDot = document.querySelector('.formdot');
            if (!formDot) return;

            const display = document.createElement('div');
            display.textContent = `[${code}] 欠品状態: ` + (
                saved === 'true' ? 'あり' :
                saved === 'false' ? 'なし' :
                '未選択'
            );
            display.style.marginBottom = '10px';
            display.style.fontWeight = 'bold';
            display.style.textAlign = 'right';
            display.style.color =
                saved === 'true' ? 'red' :
            saved === 'false' ? 'green' :
            'gray';

            formDot.parentNode.insertBefore(display, formDot);

            window.addEventListener('beforeunload', () => {
                sessionStorage.removeItem(stockStatusKey);
            });
        }
    }

    function bulkOrderCheck(){

        let selectedHorizontal = [];
        let selectedVertical = [];

        let horizontalAxisNames = [];
        let verticalAxisNames = [];

        const rows = document.querySelectorAll('table.formdot tbody tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 3) {
                const horizontal = cells[2].textContent.trim();
                const vertical = cells[3].textContent.trim();

                if (horizontal && !horizontalAxisNames.includes(horizontal)) {
                    horizontalAxisNames.push(horizontal);
                }
                if (vertical && !verticalAxisNames.includes(vertical)) {
                    verticalAxisNames.push(vertical);
                }
            }
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'custom-button-container';
        document.body.appendChild(buttonContainer);

        createAxisButtons('横軸', horizontalAxisNames, 'horizontal', buttonContainer);
        createAxisButtons('縦軸', verticalAxisNames, 'vertical', buttonContainer);

        const onOffContainer = document.createElement('div');
        onOffContainer.id = 'on-off-container';
        buttonContainer.appendChild(onOffContainer);

        const onButton = createActionButton('オン', () => toggleCheckboxes(true));
        const offButton = createActionButton('オフ', () => toggleCheckboxes(false));
        onOffContainer.appendChild(onButton);
        onOffContainer.appendChild(offButton);

        const hideButton = document.createElement('button');
        hideButton.textContent = '-';
        hideButton.id = 'hide-button';
        buttonContainer.appendChild(hideButton);
        hideButton.onclick = hideContainer;

        const showButton = document.createElement('button');
        showButton.textContent = '+';
        showButton.id = 'show-button';
        showButton.style.position = 'fixed';
        showButton.style.right = '25px';
        showButton.style.top = '50%';
        showButton.style.transform = 'translateY(-50%)';
        document.body.appendChild(showButton);
        showButton.onclick = showContainer;

        const configButton = document.createElement('button');
        configButton.textContent = '⚙';
        configButton.id = 'config-button';
        buttonContainer.appendChild(configButton);

        configButton.onclick = () => {
            const isHidden = toggleRememberStateButton.style.display === 'none';
            toggleRememberStateButton.style.display = isHidden ? 'block' : 'none';
        };

        const toggleRememberStateButton = document.createElement('button');
        toggleRememberStateButton.textContent = getRememberState() ? '表示状態の記憶: オン' : '表示状態の記憶: オフ';
        toggleRememberStateButton.id = 'toggle-remember-state';
        toggleRememberStateButton.style.display = 'none';
        toggleRememberStateButton.style.position = 'absolute';
        toggleRememberStateButton.style.bottom = '-24px';
        toggleRememberStateButton.style.left = '-2px';
        toggleRememberStateButton.title = 'オン: リロード時は最後の表示状態を維持\nオフ: リロード時は常に展開';
        buttonContainer.appendChild(toggleRememberStateButton);
        toggleRememberStateButton.onclick = toggleRememberState;

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', restoreState);
        } else {
            restoreState();
        }

        function createAxisButtons(label, axisNames, axis, container) {
            const axisContainer = document.createElement('div');
            axisContainer.classList.add('axis-container');

            const axisLabel = document.createElement('div');
            axisLabel.textContent = label;
            axisLabel.classList.add('axis-label');
            axisContainer.appendChild(axisLabel);

            axisNames.forEach(name => {
                const button = document.createElement('button');
                button.textContent = name;
                button.classList.add('axis-button');
                button.dataset.axis = axis;
                button.dataset.name = name;
                button.onclick = () => toggleSelection(button, axis, name);
                axisContainer.appendChild(button);
            });

            container.appendChild(axisContainer);
        }

        function toggleSelection(button, axis, name) {
            if (axis === 'horizontal') {
                if (selectedHorizontal.includes(name)) {
                    selectedHorizontal = selectedHorizontal.filter(item => item !== name);
                } else {
                    selectedHorizontal.push(name);
                }
            } else if (axis === 'vertical') {
                if (selectedVertical.includes(name)) {
                    selectedVertical = selectedVertical.filter(item => item !== name);
                } else {
                    selectedVertical.push(name);
                }
            }
            updateButtonStyles();
        }

        function updateButtonStyles() {
            document.querySelectorAll('.axis-button[data-axis="horizontal"]').forEach(button => {
                button.classList.toggle('selected', selectedHorizontal.includes(button.dataset.name));
            });
            document.querySelectorAll('.axis-button[data-axis="vertical"]').forEach(button => {
                button.classList.toggle('selected', selectedVertical.includes(button.dataset.name));
            });
        }

        function toggleCheckboxes(state) {
            let feedbackMessage = '';

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const checkbox = row.querySelector('td input[type="checkbox"]');
                if (cells.length > 3 && checkbox) {
                    const horizontal = cells[2].textContent.trim();
                    const vertical = cells[3].textContent.trim();

                    if (selectedHorizontal.length > 0 && selectedVertical.length > 0) {
                        if (selectedHorizontal.includes(horizontal) && selectedVertical.includes(vertical)) {
                            checkbox.checked = state;
                            feedbackMessage = `「${selectedHorizontal.join('」「')}」 と 「${selectedVertical.join('」「')}」 の条件に一致する項目を変更しました。`;
                        }
                    } else if (selectedHorizontal.length > 0 && selectedVertical.length === 0) {
                        if (selectedHorizontal.includes(horizontal)) {
                            checkbox.checked = state;
                            feedbackMessage = `「${selectedHorizontal.join('」「')}」 に一致する項目を変更しました。`;
                        }
                    } else if (selectedVertical.length > 0 && selectedHorizontal.length === 0) {
                        if (selectedVertical.includes(vertical)) {
                            checkbox.checked = state;
                            feedbackMessage = `「${selectedVertical.join('」「')}」 に一致する項目を変更しました。`;
                        }
                    }
                }
            });

            if (!feedbackMessage) {
                feedbackMessage = '選択条件がありません。';
            }

            displayFeedback(feedbackMessage);
        }

        function createActionButton(label, callback) {
            const button = document.createElement('button');
            button.textContent = label;
            button.classList.add('on-off-button');
            button.onclick = callback;
            return button;
        }

        function displayFeedback(message) {
            let feedbackDiv = document.getElementById('feedback-message');

            if (!feedbackDiv) {
                feedbackDiv = document.createElement('div');
                feedbackDiv.id = 'feedback-message';
                document.body.appendChild(feedbackDiv);
            }

            feedbackDiv.textContent = message;
            feedbackDiv.style.display = 'block';

            setTimeout(() => {
                feedbackDiv.style.display = 'none';
            }, 3000);
        }

        function hideContainer() {
            const container = document.getElementById('custom-button-container');
            const showButton = document.getElementById('show-button');
            container.style.display = 'none';
            showButton.style.display = 'block';
            if (getRememberState()) {
                localStorage.setItem('buttonContainerState', 'hidden');
            }
        }

        function showContainer() {
            const container = document.getElementById('custom-button-container');
            const showButton = document.getElementById('show-button');
            container.style.display = 'grid';
            showButton.style.display = 'none';
            if (getRememberState()) {
                localStorage.setItem('buttonContainerState', 'visible');
            }
        }

        function restoreState() {
            if (getRememberState()) {
                const savedState = localStorage.getItem('buttonContainerState');
                const container = document.getElementById('custom-button-container');
                const showButton = document.getElementById('show-button');

                if (savedState === 'hidden') {
                    container.style.display = 'none';
                    showButton.style.display = 'block';
                } else {
                    container.style.display = 'grid';
                    showButton.style.display = 'none';
                }
            }
        }

        function toggleRememberState() {
            const currentState = getRememberState();
            localStorage.setItem('rememberState', currentState ? 'false' : 'true');
            toggleRememberStateButton.textContent = currentState ? '表示状態の記憶: オフ' : '表示状態の記憶: オン';
        }

        function getRememberState() {
            return localStorage.getItem('rememberState') !== 'false';
        }

        GM_addStyle(`
        #custom-button-container {
            position: fixed;
            top: 50%;
            right: 10px;
            min-width: 150px;
            transform: translateY(-50%);
            background-color: #fff;
            padding: 10px 20px;
            border: 1px solid #ccc;
            z-index: 1000;
            display: grid;
            grid-template-columns: 1fr 1fr;
            max-height: 90vh;
        }

        .axis-container {
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            padding-bottom: 45px;
            max-height: 80vh;
        }

        .axis-label {
            margin-bottom: 3px;
            font-weight: bold;
            text-align: center;
        }

        .axis-button {
            margin: 3px;
            background-color: gray;
            color: white;
            border: none;
            padding: 3px 10px;
            cursor: pointer;
            text-align: center;
        }

        .axis-button.selected {
            background-color: #205668;
            color: white;
        }

        .axis-button:hover {
            background-color: #888;
        }

        .axis-button.selected:hover {
            background-color: #205668 !important;
        }

        #on-off-container {
            position: fixed;
            bottom: 0;
            left: 10px;
            right: 10px;
            background-color: #ffffff;
            padding: 10px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            border-top: 1px solid #ccc;
            z-index: 1001;
        }

        .on-off-button {
            background-color: #4c72af;
            color: white;
            padding: 5px 10px;
            border: none;
            cursor: pointer;
            transition: transform 0.1s ease, background-color 0.1s ease, box-shadow 0.1s ease;
        }

        .on-off-button:last-child {
            background-color: #f44336;
        }

        .on-off-button:active {
            transform: scale(0.95);
            background-color: #3b5a8e;
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
        }

        .on-off-button:last-child:active {
            background-color: #d32f2f;
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
        }

        .on-off-button:hover {
            background-color: #3c80b5;
            transition: background-color 0.3s;
        }

        .on-off-button:last-child:hover {
            background-color: #e53935;
            transition: background-color 0.3s;
        }

        #feedback-message {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 1002;
        }

        #hide-button {
            position: absolute;
            top: 0;
            left: 0;
            background-color: #ccc;
            color: white;
            border: none;
            padding: 2px 7px;
            cursor: pointer;
        }

        #config-button {
            position: absolute;
            top: 0;
            left: 22px;
            background-color: #ccc;
            color: white;
            border: none;
            padding: 1px 4px;
            cursor: pointer;
        }

        #hide-button, #config-button {
            position: absolute;
            background-color: #ccc;
            color: white;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s;
        }

        #hide-button:hover, #config-button:hover {
            background-color: #888;
            color: #fff;
        }

        #show-button {
            width: 40px;
            height: 40px;
            background: rgba(102, 204, 102, 0.5);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(102, 204, 102, 0.4);
            border-radius: 50%;
            font-size: 26px;
            font-weight: bold;
            color: #fff;
            display: none;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            pointer-events: auto;
            transform-origin: center;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
            opacity: 0;
            animation: fadeIn 0.5s forwards;
        }

        #show-button:hover {
            transform: scale(1.5);
            background: rgba(102, 204, 102, 0.8);
            font-size: 32px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        #showButton:active {
            transform: scale(1.35);
            background: rgba(102, 204, 102, 0.8);
            transition: transform 0.05s ease;
        }

        #showButton.fadeOut {
            animation: fadeOut 0.5s forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.5); }
            to { opacity: 1; transform: scale(1); }
        }

        @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.5); }
        }
    `);
    }

    function axisReminder() {

        const targetPattern = /:\/\/plus-nao\.com\/forests\/[^\/]+\/sku_check\/[^\/]+/;
        if (!targetPattern.test(window.location.href)) {
            return;
        }

        let currentUrl = window.location.href;
        let code = currentUrl.split('/').pop();
        let axisLink = `https://starlight.plusnao.co.jp/goods/axisCode?code=${code}`;

        let saveButton = document.querySelector('.submit input[value="保存して出品完了"]');
        if (saveButton) {
            let axisButton = document.createElement('input');
            axisButton.type = 'button';
            axisButton.value = '保存して縦横軸設定を開く';
            axisButton.style.background = '#D6DADE';
            axisButton.style.border = '1px solid #6C808C';
            axisButton.style.color = '#6C808C';
            axisButton.style.padding = '4px 8px';
            axisButton.style.textDecoration = 'none';
            axisButton.style.minWidth = '0';
            axisButton.style.fontWeight = 'normal';
            axisButton.style.display = 'inline-block';
            axisButton.style.width = 'auto';
            axisButton.style.marginLeft = '10px';
            axisButton.style.fontSize = '110%';

            axisButton.addEventListener('mouseover', function () {
                axisButton.style.background = '-webkit-gradient(linear, left top, left bottom, from(#f7f7e1), to(#eeeca9))';
                axisButton.style.color = '#ffffff';
                axisButton.style.border = '1px solid #454D6B';
            });

            axisButton.addEventListener('mouseout', function () {
                axisButton.style.background = '#D6DADE';
                axisButton.style.color = '#6C808C';
                axisButton.style.border = '1px solid #6C808C';
            });

            axisButton.addEventListener('click', function () {
                window.open(axisLink, '_blank');
                saveButton.click();
            });

            saveButton.style.display = 'inline-block';
            saveButton.style.width = 'auto';
            saveButton.style.fontSize = '110%';

            saveButton.parentElement.appendChild(axisButton);
        }
    }

    function nonColorSizeReminder(){

        const targets = ['TbMainproduct縦軸項目名', 'TbMainproduct横軸項目名'];
        const sheetUrl = 'https://docs.google.com/spreadsheets/d/1lLqUNM6SidsgvMvzn9Do6f7CFBuuYcZW7S18y4ubUFY/edit?pli=1&gid=1996423860';
        const storageKeyPrefix = 'NotColorSizeInputQueue_';
        const initialValuesKeyPrefix = 'InitialInputValues_';
        const savedTextKeyPrefix = 'SavedHeaderText_';

        function getStorageKey(pageUrl, keyPrefix) {
            return `${keyPrefix}${encodeURIComponent(pageUrl)}`;
        }

        function getInitialValues(pageUrl) {
            try {
                const initialValues = localStorage.getItem(getStorageKey(pageUrl, initialValuesKeyPrefix));
                return initialValues ? JSON.parse(initialValues) : {};
            } catch (error) {
                return {};
            }
        }

        function getSavedHeaderText() {
            try {
                const savedText = localStorage.getItem(savedTextKeyPrefix) || '';
                return savedText;
            } catch (error) {
                return '';
            }
        }

        function saveInputAndHeader(value) {
            const pageUrl = window.location.href;
            const inputQueueKey = getStorageKey(pageUrl, storageKeyPrefix);
            const headerText = document.querySelector('h2').textContent;
            const match = headerText.match(/\[(.*?)\]/);
            const extractedText = match ? match[1] : 'ID無し';

            let inputQueue = JSON.parse(localStorage.getItem(inputQueueKey)) || [];
            inputQueue.push({ header: extractedText, input: value });
            if (inputQueue.length > 10) {
                inputQueue.shift();
            }

            try {
                localStorage.setItem(inputQueueKey, JSON.stringify(inputQueue));
                const savedHeaderText = getSavedHeaderText();
                const newHeaderText = savedHeaderText ? `${savedHeaderText}, ${extractedText}` : extractedText;
                localStorage.setItem(savedTextKeyPrefix, newHeaderText);
            } catch (error) {
            }
        }

        function showNotificationIfNeeded() {
            const savedHeaderText = getSavedHeaderText();

            if (savedHeaderText) {
                const uniqueHeaders = [...new Set(savedHeaderText.split(', ').filter(header => header))];
                const headersText = uniqueHeaders
                .map(header => `<span style="font-family: Verdana; font-size: 10pt; color: #000000;">${header}</span>`)
                .join('<br>');

                const message = `
                ${headersText}<br>
                <span style="font-family: Verdana;">項目名にカラーとサイズ以外が入力されました</span>
            `;

                showCustomNotification(message);
            }
        }

        function showCustomNotification(message) {
            let existingNotification = document.getElementById('custom-notification');
            if (existingNotification) {
                existingNotification.remove();
            }

            const notification = document.createElement('div');
            notification.id = 'custom-notification';
            notification.style.position = 'fixed';
            notification.style.bottom = '10px';
            notification.style.right = '10px';
            notification.style.padding = '12px';
            notification.style.backgroundColor = '#e3f2fd';
            notification.style.color = '#0d47a1';
            notification.style.border = '1px solid #90caf9';
            notification.style.borderRadius = '5px';
            notification.style.zIndex = 10001;
            notification.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            notification.style.lineHeight = '1.5';

            const closeButton = document.createElement('button');
            closeButton.textContent = '×';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '2px';
            closeButton.style.right = '2px';
            closeButton.style.border = 'none';
            closeButton.style.backgroundColor = 'transparent';
            closeButton.style.color = '#0d47a1';
            closeButton.style.fontSize = '24px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.width = '40px';
            closeButton.style.height = '40px';
            closeButton.style.lineHeight = '40px';
            closeButton.style.textAlign = 'center';
            closeButton.style.padding = '0';
            closeButton.addEventListener('click', () => {
                notification.remove();
                try {
                    localStorage.removeItem(savedTextKeyPrefix);
                } catch (error) {
                }
            });

            notification.innerHTML = `
            <p style="margin: 0; font-family: Verdana;">${message}</p>
            <a href="${sheetUrl}" target="_blank" style="color: #1e88e5;">「カラーとサイズ以外にした場合」</a>を新しく開く
        `;
            notification.appendChild(closeButton);
            document.body.appendChild(notification);
        }

        function checkInput(changedFields) {
            const pageUrl = window.location.href;
            let foundInput = false;

            if (!Array.isArray(changedFields)) {
                changedFields = [];
            }

            changedFields.forEach(id => {
                const inputField = document.getElementById(id);
                if (inputField) {
                    const value = inputField.value.trim();

                    if (value !== 'カラー' && value !== 'サイズ' && value !== '-' && value !== '--' && value.trim() !== '') {
                        saveInputAndHeader(value);
                        foundInput = true;
                    }
                }
            });

            if (foundInput) {
                showNotificationIfNeeded();
            }
        }

        function initializeInitialValues() {
            const pageUrl = window.location.href;
            let initialValues = getInitialValues(pageUrl);

            targets.forEach(targetId => {
                const inputElement = document.getElementById(targetId);
                if (inputElement) {
                    initialValues[targetId] = inputElement.value.trim();
                }
            });

            try {
                localStorage.setItem(getStorageKey(pageUrl, initialValuesKeyPrefix), JSON.stringify(initialValues));
            } catch (error) {
            }
        }

        function handleButtonClick(buttonId, isSaveAndSkuStock) {
            const pageUrl = window.location.href;
            const initialValues = getInitialValues(pageUrl);

            let changedFields = [];
            targets.forEach(targetId => {
                const inputElement = document.getElementById(targetId);
                if (inputElement) {
                    const value = inputElement.value.trim();
                    const initialValue = initialValues[targetId] || '';

                    if (isSaveAndSkuStock) {
                        changedFields.push(targetId);
                    } else if (value !== initialValue) {
                        changedFields.push(targetId);
                    }
                }
            });

            checkInput(changedFields);
        }

        function main() {
            initializeInitialValues();

            const registeredSaveButton = document.getElementById('registeredSaveButton');
            const registeredSaveAndSkuStock = document.getElementById('registeredSaveAndSkuStock');
            const saveAndSkuStock = document.getElementById('saveAndSkuStock');

            if (registeredSaveButton) {
                registeredSaveButton.addEventListener('click', () => handleButtonClick('registeredSaveButton', false));
            }

            if (registeredSaveAndSkuStock) {
                registeredSaveAndSkuStock.addEventListener('click', () => handleButtonClick('registeredSaveAndSkuStock', false));
            }

            if (saveAndSkuStock) {
                saveAndSkuStock.addEventListener('click', () => handleButtonClick('saveAndSkuStock', true));
            }

            showNotificationIfNeeded();
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', main);
        } else {
            main();
        }
    }

    function axisCodeErrorCheck(){

        let currentCode = '';
        let saveButton = null;
        let modalSaveButtons = [];
        const alertBoxId = 'custom-alert-box';
        let alertTypesSet = new Set();

        function countByte(str) {
            if (!str) return 0;
            let length = 0;
            for (let char of str) {
                length += (char.match(/[^\x00-\xff]/)) ? 2 : 1;
            }
            return length;
        }

        function containsSpace(str) {
            return /[\u0020\u3000]/.test(str || '');
        }

        function containsSymbols(str) {
            return /['&<>=+\*\/\]\[\\㎜㎝㎞㎎㎏㏄]/.test(str || '');
        }

        function hasInvalidChar(str) {
            const allowedCharsOnly = /^[a-zA-Z0-9\- 　]*$/;
            return !allowedCharsOnly.test(str || '');
        }

        function highlightAxis(str) {
            return countByte(str) >= 33 || containsSpace(str) || containsSymbols(str);
        }

        function highlightCode(inputValue) {
            const combined = (currentCode || '') + (inputValue || '');

            return countByte(combined) >= 21 || containsSpace(combined) || hasInvalidChar(inputValue);
        }

        function applyHighlight(input, conditionFn, color) {
            if (!input || typeof input.value !== 'string') return;

            const value = input.value;
            const combined = (currentCode || '') + value;
            const hasInvalid = hasInvalidChar(value);

            let shouldHighlight = false;

            try {
                shouldHighlight = conditionFn(value);
                input.style.border = shouldHighlight ? `2px solid red` : '';
            } catch (e) {}

            if (!shouldHighlight) {
                if (countByte(value) < 33) alertTypesSet.delete('over33');
                if (countByte(combined) < 21) alertTypesSet.delete('over21');
                if (!containsSpace(value)) alertTypesSet.delete('space');
                if (!containsSymbols(value)) alertTypesSet.delete('symbol');
                if (!hasInvalid) alertTypesSet.delete('invalidChar');
            }

            if (shouldHighlight) {
                if (countByte(value) >= 33) alertTypesSet.add('over33');
                if (countByte(combined) >= 21) alertTypesSet.add('over21');
                if (containsSpace(value)) alertTypesSet.add('space');
                if (containsSymbols(value)) alertTypesSet.add('symbol');
                if (hasInvalid) alertTypesSet.add('invalidChar');
            }

            updateAlertMessages();
        }


        function updateSaveButtonsState() {
            try {
                const hasBadInput = Array.from(document.querySelectorAll('input.form-control')).some(input =>
                                                                                                     input &&
                                                                                                     typeof input.style.border === 'string' &&
                                                                                                     (
                    input.style.border.includes('red') ||
                    input.style.border.includes('blue')
                )
                                                                                                    );

                if (saveButton) {
                    saveButton.disabled = hasBadInput;
                }

                modalSaveButtons.forEach(btn => {
                    btn.disabled = hasBadInput;
                });
            } catch (e) {
            }
        }

        const style = document.createElement('style');
        style.innerHTML = `
        #${alertBoxId} {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #f8d7da;
            border: 1px solid #e57373;
            border-radius: 12px;
            padding: 15px 20px;
            z-index: 9999;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            font-size: 14px;
            max-width: 400px;
            line-height: 1.6;
            color: #721c24;
            font-family: "Helvetica Neue", Arial, sans-serif;
        }

        #${alertBoxId} span {
            position: absolute;
            top: -8px;
            right: -8px;
            width: 30px;
            height: 30px;
            background-color: #f44336;
            color: #fff;
            text-align: center;
            line-height: 30px;
            border-radius: 50%;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: background-color 0.3s, transform 0.2s;
        }

        #${alertBoxId} span:hover {
            background-color: #d32f2f;
            transform: scale(1.1);
        }

        #${alertBoxId} div {
            margin-bottom: 5px;
            margin-top: 5px;
        }
    `;

        document.head.appendChild(style);

        function updateAlertMessages() {
            let alertBox = document.getElementById(alertBoxId);

            const messages = [];
            if (alertTypesSet.has('space')) messages.push('・コード、または項目名にスペースが含まれています。');
            if (alertTypesSet.has('symbol')) messages.push('・項目名に機種依存文字か半角記号が含まれています。');
            if (alertTypesSet.has('over33')) messages.push('・項目名が32byteを超えています。<br>　32byte以内に収めてください。');
            if (alertTypesSet.has('over21')) messages.push('・代表商品コード+SKUが20byteを超えています。<br>　20byte以内に収めてください。');
            if (alertTypesSet.has('invalidChar')) messages.push('・コードに使用できない文字が含まれています。');

            if (messages.length === 0) {
                if (alertBox) {
                    alertBox.remove();
                }
                return;
            }

            if (!alertBox) {
                alertBox = document.createElement('div');
                alertBox.id = alertBoxId;
                document.body.appendChild(alertBox);
            }

            let newMessagesHTML = messages.map(msg => `<div>${msg}</div>`).join('');
            alertBox.innerHTML = `<span onclick="this.parentNode.remove()">×</span>` + newMessagesHTML;
        }

        function recalculateAllAlerts() {
            alertTypesSet.clear();

            document.querySelectorAll('table.table-bordered tbody tr').forEach(tr => {
                const axisInput = tr?.children?.[1]?.querySelector('input.form-control');
                if (axisInput) {
                    const value = axisInput.value || '';
                    if (countByte(value) >= 33) alertTypesSet.add('over33');
                    if (containsSpace(value)) alertTypesSet.add('space');
                    if (containsSymbols(value)) alertTypesSet.add('symbol');
                }
            });

            document.querySelectorAll('div.modal-content').forEach(modal => {
                const inputs = modal.querySelectorAll('input.form-control');
                if (inputs.length > 0) {
                    const first = inputs[0]?.value || '';
                    const second = inputs[1]?.value || '';

                    if (countByte(currentCode + first) >= 21) alertTypesSet.add('over21');

                    if (countByte(second) >= 33) alertTypesSet.add('over33');

                    if (containsSpace(first)) alertTypesSet.add('space');
                    if (containsSpace(second)) alertTypesSet.add('space');

                    if (containsSymbols(second)) alertTypesSet.add('symbol');
                    if (hasInvalidChar(first)) alertTypesSet.add('invalidChar');

                }
            });

            updateAlertMessages();
            updateSaveButtonsState();
        }

        function attachListeners(input, conditionFn) {
            if (!input || input.dataset.hasListener) return;

            const handler = () => {
                applyHighlight(input, conditionFn);
                recalculateAllAlerts();
                updateSaveButtonsState();
            };

            input.addEventListener('input', handler);
            handler();
            input.dataset.hasListener = 'true';
        }

        function extractCodeFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            currentCode = urlParams.get('code') || '';
        }

        function detectSaveButtons() {
            const buttons = document.querySelectorAll('div.row10.mb10 button.btn.btn-primary');
            saveButton = Array.from(buttons).find(btn =>
                                                  btn.textContent.includes('項目名保存') || btn.textContent === '保存'
                                                 ) || null;

            modalSaveButtons = Array.from(document.querySelectorAll('div.modal-footer button.btn-primary'))
                .filter(btn => btn.textContent.includes('保存'));
        }

        function highlightInputs() {
            try {
                extractCodeFromUrl();
                detectSaveButtons();

                const modal = document.getElementById('modalAxisCodeInsertForm');
                const isModalVisible = modal && modal.style.display === 'block';

                if (!isModalVisible) {
                    document.querySelectorAll('table.table-bordered tbody tr').forEach(tr => {
                        const axisInput = tr?.children?.[1]?.querySelector('input.form-control');
                        if (axisInput) {
                            attachListeners(axisInput, highlightAxis);
                        }
                    });
                }

                document.querySelectorAll('div.modal-content').forEach(modal => {
                    const modalInputs = modal.querySelectorAll('input.form-control');
                    const codeInput = modalInputs[0];
                    const axisInput = modalInputs[1];

                    if (codeInput) attachListeners(codeInput, highlightCode);
                    if (axisInput) attachListeners(axisInput, highlightAxis);
                });
            } catch (e) {}
        }

        function clearModalHighlights(modal) {
            if (!modal) return;
            modal.querySelectorAll('input.form-control').forEach(input => {
                input.style.border = '';
            });
        }

        function observeDynamicElements() {
            new MutationObserver(() => {
                highlightInputs();
            }).observe(document.body, {
                childList: true,
                subtree: true
            });

            observeModalDisplayState();
        }

        function observeModalDisplayState() {
            const modal = document.getElementById('modalAxisCodeInsertForm');
            if (!modal) return;

            let previousDisplay = modal.style.display;

            new MutationObserver(() => {
                const currentDisplay = modal.style.display;

                if (previousDisplay !== currentDisplay) {
                    previousDisplay = currentDisplay;

                    if (currentDisplay === 'none') {
                        clearModalHighlights(modal);
                        recalculateAllAlerts();
                        updateSaveButtonsState();
                    } else {
                        highlightInputs();
                        recalculateAllAlerts();
                        updateSaveButtonsState();
                    }
                }
            }).observe(modal, {
                attributes: true,
                attributeFilter: ['style']
            });
        }
        highlightInputs();
        observeDynamicElements();
    }

    function autoReplaceAxisCode(){

        let tableData = [];
        let warningMessage = '置換データを読み込んでいます...';
        let warningColor = 'black';
        let isLoaded = false;

        const updateWarnings = () => {
            document.querySelectorAll('.replace-warning-message').forEach(span => {
                span.innerHTML = warningMessage;
                span.style.color = warningColor;
            });
        };

        const loadReplacementData = () => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://plus-nao.com/forests/TbStockReplaceWord',
                onload: function (response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const rows = doc.querySelectorAll('.listdot100par tr');

                    tableData = [];
                    rows.forEach(row => {
                        const cells = row.querySelectorAll('td');
                        if (cells.length > 1) {
                            tableData.push({
                                key: cells[0].textContent.trim(),
                                value: cells[1].textContent.trim()
                            });
                        }
                    });

                    tableData.sort((a, b) => b.key.length - a.key.length);

                    if (tableData.length > 0) {
                        warningMessage = '';
                        warningColor = 'black';
                        isLoaded = true;
                    } else {
                        warningMessage = '置換データの読み込みに失敗しました<br>(plus-nao.comにログインが必要な場合があります)';
                        warningColor = 'red';
                    }

                    updateWarnings();
                },
                onerror: function () {
                    warningMessage = '置換データの取得中にエラーが発生しました';
                    warningColor = 'red';
                    updateWarnings();
                },
                ontimeout: function () {
                    warningMessage = '置換データの取得がタイムアウトしました';
                    warningColor = 'red';
                    updateWarnings();
                }
            });
        };

        const modalObserver = new MutationObserver(() => {
            document.querySelectorAll('div.modal-content').forEach(modal => {
                const inputs = modal.querySelectorAll('input.form-control');
                if (inputs.length > 1) {
                    const codeInput = inputs[0];
                    const axisInput = inputs[1];

                    if (!axisInput.dataset.listenerAdded) {
                        axisInput.dataset.listenerAdded = 'true';

                        let messageSpan = document.createElement('span');
                        messageSpan.className = 'replace-warning-message';
                        messageSpan.textContent = warningMessage;
                        messageSpan.style.marginLeft = '10px';
                        messageSpan.style.color = warningColor;
                        messageSpan.style.fontSize = '12px';
                        messageSpan.style.display = 'inline-block';
                        messageSpan.style.maxWidth = '250px';
                        messageSpan.style.verticalAlign = 'middle';
                        axisInput.parentElement.appendChild(messageSpan);

                        axisInput.addEventListener('input', () => {
                            const original = axisInput.value.trim();

                            if (!original) {
                                codeInput.value = '';
                            } else {
                                const exclusionPattern = /【[^【】]*】/g;
                                const filteredText = original.replace(exclusionPattern, '');

                                let replaced = filteredText;
                                for (const { key, value } of tableData) {
                                    replaced = replaced.replaceAll(key, value);
                                }

                                replaced = replaced.replaceAll('×', 'x');

                                replaced = replaced.replace(/[^a-zA-Z0-9\-]/g, '');

                                codeInput.value = replaced;
                            }

                            const inputEvent = new Event('input', {
                                bubbles: true,
                                cancelable: true
                            });
                            codeInput.dispatchEvent(inputEvent);
                        });

                        updateWarnings();
                    }
                }
            });
        });

        modalObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        loadReplacementData();

    }

    function denpyoUpdateGuard() {

        const CAL_URL = "https://starlight.plusnao.co.jp/json/calendar-data.json";
        const CAL_KEY = "doukon_calendar_map_v1";
        const CAL_META_KEY = "doukon_calendar_meta_v1";
        let calendarMap = null;

        function toJST(d = new Date()) {
            return new Date(d.getTime() + (9 * 60 + d.getTimezoneOffset()) * 60 * 1000);
        }
        function ymd(date, sep = "-") {
            const d = toJST(date);
            const yyyy = d.getFullYear();
            const mm = ("0" + (d.getMonth() + 1)).slice(-2);
            const dd = ("0" + d.getDate()).slice(-2);
            return `${yyyy}${sep}${mm}${sep}${dd}`;
        }
        function loadCache() { try { return JSON.parse(GM_getValue(CAL_KEY, "{}")); } catch { return {}; } }
        function loadMeta() { try { return JSON.parse(GM_getValue(CAL_META_KEY, "{}")); } catch { return {}; } }
        function saveMeta(meta) { GM_setValue(CAL_META_KEY, JSON.stringify(meta)); }
        function saveCache(map, meta) { GM_setValue(CAL_KEY, JSON.stringify(map)); saveMeta(meta); calendarMap = map; }
        function getHeader(headersText, name) {
            const m = (headersText || "").match(new RegExp("^" + name + ":\\s*(.+)$", "im"));
            return m ? m[1].trim() : "";
        }
        function normalizeMap(raw) {
            let obj; try { obj = typeof raw === "string" ? JSON.parse(raw) : raw; } catch { return null; }
            if (!obj || typeof obj !== "object") return null;
            const out = {};
            for (const [k, v] of Object.entries(obj)) {
                if (/^\d{4}-\d{2}-\d{2}$/.test(k) && (v === 0 || v === -1)) out[k] = v;
            }
            return Object.keys(out).length ? out : null;
        }
        function fetchCalendarOncePerDay() {
            const meta = loadMeta();
            const today = ymd(new Date());
            const cached = loadCache();
            calendarMap = cached || {};
            if (meta.lastChecked === today && cached && Object.keys(cached).length) return;

            const headers = {};
            if (meta.etag) headers["If-None-Match"] = meta.etag;
            if (meta.lastModified) headers["If-Modified-Since"] = meta.lastModified;

            GM_xmlhttpRequest({
                method: "GET",
                url: CAL_URL,
                headers,
                timeout: 10000,
                onload: (res) => {
                    try {
                        if (res.status === 200) {
                            const map = normalizeMap(res.responseText);
                            meta.lastChecked = today;
                            if (map) {
                                const etag = getHeader(res.responseHeaders, "ETag");
                                const lastMod = getHeader(res.responseHeaders, "Last-Modified");
                                if (etag) meta.etag = etag;
                                if (lastMod) meta.lastModified = lastMod;
                                saveCache(map, meta);
                            } else {
                                saveMeta(meta);
                            }
                        } else if (res.status === 304) {
                            meta.lastChecked = today; saveMeta(meta);
                            calendarMap = cached || {};
                        } else {
                            meta.lastChecked = today; saveMeta(meta);
                            calendarMap = cached || {};
                        }
                    } catch {
                        meta.lastChecked = today; saveMeta(meta);
                        calendarMap = cached || {};
                    }
                },
                onerror: () => { const m = loadMeta(); m.lastChecked = today; saveMeta(m); calendarMap = cached || {}; },
                ontimeout: () => { const m = loadMeta(); m.lastChecked = today; saveMeta(m); calendarMap = cached || {}; }
            });
        }
        function isBusinessDay(date) {
            if (!calendarMap) calendarMap = loadCache() || {};
            const key = ymd(date, "-");
            if (Object.prototype.hasOwnProperty.call(calendarMap, key)) {
                return calendarMap[key] === -1;
            }
            const d = toJST(date).getDay();
            return d !== 0 && d !== 6;
        }

        fetchCalendarOncePerDay();

        function isBusinessHours() {
            const nowJST = toJST(new Date());
            const hour = nowJST.getHours();
            const minute = nowJST.getMinutes();

            const isWeekday = isBusinessDay(nowJST);

            const totalMinutes = hour * 60 + minute;
            const startMinutes = 7 * 60;
            const endMinutes = 18 * 60;

            const isWorkHours = totalMinutes >= startMinutes && totalMinutes <= endMinutes;

            return isWeekday && isWorkHours;
        }

        function createOverlayButton(original) {
            let overlay = document.getElementById('overlay_syusei_btn');
            if (overlay) return overlay;

            const clone = original.cloneNode(true);
            clone.id = 'overlay_syusei_btn';

            clone.style.position = 'absolute';
            clone.style.zIndex = 9999;
            clone.style.cursor = 'pointer';
            clone.style.userSelect = 'none';

            original.style.position = original.style.position || 'relative';
            original.style.zIndex = 1;
            original.style.pointerEvents = 'none';

            document.body.appendChild(clone);

            return clone;
        }

        function updateOverlayPosition(original, overlay) {
            const rect = original.getBoundingClientRect();
            overlay.style.top = window.scrollY + rect.top + 'px';
            overlay.style.left = window.scrollX + rect.left + 'px';
            overlay.style.height = rect.height + 'px';

            overlay.style.display = 'inline-flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.whiteSpace = 'nowrap';
            overlay.style.fontSize = window.getComputedStyle(original).fontSize;
            overlay.style.lineHeight = rect.height + 'px';
        }

        function setupOverlayBehavior(value, original, overlay) {
            const denpyoInput = document.getElementById('jyuchu_denpyo_no');
            if (!denpyoInput) return;

            const updateOverlay = () => {
                const denpyoVal = denpyoInput.value.trim();

                if (denpyoVal === '') {
                    overlay.style.display = 'none';
                    original.style.pointerEvents = 'auto';
                    return;
                }

                overlay.replaceWith(overlay.cloneNode(true));
                overlay = document.getElementById('overlay_syusei_btn');
                if (!overlay) return;

                overlay.onclick = null;
                overlay.removeEventListener('click', overlay._clickHandler);
                delete overlay._clickHandler;

                if (value === "40") {
                    overlay.textContent = '⚠️更新禁止⚠️';
                    overlay.style.backgroundColor = "#ffcccc";
                    overlay.style.color = "#aa0000";
                    overlay.style.border = "1px solid #aa0000";
                    overlay.style.fontWeight = "bold";

                    overlay.style.display = 'flex';
                    overlay.style.alignItems = 'center';
                    overlay.style.justifyContent = 'center';
                    overlay.style.lineHeight = 'normal';

                    const clickHandler = async function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();

                        const msg1 = "⚠️この伝票は『納品書印刷済み』です⚠️\n本当に更新しますか？";
                        const msg2 = "更新を実行すると情報が変更される可能性があります。\n本当によろしいですか？";

                        if (!(await showConfirmationModal(msg1))) return;
                        if (!(await showConfirmationModal(msg2))) return;

                        original.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    };

                    overlay.addEventListener('click', clickHandler);
                    overlay._clickHandler = clickHandler;

                } else if (value === "20") {
                    overlay.textContent = '伝票更新⚠️';
                    overlay.style.backgroundColor = '';
                    overlay.style.color = '';
                    overlay.style.border = '';
                    overlay.style.fontWeight = '';

                    overlay.style.display = 'flex';
                    overlay.style.alignItems = 'center';
                    overlay.style.justifyContent = 'center';
                    overlay.style.lineHeight = 'normal';

                    const clickHandler = async function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();

                        if (isBusinessHours()) {
                            const msg = "⚠️この伝票は『納品書印刷待ち』の状態です⚠️\n本当に更新しますか？";
                            if (!(await showConfirmationModal(msg))) return;
                        }

                        original.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    };

                    overlay.addEventListener('click', clickHandler);
                    overlay._clickHandler = clickHandler;

                } else {
                    overlay.style.display = 'none';
                    original.style.pointerEvents = 'auto';
                }
            };

            updateOverlay();
            denpyoInput.addEventListener('input', updateOverlay);
        }

        function showConfirmationModal(message) {
            return new Promise((resolve) => {
                const existing = document.getElementById('custom-confirm-overlay');
                if (existing) existing.remove();

                const overlay = document.createElement('div');
                overlay.id = 'custom-confirm-overlay';
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100vw';
                overlay.style.height = '100vh';
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                overlay.style.zIndex = '9999';
                overlay.style.display = 'flex';
                overlay.style.alignItems = 'center';
                overlay.style.justifyContent = 'center';

                const modal = document.createElement('div');
                modal.id = 'custom-confirm';
                modal.style.background = '#fff0f0';
                modal.style.border = '3px solid #aa0000';
                modal.style.padding = '30px 20px';
                modal.style.borderRadius = '10px';
                modal.style.textAlign = 'center';
                modal.style.boxShadow = '0 0 20px rgba(0,0,0,0.7)';
                modal.style.maxWidth = '90%';
                modal.style.minWidth = '320px';
                modal.style.fontSize = '18px';
                modal.style.fontWeight = 'bold';
                modal.style.color = '#aa0000';

                const msg = document.createElement('div');
                msg.innerText = message;
                msg.style.marginBottom = '25px';
                msg.style.whiteSpace = 'pre-line';

                const buttonWrapper = document.createElement('div');
                buttonWrapper.style.display = 'flex';
                buttonWrapper.style.justifyContent = 'center';
                buttonWrapper.style.gap = '20px';

                const baseBtnStyle = `
            padding: 10px 20px;
            min-width: 120px;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            white-space: nowrap;
        `;

                const ok = document.createElement('button');
                ok.innerText = 'OK';
                ok.style = baseBtnStyle + 'background-color: #aa0000; color: white;';
                ok.onclick = () => {
                    overlay.remove();
                    resolve(true);
                };

                const cancel = document.createElement('button');
                cancel.innerText = 'キャンセル';
                cancel.style = baseBtnStyle + 'background-color: #ccc; color: black;';
                cancel.onclick = () => {
                    overlay.remove();
                    resolve(false);
                };

                buttonWrapper.appendChild(ok);
                buttonWrapper.appendChild(cancel);
                modal.appendChild(msg);
                modal.appendChild(buttonWrapper);
                overlay.appendChild(modal);
                document.body.appendChild(overlay);
            });
        }


        function main() {
            const original = document.getElementById('syusei_btn');
            const select = document.getElementById('jyuchu_jyotai_kbn');
            const denpyoInput = document.getElementById('jyuchu_denpyo_no');

            if (!original || !select || !denpyoInput) {
                return;
            }

            let overlay = createOverlayButton(original);
            updateOverlayPosition(original, overlay);
            setupOverlayBehavior(select.value, original, overlay);

            select.addEventListener('change', function () {
                setupOverlayBehavior(this.value, original, overlay);
            });

            window.addEventListener('scroll', () => updateOverlayPosition(original, overlay));
            window.addEventListener('resize', () => updateOverlayPosition(original, overlay));

            let previousDenpyoValue = denpyoInput.value;
            let previousSelectValue = select.value;

            setInterval(() => {
                const currentDenpyoValue = denpyoInput.value;
                const currentSelectValue = select.value;

                if (currentDenpyoValue !== previousDenpyoValue || currentSelectValue !== previousSelectValue) {
                    previousDenpyoValue = currentDenpyoValue;
                    previousSelectValue = currentSelectValue;
                    setupOverlayBehavior(currentSelectValue, original, overlay);
                }
            }, 500);
        }

        if (document.readyState === 'complete') {
            main();
        } else {
            window.addEventListener('load', main);
        }
    }

    function applyTagStyle(){

        const TAG_COLORS = {
            "モール未処理":      { bg: "rgb(251, 246, 173)", color: "rgb(0, 0, 0)" },
            "モールキャンセル":  { bg: "rgb(255, 161, 10)", color: "rgb(0, 0, 0)" },
            "楽天チャット":      { bg: "rgb(177, 22, 25)", color: "rgb(255, 255, 255)" },
            "LINE":             { bg: "rgb(63, 255, 10)", color: "rgb(0, 0, 0)" },
            "返品or交換":        { bg: "rgb(29, 147, 6)", color: "rgb(255, 255, 255)" },
            "住所不明":          { bg: "rgb(224, 128, 209)", color: "rgb(0, 0, 0)" },
            "入荷待ち":          { bg: "rgb(227, 255, 10)", color: "rgb(0, 0, 0)" },
            "Yahooチャット":     { bg: "rgb(255, 133, 10)", color: "rgb(0, 0, 0)" },
            "キャンセル伺い":    { bg: "rgb(243, 79, 108)", color: "rgb(0, 0, 0)" },
            "モール保留":        { bg: "rgb(69, 211, 84)", color: "rgb(0, 0, 0)" }
        };

        function addCustomStyles() {
            if (document.getElementById('custom-tag-input-style')) return;
            const style = document.createElement('style');
            style.id = 'custom-tag-input-style';
            style.textContent = `
#tag_input.custom-style {
    -webkit-text-size-adjust: 100%;
    --color-capturing: #8f8;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #333333;
    font-size: 11px;
    line-height: 18px;
    box-sizing: border-box;
    padding: 3px 6px 2px 6px;
    width: 100%;
    background-color: #fdfdfd;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    letter-spacing: 0;
    position: relative;
}
#tag_input.custom-style a {
    -webkit-text-size-adjust: 100%;
    --color-capturing: #8f8;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 11px;
    box-sizing: border-box;
    color: #000;
    border: 1px solid #000;
    border-radius: 9px;
    display: inline-block;
    font-weight: bold;
    letter-spacing: normal;
    line-height: 1.2;
    margin-bottom: 4px;
    margin-right: 4px;
    text-decoration: none;
    padding: 1px 4px;
    outline: none;
    word-break: break-all;
    cursor: pointer;
    user-select: none;
    background-color: transparent;
    transition: background-color 0.2s ease;
}
#tag_input.custom-style a.selected-tag {
    outline: 2px solid #0078d7 !important;
    box-shadow: 0 0 0 3px rgba(0,120,215,0.25);
    position: relative;
}
#tag_input.custom-style a.selected-tag::after {
    content: "✓";
    position: absolute;
    top: -8px;
    right: -8px;
    font-size: 13px;
    color: #0078d7;
    border: 2px solid #0078d7;
    background: #fff;
    border-radius: 50%;
    padding: 0 2px;
    font-weight: bold;
    box-sizing: border-box;
}
    `;
            document.head.appendChild(style);
        }

        function isOldStyle() {
            const items = document.querySelectorAll('ul.sub_menu li.style-change');
            for (const item of items) {
                if (item.getAttribute('data-style-id') === '0' && item.classList.contains('style-checked')) {
                    return true;
                }
            }
            return false;
        }

        function getSelectedTags() {
            const jyuchuTagTextarea = document.getElementById('jyuchu_tag');
            if (!jyuchuTagTextarea) return [];
            const rawText = jyuchuTagTextarea.value || '';
            const matches = rawText.match(/\[([^\]]+)\]/g);
            if (!matches) return [];
            const tags = matches.map(s => s.replace(/^\[|\]$/g, '').trim()).filter(s => s.length > 0);
            return tags;
        }

        function applyCustomStyle() {
            const tagInput = document.getElementById('tag_input');
            if (!tagInput) return;

            tagInput.classList.add('custom-style');

            const selectedTags = getSelectedTags();

            const anchors = tagInput.querySelectorAll('a');
            anchors.forEach(a => {
                const text = a.textContent.trim();

                if (TAG_COLORS.hasOwnProperty(text)) {
                    a.style.backgroundColor = TAG_COLORS[text].bg;
                    a.style.color = TAG_COLORS[text].color;
                    a.style.border = '1.5px solid #000';
                } else {
                    a.style.backgroundColor = '';
                    a.style.color = '';
                    a.style.border = '';
                }

                if (selectedTags.includes(text)) {
                    a.classList.add('selected-tag');
                } else {
                    a.classList.remove('selected-tag');
                }

                if (!a.dataset.listenerAdded) {
                    a.addEventListener('click', function(e) {
                        const jyuchuTagTextarea = document.getElementById('jyuchu_tag');
                        if (!jyuchuTagTextarea) return;

                        if (a.classList.contains('selected-tag')) {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            e.stopPropagation();

                            const tagPattern = new RegExp(`\\s*\\[${escapeRegExp(text)}\\]\\s*`, "g");
                            jyuchuTagTextarea.value = jyuchuTagTextarea.value.replace(tagPattern, " ");
                            jyuchuTagTextarea.value = jyuchuTagTextarea.value.replace(/\s+/g, " ").trim();

                            const event = new Event('input', { bubbles: true });
                            jyuchuTagTextarea.dispatchEvent(event);

                        } else {
                            const event = new Event('input', { bubbles: true });
                            jyuchuTagTextarea.dispatchEvent(event);
                        }

                        setTimeout(applyCustomStyle, 10);
                    }, true);

                    a.dataset.listenerAdded = 'true';
                }

            });
        }

        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }


        function observeTagInput() {
            const tagInput = document.getElementById('tag_input');
            if (!tagInput || tagInput.dataset.observerAdded) return;

            const observer = new MutationObserver(() => {
                applyCustomStyle();
            });

            observer.observe(tagInput, { childList: true, subtree: true });
            tagInput.dataset.observerAdded = 'true';
        }

        let prevDenpyoNo = null;
        setInterval(() => {
            const denpyoInput = document.getElementById('jyuchu_denpyo_no');
            if (!denpyoInput) return;
            const nowNo = denpyoInput.value;
            if (prevDenpyoNo !== nowNo) {
                prevDenpyoNo = nowNo;
                applyCustomStyle();
            }
        }, 700);

        function main() {
            if (isOldStyle()) {
                addCustomStyles();
                applyCustomStyle();
                observeTagInput();

                const jyuchuTagTextarea = document.getElementById('jyuchu_tag');
                if (jyuchuTagTextarea) {
                    jyuchuTagTextarea.addEventListener('input', () => {
                        applyCustomStyle();
                    });
                }
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', main);
        } else {
            main();
        }
    }

    function denpyoAutoReflect(){

        const OLD_KEY = 'jyuchu_denpyo_no_old';
        const NEW_KEY = 'jyuchu_denpyo_no';
        const FLAG_KEY = 'update_flag';

        function main() {
            localStorage.removeItem(NEW_KEY);

            const inputElem = document.getElementById('jyuchu_denpyo_no');
            if (!inputElem) return;

            let lastVal = '';
            let wasEmpty = true;
            let initialized = false;

            setTimeout(() => {
                initialized = true;
            }, 1000);

            setInterval(() => {
                const currentVal = inputElem.value;

                if (currentVal === '') {
                    wasEmpty = true;
                } else {
                    if (initialized && wasEmpty && currentVal !== lastVal) {
                        localStorage.setItem(NEW_KEY, currentVal);
                        wasEmpty = false;
                    }
                }
                lastVal = currentVal;
            }, 500);

            function oldValSaveHandler() {
                const currentVal = inputElem.value || '';
                if (currentVal) {
                    localStorage.setItem(OLD_KEY, currentVal);
                }
            }

            const observer = new MutationObserver((mutations, obs) => {
                const btn = document.getElementById('ne_dlg_btn1_hukusyaDlg');
                if (btn) {
                    btn.addEventListener('click', () => {
                        oldValSaveHandler();
                        addReflectButton();
                    });

                    obs.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', main);
        } else {
            main();
        }

        window.addEventListener('storage', (event) => {
            if (event.key === FLAG_KEY) {
                reflectDenpyo();
            }
        });

        function getTodayDate() {
            const date = new Date();
            const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
            const jstDate = new Date(utc + (9 * 60 * 60000));
            const mm = String(jstDate.getMonth() + 1).padStart(2, '0');
            const dd = String(jstDate.getDate()).padStart(2, '0');
            return `${mm}/${dd}`;
        }

        async function reflectDenpyo(myDenpyo) {
            const textarea = document.getElementById('sagyosya_ran');
            if (!textarea) {
                return;
            }

            const oldVal = localStorage.getItem(OLD_KEY) || '';
            const newVal = localStorage.getItem(NEW_KEY) || '';

            const oldLine = oldVal ? `（元伝: ${oldVal}）` : '';
            const newLine = newVal ? `${getTodayDate()}（複写: ${newVal}）` : '';

            const lines = [oldLine, newLine].filter(line => line !== '');

            if (lines.length === 0) return;

            const existingText = textarea.value || '';

            let combinedText = lines.join('\n') + (existingText ? '\n' + existingText : '');

            const jyuchuInput = document.getElementById('jyuchu_denpyo_no');
            if (jyuchuInput) {
                const currentVal = jyuchuInput.value;
                if (currentVal) {
                    const textLines = combinedText.split('\n');
                    const filteredLines = textLines.filter(line => !line.includes(currentVal));
                    combinedText = filteredLines.join('\n');
                }
            }

            textarea.value = combinedText;
        }

        function addReflectButton() {
            const targetTd = document.querySelector('#jyuyou_check_head td.group_head');

            const button = document.createElement('button');
            button.textContent = '複写処理';
            Object.assign(button.style, {
                position: 'absolute',
                top: '0',
                right: '95px',
                minWidth: '0',
                width: 'auto',
                fontSize: '10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                zIndex: 1000,
            });

            targetTd.style.position = 'relative';
            targetTd.appendChild(button);

            button.addEventListener('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();
                button.remove();

                resetFormFields();
                resetTable();

                const messageDiv = document.createElement('div');
                messageDiv.textContent = '新規登録を押して複写自動処理を続行します';
                Object.assign(messageDiv.style, {
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    zIndex: 10000,
                    boxShadow: '0 0 6px rgba(0,0,0,0.3)',
                });

                document.body.appendChild(messageDiv);

                await waitForJyuchuDenpyoNo();

                messageDiv.remove();

                localStorage.setItem(FLAG_KEY, Date.now().toString());
                await reflectDenpyo();
                handleNumberInput();
            });
        }

        function resetFormFields() {
            const resetIds = [
                'syohin_kin', 'zei_kin', 'tesuryo_kin', 'hasou_kin', 'sonota_kin', 'point', 'goukei_kin'
            ];

            const select = document.getElementById('siharai_kbn');
            if (select) {
                select.value = '99';
                select.dispatchEvent(new Event('change'));
            }

            resetIds.forEach(id => {
                const elem = document.getElementById(id);
                if (elem) {
                    elem.value = '0';
                    elem.dispatchEvent(new Event('input'));
                    elem.dispatchEvent(new Event('change'));
                }
            });
        }

        const handleNumberInput = (val) => {
            const popupButton = document.getElementById('show-jidousousin-btn');
            if (!popupButton) {
                return;
            }
            popupButton.click();

            const maxWaitMs = 5000;
            const intervalMs = 200;
            let waited = 0;

            const waitForPopupAndOperate = () => {
                const stopMailCheckbox = document.getElementById('stop_mail_j');
                const registerButton = document.getElementById('ne_dlg_btn1_ne_Dialog');
                const closeButton = document.getElementById('ne_dlg_btn0_ne_Dialog');

                if (stopMailCheckbox && registerButton && closeButton) {
                    if (!stopMailCheckbox.checked) {
                        stopMailCheckbox.click();
                        registerButton.click();
                    } else {
                        closeButton.click();
                    }

                } else {
                    if (waited >= maxWaitMs) {
                        return;
                    }
                    waited += intervalMs;
                    setTimeout(waitForPopupAndOperate, intervalMs);
                }
            };

            setTimeout(waitForPopupAndOperate, intervalMs);
        };

        function waitForJyuchuDenpyoNo(interval = 100) {
            return new Promise((resolve) => {
                const check = () => {
                    const val = document.getElementById('jyuchu_denpyo_no')?.value;
                    if (val && val.trim() !== '') {
                        resolve();
                    } else {
                        setTimeout(check, interval);
                    }
                };

                check();
            });
        }

        const simulateInputChange = (input, value) => {

            input.focus();
            input.value = value;

            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));

            const parentCell = input.closest('td');
            if (parentCell) {
                input.blur();
                parentCell.textContent = value;
            }
        };

        const resetTable = () => {

            const table = document.getElementById('jyuchuMeisai_tablene_table');
            if (!table) {
                return;
            }

            const rows = Array.from(table.rows);
            if (rows.length < 2) {
                return;
            }

            const headerTexts = Array.from(rows[0].cells).map(cell => cell.textContent.trim());
            const targetIndices = ['売単価', '小計'].map(col => headerTexts.indexOf(col)).filter(i => i !== -1);

            if (targetIndices.length === 0) {
                return;
            }

            let delay = 0;
            rows.slice(1).forEach((row, rowIndex) => {
                targetIndices.forEach(index => {
                    const cell = row.cells[index];
                    if (!cell) {
                        return;
                    }

                    setTimeout(() => {
                        cell.click();

                        setTimeout(() => {
                            const editInput = cell.querySelector('input[type="text"]:not([readonly])');
                            if (!editInput) {
                                return;
                            }
                            simulateInputChange(editInput, '0');
                        }, 150);
                    }, delay);

                    delay += 400;
                });
            });

        };
    }

    function jyuchuDateCheck() {
        function main() {
            const inputDate = document.getElementById('jyuchu_bi');
            if (!inputDate) return;

            let dismissedDateStr = null;
            const periodMonths = 2;

            const checkDate = () => {
                const dateStr = inputDate.value;
                const dateParts = dateStr.split('/');
                if (dateParts.length !== 3) return;

                const jyuchuDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                const now = new Date();
                const periodAgo = new Date();
                periodAgo.setMonth(periodAgo.getMonth() - periodMonths);

                if (jyuchuDate < periodAgo) {
                    if (dismissedDateStr === dateStr) return;
                    showWarningBox(dateStr);
                } else {
                    const existingBox = document.getElementById('jyuchu_warning_box');
                    if (existingBox) existingBox.remove();
                    dismissedDateStr = null;
                }
            };

            const showWarningBox = (dateStr) => {
                if (document.getElementById('jyuchu_warning_box')) return;

                const box = document.createElement('div');
                box.id = 'jyuchu_warning_box';
                box.style.cssText = `
                position: fixed;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #fff3cd;
                color: #856404;
                border: 1px solid #ffeeba;
                padding: 16px 24px;
                font-weight: bold;
                font-size: 16px;
                text-align: center;
                border-radius: 8px;
                z-index: 99999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            `;

                const closeBtn = document.createElement('button');
                closeBtn.textContent = '×';
                closeBtn.style.cssText = `
                position: absolute;
                top: 4px;
                right: 4px;
                width: 28px;
                height: 28px;
                background: transparent;
                border: none;
                font-size: 24px;
                font-weight: bold;
                color: #856404;
                cursor: pointer;
                line-height: 28px;
                padding: 0;
                user-select: none;
                text-align: center;
            `;
                closeBtn.onclick = () => {
                    dismissedDateStr = dateStr;
                    box.remove();
                };
                box.appendChild(closeBtn);

                const message = document.createElement('div');
                message.innerHTML = `
                この伝票の受注日は <strong>${periodMonths}ヶ月以上前</strong> の日付です。<br>
                再検索をお願いします。<br><br>
            `;
                box.appendChild(message);

                const btn = document.createElement('button');
                btn.textContent = '再検索';
                btn.style.cssText = 'padding: 8px 16px; font-size: 14px; cursor: pointer; white-space: nowrap;';
                btn.onclick = reseach;

                box.appendChild(btn);
                document.body.appendChild(box);
            };

            const reseach = () => {
                const menuLink = document.getElementById('sub_menu_03_01_lnk');
                if (menuLink) menuLink.click();

                const denpyoInput = document.getElementById('jyuchu_denpyo_no');
                const searchInput = document.getElementById('sea_jyuchu_search_field02');
                const searchButton = document.getElementById('ne_dlg_btn2_searchJyuchuDlg');

                if (!denpyoInput || !searchInput || !searchButton) {
                    return alert('必要な要素が見つかりません');
                }

                const denpyoValue = denpyoInput.value.trim();
                if (!denpyoValue) {
                    return alert('伝票番号が空です');
                }

                searchInput.value = denpyoValue;
                searchButton.click();

                const observer = new MutationObserver(() => {
                    const table = document.getElementById('searchJyuchu_tablene_table');
                    if (!table) return;

                    const rows = table.querySelectorAll('tbody tr');
                    if (rows.length < 2) return;

                    const targetCell = rows[1].querySelector('td');
                    if (targetCell) {
                        const dblClickEvent = new MouseEvent('dblclick', { bubbles: true });
                        targetCell.dispatchEvent(dblClickEvent);
                        observer.disconnect();

                        let lastDenpyo = denpyoInput.value;
                        const checkInterval = setInterval(() => {
                            const currentDenpyo = denpyoInput.value;
                            if (currentDenpyo && currentDenpyo !== lastDenpyo) {
                                lastDenpyo = currentDenpyo;
                                checkDate();
                            }
                        }, 1000);
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });
            };

            checkDate();
            setInterval(checkDate, 1000);
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', main);
        } else {
            main();
        }
    }

    function freeStockCheck(){

        function insertFreeStockRow() {
            const fontBold = document.querySelector('#subinfo font b');
            if (!fontBold) return;

            const td = fontBold.closest('td');
            const table = td?.closest('table');
            if (!table) return;

            const tbody = table.querySelector('tbody');
            if (!tbody) return;

            const productText = td.textContent.trim();
            const match = productText.match(/^([^\s　]+)/);
            const productCode = match ? match[1].trim() : '';

            if ([...tbody.querySelectorAll('tr')].some(tr => tr.textContent.includes('フリー在庫数'))) return;

            const newRow = document.createElement('tr');
            newRow.style.background = '#FFFFFF';
            newRow.style.height = '10px';

            const newTd = document.createElement('td');
            newTd.style.padding = '1px';
            newTd.setAttribute('align', 'left');
            newTd.textContent = 'フリー在庫数：';

            newRow.appendChild(newTd);

            const trList = tbody.querySelectorAll('tr');
            if (trList.length >= 3) {
                const referenceTr = trList[2];
                referenceTr.parentNode.insertBefore(newRow, referenceTr.nextSibling);
            } else {
                tbody.appendChild(newRow);
            }

            adjustTableSize();

            const popupTrigger = document.getElementById('sub_menu_03_02_lnk');
            if (popupTrigger) {
                popupTrigger.click();
                newTd.textContent = 'フリー在庫数：検索中…';
                waitPopupAndSearch(productCode, newTd);
            } else {
                console.warn('商品検索リンクが見つかりません');
            }
        }

        function waitPopupAndSearch(productCode, tdToUpdate) {
            const popupId = 'ne_dlg_searchSyohinDlg';

            const observer = new MutationObserver((mutations, obs) => {
                const popup = document.getElementById(popupId);
                if (popup && popup.style.visibility === 'visible') {
                    obs.disconnect();
                    performSearchInPopup(productCode, tdToUpdate);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            const popup = document.getElementById(popupId);
            if (popup && popup.style.visibility === 'visible') {
                observer.disconnect();
                performSearchInPopup(productCode, tdToUpdate);
            }
        }

        function performSearchInPopup(productCode, tdToUpdate) {
            const popup = document.getElementById('ne_dlg_searchSyohinDlg');

            const originalDisplay = popup ? popup.style.display : '';

            if (popup) {
                popup.style.display = 'none';
            }

            const input = document.querySelector('#ne_dlg_searchSyohinDlg #sea_syohin_search_field01');
            const btn = document.querySelector('#ne_dlg_searchSyohinDlg #ne_dlg_btn2_searchSyohinDlg');

            if (!input || !btn) {
                console.warn('検索フォームが見つかりません');
                return;
            }

            input.value = productCode;
            btn.click();

            const observer = new MutationObserver((mutations, obs) => {
                const table = document.querySelector('#ne_dlg_searchSyohinDlg #searchsyohin_tablene_table');
                if (table) {
                    const rows = table.querySelectorAll('tbody tr');
                    if (rows.length > 1) {
                        const headerCells = rows[0].querySelectorAll('td');
                        const dataCells = rows[1].querySelectorAll('td');

                        let freeStockIndex = -1;
                        headerCells.forEach((cell, index) => {
                            const div = cell.querySelector('div');
                            const headerText = div ? div.textContent.trim() : cell.textContent.trim();
                            if (headerText === 'ﾌﾘｰ在庫') {
                                freeStockIndex = index;
                            }
                        });

                        if (freeStockIndex !== -1 && dataCells.length > freeStockIndex) {
                            const freeStockValue = dataCells[freeStockIndex].textContent.trim();
                            tdToUpdate.textContent = `フリー在庫数：${freeStockValue}`;
                        } else {
                            tdToUpdate.textContent = 'フリー在庫数：取得失敗';
                        }

                        const closeBtn = popup ? popup.querySelector('img[onclick*="searchSyohinDlg.hide"]') : null;
                        if (closeBtn) {
                            closeBtn.click();
                            setTimeout(() => {
                                if (popup) {
                                    popup.style.display = originalDisplay || 'block';
                                }
                            }, 300);
                        } else if (popup) {
                            popup.style.display = originalDisplay || 'block';
                        }

                        obs.disconnect();
                    }
                }
            });

            observer.observe(document.querySelector('#ne_dlg_searchSyohinDlg'), {
                childList: true,
                subtree: true
            });
        }

        function adjustTableSize() {
            const tableElem = document.querySelector('table[width="100"][height="100"]');
            if (tableElem) {
                tableElem.removeAttribute('width');
                tableElem.removeAttribute('height');
                tableElem.style.width = '85px';
                tableElem.style.height = '85px';
            }
        }

        const subinfo = document.getElementById('subinfo');
        if (subinfo) {
            const observer = new MutationObserver(() => {
                insertFreeStockRow();
            });

            observer.observe(subinfo, {
                childList: true,
                subtree: true,
            });

            insertFreeStockRow();
        }
    }

    function autoLogin(){

        const url = location.href;
        const mallFlagKey = "mall_action_in_progress";
        const mallRetryKeyPrefix = "mall_action_retry_request_";
        const currentJyuchuNoKey = "currentJyuchuNo";

        const valueMapping = {
            1: 1,
            27: 5,
            31: 2,
            32: 3,
            35: 4,
            36: 6,
            40: 'shopify'
        };

        function onReady(fn) {
            if (document.readyState === "loading") {
                window.addEventListener('DOMContentLoaded', fn);
            } else {
                fn();
            }
        }

        if (url === "https://mainmenu.rms.rakuten.co.jp/") {
            let notified = false;

            function notifyNow() {
                if (notified) return;
                notified = true;
                (async () => {
                    const isMallAction = await GM_getValue(mallFlagKey, false);
                    if (!isMallAction) return;

                    const jyuchuNo = await GM_getValue(currentJyuchuNoKey, null);
                    if (!jyuchuNo) return;
                    const retryKey = mallRetryKeyPrefix + jyuchuNo;

                    await GM_setValue(retryKey, true);
                    await GM_setValue(mallFlagKey, false);
                    window.close();
                })();
            }

            window.addEventListener('DOMContentLoaded', () => {
                setTimeout(notifyNow, 3800);
            });

            window.addEventListener('load', () => {
                notifyNow();
            });

            return;
        }

        if (url.startsWith("https://mainmenu.rms.rakuten.co.jp/?act=login&sp_id=1")) {
            onReady(async () => {
                const isMallAction = await GM_getValue(mallFlagKey, false);
                if (!isMallAction) return;
                const btn = document.querySelector('.btn-reset.btn-round.btn-red');
                if (btn) btn.click();
            });
            return;
        }

        if (url.startsWith("https://glogin.rms.rakuten.co.jp/")) {
            onReady(async () => {
                const isMallAction = await GM_getValue(mallFlagKey, false);
                if (!isMallAction) return;
                const loginBtn = document.querySelector('.rf-button-primary.rf-block.rf-medium');
                if (loginBtn) loginBtn.click();
            });
            return;
        }

        if (url.startsWith("https://mainmenu.rms.rakuten.co.jp/?act=app_login_error")) {
            onReady(async () => {
                const isMallAction = await GM_getValue(mallFlagKey, false);
                if (!isMallAction) return;
                await GM_setValue(mallFlagKey, true);
                const shopTypeNo = await GM_getValue('lastshopTypeNo', null);
                const popup = window.open(`https://starlight.plusnao.co.jp/rms/index?shop_type=${shopTypeNo}&id=1354`, "_blank");

                if (!popup || popup.closed || typeof popup.closed == 'undefined') {
                    alert(
                        "ポップアップがブロックされました。\n" +
                        "画面上部やブラウザのアドレスバー付近にブロックの案内が出ている場合は\n" +
                        "「許可」を選択してください。\n\n" +
                        "許可後にもう一度操作をやり直してください。"
                    );
                } else {
                    setTimeout(() => { window.close(); }, 500);
                }
            });
            return;
        }

        if (url.startsWith("https://order-rp.rms.rakuten.co.jp/order-rb/individual-order-detail-sc/init")) {
            onReady(async () => {
                const layoutContent = document.getElementById("layoutContent");
                if (layoutContent && layoutContent.innerText.includes("エラー")) {
                    await GM_setValue(mallFlagKey, true);
                    const shopTypeNo = await GM_getValue('lastshopTypeNo', null);
                    const popup = window.open(`https://starlight.plusnao.co.jp/rms/index?shop_type=${shopTypeNo}&id=1354`, "_blank");

                    if (!popup || popup.closed || typeof popup.closed == 'undefined') {
                        alert(
                            "ポップアップがブロックされました。\n" +
                            "画面上部やブラウザのアドレスバー付近にブロックの案内が出ている場合は\n" +
                            "「許可」を選択してください。\n\n" +
                            "許可後にもう一度操作をやり直してください。"
                        );
                    } else {
                        setTimeout(() => { window.close(); }, 500);
                    }
                } else {
                    await GM_setValue(mallFlagKey, false);
                }
            });
            return;
        }

        if (url.startsWith("https://main.next-engine.com/Userjyuchu/jyuchuInp")) {
            function main() {
                const select = document.getElementById('tenpo_code');
                const moruBtn = document.getElementById('show-moru-btn');
                let prevJyuchuNo = null;

                function monitorJyuchuNo() {
                    const jyuchuNoInput = document.getElementById('jyuchu_denpyo_no');
                    if (!jyuchuNoInput) return;
                    const currentJyuchuNo = jyuchuNoInput.value;
                    if (currentJyuchuNo !== prevJyuchuNo) {
                        prevJyuchuNo = currentJyuchuNo;
                    }
                }
                setInterval(monitorJyuchuNo, 300);

                if (select && moruBtn) {
                    moruBtn.addEventListener('click', async (e) => {

                        const jyuchuNoInput = document.getElementById('jyuchu_denpyo_no');
                        const myJyuchuNo = jyuchuNoInput ? jyuchuNoInput.value : null;
                        if (myJyuchuNo) {
                            await GM_setValue(currentJyuchuNoKey, myJyuchuNo);
                        }

                        const value = select.value;
                        const mappedValue = valueMapping[parseInt(value)];

                        if (mappedValue) {
                            await GM_setValue(mallFlagKey, true);

                            if (mappedValue !== 'shopify') {
                                await GM_setValue('lastshopTypeNo', mappedValue);
                            }
                            if (mappedValue === 'shopify') {
                                const orderNumber = document.getElementById('tenpo_denpyo_no').value;
                                await GM_setValue('orderNumber', orderNumber);
                                window.open(`https://admin.shopify.com/store/eh8nfp-gh/orders?start=MQ%3D%3D`, '_blank');
                            }
                        }
                    });
                }

                setInterval(() => {
                    const jyuchuNoInput = document.getElementById('jyuchu_denpyo_no');
                    if (!jyuchuNoInput) return;
                    const myJyuchuNo = jyuchuNoInput.value;
                    if (!myJyuchuNo) return;
                    const myRetryKey = mallRetryKeyPrefix + myJyuchuNo;

                    if (window[`_addedRetryListener_${myJyuchuNo}`]) return;
                    window[`_addedRetryListener_${myJyuchuNo}`] = true;

                    GM_addValueChangeListener(myRetryKey, async function(name, oldValue, newValue, remote) {
                        if (newValue === true) {
                            const moruBtn = document.getElementById('show-moru-btn');
                            if (moruBtn) {
                                moruBtn.click();
                            } else {
                            }
                            await GM_setValue(myRetryKey, false);
                            await GM_deleteValue(myRetryKey);
                        }
                    });
                }, 500);
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', main);
            } else {
                main();
            }
        }

        if (url.startsWith("https://admin.shopify.com/store/eh8nfp-gh/orders?start=MQ%3D%3D")) {
            window.addEventListener('load', async function() {
                const orderNumber = await GM_getValue('orderNumber', null);
                if (orderNumber) {
                    automateShopifySearch(orderNumber);
                }
            });
            return;
        }

        function automateShopifySearch(orderNumber) {
            'use strict';

            const observer = new MutationObserver(function(mutations) {
                const searchButton = document.querySelector('button._TopBarButton_ale7v_2._SearchActivator_8d1vr_4');
                if (searchButton) {
                    searchButton.click();

                    setTimeout(function() {
                        const searchInput = document.querySelector('input[aria-label="検索"]');
                        if (searchInput) {
                            searchInput.focus();

                            const instructionMessage = document.createElement('div');
                            instructionMessage.style.position = 'fixed';
                            instructionMessage.style.bottom = '32px';
                            instructionMessage.style.right = '32px';
                            instructionMessage.style.backgroundColor = '#007bff';
                            instructionMessage.style.color = '#fff';
                            instructionMessage.style.padding = '16px 28px';
                            instructionMessage.style.fontSize = '20px';
                            instructionMessage.style.fontWeight = 'bold';
                            instructionMessage.style.borderRadius = '10px';
                            instructionMessage.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.18)';
                            instructionMessage.style.display = 'none';
                            instructionMessage.style.zIndex = '820';
                            instructionMessage.style.border = '2px solid #ffd700';
                            instructionMessage.style.letterSpacing = '1px';
                            instructionMessage.style.textShadow = '0 2px 4px rgba(0,0,0,0.15)';

                            document.body.appendChild(instructionMessage);

                            searchInput.addEventListener('blur', function() {
                                instructionMessage.style.display = 'none';
                            });

                            searchInput.value = orderNumber;

                            const clickEvent = new MouseEvent('click', { 'bubbles': true, 'cancelable': true });
                            searchInput.dispatchEvent(clickEvent);

                            const inputEvent = new Event('input', { 'bubbles': true, 'cancelable': true });
                            searchInput.dispatchEvent(inputEvent);

                            setTimeout(function() {
                                instructionMessage.style.display = 'block';
                                instructionMessage.innerText = 'スペースを押して検索を完了させてください';
                            }, 200);

                            const intervalId = setInterval(function() {
                                const resultItem = Array.from(document.querySelectorAll('#search-results li'))
                                .find(item => {
                                    const orderNumberElement = item.querySelector('mark');
                                    return orderNumberElement && orderNumberElement.textContent.trim() === orderNumber;
                                });

                                if (resultItem) {
                                    const link = resultItem.querySelector('a');
                                    if (link) {
                                        link.click();
                                        clearInterval(intervalId);
                                        instructionMessage.style.display = 'none';
                                        GM_setValue('orderNumber', '');
                                        GM_setValue('mall_action_in_progress', false);
                                    }
                                }
                            }, 500);

                            window.addEventListener('keydown', function(event) {
                                if (event.code === 'Space') {
                                    instructionMessage.style.display = 'none';
                                }
                            });
                        }
                    }, 500);

                    observer.disconnect();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }

        function updateMoruBtnBorder() {
            const moruBtn = document.getElementById('show-moru-btn');
            if (!moruBtn) return;
            if (window._autoLogin_ctrlKey) {
                moruBtn.style.boxShadow = '0 0 0 2.5px #007aff, 0 1px 2px rgba(0,0,0,0.04)';
                moruBtn.style.borderColor = '#3c80cf';
                moruBtn.style.background = '#f2f8fc';
                moruBtn.style.position = 'relative';
                moruBtn.style.top = '-2px';
            } else {
                moruBtn.style.boxShadow = '';
                moruBtn.style.borderColor = '';
                moruBtn.style.background = '';
                moruBtn.style.top = '';
            }
        }
    }

    function denpyoBunkatsuAutoReflect() {
        const OLD_KEY = 'bunkatsu_auto_jyuchu_denpyo_no_old';
        const NEW_KEY = 'bunkatsu_auto_jyuchu_denpyo_no_new';
        const FLAG_KEY = 'bunkatsu_auto_update_flag';

        function main() {
            const observer = new MutationObserver((mutations, obs) => {
                const btn = document.getElementById('ne_dlg_btn2_bunkatuDlg');
                if (btn) {
                    btn.addEventListener('click', () => {
                        localStorage.removeItem(OLD_KEY);
                        localStorage.removeItem(NEW_KEY);
                        localStorage.removeItem(FLAG_KEY);
                        const inputElem = document.getElementById('jyuchu_denpyo_no');
                        const oldVal = inputElem ? inputElem.value : '';
                        if (oldVal) {
                            localStorage.setItem(OLD_KEY, oldVal);
                        }
                    });
                    obs.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', main);
        } else {
            main();
        }

        function main2() {
            const inputElem = document.getElementById('jyuchu_denpyo_no');
            const oldVal = localStorage.getItem(OLD_KEY);
            if (inputElem && oldVal) {
                const newVal = inputElem.value;
                if (newVal && newVal !== oldVal) {
                    localStorage.setItem(NEW_KEY, newVal);
                    localStorage.setItem(FLAG_KEY, Date.now().toString());

                    let retry = 0;
                    const maxRetry = 20;
                    const interval = 250;
                    const doMark = () => {
                        let success = true;

                        const chk = document.getElementById('chk_kakunin_check_kbn');
                        if (chk && !chk.checked) {
                            chk.checked = true;
                            chk.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        if (!chk) {
                            success = false;
                        }

                        const tagArea = document.getElementById('jyuchu_tag');
                        let tagEdited = false;
                        if (tagArea) {
                            const addTag = '[入荷待ち]';
                            let currentTag = tagArea.value || '';
                            if (!currentTag.includes(addTag)) {
                                tagArea.value = currentTag + addTag;
                                tagArea.dispatchEvent(new Event('input', { bubbles: true }));
                                tagArea.dispatchEvent(new Event('change', { bubbles: true }));
                                tagEdited = true;
                            }
                        }
                        if (!tagArea) {
                            success = false;
                        }

                        if (tagEdited) {
                            const editBtn = document.querySelector('a[onclick*="Element.show(\'jyuchu_tag\'"]');
                            if (editBtn) {
                                editBtn.click();
                            }
                            setTimeout(() => {
                                const closeBtn = document.querySelector('a[onclick*="tagshow()"]');
                                if (closeBtn) {
                                    closeBtn.click();
                                }
                            }, 10);
                        }

                        if (!success && retry < maxRetry) {
                            retry++;
                            setTimeout(doMark, interval);
                        }
                        if (success) {
                            setTimeout(() => {
                                reflectDenpyo();
                                localStorage.removeItem(OLD_KEY);
                                localStorage.removeItem(NEW_KEY);
                            }, 50);
                        }
                    };
                    doMark();
                }
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', main2);
        } else {
            main2();
        }

        window.addEventListener('storage', (event) => {
            if (event.key === FLAG_KEY) {
                reflectDenpyo();
            }
        });

        function getTodayDate() {
            const date = new Date();
            const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
            const jstDate = new Date(utc + (9 * 60 * 60000));
            const mm = String(jstDate.getMonth() + 1).padStart(2, '0');
            const dd = String(jstDate.getDate()).padStart(2, '0');
            return `${mm}/${dd}`;
        }

        async function reflectDenpyo() {
            const textarea = document.getElementById('sagyosya_ran');
            if (!textarea) {
                return;
            }

            const oldVal = localStorage.getItem(OLD_KEY) || '';
            const newVal = localStorage.getItem(NEW_KEY) || '';

            const oldLine = oldVal ? `（元伝: ${oldVal}）` : '';
            const newLine = newVal ? `${getTodayDate()}（分割: ${newVal}）` : '';

            const lines = [oldLine, newLine].filter(line => line !== '');

            if (lines.length === 0) {
                return;
            }

            const existingText = textarea.value || '';
            let combinedText = lines.join('\n') + (existingText ? '\n' + existingText : '');

            const jyuchuInput = document.getElementById('jyuchu_denpyo_no');
            if (jyuchuInput) {
                const currentVal = jyuchuInput.value;
                if (currentVal) {
                    const textLines = combinedText.split('\n');
                    const filteredLines = textLines.filter(line => !line.includes(currentVal));
                    combinedText = filteredLines.join('\n');
                }
            }

            textarea.value = combinedText;
        }
    }

    function doukonCheck(){

        const CAL_URL = "https://starlight.plusnao.co.jp/json/calendar-data.json";
        const CAL_KEY = "doukon_calendar_map_v1";
        const CAL_META_KEY = "doukon_calendar_meta_v1";
        let calendarMap = null;

        function toJST(d = new Date()) {
            return new Date(d.getTime() + (9 * 60 + d.getTimezoneOffset()) * 60 * 1000);
        }
        function ymd(date, sep = "-") {
            const d = toJST(date);
            const yyyy = d.getFullYear();
            const mm = ("0" + (d.getMonth() + 1)).slice(-2);
            const dd = ("0" + d.getDate()).slice(-2);
            return `${yyyy}${sep}${mm}${sep}${dd}`;
        }
        function loadCache() { try { return JSON.parse(GM_getValue(CAL_KEY, "{}")); } catch { return {}; } }
        function loadMeta() { try { return JSON.parse(GM_getValue(CAL_META_KEY, "{}")); } catch { return {}; } }
        function saveMeta(meta) { GM_setValue(CAL_META_KEY, JSON.stringify(meta)); }
        function saveCache(map, meta) { GM_setValue(CAL_KEY, JSON.stringify(map)); saveMeta(meta); calendarMap = map; }
        function getHeader(headersText, name) {
            const m = (headersText || "").match(new RegExp("^" + name + ":\\s*(.+)$", "im"));
            return m ? m[1].trim() : "";
        }
        function normalizeMap(raw) {
            let obj; try { obj = typeof raw === "string" ? JSON.parse(raw) : raw; } catch { return null; }
            if (!obj || typeof obj !== "object") return null;
            const out = {};
            for (const [k, v] of Object.entries(obj)) {
                if (/^\d{4}-\d{2}-\d{2}$/.test(k) && (v === 0 || v === -1)) out[k] = v;
            }
            return Object.keys(out).length ? out : null;
        }

        // 1日1回だけ取得。失敗時は保存分で継続
        function fetchCalendarOncePerDay() {
            const meta = loadMeta();
            const today = ymd(new Date());
            const cached = loadCache();
            calendarMap = cached || {};

            if (meta.lastChecked === today && cached && Object.keys(cached).length) return;

            const headers = {};
            if (meta.etag) headers["If-None-Match"] = meta.etag;
            if (meta.lastModified) headers["If-Modified-Since"] = meta.lastModified;

            GM_xmlhttpRequest({
                method: "GET",
                url: CAL_URL,
                headers,
                timeout: 10000,
                onload: (res) => {
                    try {
                        if (res.status === 200) {
                            const map = normalizeMap(res.responseText);
                            meta.lastChecked = today;
                            if (map) {
                                const etag = getHeader(res.responseHeaders, "ETag");
                                const lastMod = getHeader(res.responseHeaders, "Last-Modified");
                                if (etag) meta.etag = etag;
                                if (lastMod) meta.lastModified = lastMod;
                                saveCache(map, meta);
                            } else {
                                saveMeta(meta);
                            }
                        } else if (res.status === 304) {
                            meta.lastChecked = today; saveMeta(meta);
                            calendarMap = cached || {};
                        } else {
                            meta.lastChecked = today; saveMeta(meta);
                            calendarMap = cached || {};
                        }
                    } catch {
                        meta.lastChecked = today; saveMeta(meta);
                        calendarMap = cached || {};
                    }
                },
                onerror: () => { const m = loadMeta(); m.lastChecked = today; saveMeta(m); calendarMap = cached || {}; },
                ontimeout: () => { const m = loadMeta(); m.lastChecked = today; saveMeta(m); calendarMap = cached || {}; }
            });
        }

        function isWorkingDay(date) {
            if (!calendarMap) calendarMap = loadCache() || {};
            const key = ymd(date, "-");
            if (Object.prototype.hasOwnProperty.call(calendarMap, key)) {
                return calendarMap[key] === -1;
            }
            const d = toJST(date).getDay();
            return d !== 0 && d !== 6;
        }

        fetchCalendarOncePerDay();

        const headerTrId = "doukon_tablene_header";
        const customColClass = "chk-doukon-col";
        const targetShrinkColIndex = 7;
        const denpyoStatusMap = {};
        let childSystemMessages = {};
        let blackListNames = [];
        let blackListFetchFailed = false;
        let blackListFetchErrorMsg = "";
        const bannerQueue = [];
        let bannerVisible = false;
        let parentHasSetItem = false;
        let updatePaused = false;

        function resizeColumn() {
            const headTr = document.getElementById(headerTrId);
            if (!headTr) return;
            const ths = headTr.querySelectorAll("td");
            if (ths.length > targetShrinkColIndex) {
                ths[targetShrinkColIndex].style.width = "120px";
            }
            const table = headTr.closest("table");
            if (!table) return;
            const bodyRows = table.querySelectorAll("tbody tr");
            bodyRows.forEach(row => {
                const tds = row.querySelectorAll("td");
                if (tds.length > targetShrinkColIndex) {
                    tds[targetShrinkColIndex].style.width = "120px";
                }
            });
        }

        function isStatusEqual(a, b) {
            if (!a || !b) return false;
            return (
                a.nyukinOK === b.nyukinOK &&
                a.siharaiOK === b.siharaiOK &&
                a.meisaiOK === b.meisaiOK &&
                a.meisaiNG === b.meisaiNG &&
                a.zeroQty === b.zeroQty
            );
        }

        function getNextWorkingDay(fromDate) {
            let date = new Date(fromDate.getTime());
            for (let i = 0; i < 370; i++) {
                date.setDate(date.getDate() + 1);
                if (isWorkingDay(date)) {
                    return ymd(date, "/");
                }
            }
            const fallback = new Date(fromDate.getTime());
            fallback.setDate(fallback.getDate() + 1);
            return ymd(fallback, "/");
        }

        function showBanner(msg) {
            if (bannerVisible) {
                bannerQueue.push(msg);
                return;
            }
            bannerVisible = true;

            let oldBanner = document.getElementById('custom-warning-banner');
            if (oldBanner) oldBanner.remove();

            let banner = document.createElement('div');
            banner.id = 'custom-warning-banner';
            banner.style.position = 'fixed';
            banner.style.bottom = '18px';
            banner.style.left = '50%';
            banner.style.transform = 'translateX(-50%)';
            banner.style.background = 'rgba(40, 48, 60, 0.93)';
            banner.style.color = '#fff';
            banner.style.padding = '24px 32px 20px 30px';
            banner.style.zIndex = '2147483647';
            banner.style.borderRadius = '15px';
            banner.style.fontSize = '1.5em';
            banner.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
            banner.style.display = 'block';
            banner.style.minWidth = '330px';
            banner.style.wordBreak = 'break-word';
            banner.style.border = '1.1px solid #fff2';
            banner.style.backdropFilter = 'blur(1.2px)';
            banner.style.fontFamily = "'Segoe UI', 'Meiryo', sans-serif";
            banner.style.animation = 'customBannerFadein 0.33s cubic-bezier(.33,1.5,.4,1)';
            banner.style.boxSizing = 'border-box';
            banner.style.overflow = 'visible';
            banner.style.pointerEvents = 'auto';
            banner.style.lineHeight = '1.5';
            banner.style.textAlign = 'center';
            banner.style.whiteSpace = "nowrap";

            let row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.gap = '9px';
            row.style.paddingRight = '22px';

            let icon = document.createElement('span');
            icon.innerHTML = '⚠️';
            icon.style.fontSize = '1.8em';
            icon.style.flexShrink = '0';
            icon.style.marginTop = '0';

            let textArea = document.createElement('div');
            textArea.style.flex = '1 1 0%';
            textArea.style.display = 'flex';
            textArea.style.flexDirection = 'column';

            textArea.innerHTML = msg;
            textArea.style.whiteSpace = "nowrap";

            row.appendChild(icon);
            row.appendChild(textArea);

            let closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.setAttribute('aria-label', '閉じる');
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '5px';
            closeBtn.style.right = '7px';
            closeBtn.style.background = 'rgba(255,255,255,0.13)';
            closeBtn.style.border = 'none';
            closeBtn.style.color = '#fff';
            closeBtn.style.fontSize = '1.7em';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.width = '36px';
            closeBtn.style.height = '36px';
            closeBtn.style.padding = '0';
            closeBtn.style.display = 'flex';
            closeBtn.style.justifyContent = 'center';
            closeBtn.style.alignItems = 'center';
            closeBtn.style.borderRadius = '7px';
            closeBtn.style.lineHeight = '1';
            closeBtn.onmouseover = () => { closeBtn.style.background = 'rgba(255,255,255,0.20)'; };
            closeBtn.onmouseout = () => { closeBtn.style.background = 'rgba(255,255,255,0.13)'; };

            closeBtn.addEventListener('click', () => {
                banner.remove();
                childSystemMessages = {};
                bannerVisible = false;
                if (bannerQueue.length > 0) showBanner(bannerQueue.shift());
            });

            banner.appendChild(row);
            banner.appendChild(closeBtn);
            document.body.appendChild(banner);

            if (!document.getElementById('custom-banner-fadein-style')) {
                let style = document.createElement('style');
                style.id = 'custom-banner-fadein-style';
                style.innerHTML = `
    @keyframes customBannerFadein {
        from { opacity: 0; transform: translateX(-50%) translateY(40px);}
        to   { opacity: 1; transform: translateX(-50%) translateY(0);}
    }
    `;
                document.head.appendChild(style);
            }
        }

        let prevText = "";

        function setExecButtonListener(execBtn) {
            if (execBtn.dataset.doukonRestoredExec) return;
            execBtn.dataset.doukonRestoredExec = "1";
            execBtn.addEventListener('click', function() {
                setTimeout(() => {
                    checkAndUpdateDate();
                    restoreNouhinsyoTextRepeatedly();
                    checkAndShowBanner();
                }, 300);
            });
        }

        function restoreNouhinsyoText() {
            const nouhinsyo = document.getElementById('nouhinsyo_text');
            if (nouhinsyo && nouhinsyo.value !== prevText) {
                nouhinsyo.value = prevText;
                nouhinsyo.dispatchEvent(new Event('input', { bubbles: true }));
                showBanner(
                    `<strong style="font-size:1.10em;">納品書特記事項を復元しました。</strong><br>
            <span style="font-size:1.04em;">伝票更新を行い保存してください。</span>`
            );
            }
        }

        function restoreNouhinsyoTextRepeatedly() {
            const maxTries = 20;
            let tries = 0;

            const interval = setInterval(() => {
                tries++;
                restoreNouhinsyoText(prevText);
                if (tries >= maxTries) {
                    clearInterval(interval);
                }
            }, 300);
        }

        function checkAndShowBanner() {
            const okMsgs = [
                "同梱可能受注が存在します。\nこの伝票は受注メールが送信されません。",
                "同梱可能受注が存在します。"
            ];
            const normalize = str => (str || "").replace(/[\s\u3000]+/g, "");

            const sysMsgElem = document.getElementById('system_message_kbn');
            const msg = sysMsgElem ? sysMsgElem.value.trim() : "";
            const msgNorm = normalize(msg);
            const isParentOK = okMsgs.some(ok => normalize(ok) === msgNorm);

            const ngChilds = [];
            for (const [denpyoNo, systemMessage] of Object.entries(childSystemMessages)) {
                if (systemMessage && systemMessage.includes("備考欄を見て下さい。")) {
                    ngChilds.push({
                        denpyoNo,
                        message: systemMessage
                    });
                }
            }

            let html = "";

            if (ngChilds.length > 0) {
                const ngList = ngChilds.map(item =>
                                            `・伝票番号：${item.denpyoNo}<br><span style="font-size:0.85em;color:#aaa;">${item.message.replace(/\n/g, "<br>")}</span>`
        ).join("<br>");
                html += `<strong style='font-size:1.08em;'>候補先に「備考欄を見て下さい。」と指示があります。</strong>
    <strong style='font-size:1.08em;'>内容を確認してください。</strong>
    <div style='margin-top:12px; font-size:0.92em; color:#eee; text-align:left;'>
        ${ngList}
    </div>`;
            }

            if (!isParentOK && msgNorm) {
                if (html) html += `<div style="margin-top:20px;"></div>`;
                html += `<strong style='font-size:1.08em;'>同梱先の確認内容欄に注意事項が含まれています。</strong>
    <strong style='font-size:1.08em;'>内容を確認してください。</strong>`;
            }

            if (html) {
                showBanner(html);
            }
        }

        function showStatus(msg, level = "info") {
            if (level === "error") {
                err(msg);
            } else if (level === "warn") {
                console.warn(msg);
            }
        }

        function isParentNameBlacklisted() {
            const nameIds = ['jyuchu_name', 'hasou_name'];
            for (const id of nameIds) {
                const elem = document.getElementById(id);
                const name = (elem?.value || elem?.textContent || '').trim();
                if (blackListNames.includes(name)) return true;
            }
            return false;
        }

        fetchBlackList('http://tk2-217-18298.vs.sakura.ne.jp/issues/404220');

        function fetchBlackList(url) {
            blackListFetchFailed = false;
            blackListFetchErrorMsg = "";

            showStatus("ブラックリスト取得中...", "info");

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 10000,
                onload: function(response) {
                    try {
                        const finalUrl = response.finalUrl || response.responseURL || url;
                        if (finalUrl.includes('/login')) {
                            blackListFetchFailed = true;
                            blackListFetchErrorMsg = "Redmine未ログインのためブラックリスト取得不可です。ログインしてください。";
                            blackListNames = [];
                            showStatus("[認証エラー] " + blackListFetchErrorMsg, "warn");
                            return;
                        }
                        if (response.status !== 200) {
                            blackListFetchFailed = true;
                            blackListFetchErrorMsg = `ステータス: ${response.status} で取得失敗`;
                            blackListNames = [];
                            showStatus("[エラー] " + blackListFetchErrorMsg, "error");
                            return;
                        }
                        if (!response.responseText) {
                            blackListFetchFailed = true;
                            blackListFetchErrorMsg = "ページ内容が空です。";
                            blackListNames = [];
                            showStatus("[エラー] " + blackListFetchErrorMsg, "error");
                            return;
                        }
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        if (!doc) {
                            blackListFetchFailed = true;
                            blackListFetchErrorMsg = "DOMパース失敗。";
                            blackListNames = [];
                            showStatus("[エラー] " + blackListFetchErrorMsg, "error");
                            return;
                        }
                        const wikiDiv = doc.querySelector('.wiki p');
                        if (!wikiDiv) {
                            blackListFetchFailed = true;
                            blackListFetchErrorMsg = "class='wiki' 内の <p> 要素が見つかりません。";
                            blackListNames = [];
                            showStatus("[エラー] " + blackListFetchErrorMsg, "error");
                            return;
                        }
                        blackListNames = wikiDiv.innerHTML
                            .split('<br>')
                            .map(name => name.trim())
                            .filter(name => name.length > 0);
                        if (blackListNames.length === 0) {
                            blackListFetchFailed = true;
                            blackListFetchErrorMsg = "ブラックリストが空です。";
                            showStatus("[注意] " + blackListFetchErrorMsg, "warn");
                        } else {
                            blackListFetchFailed = false;
                            blackListFetchErrorMsg = "";
                            showStatus("ブラックリスト取得成功！", "info");
                        }
                    } catch (e) {
                        blackListFetchFailed = true;
                        blackListFetchErrorMsg = "例外エラー: " + e;
                        blackListNames = [];
                        showStatus("[例外エラー] " + blackListFetchErrorMsg, "error");
                    }
                },
                onerror: function() {
                    blackListFetchFailed = true;
                    blackListFetchErrorMsg = "通信エラーでブラックリストを取得できません。";
                    blackListNames = [];
                    showStatus("[通信エラー] " + blackListFetchErrorMsg, "error");
                },
                ontimeout: function() {
                    blackListFetchFailed = true;
                    blackListFetchErrorMsg = "タイムアウトでブラックリストを取得できません。";
                    blackListNames = [];
                    showStatus("[タイムアウト] " + blackListFetchErrorMsg, "error");
                }
            });
        }


        function getJSTDateObj() {
            const now = new Date();
            return new Date(now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60 * 1000);
        }

        function checkAndUpdateDate() {
            const jyuchuBiParent = document.getElementById('jyuchu_bi')?.value ?? null;
            const table = document.getElementById(headerTrId)?.closest("table");
            if (!jyuchuBiParent) {
                return;
            }
            if (!table) {
                return;
            }
            const rows = table.querySelectorAll("tbody tr");
            let shouldUpdateDate = false;
            for (const row of rows) {
                const tds = row.querySelectorAll("td");
                if (tds.length < 2) {
                    continue;
                }
                const num = tds[1].textContent.trim().match(/\d+/)?.[0] || null;
                const checkbox = tds[0].querySelector('input[type="checkbox"]');
                if (num && checkbox && checkbox.checked) {
                    const childDateStr = jyuchuBiChildMap[num];
                    if (!childDateStr) {
                        continue;
                    }
                    const parentDate = new Date(jyuchuBiParent.replace(/-/g, '/').replace(/\./g, '/'));
                    const childDate = new Date(childDateStr.replace(/-/g, '/').replace(/\./g, '/'));
                    if (parentDate > childDate) {
                        shouldUpdateDate = true;
                        break;
                    }
                }
            }

            if (shouldUpdateDate) {
                let baseDate = getJSTDateObj();
                if (
                    baseDate.getHours() < 6 ||
                    (baseDate.getHours() === 6 && baseDate.getMinutes() < 30)
                ) {
                    baseDate.setDate(baseDate.getDate() - 1);
                }
                const nextWorkday = getNextWorkingDay(baseDate);
                showBanner(
                    `<strong style="font-size:1.10em; display:block; margin-bottom:0; line-height:1.15;">
        同梱先の日付が新しいです。
    </strong>
    <strong style="font-size:1.10em; display:block; margin-top:0; line-height:1.15;">
        納品印刷指示日を最短出荷日に設定してください。
    </strong>
    <span style="display:block; font-size:1.04em; margin-top:0.65em;">
        （推奨日付: <span style="color:#fff8a1;font-weight:bold;">${nextWorkday}</span>）
    </span>`
            );
            }
        }

        let lastVisibility = null;
        let lastDenpyoNo = null;

        setInterval(() => {
            const btn = document.getElementById('ne_dlg_btn1_doukonDlg');
            if (!btn) {
                lastVisibility = null;
                return;
            }

            const visibility = btn.style.visibility || window.getComputedStyle(btn).visibility;

            if (lastVisibility !== 'visible' && visibility === 'visible') {
                const denpyoInput = document.getElementById('doukonsaki_jyuchu_denpyo_no');
                const nowDenpyoNo = denpyoInput ? (denpyoInput.value || denpyoInput.textContent || '').trim() : '';

                if (nowDenpyoNo && nowDenpyoNo !== lastDenpyoNo) {
                    childSystemMessages = {};
                    lastDenpyoNo = nowDenpyoNo;
                }

                const nouhinsyo = document.getElementById('nouhinsyo_text');
                if (nouhinsyo) {
                    prevText = nouhinsyo.value;
                }
                checkParentMeisaiForSetItem();

                setExecButtonListener(btn);
            }
            lastVisibility = visibility;
        }, 1000);

        function checkParentMeisaiForSetItem() {
            const table = document.getElementById("jyuchuMeisai_tablene_table");
            if (!table) {
                parentHasSetItem = false;
                return;
            }

            const rows = table.querySelectorAll("tbody tr");
            parentHasSetItem = false;

            for (let i = 1; i < rows.length; i++) {
                const tds = rows[i].querySelectorAll("td");
                if (tds.length < 13) continue;

                const qty = tds[6].textContent.trim();
                const price = tds[10].textContent.trim();
                const subtotal = tds[12].textContent.trim();

                if (qty !== "1" && price === subtotal) {
                    parentHasSetItem = true;
                    break;
                }
            }
        }

        let jyuchuBiChildMap = {};
        let mallHoldMap = {};

        window.addEventListener("message", function(event) {
            if (!event.data) return;
            if (event.data.type === "JyuchuBiChildValue") {
                const {denpyoNo, JyuchuBiChild} = event.data;
                jyuchuBiChildMap[denpyoNo] = JyuchuBiChild;
            }

            if (event.data.type === "NyukinKbnValueCheck") {
                const {denpyoNo, value, isNyukinOK} = event.data;
                const btn = document.querySelector(`button.chk-doukon-btn[data-denpyo-no="${denpyoNo}"]`);
                if (btn) {
                    btn._nyukinOK = isNyukinOK;
                    const prevStatus = denpyoStatusMap[denpyoNo];
                    const newStatus = {
                        nyukinOK: btn._nyukinOK,
                        siharaiOK: btn._siharaiOK,
                        meisaiOK: btn._meisaiOK,
                        meisaiNG: btn._meisaiNG,
                    };
                    if (isStatusEqual(prevStatus, newStatus)) return;
                    denpyoStatusMap[denpyoNo] = newStatus;
                }
            }

            if (event.data.type === "SiharaikbnValueCheck") {
                const {value: childValue, denpyoNo} = event.data;
                const ownElem = document.getElementById("siharai_kbn");
                const ownValue = ownElem ? ownElem.value || ownElem.textContent : "";
                const isOK = ownValue === childValue || ownValue === "85" || childValue === "85";
                const btn = document.querySelector(`button.chk-doukon-btn[data-denpyo-no="${denpyoNo}"]`);
                if (btn) {
                    btn._siharaiOK = isOK;
                    const prevStatus = denpyoStatusMap[denpyoNo];
                    const newStatus = {
                        nyukinOK: btn._nyukinOK,
                        siharaiOK: btn._siharaiOK,
                        meisaiOK: btn._meisaiOK,
                        meisaiNG: btn._meisaiNG,
                    };
                    if (isStatusEqual(prevStatus, newStatus)) return;
                    denpyoStatusMap[denpyoNo] = newStatus;
                }
            }

            if (event.data.type === "meisaiJudge") {
                const num = event.data.denpyoNo;
                const btn = document.querySelector(`button.chk-doukon-btn[data-denpyo-no="${num}"]`);
                if (btn) {
                    btn._meisaiOK = !!event.data.isAllMatch;
                    btn._meisaiNG = !!event.data.hasSetItem;
                    btn._zeroQty = !!event.data.hasZeroQty;
                    const prevStatus = denpyoStatusMap[num];
                    const newStatus = {
                        nyukinOK: btn._nyukinOK,
                        siharaiOK: btn._siharaiOK,
                        meisaiOK: btn._meisaiOK,
                        meisaiNG: btn._meisaiNG,
                        zeroQty: btn._zeroQty,
                    };
                    if (isStatusEqual(prevStatus, newStatus)) return;
                    denpyoStatusMap[num] = newStatus;
                }
            }

            if (event.data.type === "GetSystemMessage") {
                const {denpyoNo} = event.data;
                const sysMsgElem = document.getElementById("system_message_kbn");
                const systemMessage = sysMsgElem ? sysMsgElem.value : "";
                window.opener.postMessage(
                    {
                        type: "SystemMessageValue",
                        denpyoNo,
                        systemMessage
                    },
                    "*"
                );
            }
            if (event.data.type === "SystemMessageValue") {
                const {denpyoNo, systemMessage} = event.data;
                childSystemMessages[denpyoNo] = systemMessage;
            }

            if (event.data.type === "MallHoldTagResult") {
                const { denpyoNo, hasMallHold } = event.data;
                mallHoldMap[denpyoNo] = hasMallHold;
                updateRows();
            }
        });

        function safeUpdateRows() {
            if (!updatePaused) {
                updateRows();
            }
        }

        function updateRows() {
            const headTr = document.getElementById(headerTrId);
            if (!headTr) return;
            const table = headTr.closest("table");
            if (!table) return;
            const rows = table.querySelectorAll("tbody tr");

            let magnifierRows = [];

            rows.forEach(row => {
                const tds = row.querySelectorAll("td");
                if (tds.length < 2) return;
                const num = tds[1].textContent.trim().match(/\d+/)?.[0] || null;
                const checkbox = tds[0].querySelector('input[type="checkbox"]');

                let lastTd = row.querySelector("td." + customColClass);
                if (!lastTd) {
                    lastTd = document.createElement("td");
                    lastTd.classList.add(customColClass);
                    lastTd.style.textAlign = "center";
                    lastTd.style.verticalAlign = "middle";
                    lastTd.style.width = "22px";
                    row.appendChild(lastTd);
                }

                lastTd.querySelectorAll("div.doukon-magnifier-btn-holder").forEach(d => d.remove());

                if (!(num && checkbox && checkbox.checked)) return;

                let div = document.createElement("div");
                div.className = "doukon-magnifier-btn-holder";
                div.style.display = "flex";
                div.style.justifyContent = "center";
                div.style.alignItems = "center";
                div.style.height = "100%";

                magnifierRows.push(num);

                const btn = document.createElement("button");
                btn.className = "chk-doukon-btn";
                btn.tabIndex = 0;

                const status = denpyoStatusMap[num] || {};
                btn._nyukinOK = status.nyukinOK;
                btn._siharaiOK = status.siharaiOK;
                btn._meisaiOK = status.meisaiOK;
                btn._meisaiNG = status.meisaiNG;
                btn._zeroQty = status.zeroQty;

                let bg = "#fff", border = "#b3b3b3", svgColor = "#666";
                let issues = [];
                let warning = [];

                // --- 1. 赤条件が1つでもあれば赤！最優先 ---
                const parentBlacklisted = isParentNameBlacklisted();
                if (
                    mallHoldMap[num] ||
                    btn._meisaiNG === true ||
                    btn._nyukinOK === false ||
                    btn._siharaiOK === false ||
                    btn._meisaiOK === false ||
                    btn._zeroQty === true ||
                    parentBlacklisted ||
                    parentHasSetItem
                ) {
                    bg = "#ffd6d6";
                    border = "#ff8a8a";
                    svgColor = "#d50000";
                    if (btn._nyukinOK === false) issues.push("■候補先が入金済みではない");
                    if (btn._siharaiOK === false) issues.push("■支払方法の不一致");
                    if (btn._meisaiOK === false) issues.push("■候補先が引きあたっていない");
                    if (btn._meisaiNG === true) issues.push("■候補先がセット商品");
                    if (btn._zeroQty === true) issues.push("■受注数が0件");
                    if (mallHoldMap[num]) issues.push("■候補先のタグにモール保留");
                    if (parentBlacklisted) issues.push("■同梱禁止ブラックリストに該当");
                    if (parentHasSetItem) issues.push("■同梱先がセット商品");
                }
                // --- 2. 全OK＆ブラックリスト取得失敗なら黄色背景＆緑枠・SVG ---
                else if (
                    btn._nyukinOK === true &&
                    btn._siharaiOK === true &&
                    btn._meisaiOK === true &&
                    blackListFetchFailed
                ) {
                    bg = "#fff9d1"; // 薄い黄色
                    border = "#66d966"; // 緑枠
                    svgColor = "#e5ae00"; // 黄色SVG
                    warning.push("■ブラックリスト取得失敗");
                    warning.push("　┗ " + (blackListFetchErrorMsg || "原因不明のエラー"));
                }
                // --- 3. ブラックリスト取得失敗のみ（それ以外の状態） ---
                else if (blackListFetchFailed) {
                    bg = "#fff9d1";
                    border = "#ffda6c";
                    svgColor = "#e5ae00";
                    warning.push("■ブラックリスト取得失敗");
                    warning.push("　┗ " + (blackListFetchErrorMsg || "原因不明のエラー"));
                }
                // --- 4. 全てOKなら緑 ---
                else if (
                    btn._nyukinOK === true &&
                    btn._siharaiOK === true &&
                    btn._meisaiOK === true
                ) {
                    bg = "#d4f7d4";
                    border = "#66d966";
                    svgColor = "#19732a";
                }

                let tooltipMsg = "同梱条件チェック";
                if (issues.length) {
                    tooltipMsg += "\n[NG]\n" + issues.join("\n");
                } else if (
                    btn._nyukinOK === true &&
                    btn._siharaiOK === true &&
                    btn._meisaiOK === true
                ) {
                    tooltipMsg += "\n[OK] 全ての条件をクリアしています";
                    if (warning.length) {
                        tooltipMsg += "\n[要確認]\n" + warning.join("\n");
                    }
                } else if (warning.length) {
                    tooltipMsg += "\n[要確認]\n" + warning.join("\n");
                } else {
                    tooltipMsg += "\n[未チェック]";
                }

                btn.style.width = "18px";
                btn.style.height = "18px";
                btn.style.padding = "0";
                btn.style.background = bg;
                btn.style.border = "2px solid " + border;
                btn.style.borderRadius = "6px";
                btn.style.boxShadow = "none";
                btn.style.cursor = "pointer";
                btn.style.display = "flex";
                btn.style.alignItems = "center";
                btn.style.justifyContent = "center";
                btn.style.transition = "background 0.2s, border-color 0.2s, box-shadow 0.2s";

                btn.innerHTML = `
<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${svgColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="7"/>
    <line x1="16.65" y1="16.65" x2="21" y2="21"/>
</svg>
`.trim();

                btn.title = tooltipMsg;

                btn.onmouseenter = () => {
                    btn.style.boxShadow = "0 3px 10px rgba(80,140,250,0.19)";
                    btn.style.borderColor = "#3b82f6";
                    if (bg === "#fff") btn.style.background = "#f0f9ff";
                };
                btn.onmouseleave = () => {
                    btn.style.boxShadow = "0 1px 4px rgba(0,0,0,0.11)";
                    btn.style.borderColor = border;
                    btn.style.background = bg;
                };
                btn.onfocus = () => { btn.style.outline = "2px solid #3b82f6"; };
                btn.onblur = () => { btn.style.outline = ""; };

                btn.setAttribute("data-denpyo-no", num);

                btn.addEventListener('mousedown', () => {
                    updatePaused = true;
                    setTimeout(() => {
                        updatePaused = false;
                    }, 100);
                });

                btn.onclick = function(e) {
                    e.stopPropagation();

                    if (window.getSelection) {
                        window.getSelection().removeAllRanges();
                    } else if (document.selection) {
                        document.selection.empty();
                    }

                    btn._nyukinOK = undefined;
                    btn._siharaiOK = false;
                    btn._meisaiOK = false;
                    btn._meisaiNG = false;

                    denpyoStatusMap[num] = {
                        nyukinOK: btn._nyukinOK,
                        siharaiOK: btn._siharaiOK,
                        meisaiOK: btn._meisaiOK,
                        meisaiNG: btn._meisaiNG,
                    };

                    const ownElem = document.getElementById("siharai_kbn");
                    const ownValue = ownElem ? ownElem.value || ownElem.textContent : "";
                    const url = `https://main.next-engine.com/Userjyuchu/jyuchuInp?kensaku_denpyo_no=${num}&jyuchu_meisai_order=jyuchu_meisai_gyo`;

                    const win = window.open(
                        url,
                        "denpyoJoukenCheckWindow",
                        "width=1100,height=700,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes"
                    );

                    const postMessageToChild = () => {
                        if (!win) return;
                        win.postMessage(
                            {
                                type: "SiharaikbnParentValue",
                                value: ownValue,
                                denpyoNo: num
                            },
                            "*"
                        );
                        win.postMessage(
                            {
                                type: "CheckNyukinKbn",
                                denpyoNo: num
                            },
                            "*"
                        );
                        win.postMessage(
                            {
                                type: "StartMeisaiCheck",
                                denpyoNo: num
                            },
                            "*"
                        );
                        win.postMessage(
                            {
                                type: "GetJyuchuBiChild",
                                denpyoNo: num
                            },
                            "*"
                        );
                        win.postMessage(
                            {
                                type: "GetSystemMessage",
                                denpyoNo: num
                            },
                            "*"
                        );
                        win.postMessage(
                            {
                                type: "GetMallHoldTag",
                                denpyoNo: num
                            },
                            "*"
                        );
                    };

                    let sendCount = 0;
                    const sendInterval = setInterval(() => {
                        if (win && !win.closed) {
                            postMessageToChild();
                            sendCount++;
                            if (sendCount >= 10) clearInterval(sendInterval);
                        } else {
                            clearInterval(sendInterval);
                        }
                    }, 1000);
                };

                div.appendChild(btn);
                lastTd.appendChild(div);

            });

            const execBtn = document.getElementById("ne_dlg_btn1_doukonDlg");
            if (execBtn) setupForceExecBtn(execBtn);

            if (execBtn && magnifierRows.length > 0) {
                let allOK = magnifierRows.every(num => {
                    const st = denpyoStatusMap[num];
                    return (
                        st &&
                        st.nyukinOK === true &&
                        st.siharaiOK === true &&
                        st.meisaiOK === true &&
                        st.meisaiNG !== true &&
                        st.zeroQty !== true &&
                        mallHoldMap[num] !== true &&
                        !isParentNameBlacklisted()
                    );
                }) && parentHasSetItem === false;

                execBtn.disabled = !allOK;
                execBtn.value = allOK ? "　　実　行　　" : "条件未クリア";
                execBtn.style.opacity = allOK ? 1 : 0.6;
                execBtn.style.cursor = allOK ? "pointer" : "not-allowed";
            } else {
                if (execBtn) {
                    execBtn.disabled = true;
                    execBtn.value = "条件未クリア";
                    execBtn.style.opacity = 0.6;
                    execBtn.style.cursor = "not-allowed";
                }
            }
        }

        let forceBtn = null;

        function setupForceExecBtn(execBtn) {
            if (forceBtn) return;
            forceBtn = document.createElement('button');
            forceBtn.id = 'force-exec-btn';
            forceBtn.textContent = '強制実行';
            forceBtn.style.marginLeft = '10px';
            forceBtn.style.padding = execBtn.style.padding || '0 12px';
            forceBtn.style.height = execBtn.offsetHeight + 'px';
            forceBtn.style.fontSize = execBtn.style.fontSize || '1em';
            forceBtn.style.border = '2px solid #3B82F6';
            forceBtn.style.background = 'transparent';
            forceBtn.style.color = '#3B82F6';
            forceBtn.style.cursor = 'pointer';
            forceBtn.style.display = 'none';
            forceBtn.title = "Ctrlを押している時だけ出現／条件未クリアでも強制的に実行します（注意）";
            forceBtn.addEventListener('mouseover', () => {
                forceBtn.style.background = '#3B82F6';
                forceBtn.style.color = '#fff';
            });
            forceBtn.addEventListener('mouseout', () => {
                forceBtn.style.background = 'transparent';
                forceBtn.style.color = '#3B82F6';
            });
            forceBtn.addEventListener('click', () => {
                execBtn.disabled = false;
                execBtn.click();
            });
            execBtn.parentNode.insertBefore(forceBtn, execBtn.nextSibling);

            window.addEventListener('keydown', e => {
                if (e.ctrlKey) forceBtn.style.display = '';
            });
            window.addEventListener('keyup', e => {
                if (!e.ctrlKey) forceBtn.style.display = 'none';
            });
        }

        function childWindowWatcher() {
            let lastDenpyoNo = null;

            window.addEventListener("message", function(event) {
                if (!event.data) return;

                if (event.data.type === "GetJyuchuBiChild") {
                    const {denpyoNo} = event.data;
                    const JyuchuBiChildElem = document.getElementById("jyuchu_bi");
                    const JyuchuBiChildValue = JyuchuBiChildElem ? JyuchuBiChildElem.value || JyuchuBiChildElem.textContent : "";
                    window.opener.postMessage(
                        {
                            type: "JyuchuBiChildValue",
                            denpyoNo,
                            JyuchuBiChild: JyuchuBiChildValue
                        },
                        "*"
                    );
                }

                if (event.data.type === "CheckNyukinKbn") {
                    const {denpyoNo} = event.data;
                    const nyukinElem = document.getElementById("nyukin_kbn");
                    const nyukinValue = nyukinElem ? (nyukinElem.value || nyukinElem.textContent) : "";
                    const isNyukinOK = (nyukinValue === "2");

                    window.opener.postMessage(
                        {
                            type: "NyukinKbnValueCheck",
                            denpyoNo,
                            value: nyukinValue,
                            isNyukinOK: isNyukinOK
                        },
                        "*"
                    );
                }

                if (event.data.type === "GetMallHoldTag") {
                    const { denpyoNo } = event.data;
                    const tagElem = document.getElementById("jyuchu_tag");
                    const tagHtml = tagElem ? tagElem.innerText || tagElem.textContent : "";
                    const hasMallHold = tagHtml.includes("モール保留");
                    window.opener.postMessage(
                        {
                            type: "MallHoldTagResult",
                            denpyoNo,
                            hasMallHold
                        },
                        "*"
                    );
                }

                if (event.data.type === "SiharaikbnParentValue") {
                    const {value: parentValue, denpyoNo} = event.data;
                    lastDenpyoNo = denpyoNo;

                    const ownElem = document.getElementById("siharai_kbn");
                    if (!ownElem) return;

                    let ownValue = ownElem.value || ownElem.textContent;
                    window.opener.postMessage(
                        {
                            type: "SiharaikbnValueCheck",
                            from: "child",
                            value: ownValue,
                            denpyoNo: lastDenpyoNo
                        },
                        "*"
                    );
                }

                if (event.data.type === "StartMeisaiCheck") {
                    const {denpyoNo} = event.data;
                    let closed = false;

                    function closeWindowOnce() {
                        if (!closed) {
                            closed = true;
                            setTimeout(() => window.close(), 50);
                        }
                    }

                    function checkMeisaiTable() {
                        const table = document.getElementById("jyuchuMeisai_tablene_table");
                        if (!table) return;
                        const rows = table.querySelectorAll("tbody tr");

                        let isAllMatch = true;
                        let hasSetItem = false;
                        let hasZeroQty = false;
                        for (let i = 1; i < rows.length; i++) {
                            const tds = rows[i].querySelectorAll("td");
                            if (tds.length < 13) continue;
                            const cb = tds[2].querySelector('input[type="checkbox"]');
                            if (cb && cb.checked) continue;

                            const orderQty = tds[6].textContent.trim();
                            const hikiateQty = tds[7].textContent.trim();

                            if (orderQty === "0") {
                                hasZeroQty = true;
                            }

                            if (orderQty !== hikiateQty) {
                                isAllMatch = false;
                            }

                            const price = tds[10].textContent.trim();
                            const subtotal = tds[12].textContent.trim();
                            if (orderQty !== "1" && price === subtotal) {
                                hasSetItem = true;
                            }
                        }

                        window.opener.postMessage(
                            {
                                type: "meisaiJudge",
                                denpyoNo,
                                isAllMatch,
                                hasSetItem,
                                hasZeroQty
                            },
                            "*"
                        );
                        closeWindowOnce();
                    }

                    setInterval(checkMeisaiTable, 1000);
                }
            });
        }

        if (window.opener && window.name === "denpyoJoukenCheckWindow") {
            childWindowWatcher();
        }

        function setupHelpIcon() {
            const headTr = document.getElementById(headerTrId);
            if (!headTr) return;
            const ths = headTr.querySelectorAll('td,th');
            let lastTh = ths[ths.length - 1];

            if (lastTh.querySelector('.help-icon-btn')) return;

            const helpBtn = document.createElement('button');
            helpBtn.className = 'help-icon-btn';
            helpBtn.innerText = '？';

            helpBtn.style.background = 'none';
            helpBtn.style.border = 'none';
            helpBtn.style.color = '#2b2b2b';
            helpBtn.style.fontWeight = 'bold';
            helpBtn.style.cursor = 'pointer';
            helpBtn.style.padding = '0 6px 0 4px';
            helpBtn.style.verticalAlign = 'middle';
            helpBtn.title = 'この列の説明を見る';
            helpBtn.style.width = "auto";
            helpBtn.style.minWidth = "unset";
            helpBtn.style.maxWidth = "unset";
            helpBtn.style.setProperty("width", "auto", "important");
            helpBtn.style.setProperty("min-width", "unset", "important");
            helpBtn.style.setProperty("max-width", "unset", "important");

            helpBtn.onclick = function(e) {
                e.stopPropagation();
                showBanner(
                    `<strong>同梱候補判定の操作説明</strong><br>
                   ・この列のボタンで各伝票の同梱条件チェックを実行します<br>
                   ・ボタンの色は状態を示します（赤:NG、緑:OK、黄色:要確認）<br>
                   ・すべてOKだと実行ボタンの使用が可能になります<br>
                   ・Ctrlを押しながら「強制実行」を使うと条件未クリアでも実行可能です（慎重にご利用ください）<br>
                   <span style="color:#aaa;">
                       ※詳しい使い方は
                       <a href="https://github.com/NEL227/work-toolkit/releases/tag/v1.5.0" target="_blank" style="color:#aaf;text-decoration:underline;">こちら</a>
                       を参照してください
                   </span>`
               );
            };

            lastTh.appendChild(helpBtn);
        }

        setInterval(() => {
            resizeColumn();
            safeUpdateRows();
            setupHelpIcon();
        }, 1000);
    }

    function deliveryNoteTemplateSupport(){
        GM_addStyle(`
    *, *::before, *::after {
    box-sizing: border-box;
}
.template-list-popup {
    overflow-y: auto;
    overflow-x: hidden;
}
.template-content {
    width: auto;
}
.template-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 17px;
    width: auto;
    padding-bottom: 2px;
    margin-left: 3px;
    background: #fff;
    border: 1px solid #bbb;
    border-radius: 7px;
    font-size: 11px;
    cursor: pointer;
    transition: background 0.2s;
    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
}
.template-btn:hover {
    background: #e5fbe6;
}
.template-list-popup {
    background: #fff;
    border: 1px solid #ccc;
    padding: 10px 18px 10px 16px;
    z-index: 10099;
    position: fixed;
    top: 18px;
    right: 24px;
    width: 600px;
    max-width: 95vw;
    max-height: 420px;
    overflow: auto;
    box-shadow: 0 6px 24px rgba(0,0,0,0.18);
    display: none;
    border-radius: 10px;
    font-size: 13px;
}
.template-div {
    padding: 7px 0 2px 0;
    border-top: 1px solid #eee;
    display: flex;
    align-items: flex-start;
    gap: 0.6em;
}
.template-div:first-child { border-top: none; }
.template-header-row {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 0.6em;
}

.title-text-div {flex-grow:1;cursor:pointer;}
.template-content {
    width: 100%;
    height: 0;
    opacity: 0;
    overflow: hidden;
    transition: height 0.3s, opacity 0.3s;
    font-size: 13px;
    padding-left: 8px;
    color: #333;
    margin-top: 2px;
}
.template-content.show {
    height: auto;
    opacity: 1;
    padding: 8px 0 6px 8px;
}
.paste-button-template {
    background: #fff;
    color: #0d7b3e;
    border: 1px solid #7ed17e;
    cursor: pointer;
    border-radius: 5px;
    font-size: 15px;
    width: 25px;
    height: 25px;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    margin-top: 0;
    margin-bottom: 0;
}
.paste-button-template::before { content: '📝'; font-size: 16px; }
.paste-button-template:hover { background: #c6f7cb; }
.editable-textarea {
    width: 98%;
    min-height: 125px;
    font-size: 14px;
    margin: 0 0 0 0;
    box-sizing: border-box;
    resize: vertical;
    border-radius: 5px;
    border: 1px solid #d1d6e0;
    padding: 7px;
}
.template-title {
    font-weight: bold;
    font-size: 16px;
    color: #244c8b;
    margin-right: 6px;
    letter-spacing: 0.02em;
    display: inline-flex;
    align-items: center;
}
.no-content-label {
    color: #aaa;
    font-style: italic;
}
.editable-label {
    font-size: 12px;
    color: #24996e;
    margin: 0 0 0 4px;
    padding: 2px 7px;
    background: #e6f5ec;
    border-radius: 7px;
    display: inline-block;
    vertical-align: middle;
    font-weight: normal;
}
.template-clickable-group:hover {
    transform: translateY(-1.5px);
}
.spinner {
  display: inline-block;
  width: 28px;
  height: 28px;
  vertical-align: middle;
}
.spinner:after {
  content: " ";
  display: block;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid #74c97f;
  border-color: #74c97f transparent #74c97f transparent;
  animation: spinner-anim 1.2s linear infinite;
}
@keyframes spinner-anim {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
    `);

        const TEMPLATE_URL = 'http://tk2-217-18298.vs.sakura.ne.jp/issues/406132';

        let templates = [];
        let templatesLoaded = false;
        let loadingError = "";
        let currentPopupDiv = null;

        function parseTemplatesFromText(rawText) {
            const blocks = rawText.split(/-{3,}/).map(s => s.trim()).filter(Boolean);
            const result = [];

            for (const block of blocks) {
                const titleMatch = block.match(/^タイトル：([^\r\n]+)/m);
                const editMatch = block.match(/^編集：(可能|不可)/m);
                const bodyMatch = block.match(/^本文：([\s\S]*)$/m);

                const titleText = titleMatch ? titleMatch[1].trim() : '';
                const editable = editMatch ? (editMatch[1] === '可能') : false;

                let body = '';
                if (bodyMatch) {
                    body = bodyMatch[1].trim();
                } else {
                    body = '';
                }

                if (body === '無し') {
                    body = '';
                } else {
                    body = body.trim();
                }

                if (!titleText) continue;

                result.push({
                    titleText: titleText,
                    fullText: body,
                    editable: editable,
                    body: body
                });
            }
            return result;
        }

        function fetchTemplates(url, callback) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 10000,
                onload: function(response) {
                    try {
                        const finalUrl = response.finalUrl || response.responseURL || url;
                        if (finalUrl.includes('/login')) {
                            loadingError = "[認証エラー] Redmine未ログインのためテンプレート取得不可です。ログインしてください。";
                            return callback([]);
                        }
                        if (response.status !== 200) {
                            loadingError = `[エラー] ステータス: ${response.status} で取得失敗`;
                            return callback([]);
                        }
                        if (!response.responseText) {
                            loadingError = "[エラー] ページ内容が空です。";
                            return callback([]);
                        }
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        if (!doc) {
                            loadingError = "[エラー] DOMパース失敗。";
                            return callback([]);
                        }
                        const descriptionDiv = doc.querySelector('div.description');
                        if (!descriptionDiv) {
                            loadingError = "[エラー] class='description' が見つかりません";
                            return callback([]);
                        }
                        const wikiDiv = descriptionDiv.querySelector('.wiki');
                        if (!wikiDiv) {
                            loadingError = "[エラー] class='wiki' が見つかりません（description内）";
                            return callback([]);
                        }
                        let wikiText = wikiDiv.innerHTML
                        .replace(/<br\s*\/?>/gi, '\n')
                        .replace(/<\/p>\s*<p>/gi, '\n\n')
                        .replace(/<p[^>]*>/gi, '')
                        .replace(/<\/p>/gi, '')
                        .replace(/<[^>]+>/g, '');

                        const list = parseTemplatesFromText(wikiText);
                        if(list.length === 0){
                            loadingError = "[注意] テンプレートが空です。";
                        }
                        callback(list);
                    } catch (e) {
                        loadingError = "[例外エラー] " + e;
                        callback([]);
                    }
                },
                onerror: function() {
                    loadingError = "[通信エラー] 通信エラーでテンプレートを取得できません。";
                    callback([]);
                },
                ontimeout: function() {
                    loadingError = "[タイムアウト] タイムアウトでテンプレートを取得できません。";
                    callback([]);
                }
            });
        }

        function createPopupTemplateList(getTargetInput, templates) {
            let popupDiv = document.getElementById('template-popup');
            if (popupDiv) popupDiv.remove();

            popupDiv = document.createElement('div');
            popupDiv.className = 'template-list-popup';
            popupDiv.id = 'template-popup';

            if (!templatesLoaded && !loadingError) {
                const loadingDiv = document.createElement('div');
                loadingDiv.style.display = 'flex';
                loadingDiv.style.alignItems = 'center';
                loadingDiv.style.gap = '10px';

                const spinner = document.createElement('span');
                spinner.className = 'spinner';
                loadingDiv.appendChild(spinner);

                const loadingText = document.createElement('span');
                loadingText.textContent = 'テンプレート取得中...';
                loadingDiv.appendChild(loadingText);

                popupDiv.appendChild(loadingDiv);
            } else if (loadingError) {
                popupDiv.textContent = loadingError;
            } else if (templates.length === 0) {
                popupDiv.textContent = 'テンプレートが見つかりません';
            } else {
                templates.forEach((template, i) => {
                    const templateDiv = document.createElement('div');
                    templateDiv.className = 'template-div';

                    const headerRow = document.createElement('div');
                    headerRow.className = 'template-header-row';

                    const clickableGroup = document.createElement('span');
                    clickableGroup.style.display = 'inline-flex';
                    clickableGroup.style.alignItems = 'center';
                    if (template.fullText) {
                        clickableGroup.className = 'template-clickable-group';
                        clickableGroup.style.cursor = 'pointer';
                    }

                    if (template.fullText) {
                        const icon = document.createElement('span');
                        icon.textContent = '🗒️';
                        icon.style.fontSize = '20px';
                        icon.style.marginRight = '3px';
                        icon.style.verticalAlign = 'middle';
                        clickableGroup.appendChild(icon);
                    }

                    const titleSpan = document.createElement('span');
                    titleSpan.className = 'template-title';
                    titleSpan.textContent = template.titleText;
                    clickableGroup.appendChild(titleSpan);

                    if (template.fullText && template.editable) {
                        const editableLabel = document.createElement('span');
                        editableLabel.className = 'editable-label';
                        editableLabel.style.marginLeft = '7px';
                        editableLabel.textContent = '編集可能';
                        clickableGroup.appendChild(editableLabel);
                    }

                    if (template.fullText) {
                        clickableGroup.addEventListener('click', function () {
                            templateContentDiv.classList.toggle('show');
                        });
                    }

                    const pasteButton = document.createElement('button');
                    pasteButton.type = 'button';
                    pasteButton.className = 'paste-button-template';
                    pasteButton.title = '貼り付け';
                    pasteButton.addEventListener('click', function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                        const targetInput = getTargetInput();
                        let text = template.fullText ? template.fullText : template.titleText;
                        if (targetInput) {
                            if (targetInput.value) targetInput.value += '\n' + text;
                            else targetInput.value = text;
                            targetInput.dispatchEvent(new Event('input', { bubbles: true }));
                        } else {
                            alert('id="nouhinsyo_text" の要素が見つかりません');
                        }
                        popupDiv.style.display = 'none';
                    });

                    headerRow.appendChild(clickableGroup);
                    headerRow.appendChild(pasteButton);
                    templateDiv.appendChild(headerRow);

                    let templateContentDiv = document.createElement('div');
                    templateContentDiv.className = 'template-content';
                    templateContentDiv.style.whiteSpace = 'pre-wrap';

                    if (template.fullText && template.editable) {
                        const textarea = document.createElement('textarea');
                        textarea.className = 'editable-textarea';
                        textarea.value = template.body;
                        textarea.addEventListener('input', (e) => {
                            template.fullText = textarea.value;
                        });
                        templateContentDiv.appendChild(textarea);
                    } else if (template.fullText) {
                        templateContentDiv.textContent = template.fullText;
                    }

                    popupDiv.appendChild(templateDiv);
                    if (template.fullText) popupDiv.appendChild(templateContentDiv);
                });

            }

            document.body.appendChild(popupDiv);
            return popupDiv;
        }

        function insertTemplateButton() {
            const targetTd = Array.from(document.querySelectorAll('td.group_head'))
            .find(td => td.textContent.includes('納品書特記事項'));
            if (!targetTd) return;
            if (targetTd.querySelector('.template-btn')) return;

            targetTd.style.position = "relative";

            const getTargetInput = () => document.getElementById('nouhinsyo_text');

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'template-btn';
            btn.title = 'テンプレート挿入';
            btn.innerText = '定型文';

            btn.style.position = "absolute";
            btn.style.top = "3px";
            btn.style.right = "0";
            btn.style.zIndex = "10";

            btn.onclick = e => {
                e.stopPropagation();

                if (currentPopupDiv && currentPopupDiv.style.display === 'block') {
                    currentPopupDiv.style.display = 'none';
                    currentPopupDiv = null;
                    return;
                }

                currentPopupDiv = createPopupTemplateList(getTargetInput, templates);
                currentPopupDiv.style.display = 'block';

                function closePopup(ev) {
                    if (!currentPopupDiv.contains(ev.target) && ev.target !== btn) {
                        currentPopupDiv.style.display = 'none';
                        document.removeEventListener('mousedown', closePopup);
                        currentPopupDiv = null;
                    }
                }
                setTimeout(() => {
                    document.addEventListener('mousedown', closePopup);
                });

                function escClose(ev) {
                    if (ev.key === 'Escape') {
                        currentPopupDiv.style.display = 'none';
                        document.removeEventListener('keydown', escClose);
                        document.removeEventListener('mousedown', closePopup);
                        currentPopupDiv = null;
                    }
                }
                document.addEventListener('keydown', escClose);
            };

            const openLink = targetTd.querySelector('a#nouhinsyo_sw');
            if (openLink) {
                openLink.after(btn);
            } else {
                targetTd.appendChild(btn);
            }
        }

        const getTargetInput = () => document.getElementById('nouhinsyo_text');

        function updatePopupIfOpen() {
            if (currentPopupDiv && currentPopupDiv.style.display === 'block') {
                document.removeEventListener('keydown', escClose);
                const newPopupDiv = createPopupTemplateList(getTargetInput, templates);
                newPopupDiv.style.display = 'block';
                currentPopupDiv.replaceWith(newPopupDiv);
                currentPopupDiv = newPopupDiv;

                function closePopup(ev) {
                    if (!currentPopupDiv.contains(ev.target)) {
                        currentPopupDiv.style.display = 'none';
                        document.removeEventListener('mousedown', closePopup);
                        document.removeEventListener('keydown', escClose);
                        currentPopupDiv = null;
                    }
                }
                setTimeout(() => {
                    document.addEventListener('mousedown', closePopup);
                });

                function escClose(ev) {
                    if (ev.key === 'Escape') {
                        currentPopupDiv.style.display = 'none';
                        document.removeEventListener('keydown', escClose);
                        document.removeEventListener('mousedown', closePopup);
                        currentPopupDiv = null;
                    }
                }
                document.addEventListener('keydown', escClose);
            }
        }

        insertTemplateButton();

        fetchTemplates(TEMPLATE_URL, function(list) {
            templates = list;
            templatesLoaded = true;
            updatePopupIfOpen();
        });
    }

    function messageTemplateSupport(){

        GM_addStyle(`
    *, *::before, *::after {
    box-sizing: border-box;
}
.template2-list-popup {
    overflow-y: auto;
    overflow-x: hidden;
}
.template2-content {
    width: auto;
}
.template2-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 17px;
    width: auto;
    padding-bottom: 2px;
    margin-left: 3px;
    background: #fff;
    border: 1px solid #bbb;
    border-radius: 7px;
    font-size: 11px;
    cursor: pointer;
    transition: background 0.2s;
    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
}
.template2-btn:hover {
    background: #e5fbe6;
}
.template2-list-popup {
    background: #fff;
    border: 1px solid #ccc;
    padding: 10px 18px 10px 16px;
    z-index: 10099;
    position: fixed;
    top: 18px;
    right: 24px;
    width: 600px;
    max-width: 95vw;
    max-height: 420px;
    overflow: auto;
    box-shadow: 0 6px 24px rgba(0,0,0,0.18);
    display: none;
    border-radius: 10px;
    font-size: 13px;
}
.template2-div {
    padding: 7px 0 2px 0;
    border-top: 1px solid #eee;
    display: flex;
    align-items: flex-start;
    gap: 0.6em;
}
.template2-div:first-child { border-top: none; }
.template2-header-row {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 0.6em;
}

.title-text-div {flex-grow:1;cursor:pointer;}
.template2-content {
    width: 100%;
    height: 0;
    opacity: 0;
    overflow: hidden;
    transition: height 0.3s, opacity 0.3s;
    font-size: 13px;
    padding-left: 8px;
    color: #333;
    margin-top: 2px;
}
.template2-content.show {
    height: auto;
    opacity: 1;
    padding: 8px 0 6px 8px;
}
.paste-button-template2 {
    background: #fff;
    color: #0d7b3e;
    border: 1px solid #7ed17e;
    cursor: pointer;
    border-radius: 5px;
    font-size: 15px;
    width: 25px;
    height: 25px;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    margin-top: 0;
    margin-bottom: 0;
}
.paste-button-template2::before { content: '📝'; font-size: 16px; }
.paste-button-template2:hover { background: #c6f7cb; }
.editable-textarea {
    width: 98%;
    min-height: 125px;
    font-size: 14px;
    margin: 0 0 0 0;
    box-sizing: border-box;
    resize: vertical;
    border-radius: 5px;
    border: 1px solid #d1d6e0;
    padding: 7px;
}
.template2-title {
    font-weight: bold;
    font-size: 16px;
    color: #244c8b;
    margin-right: 6px;
    letter-spacing: 0.02em;
    display: inline-flex;
    align-items: center;
}
.no-content-label2 {
    color: #aaa;
    font-style: italic;
}
.editable-label2 {
    font-size: 12px;
    color: #24996e;
    margin: 0 0 0 4px;
    padding: 2px 7px;
    background: #e6f5ec;
    border-radius: 7px;
    display: inline-block;
    vertical-align: middle;
    font-weight: normal;
}
.template2-clickable-group:hover {
    transform: translateY(-1.5px);
}
.spinner2 {
  display: inline-block;
  width: 28px;
  height: 28px;
  vertical-align: middle;
}
.spinner2:after {
  content: " ";
  display: block;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid #74c97f;
  border-color: #74c97f transparent #74c97f transparent;
  animation: spinner-anim 1.2s linear infinite;
}
@keyframes spinner-anim2 {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
    `);

        const TEMPLATE_URL = 'http://tk2-217-18298.vs.sakura.ne.jp/issues/409075';

        let templates = [];
        let templatesLoaded = false;
        let loadingError = "";
        let currentPopupDiv = null;

        function parseTemplatesFromText(rawText) {
            const blocks = rawText.split(/-{3,}/).map(s => s.trim()).filter(Boolean);
            const result = [];

            for (const block of blocks) {
                const titleMatch = block.match(/^タイトル：([^\r\n]+)/m);
                const editMatch = block.match(/^編集：(可能|不可)/m);
                const bodyMatch = block.match(/^本文：([\s\S]*)$/m);

                const titleText = titleMatch ? titleMatch[1].trim() : '';
                const editable = editMatch ? (editMatch[1] === '可能') : false;

                let body = '';
                if (bodyMatch) {
                    body = bodyMatch[1].trim();
                } else {
                    body = '';
                }

                if (body === '無し') {
                    body = '';
                } else {
                    body = body.trim();
                }

                if (!titleText) continue;

                result.push({
                    titleText: titleText,
                    fullText: body,
                    editable: editable,
                    body: body
                });
            }
            return result;
        }

        function fetchTemplates(url, callback) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 10000,
                onload: function(response) {
                    try {
                        const finalUrl = response.finalUrl || response.responseURL || url;
                        if (finalUrl.includes('/login')) {
                            loadingError = "[認証エラー] Redmine未ログインのためテンプレート取得不可です。ログインしてください。";
                            return callback([]);
                        }
                        if (response.status !== 200) {
                            loadingError = `[エラー] ステータス: ${response.status} で取得失敗`;
                            return callback([]);
                        }
                        if (!response.responseText) {
                            loadingError = "[エラー] ページ内容が空です。";
                            return callback([]);
                        }
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        if (!doc) {
                            loadingError = "[エラー] DOMパース失敗。";
                            return callback([]);
                        }
                        const descriptionDiv = doc.querySelector('div.description');
                        if (!descriptionDiv) {
                            loadingError = "[エラー] class='description' が見つかりません";
                            return callback([]);
                        }
                        const wikiDiv = descriptionDiv.querySelector('.wiki');
                        if (!wikiDiv) {
                            loadingError = "[エラー] class='wiki' が見つかりません（description内）";
                            return callback([]);
                        }
                        let wikiText = wikiDiv.innerHTML
                        .replace(/<br\s*\/?>/gi, '\n')
                        .replace(/<\/p>\s*<p>/gi, '\n\n')
                        .replace(/<p[^>]*>/gi, '')
                        .replace(/<\/p>/gi, '')
                        .replace(/<[^>]+>/g, '');

                        const list = parseTemplatesFromText(wikiText);
                        if(list.length === 0){
                            loadingError = "[注意] テンプレートが空です。";
                        }
                        callback(list);
                    } catch (e) {
                        loadingError = "[例外エラー] " + e;
                        callback([]);
                    }
                },
                onerror: function() {
                    loadingError = "[通信エラー] 通信エラーでテンプレートを取得できません。";
                    callback([]);
                },
                ontimeout: function() {
                    loadingError = "[タイムアウト] タイムアウトでテンプレートを取得できません。";
                    callback([]);
                }
            });
        }

        function createPopupTemplateList(getTargetInput, templates) {
            let popupDiv = document.getElementById('template2-popup');
            if (popupDiv) popupDiv.remove();

            popupDiv = document.createElement('div');
            popupDiv.className = 'template2-list-popup';
            popupDiv.id = 'template2-popup';

            if (!templatesLoaded && !loadingError) {
                const loadingDiv = document.createElement('div');
                loadingDiv.style.display = 'flex';
                loadingDiv.style.alignItems = 'center';
                loadingDiv.style.gap = '10px';

                const spinner = document.createElement('span');
                spinner.className = 'spinner';
                loadingDiv.appendChild(spinner);

                const loadingText = document.createElement('span');
                loadingText.textContent = 'テンプレート取得中...';
                loadingDiv.appendChild(loadingText);

                popupDiv.appendChild(loadingDiv);
            } else if (loadingError) {
                popupDiv.textContent = loadingError;
            } else if (templates.length === 0) {
                popupDiv.textContent = 'テンプレートが見つかりません';
            } else {
                templates.forEach((template, i) => {
                    const templateDiv = document.createElement('div');
                    templateDiv.className = 'template2-div';

                    const headerRow = document.createElement('div');
                    headerRow.className = 'template2-header-row';

                    const clickableGroup = document.createElement('span');
                    clickableGroup.style.display = 'inline-flex';
                    clickableGroup.style.alignItems = 'center';
                    if (template.fullText) {
                        clickableGroup.className = 'template2-clickable-group';
                        clickableGroup.style.cursor = 'pointer';
                    }

                    if (template.fullText) {
                        const icon = document.createElement('span');
                        icon.textContent = '🗒️';
                        icon.style.fontSize = '20px';
                        icon.style.marginRight = '3px';
                        icon.style.verticalAlign = 'middle';
                        clickableGroup.appendChild(icon);
                    }

                    const titleSpan = document.createElement('span');
                    titleSpan.className = 'template2-title';
                    titleSpan.textContent = template.titleText;
                    clickableGroup.appendChild(titleSpan);

                    if (template.fullText && template.editable) {
                        const editableLabel = document.createElement('span');
                        editableLabel.className = 'editable-label2';
                        editableLabel.style.marginLeft = '7px';
                        editableLabel.textContent = '編集可能';
                        clickableGroup.appendChild(editableLabel);
                    }

                    if (template.fullText) {
                        clickableGroup.addEventListener('click', function () {
                            templateContentDiv.classList.toggle('show');
                        });
                    }

                    const pasteButton = document.createElement('button');
                    pasteButton.type = 'button';
                    pasteButton.className = 'paste-button-template2';
                    pasteButton.title = '貼り付け';
                    pasteButton.addEventListener('click', function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                        const targetInput = getTargetInput();
                        let text = template.fullText ? template.fullText : template.titleText;
                        if (targetInput) {
                            if (targetInput.value) targetInput.value += '\n' + text;
                            else targetInput.value = text;
                            targetInput.dispatchEvent(new Event('input', { bubbles: true }));
                        } else {
                            alert('id="bikou" の要素が見つかりません');
                        }
                        popupDiv.style.display = 'none';
                    });

                    headerRow.appendChild(clickableGroup);
                    headerRow.appendChild(pasteButton);
                    templateDiv.appendChild(headerRow);

                    let templateContentDiv = document.createElement('div');
                    templateContentDiv.className = 'template2-content';
                    templateContentDiv.style.whiteSpace = 'pre-wrap';

                    if (template.fullText && template.editable) {
                        const textarea = document.createElement('textarea');
                        textarea.className = 'editable-textarea';
                        textarea.value = template.body;
                        textarea.addEventListener('input', (e) => {
                            template.fullText = textarea.value;
                        });
                        templateContentDiv.appendChild(textarea);
                    } else if (template.fullText) {
                        templateContentDiv.textContent = template.fullText;
                    }

                    popupDiv.appendChild(templateDiv);
                    if (template.fullText) popupDiv.appendChild(templateContentDiv);
                });

            }

            document.body.appendChild(popupDiv);
            return popupDiv;
        }

        function insertTemplateButton() {
            const targetTds = Array.from(document.querySelectorAll('td.group_head'))
            .filter(td => td.textContent.includes('メッセージ'));

            if (targetTds.length < 2) return;
            const targetTd = targetTds[1];

            if (!targetTd) return;
            if (targetTd.querySelector('.template2-btn')) return;

            targetTd.style.position = "relative";

            const getTargetInput = () => document.getElementById('message');

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'template2-btn';
            btn.title = 'テンプレート挿入';
            btn.innerText = '定型文';

            btn.style.position = "absolute";
            btn.style.top = "1px";
            btn.style.left = "75px";
            btn.style.zIndex = "10";

            btn.onclick = e => {
                e.stopPropagation();

                if (currentPopupDiv && currentPopupDiv.style.display === 'block') {
                    currentPopupDiv.style.display = 'none';
                    currentPopupDiv = null;
                    return;
                }

                currentPopupDiv = createPopupTemplateList(getTargetInput, templates);
                currentPopupDiv.style.display = 'block';

                function closePopup(ev) {
                    if (!currentPopupDiv.contains(ev.target) && ev.target !== btn) {
                        currentPopupDiv.style.display = 'none';
                        document.removeEventListener('mousedown', closePopup);
                        currentPopupDiv = null;
                    }
                }
                setTimeout(() => {
                    document.addEventListener('mousedown', closePopup);
                });

                function escClose(ev) {
                    if (ev.key === 'Escape') {
                        currentPopupDiv.style.display = 'none';
                        document.removeEventListener('keydown', escClose);
                        document.removeEventListener('mousedown', closePopup);
                        currentPopupDiv = null;
                    }
                }
                document.addEventListener('keydown', escClose);
            };

            targetTd.appendChild(btn);
        }

        const getTargetInput = () => document.getElementById('message');

        function updatePopupIfOpen() {
            if (currentPopupDiv && currentPopupDiv.style.display === 'block') {
                document.removeEventListener('keydown', escClose);
                const newPopupDiv = createPopupTemplateList(getTargetInput, templates);
                newPopupDiv.style.display = 'block';
                currentPopupDiv.replaceWith(newPopupDiv);
                currentPopupDiv = newPopupDiv;

                function closePopup(ev) {
                    if (!currentPopupDiv.contains(ev.target)) {
                        currentPopupDiv.style.display = 'none';
                        document.removeEventListener('mousedown', closePopup);
                        document.removeEventListener('keydown', escClose);
                        currentPopupDiv = null;
                    }
                }
                setTimeout(() => {
                    document.addEventListener('mousedown', closePopup);
                });

                function escClose(ev) {
                    if (ev.key === 'Escape') {
                        currentPopupDiv.style.display = 'none';
                        document.removeEventListener('keydown', escClose);
                        document.removeEventListener('mousedown', closePopup);
                        currentPopupDiv = null;
                    }
                }
                document.addEventListener('keydown', escClose);
            }
        }

        insertTemplateButton();

        fetchTemplates(TEMPLATE_URL, function(list) {
            templates = list;
            templatesLoaded = true;
            updatePopupIfOpen();
        });
    }

    function enable1688GuestView() {
        const STYLE_ID = 'tm-1688-guest-style';

        function isGuest() {
            const s = document.getElementById('submitOrder');
            return !!(s && s.classList.contains('not-login'));
        }

        function ensureStyle() {
            if (document.getElementById(STYLE_ID)) return;
            const s = document.createElement('style');
            s.id = STYLE_ID;
            s.textContent = `
:root[data-tm-guest="1"] #submitOrder { display: none !important; }
:root[data-tm-guest="1"] .module-login-bar.v-flex.center { display: none !important; }
:root[data-tm-guest="1"] .collapse-footer { display: none !important; }

:root[data-tm-guest="1"] .module-od-sku-selection.od-sku-selection-not-login {
  height:auto !important; max-height:none !important;
}
:root[data-tm-guest="1"] .antd-external-collapse.collapse-body,
:root[data-tm-guest="1"] #description .collapse-body {
  height:auto !important; max-height:none !important;
}

:root[data-tm-guest="1"] #mainPrice,
:root[data-tm-guest="1"] #mainPrice .price-comp,
:root[data-tm-guest="1"] .module-od-main-price,
:root[data-tm-guest="1"] .od-price-wrap,
:root[data-tm-guest="1"] .od-pc-main-info,
:root[data-tm-guest="1"] .od-detail-info {
  height:auto !important; max-height:none !important;
}

:root[data-tm-guest="1"] .hp-badge{
  margin-right:10px; padding:1px 6px; border-radius:999px; background:#ff4000; color:#fff;
  font:12px/18px system-ui,sans-serif; display:inline-block; vertical-align:middle; white-space:nowrap;
}

:root[data-tm-guest="1"] .hp-range{
  display:inline-block; padding:2px 8px; border-radius:10px;
  font:600 16px/20px system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
  letter-spacing:.2px; color:#fff; background:#ff4000; border:1px solid rgba(0,0,0,.08);
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.35); -webkit-font-smoothing:antialiased; white-space:nowrap;
}

:root[data-tm-guest="1"] .hp-range-host{
  display:block; margin-left:6px; padding:0; white-space:normal;
  pointer-events:auto; cursor:default; user-select:text;
}

:root[data-tm-guest="1"] .hp-moq{
  display:inline-flex; flex-wrap:wrap; align-items:flex-start; gap:6px 8px;
  margin:4px 0 4px 8px; max-width:100%;
}
:root[data-tm-guest="1"] .hp-moq-chip{
  display:inline-block; padding:2px 8px; border-radius:10px;
  font:600 13px/20px system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
  color:#fff; background:#656565; border:1px solid rgba(255,255,255,.15); white-space:nowrap;
}
:root[data-tm-guest="1"] .hp-moq-more{
  display:inline-block; padding:2px 8px; border-radius:10px; border:1px dashed rgba(0,0,0,.25);
  font:600 12px/20px system-ui,sans-serif; background:transparent; cursor:pointer;
}
:root[data-tm-guest="1"] .hp-moq[data-collapsed="1"] .hp-moq-chip[data-overflow="1"]{ display:none !important; }

:root[data-tm-guest="1"] .hp-stealth { opacity:0.01 !important; }
:root[data-tm-guest="1"].hp-stealth-all,
:root[data-tm-guest="1"].hp-stealth-all * { animation:none !important; transition:none !important; scroll-behavior:auto !important; }
:root[data-tm-guest="1"].hp-stealth-all [data-module*="photo"],
:root[data-tm-guest="1"].hp-stealth-all #mod-detail-gallery,
:root[data-tm-guest="1"].hp-stealth-all [id*="gallery"],
:root[data-tm-guest="1"].hp-stealth-all [class*="gallery"],
:root[data-tm-guest="1"].hp-stealth-all [class*="image-viewer"],
:root[data-tm-guest="1"].hp-stealth-all [class*="main-image"],
:root[data-tm-guest="1"].hp-stealth-all [class*="preview"]{ visibility:hidden !important; }
:root[data-tm-guest="1"].hp-stealth-all .transverse-filter{ pointer-events:none !important; }
:root[data-tm-guest="1"].hp-stealth-all .sku-filter-button,
:root[data-tm-guest="1"].hp-stealth-all .sku-filter-button *{ transition:none !important; animation:none !important; filter:none !important; }
:root[data-tm-guest="1"].hp-stealth-all .sku-filter-button.active,
:root[data-tm-guest="1"].hp-stealth-all .sku-filter-button.selected,
:root[data-tm-guest="1"].hp-stealth-all .sku-filter-button.is-selected,
:root[data-tm-guest="1"].hp-stealth-all .sku-filter-button[aria-checked="true"],
:root[data-tm-guest="1"].hp-stealth-all .sku-filter-button.active .label-image-wrap,
:root[data-tm-guest="1"].hp-stealth-all .sku-filter-button.active .prop-img{
  outline:none !important; box-shadow:none !important; border-color:transparent !important;
  filter:none !important; background:inherit !important; color:inherit !important;
}
`;
            document.head.appendChild(s);
        }

        const guestFeature = (() => {
            let depMo=null, mpMo=null, bodyMo=null, scheduled=false;
            let INTERNAL_SWITCHING=false;

            const unclippedNodes = new Set();

            const state = {
                harvesting:false, rerun:false, globalMin:null, globalMax:null, lastSig:'', lastHarvestAt:0,
                moqTiers:[]
            };

            const qs=(s,root=document)=>root.querySelector(s);
            const qsa=(s,root=document)=>Array.from(root.querySelectorAll(s));
            const normalize=(s)=>String(s||'').replace(/\s+/g,' ').replace(/\u3000/g,' ').trim();
            const rafOnce=()=>new Promise(r=>requestAnimationFrame(()=>r()));
            const raf2=async()=>{ await rafOnce(); await rafOnce(); };

            const SEL = {
                depListContainer: '.expand-view-list',
                depListItem:      '.expand-view-item',
                depListItemLabel: '.item-label',
                depListPrice:     '.item-price-stock',
                mainPrice:        '#mainPrice',
                mainPriceLead:    '#mainPrice .unlogin-lead',
                mainPriceHost:    '#mainPrice .hp-range-host',
                parentModule:     '.feature-item',
                parentItemButton: '.transverse-filter .sku-filter-button',
                activeButton:     '.sku-filter-button.active',
                parentItemLabel:  '.label-name',
            };

            const fmtYuan = (n)=>`¥ ${Number(n).toFixed(2)}`;
            function parsePriceNum(text){ const m = String(text||'').match(/(\d+(?:\.\d+)?)/); return m ? Number(m[1]) : NaN; }

            function isFramedContainer(el) {
                const cs = getComputedStyle(el);
                const hasBorder =
                      parseFloat(cs.borderTopWidth)  > 0 ||
                      parseFloat(cs.borderRightWidth)> 0 ||
                      parseFloat(cs.borderBottomWidth)>0 ||
                      parseFloat(cs.borderLeftWidth) > 0;
                const hasShadow = !!cs.boxShadow && cs.boxShadow !== 'none';
                const hasOutline = !!cs.outlineStyle && cs.outlineStyle !== 'none';
                const bg = cs.backgroundColor;
                const opaqueBg = bg && bg !== 'transparent' && !/rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/i.test(bg);
                return hasBorder || hasShadow || hasOutline || opaqueBg;
            }
            function isScrollContainer(el){
                const cs = getComputedStyle(el);
                const oy = cs.overflowY;
                const ox = cs.overflowX;
                const scrollish = (v)=> v === 'auto' || v === 'scroll';
                return scrollish(oy) || scrollish(ox);
            }
            function rememberInline(el, key) {
                const dataKey = 'hpUnclip' + key[0].toUpperCase() + key.slice(1);
                if (el.dataset[dataKey] === undefined) {
                    el.dataset[dataKey] = el.style[key] || '';
                    unclippedNodes.add(el);
                }
            }
            function restoreInline(el, key) {
                const dataKey = 'hpUnclip' + key[0].toUpperCase() + key.slice(1);
                if (el.dataset[dataKey] !== undefined) {
                    el.style[key] = el.dataset[dataKey];
                    delete el.dataset[dataKey];
                }
            }
            function unlockHeights(el) {
                rememberInline(el, 'height');
                rememberInline(el, 'maxHeight');
                el.style.height = 'auto';
                el.style.maxHeight = 'none';
            }
            function softenOverflow(el) {
                if (isFramedContainer(el)) return;
                if (isScrollContainer(el)) return;
                rememberInline(el, 'overflow');         el.style.overflow  = 'visible';
                rememberInline(el, 'overflowX');        el.style.overflowX = 'visible';
                rememberInline(el, 'overflowY');        el.style.overflowY = 'visible';
            }
            function ensureUnclippedFor(node){
                if(!node) return;
                let p = node.parentElement;
                let hops = 0;
                while(p && hops < 10){
                    const cs = getComputedStyle(p);

                    const heightLimited =
                          (cs.maxHeight !== 'none' && p.scrollHeight > p.clientHeight + 1) ||
                          (cs.height !== 'auto' && p.scrollHeight > p.clientHeight + 1);
                    if (heightLimited) {
                        unlockHeights(p);
                        if (p.scrollHeight > p.clientHeight + 1) softenOverflow(p);
                        if (p.id === 'mainPrice') break;
                        break;
                    }

                    const overflowCuts =
                          (cs.overflowY === 'hidden' || cs.overflowY === 'clip' ||
                           cs.overflowX === 'hidden' || cs.overflowX === 'clip') &&
                          (p.scrollHeight > p.clientHeight + 1 || p.scrollWidth > p.clientWidth + 1);
                    if (overflowCuts) {
                        softenOverflow(p);
                        if (p.id === 'mainPrice') break;
                        break;
                    }

                    if (p.id === 'mainPrice') break;
                    p = p.parentElement;
                    hops++;
                }
            }
            function restoreUnclipped(){
                for(const el of unclippedNodes){
                    restoreInline(el, 'height');
                    restoreInline(el, 'maxHeight');
                    restoreInline(el, 'overflow');
                    restoreInline(el, 'overflowX');
                    restoreInline(el, 'overflowY');
                }
                unclippedNodes.clear();
            }

            function collectDependentList(container){
                if(!container) return [];
                const rows = container.querySelectorAll(SEL.depListItem);
                const out = [];
                for(let i=0;i<rows.length;i++){
                    const row = rows[i];
                    const labelEl = row.querySelector(SEL.depListItemLabel);
                    const label = normalize(labelEl?.getAttribute('title') || labelEl?.textContent || '');
                    if(!label) continue;
                    const ps = row.querySelectorAll(SEL.depListPrice);
                    const t1 = normalize(ps[0]?.textContent || '');
                    const t2 = normalize(ps[1]?.textContent || '');
                    const priceText = /[¥￥]/.test(t1) ? t1 : /[¥￥]/.test(t2) ? t2 : (t1 || t2);
                    const priceNum = parsePriceNum(priceText);
                    out.push({ index:i, label, priceText, price: isFinite(priceNum)?priceNum:NaN, row });
                }
                return out;
            }
            function ensureBadgeHost(row){ return row.querySelector(SEL.depListItemLabel)?.parentElement || row; }
            function annotateBadges(container, items){
                const map = new Map(items.map(x=>[x.label, x.price]));
                const rows = container.querySelectorAll(SEL.depListItem);
                for(const row of rows){
                    const labelEl = row.querySelector(SEL.depListItemLabel);
                    const label = normalize(labelEl?.getAttribute('title') || labelEl?.textContent || '');
                    if(!label) continue;
                    const priceNum = map.get(label);
                    const display = isFinite(priceNum) ? `${priceNum} 元` : '-';
                    const host = ensureBadgeHost(row);
                    if(!host) continue;
                    let badge = host.querySelector('.hp-badge');
                    const current = host.getAttribute('data-hp') || '';
                    if(current === display) continue;
                    if(!badge){ badge = document.createElement('span'); badge.className = 'hp-badge'; host.appendChild(badge); }
                    badge.textContent = display;
                    host.setAttribute('data-hp', display);
                }
            }

            function neutralizeUnloginLead(){
                const old = qs(SEL.mainPriceLead);
                if(!old) return null;
                const host = document.createElement('p');
                host.className = 'hp-range-host';
                old.replaceWith(host);
                return host;
            }
            function getRangeHost(){
                let host = qs(SEL.mainPriceHost);
                if(host) return host;
                host = neutralizeUnloginLead();
                if(host) return host;
                const parent = qs('#mainPrice .price-comp') || qs('#mainPrice .module-od-main-price') || qs('#mainPrice');
                if(!parent) return null;
                host = document.createElement('p');
                host.className = 'hp-range-host';
                parent.appendChild(host);
                return host;
            }

            function renderMainPriceRange(min, max){
                const host = getRangeHost();
                if(!host) return;
                const min2 = Number(Number(min).toFixed(2));
                const max2 = Number(Number(max).toFixed(2));
                let range = host.querySelector('.hp-range');
                if(min2 === max2){
                    if(range) range.remove();
                    host.removeAttribute('data-hp-range');
                } else {
                    const text = `${fmtYuan(min2)} ~ ${fmtYuan(max2)}`;
                    if(!range){
                        range = document.createElement('span');
                        range.className = 'hp-range';
                        host.prepend(range);
                    }
                    if(range.textContent !== text){
                        range.textContent = text;
                        host.setAttribute('data-hp-range', text);
                    }
                }
                ensureUnclippedFor(host);
            }

            let moqRO = null;
            function renderMoqTiers(tiers){
                const host = getRangeHost();
                if(!host) return;

                let moq = host.querySelector('.hp-moq');
                if(!moq){
                    moq = document.createElement('span');
                    moq.className = 'hp-moq';
                    host.appendChild(moq);
                }

                const prevSig = moq.getAttribute('data-sig') || '';
                const newSig = String(tiers.join('|'));
                if(prevSig !== newSig){
                    moq.innerHTML = '';
                    moq.setAttribute('data-sig', newSig);

                    const chips = [];
                    for(const seg of tiers){
                        const chip = document.createElement('span');
                        chip.className = 'hp-moq-chip';
                        chip.textContent = seg;
                        moq.appendChild(chip);
                        chips.push(chip);
                    }

                    moq.removeAttribute('data-collapsed');
                    chips.forEach(c=>c.removeAttribute('data-overflow'));
                    const firstTop = chips.length ? chips[0].offsetTop : 0;
                    let lastVisibleIdx = chips.length - 1;
                    for(let i=0;i<chips.length;i++){
                        if(chips[i].offsetTop - firstTop > 24){ lastVisibleIdx = i - 1; break; }
                    }
                    if(lastVisibleIdx < chips.length - 1){
                        moq.setAttribute('data-collapsed','1');
                        for(let i=lastVisibleIdx+1;i<chips.length;i++) chips[i].setAttribute('data-overflow','1');
                        const more = document.createElement('button');
                        more.type = 'button';
                        more.className = 'hp-moq-more';
                        more.textContent = `もっと…`;
                        more.addEventListener('click', ()=>{
                            const collapsed = moq.getAttribute('data-collapsed') === '1';
                            if(collapsed){
                                moq.setAttribute('data-collapsed','0');
                                chips.forEach(c=>c.removeAttribute('data-overflow'));
                                more.textContent = '閉じる';
                            }else{
                                moq.setAttribute('data-collapsed','1');
                                for(let i=lastVisibleIdx+1;i<chips.length;i++) chips[i].setAttribute('data-overflow','1');
                                more.textContent = 'もっと…';
                            }
                            ensureUnclippedFor(host);
                        }, { passive:true });
                        moq.appendChild(more);
                    }
                }

                if(!moqRO){ moqRO = new ResizeObserver(()=>ensureUnclippedFor(host)); }
                moqRO.disconnect();
                moqRO.observe(moq);
                ensureUnclippedFor(host);
            }

            function findControlModule(){
                const activeBtn = qs(SEL.activeButton);
                return activeBtn ? activeBtn.closest(SEL.parentModule) : null;
            }
            function findControlButtons(){
                const m = findControlModule();
                return m ? qsa(SEL.parentItemButton, m) : [];
            }
            function buttonsSignature(btns){
                const labels = btns.map(b=>normalize(b.querySelector(SEL.parentItemLabel)?.textContent || b.getAttribute('title') || ''));
                return labels.join('|') + `#${btns.length}`;
            }

            function setStealth(on){
                qsa(SEL.depListContainer).forEach(c=>c.classList.toggle('hp-stealth', !!on));
                document.documentElement.classList.toggle('hp-stealth-all', !!on);
            }

            async function clickAndRead(btn){
                btn.click();
                await raf2();
                return collectDependentList(qs(SEL.depListContainer));
            }

            function computeMinMaxFromCombos(combos){
                let min = Infinity, max = -Infinity;
                for(const items of combos){
                    for(const it of items){
                        if(!isFinite(it.price)) continue;
                        if(it.price < min) min = it.price;
                        if(it.price > max) max = it.price;
                    }
                }
                if(!isFinite(min) || !isFinite(max)) return null;
                return { min, max };
            }

            const HARVEST_COOLDOWN_MS = 2500;
            async function harvestAllActives(){
                const now = Date.now();
                if(now - state.lastHarvestAt < HARVEST_COOLDOWN_MS) return;
                state.lastHarvestAt = now;
                if(state.harvesting){ state.rerun = true; return; }
                state.harvesting = true; state.rerun = false;

                INTERNAL_SWITCHING = true;
                setStealth(true);

                try{
                    const buttons = findControlButtons();
                    if(!buttons.length) return;
                    const sig = buttonsSignature(buttons);
                    if(sig === state.lastSig && isFinite(state.globalMin) && isFinite(state.globalMax)) return;
                    state.lastSig = sig;

                    const orig = qs(SEL.activeButton);
                    const combos = [];
                    combos.push(collectDependentList(qs(SEL.depListContainer)));
                    for(const btn of buttons){
                        if(orig && btn === orig) continue;
                        combos.push(await clickAndRead(btn));
                    }
                    if(orig){ orig.click(); await raf2(); }

                    const mm = computeMinMaxFromCombos(combos);
                    if(mm){
                        state.globalMin = mm.min;
                        state.globalMax = mm.max;
                        renderMainPriceRange(mm.min, mm.max);
                    }
                } finally {
                    setStealth(false);
                    INTERNAL_SWITCHING = false;
                    state.harvesting = false;
                    if(state.rerun){ state.rerun = false; harvestAllActives(); }
                }
            }

            function updateBadgesAndMaybeRange(){
                if(INTERNAL_SWITCHING) return;
                const container = qs(SEL.depListContainer);
                if(!container) return;
                const items = collectDependentList(container);
                annotateBadges(container, items);

                if(!(isFinite(state.globalMin) && isFinite(state.globalMax))){
                    const nums = items.map(x=>x.price).filter(isFinite);
                    if(nums.length){
                        const min = Math.min(...nums), max = Math.max(...nums);
                        renderMainPriceRange(min, max);
                    }
                } else {
                    renderMainPriceRange(state.globalMin, state.globalMax);
                }

                if(state.moqTiers?.length) renderMoqTiers(state.moqTiers);
            }

            function extractBalancedArray(src, startIdx){
                let i = startIdx, depth = 0, inStr = false, q = '', esc = false, from = -1;
                for(; i < src.length; i++){
                    const ch = src[i];
                    if(inStr){
                        if(esc){ esc=false; continue; }
                        if(ch==='\\'){ esc=true; continue; }
                        if(ch===q){ inStr=false; continue; }
                        continue;
                    }
                    if(ch==='"' || ch==="'"){ inStr=true; q=ch; continue; }
                    if(ch==='['){ if(depth===0) from=i; depth++; continue; }
                    if(ch===']'){ depth--; if(depth===0) return src.slice(from, i+1); continue; }
                }
                return null;
            }
            function tryJson(text){ try{ return JSON.parse(text); } catch{ return null; } }
            function pickNearestUnit(scriptText, anchorIdx){
                const re = /"(unit|saleUnit|priceUnit)"\s*:\s*"([^"]+)"/g;
                const hits = []; let m;
                while((m = re.exec(scriptText))){ hits.push({ key:m[1], val:m[2], idx:m.index }); }
                if(!hits.length) return null;
                const weight = { unit:0, saleUnit:1, priceUnit:2 };
                hits.sort((a,b)=>{
                    const da = Math.abs(a.idx - anchorIdx), db = Math.abs(b.idx - anchorIdx);
                    if(da !== db) return da - db;
                    return (weight[a.key]||9) - (weight[b.key]||9);
                });
                return hits[0].val || null;
            }
            function collectOriginalWithoutPromotion(){
                const scripts = qsa('script');
                let best = null;
                for(const s of scripts){
                    const t = s.textContent || '';
                    const k = t.indexOf('"originalPricesWithoutPromotion"');
                    if(k === -1) continue;
                    const arrStart = t.indexOf('[', k);
                    if(arrStart === -1) continue;
                    const arrText = extractBalancedArray(t, arrStart);
                    if(!arrText) continue;
                    const arr = tryJson(arrText);
                    if(!Array.isArray(arr) || !arr.length) continue;
                    const unit = pickNearestUnit(t, k) || '件';
                    if(!best || arr.length > best.arr.length){
                        best = { arr, unit, anchor:k };
                    }
                }
                return best;
            }
            function collectPriceRangesFallback(){
                const scripts = qsa('script');
                const keys = ['"offerPriceRanges"', '"disPriceRanges"'];
                let best = null;
                for(const s of scripts){
                    const t = s.textContent || '';
                    let foundIdx = -1;
                    for(const key of keys){
                        const k = t.indexOf(key);
                        if(k !== -1){ foundIdx = k; break; }
                    }
                    if(foundIdx === -1) continue;
                    const arrStart = t.indexOf('[', foundIdx);
                    if(arrStart === -1) continue;
                    const arrText = extractBalancedArray(t, arrStart);
                    if(!arrText) continue;
                    const arr = tryJson(arrText);
                    if(!Array.isArray(arr) || !arr.length) continue;
                    const unit = pickNearestUnit(t, foundIdx) || '件';
                    if(!best || arr.length > best.arr.length){
                        best = { arr, unit, keyHit:'ranges' };
                    }
                }
                return best;
            }
            function formatTiersFromOriginal(arr, unit){
                const rows = (arr||[])
                .map(x => ({ b: Number(x?.beginAmount), price: String(x?.price ?? '').trim() }))
                .filter(x => Number.isFinite(x.b))
                .sort((a,b)=>a.b - b.b);
                if(!rows.length) return [];
                const sameAll = rows.every(r => r.b === rows[0].b);
                if(sameAll) return [`≥${rows[0].b}${unit}`];

                const out = []; const uniq = new Set();
                for(let i=0;i<rows.length;i++){
                    const cur = rows[i]; const next = rows[i+1];
                    const end = next ? (Number(next.b) - 1) : 0;
                    const lot = end > 0 ? `${cur.b}-${end}${unit}` : `≥${cur.b}${unit}`;
                    const priceText = cur.price ? (cur.price.startsWith('¥')?cur.price:`¥${cur.price}`) : '';
                    const seg = `${lot} ${priceText}`.trim();
                    if(!uniq.has(seg)){ uniq.add(seg); out.push(seg); }
                }
                return out;
            }
            function formatTiersFromRanges(arr, unit){
                const rows = (arr||[])
                .map(x => ({ b:Number(x?.beginAmount), e:Number(x?.endAmount||0), price: String((x?.discountPrice ?? x?.price) ?? '').trim() }))
                .filter(x => Number.isFinite(x.b))
                .sort((a,b)=>a.b - b.b);
                if(!rows.length) return [];
                const sameAll = rows.every(r => r.b === rows[0].b && (r.e||0)===(rows[0].e||0));
                if(sameAll){
                    const r = rows[0]; return [ r.e>0 ? `${r.b}-${r.e}${unit}` : `≥${r.b}${unit}` ];
                }
                const out = []; const seen = new Set();
                for(const r of rows){
                    const lot = r.e > 0 ? `${r.b}-${r.e}${unit}` : `≥${r.b}${unit}`;
                    const priceText = r.price ? (r.price.startsWith('¥')?r.price:`¥${r.price}`) : '';
                    const seg = `${lot} ${priceText}`.trim();
                    if(!seen.has(seg)){ seen.add(seg); out.push(seg); }
                }
                return out;
            }
            function updateMoqFromPage(){
                const ori = collectOriginalWithoutPromotion();
                if(ori && ori.arr?.length){
                    const arr = formatTiersFromOriginal(ori.arr, ori.unit || '件');
                    if(arr.length){ state.moqTiers = arr; renderMoqTiers(arr); return; }
                }
                const fb = collectPriceRangesFallback();
                if(fb && fb.arr?.length){
                    const arr = formatTiersFromRanges(fb.arr, fb.unit || '件');
                    if(arr.length){ state.moqTiers = arr; renderMoqTiers(arr); }
                }
            }

            function schedule(fn){ if(scheduled) return; scheduled=true; requestAnimationFrame(()=>{ scheduled=false; fn(); }); }

            function install(){
                if(qs(SEL.depListContainer) && !depMo){
                    depMo = new MutationObserver(()=>schedule(updateBadgesAndMaybeRange));
                    depMo.observe(qs(SEL.depListContainer), { childList:true, subtree:true, characterData:true });
                    updateBadgesAndMaybeRange();
                }
                if(qs(SEL.mainPrice) && !mpMo){
                    mpMo = new MutationObserver(()=>schedule(()=>{
                        if(qs(SEL.mainPriceLead)) neutralizeUnloginLead();
                        if(isFinite(state.globalMin) && isFinite(state.globalMax)) renderMainPriceRange(state.globalMin, state.globalMax);
                        else updateBadgesAndMaybeRange();
                        if(state.moqTiers?.length) renderMoqTiers(state.moqTiers);
                    }));
                    mpMo.observe(qs(SEL.mainPrice), { childList:true, subtree:true, characterData:true });
                    if(qs(SEL.mainPriceLead)) neutralizeUnloginLead();
                }
                if(!bodyMo){
                    bodyMo = new MutationObserver(()=>{
                        if(qs(SEL.depListContainer) && !depMo) {
                            depMo = new MutationObserver(()=>schedule(updateBadgesAndMaybeRange));
                            depMo.observe(qs(SEL.depListContainer), { childList:true, subtree:true, characterData:true });
                            updateBadgesAndMaybeRange();
                        }
                        if(qs(SEL.mainPrice) && !mpMo){
                            mpMo = new MutationObserver(()=>schedule(()=>{
                                if(qs(SEL.mainPriceLead)) neutralizeUnloginLead();
                                if(isFinite(state.globalMin) && isFinite(state.globalMax)) renderMainPriceRange(state.globalMin, state.globalMax);
                                else updateBadgesAndMaybeRange();
                                if(state.moqTiers?.length) renderMoqTiers(state.moqTiers);
                            }));
                            mpMo.observe(qs(SEL.mainPrice), { childList:true, subtree:true, characterData:true });
                            if(qs(SEL.mainPriceLead)) neutralizeUnloginLead();
                        }
                        const btns = findControlButtons();
                        const sigNow = buttonsSignature(btns);
                        if(sigNow && sigNow !== state.lastSig) schedule(()=>harvestAllActives());
                        if(!state.moqTiers?.length) updateMoqFromPage();
                    });
                    bodyMo.observe(document.body, { childList:true, subtree:true });
                }
                ensureUnclippedFor(qs(SEL.mainPrice) || getRangeHost());
                harvestAllActives();
                updateMoqFromPage();
            }

            function uninstall(){
                depMo?.disconnect(); depMo=null;
                mpMo?.disconnect(); mpMo=null;
                bodyMo?.disconnect(); bodyMo=null;
                restoreUnclipped();
                document.documentElement.classList.remove('hp-stealth-all');
                qsa(SEL.depListContainer).forEach(c=>c.classList.remove('hp-stealth'));
                state.harvesting=false; state.rerun=false; INTERNAL_SWITCHING=false;
            }

            return { install, uninstall };
        })();

        function applyMode() {
            ensureStyle();
            const root = document.documentElement;
            if (isGuest()) {
                root.setAttribute('data-tm-guest', '1');
                guestFeature.install();
            } else {
                guestFeature.uninstall();
                root.removeAttribute('data-tm-guest');
            }
        }

        const scheduleApply = (() => {
            let raf = 0;
            return () => {
                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(applyMode);
            };
        })();

        function boot() {
            applyMode();
            const mo = new MutationObserver(scheduleApply);
            mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
            window.addEventListener('hashchange', scheduleApply, { passive: true });
            window.addEventListener('popstate', scheduleApply, { passive: true });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', boot);
        } else {
            boot();
        }
    }

    runPageScripts();

})();

// @integrity-check:toolkit_end
// @integrity-hash: b38df38f88d3997f0341aa7c35c3f56de1316ce2ec539e0fb7ea28844f1d5f6f
