import isIE from '../isUserAgentInternetExplorer';

describe('Test is User Agent Internet Explorer utility function', () => {
  it('should return false for Samsung Galaxy S9', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for Samsung Galaxy S8', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/60.0.3112.107 Mobile Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for Samsung Galaxy S7', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; Android 7.0; SM-G930VC Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for Samsung Galaxy S7 Edge', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; Android 6.0.1; SM-G935S Build/MMB29K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/55.0.2883.91 Mobile Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for Samsung Galaxy S6', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; Android 6.0.1; SM-G920V Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for Samsung Galaxy S6 Edge Plus', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for Nexus 6P', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 6P Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for Sony Xperia XZ', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; Android 7.1.1; G8231 Build/41.2.A.0.219; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/59.0.3071.125 Mobile Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for Sony Xperia Z5', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; Android 6.0.1; E6653 Build/32.2.A.0.253) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for HTC One X10', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; Android 6.0; HTC One X10 Build/MRA58K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/61.0.3163.98 Mobile Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for HTC One M9', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; Android 6.0; HTC One M9 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.3',
    );
    expect(result).toBe(false);
  });
  it('should return false for Apple iPhone XR (Safari)', () => {
    const result = isIE(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
    );
    expect(result).toBe(false);
  });
  it('should return false for Apple iPhone XS (Chrome)', () => {
    const result = isIE(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/69.0.3497.105 Mobile/15E148 Safari/605.1',
    );
    expect(result).toBe(false);
  });
  it('should return false for Apple iPhone XS Max (Firefox)', () => {
    const result = isIE(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/13.2b11866 Mobile/16A366 Safari/605.1.15',
    );
    expect(result).toBe(false);
  });
  it('should return false for Apple iPhone X', () => {
    const result = isIE(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
    );
    expect(result).toBe(false);
  });
  it('should return false for Apple iPhone 8', () => {
    const result = isIE(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
    );
    expect(result).toBe(false);
  });
  it('should return false for Apple iPhone 8 Plus', () => {
    const result = isIE(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A5370a Safari/604.1',
    );
    expect(result).toBe(false);
  });
  it('should return false for Apple iPhone 7', () => {
    const result = isIE(
      'Mozilla/5.0 (iPhone9,3; U; CPU iPhone OS 10_0_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A403 Safari/602.1',
    );
    expect(result).toBe(false);
  });
  it('should return false for Apple iPhone 7 Plus', () => {
    const result = isIE(
      'Mozilla/5.0 (iPhone9,4; U; CPU iPhone OS 10_0_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A403 Safari/602.1',
    );
    expect(result).toBe(false);
  });
  it('should return false for Apple iPhone 6', () => {
    const result = isIE(
      'Mozilla/5.0 (Apple-iPhone7C2/1202.466; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543 Safari/419.3',
    );
    expect(result).toBe(false);
  });
  it('should return false for Microsoft Lumia 650', () => {
    const result = isIE(
      'Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Microsoft; RM-1152) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Mobile Safari/537.36 Edge/15.15254',
    );
    expect(result).toBe(false);
  });
  it('should return false for Microsoft Lumia 550', () => {
    const result = isIE(
      'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; RM-1127_16056) AppleWebKit/537.36(KHTML, like Gecko) Chrome/42.0.2311.135 Mobile Safari/537.36 Edge/12.10536',
    );
    expect(result).toBe(false);
  });
  it('should return false for Microsoft Lumia 950', () => {
    const result = isIE(
      'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/13.1058',
    );
    expect(result).toBe(false);
  });
  it('should return false for Google Pixel C', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; Android 7.0; Pixel C Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for Sony Xperia Z4 Tablet', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; Android 6.0.1; SGP771 Build/32.2.A.0.253; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for Nvidia Shield Tablet K1', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; Android 6.0.1; SHIELD Tablet K1 Build/MRA58K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/55.0.2883.91 Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for Samsung Galaxy Tab S3', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; Android 7.0; SM-T827R4 Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.116 Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for Samsung Galaxy Tab A', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; Android 5.0.2; SAMSUNG SM-T550 Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.3 Chrome/38.0.2125.102 Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for Amazon Kindle Fire HDX 7', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; Android 4.4.3; KFTHWI Build/KTU84M) AppleWebKit/537.36 (KHTML, like Gecko) Silk/47.1.79 like Chrome/47.0.2526.80 Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for LG G Pad 7.0', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; Android 5.0.2; LG-V410/V41020c Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/34.0.1847.118 Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for Windows 10-based PC using Edge browser', () => {
    const result = isIE(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
    );
    expect(result).toBe(false);
  });
  it('should return false for Chrome OS-based laptop using Chrome browser (Chromebook)', () => {
    const result = isIE(
      'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for Mac OS X-based computer using a Safari browser', () => {
    const result = isIE(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9',
    );
    expect(result).toBe(false);
  });
  it('should return false for Windows 7-based PC using a Chrome browser', () => {
    const result = isIE(
      'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for Linux-based PC using a Firefox browser', () => {
    const result = isIE(
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1',
    );
    expect(result).toBe(false);
  });
  it('should return false for Chromecast', () => {
    const result = isIE(
      'Mozilla/5.0 (CrKey armv7l 1.5.16041) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.0 Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for Roku Ultra', () => {
    const result = isIE('Roku4640X/DVP-7.70 (297.70E04154A)');
    expect(result).toBe(false);
  });
  it('should return false for Minix NEO X5', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; U; Android 4.2.2; he-il; NEO-X5-116A Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30',
    );
    expect(result).toBe(false);
  });
  it('should return false for Amazon 4K Fire TV', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; Android 5.1; AFTS Build/LMY47O) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/41.99900.2250.0242 Safari/537.36',
    );
    expect(result).toBe(false);
  });
  it('should return false for Google Nexus Player', () => {
    const result = isIE(
      'Dalvik/2.1.0 (Linux; U; Android 6.0.1; Nexus Player Build/MMB29T)',
    );
    expect(result).toBe(false);
  });
  it('should return false for Apple TV 5th Gen 4K', () => {
    const result = isIE('AppleTV6,2/11.1');
    expect(result).toBe(false);
  });
  it('should return false for Apple TV 4th Gen', () => {
    const result = isIE('AppleTV5,3/9.1.1');
    expect(result).toBe(false);
  });
  it('should return false for Nintendo Wii U', () => {
    const result = isIE(
      'Mozilla/5.0 (Nintendo WiiU) AppleWebKit/536.30 (KHTML, like Gecko) NX/3.0.4.2.12 NintendoBrowser/4.3.1.11264.US',
    );
    expect(result).toBe(false);
  });
  it('should return false for Xbox One S', () => {
    const result = isIE(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; XBOX_ONE_ED) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393',
    );
    expect(result).toBe(false);
  });
  it('should return false for Xbox One', () => {
    const result = isIE(
      'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/13.10586',
    );
    expect(result).toBe(false);
  });
  it('should return false for Playstation 4', () => {
    const result = isIE(
      'Mozilla/5.0 (PlayStation 4 3.11) AppleWebKit/537.73 (KHTML, like Gecko)',
    );
    expect(result).toBe(false);
  });
  it('should return false for Playstation Vita', () => {
    const result = isIE(
      'Mozilla/5.0 (PlayStation Vita 3.61) AppleWebKit/537.73 (KHTML, like Gecko) Silk/3.2',
    );
    expect(result).toBe(false);
  });
  it('should return false for Nintendo 3DS', () => {
    const result = isIE(
      'Mozilla/5.0 (Nintendo 3DS; U; ; en) Version/1.7412.EU',
    );
    expect(result).toBe(false);
  });
  it('should return false for Google bot', () => {
    const result = isIE(
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    );
    expect(result).toBe(false);
  });
  it('should return false for Bing bot', () => {
    const result = isIE(
      'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
    );
    expect(result).toBe(false);
  });
  it('should return false for Yahoo! bot', () => {
    const result = isIE(
      'Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)',
    );
    expect(result).toBe(false);
  });
  it('should return false for Amazon Kindle 4', () => {
    const result = isIE(
      'Mozilla/5.0 (X11; U; Linux armv7l like Android; en-us) AppleWebKit/531.2+ (KHTML, like Gecko) Version/5.0 Safari/533.2+ Kindle/3.0+',
    );
    expect(result).toBe(false);
  });
  it('should return false for Amazon Kindle 3', () => {
    const result = isIE(
      'Mozilla/5.0 (Linux; U; en-US) AppleWebKit/528.5+ (KHTML, like Gecko, Safari/528.5+) Version/4.0 Kindle/3.0 (screen 600x800; rotate)',
    );
    expect(result).toBe(false);
  });
  it('should return true for IE 6', () => {
    const result = isIE(
      'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)',
    );
    expect(result).toBe(true);
  });
  it('should return true for IE 9', () => {
    const result = isIE(
      'Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1; 125LA; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022)',
    );
    expect(result).toBe(true);
  });
  it('should return true for IE 10', () => {
    const result = isIE(
      'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)',
    );
    expect(result).toBe(true);
  });
  it('should return true for IE 11', () => {
    const result = isIE(
      'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko',
    );
    expect(result).toBe(true);
  });
  it('should return true for IE 11', () => {
    const result = isIE(
      'Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko',
    );
    expect(result).toBe(true);
  });
});
