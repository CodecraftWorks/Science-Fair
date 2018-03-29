<html>
    <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <link rel="stylesheet" href="ScienceProject.css">
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
        <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/hmac-sha1.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/hmac-sha256.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/core-min.js"></script>
    </head>
    <body>
        <div class="input-group mb-3">
            <input id="tbox" type="text" class="form-control" placeholder="Type your sentence here." aria-describedby="basic-addon2">
            <div class="input-group-append">
                <button id="enter" class="btn btn-outline-secondary" type="button">Submit</button>
            </div>
        </div>
        <div id="errors"></div>
        <div id="options" class="alert alert-success"></div>
        <div id="debug" class="alert alert-danger"></div>
        <div id="images" class="border"></div>
        <script src="adjectives.js"></script>
        <script src="verbs.js"></script>
        <script src="models.js"></script>
        <script type="text/javascript">
            var MASHAPE_API_KEY = "<?php echo getenv("MASHAPE_API_KEY"); ?>";
            var MASHAPE_API_HOST = "<?php echo getenv("MASHAPE_API_HOST"); ?>";
        </script>
        <script src="ScienceProject.js" crossorigin="anonymous"></script>
    </body>
</html>
