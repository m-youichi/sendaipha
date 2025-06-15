/**
 * 川内薬剤師会 お知らせ自動更新システム
 * Google Apps Script用コード
 */

// 設定値
const CONFIG = {
  // Google DriveのフォルダID（お知らせファイルを格納するフォルダ）
  NEWS_FOLDER_ID: 'YOUR_GOOGLE_DRIVE_FOLDER_ID',
  
  // 対象ファイル形式
  SUPPORTED_FORMATS: ['.pdf', '.doc', '.docx', '.txt'],
  
  // 最大表示件数
  MAX_NEWS_COUNT: 10
};

/**
 * Webアプリのメイン関数
 * GET/POSTリクエストを処理
 */
function doGet(e) {
  try {
    const newsData = getNewsFromDrive();
    
    return ContentService
      .createTextOutput(JSON.stringify(newsData))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  } catch (error) {
    console.error('エラー:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({error: 'データの取得に失敗しました'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Google Driveからお知らせファイル一覧を取得
 */
function getNewsFromDrive() {
  const folder = DriveApp.getFolderById(CONFIG.NEWS_FOLDER_ID);
  const files = folder.getFiles();
  
  const newsData = [];
  
  while (files.hasNext() && newsData.length < CONFIG.MAX_NEWS_COUNT) {
    const file = files.next();
    const fileName = file.getName();
    
    // サポートされているファイル形式かチェック
    if (isSupportedFile(fileName)) {
      const newsItem = {
        fileId: file.getId(),
        title: formatTitle(fileName),
        url: getFileUrl(file),
        date: formatDate(file.getDateCreated()),
        lastModified: file.getLastUpdated().getTime(),
        size: file.getSize(),
        mimeType: file.getBlob().getContentType()
      };
      
      newsData.push(newsItem);
    }
  }
  
  // 作成日時の降順でソート（新しいものが上）
  newsData.sort((a, b) => b.lastModified - a.lastModified);
  
  return newsData;
}

/**
 * サポートされているファイル形式かチェック
 */
function isSupportedFile(fileName) {
  return CONFIG.SUPPORTED_FORMATS.some(format => 
    fileName.toLowerCase().endsWith(format)
  );
}

/**
 * ファイル名からタイトルを整形
 */
function formatTitle(fileName) {
  // 拡張子を除去
  let title = fileName.replace(/\.[^/.]+$/, '');
  
  // 日付パターンを除去（例: 2024-01-15_、20240115_）
  title = title.replace(/^\d{4}[-_]\d{1,2}[-_]\d{1,2}[_-]?/, '');
  title = title.replace(/^\d{8}[_-]?/, '');
  
  // アンダースコアをスペースに変換
  title = title.replace(/_/g, ' ');
  
  return title;
}

/**
 * ファイルの公開URLを取得
 */
function getFileUrl(file) {
  // ファイルを一般公開に設定
  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return `https://drive.google.com/file/d/${file.getId()}/view`;
  } catch (error) {
    console.error('ファイル共有設定エラー:', error);
    return '#';
  }
}

/**
 * 日付を YYYY.MM.DD 形式でフォーマット
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}.${month}.${day}`;
}

/**
 * 手動でお知らせデータを確認する関数（テスト用）
 */
function testGetNews() {
  const newsData = getNewsFromDrive();
  console.log('取得したお知らせ:', newsData);
  return newsData;
}

/**
 * サンプルデータを返す関数（開発・テスト用）
 */
function getSampleNewsData() {
  return [
    {
      fileId: 'sample1',
      title: '令和6年度 薬剤師研修会のご案内',
      url: 'https://drive.google.com/file/d/sample1/view',
      date: '2024.01.15',
      lastModified: Date.now() - 86400000,
      size: 1024000,
      mimeType: 'application/pdf'
    },
    {
      fileId: 'sample2',
      title: '年末年始の休日当番薬局について',
      url: 'https://drive.google.com/file/d/sample2/view',
      date: '2024.01.10',
      lastModified: Date.now() - 172800000,
      size: 512000,
      mimeType: 'application/pdf'
    },
    {
      fileId: 'sample3',
      title: 'インフルエンザ予防接種実施薬局一覧',
      url: 'https://drive.google.com/file/d/sample3/view',
      date: '2024.01.08',
      lastModified: Date.now() - 259200000,
      size: 768000,
      mimeType: 'application/pdf'
    },
    {
      fileId: 'sample4',
      title: '薬局における在宅医療推進事業について',
      url: 'https://drive.google.com/file/d/sample4/view',
      date: '2024.01.05',
      lastModified: Date.now() - 345600000,
      size: 2048000,
      mimeType: 'application/pdf'
    },
    {
      fileId: 'sample5',
      title: '新型コロナウイルス感染症対策ガイドライン更新',
      url: 'https://drive.google.com/file/d/sample5/view',
      date: '2024.01.03',
      lastModified: Date.now() - 432000000,
      size: 1536000,
      mimeType: 'application/pdf'
    }
  ];
} 