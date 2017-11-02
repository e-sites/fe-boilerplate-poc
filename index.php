<?php
  $manifestJS = json_decode(file_get_contents('build/js/manifest.json'), true);
  $manifestCSS = json_decode(file_get_contents('build/css/manifest.json'), true);
?>

<!DOCTYPE html>
<html lang="nl">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="robots" content="index, follow">
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="theme-color" content="#ffffff">
  <title>Default site</title>
  <script>window.onerror = new Function("m", "f", "l", "(new Image()).src=\"http://cdn.e-sites.nl/js-error/e.gif?m=\"+encodeURIComponent(m)+\"&f=\"+encodeURIComponent(f)+\"&l=\"+encodeURIComponent(l)+\"&p=\"+encodeURIComponent(document.location.href)+\"&t=1&s=\"+((new Date()).getTime()-" + (new Date()).getTime() + ");window.onerror=null;");</script>
  <script>document.documentElement.className += ' js'; var app = {}, fs = {};</script>
  <link rel="dns-prefetch" href="//ajax.googleapis.com">
  <link rel="dns-prefetch" href="//google-analytics.com">
  <link rel="stylesheet" href="/build/css/<?php echo $manifestCSS['styles.css']; ?>">
  <!--[if lt IE 9]>
    <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <script>window.html5||document.write('<script src="/assets/js/polyfills/html5.min.js"><\/script>')</script>
  <![endif]-->
  <script>
    (function (i, s, o, g, r, a, m) { i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () { (i[r].q = i[r].q || []).push(arguments) }, i[r].l = 1 * new Date(); a = s.createElement(o), m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m) })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    ga('create', 'UA-XXXXX-X'); ga('send', 'pageview');
  </script>
</head>

<body>
  <h1>content</h1>
  <a href="http://google.nl" target="_blank">External link</a>

  <script src="build/js<?php echo $manifestJS['manifest.js']; ?>"></script>
  <script src="build/js<?php echo $manifestJS['vendor.js']; ?>"></script>
  <script src="build/js<?php echo $manifestJS['app.js']; ?>"></script>
</body>

</html>
