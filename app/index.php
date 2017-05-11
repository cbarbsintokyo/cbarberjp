<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Craig Barber | Web Developer based in Tokyo, Japan.</title>
    <meta name="description" content="Web Developer based in Tokyo, Japan.">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="shortcut icon" type="image/x-icon" href="images/favicon.ico"/>

    <!--build:css css/main.min.css -->
    <link rel="stylesheet" href="css/main.css">
    <!-- endbuild -->
  </head>

  <body>
    <div class="sprite">
      <?php echo file_get_contents("svg/sprite.svg"); ?>
    </div>
    <header class="header">
      <div class="content-container">
        <div class="logo">
          <svg class="logo__image">
            <use xlink:href="#logo"></use>
          </svg>
        </div>
      </div>
    </header>

    <main class="main">
      <section class="content-section content-section--intro">
        <div class="content-container">
          <img class="profile-pic" src="images/profile.png" alt="Craig Barber profile picture">
          <h1 class="main-heading">
            <span class="main-heading__text main-heading__text--name dual-heading">Craig Barber</span>
            <span class="main-heading__text main-heading__text--position lazer-heading">Web Developer</span>
          </h1>
          <p>Based in Tokyo, Japan. I love creating things with/for the web.
            Whether you have an interesting project you want to work together on, or just talk things web, get in touch!</p>
          <p><a class="text-link" href="mailto:hello@cbarber.jp" onclick="trackOutboundLink('hello@cbarber.jp')" title="Send me an email">Say hello &rarr;</a></p>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="fuji-san">
        <div class="fuji-san__image"></div>
      </div>
      <div class="content-container footer__inner-container">
        <svg class="footer__image">
          <use xlink:href="#endpoint"></use>
        </svg>
        <p class="footer__text">&copy; Craig Barber | Tokyo, Japan.</p>
      </div>
    </footer>

    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-17991254-7', 'auto');
      ga('send', 'pageview');

      var trackOutboundLink = function(url) {
        ga('send', 'event', 'outbound', 'click', url, {
          'transport': 'beacon',
          'hitCallback': function(){document.location = url;}
        });
      }
    </script>

    <!--build:js js/main.min.js -->
    <script src="js/craig.js"></script>
    <!-- endbuild -->

  </body>
</html>
