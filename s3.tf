resource "aws_s3_bucket" "bucket" {
  bucket = "${var.bucket_name}"
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }

  tags = "${var.tags}"
}

output "website" {
  value = "${aws_s3_bucket.bucket.website_endpoint}"
}

resource "aws_s3_bucket_public_access_block" "s3_allow_open" {
  bucket = "${aws_s3_bucket.bucket.id}"

  block_public_acls   = false
  block_public_policy = false
}

variable "website_items" {
  default = [
    "index.html",
    "js/quadrant.js",
    "backend/3p/fastclick/lib/fastclick.js",
    "backend/3p/skycons/skycons.js",
    "backend/3p/DateJS/build/date.js",
    "backend/3p/bootstrap/dist/css/bootstrap.min.css",
    "backend/3p/bootstrap/dist/js/bootstrap.min.js",
    "backend/3p/bootstrap/dist/fonts/glyphicons-halflings-regular.woff",
    "backend/3p/bootstrap/dist/fonts/glyphicons-halflings-regular.eot",
    "backend/3p/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2",
    "backend/3p/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf",
    "backend/3p/bootstrap/dist/fonts/glyphicons-halflings-regular.svg",
    "backend/3p/moment/min/moment.min.js",
    "backend/3p/gauge.js/dist/gauge.min.js",
    "backend/3p/jquery/dist/jquery.min.js",
    "backend/3p/nprogress/nprogress.css",
    "backend/3p/nprogress/nprogress.js",
    "backend/3p/Flot/jquery.flot.time.js",
    "backend/3p/Flot/jquery.flot.stack.js",
    "backend/3p/Flot/jquery.flot.resize.js",
    "backend/3p/Flot/jquery.flot.pie.js",
    "backend/3p/Flot/jquery.flot.js",
    "backend/3p/flot-spline/js/jquery.flot.spline.min.js",
    "backend/3p/iCheck/icheck.min.js",
    "backend/3p/iCheck/skins/flat/green.png",
    "backend/3p/iCheck/skins/flat/green@2x.png",
    "backend/3p/iCheck/skins/flat/green.css",
    "backend/3p/bootstrap-daterangepicker/daterangepicker.js",
    "backend/3p/bootstrap-daterangepicker/daterangepicker.css",
    "backend/3p/flot.orderbars/js/jquery.flot.orderBars.js",
    "backend/3p/flot.curvedlines/curvedLines.js",
    "backend/3p/bootstrap-progressbar/bootstrap-progressbar.min.js",
    "backend/3p/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css",
    "backend/3p/font-awesome/css/font-awesome.min.css",
    "backend/3p/font-awesome/fonts/fontawesome-webfont.svg",
    "backend/3p/font-awesome/fonts/fontawesome-webfont.woff2",
    "backend/3p/font-awesome/fonts/fontawesome-webfont.ttf",
    "backend/3p/font-awesome/fonts/fontawesome-webfont.woff",
    "backend/3p/font-awesome/fonts/fontawesome-webfont.eot",
    "backend/3p/jqvmap/dist/maps/jquery.vmap.world.js",
    "backend/3p/jqvmap/dist/jqvmap.min.css",
    "backend/3p/jqvmap/dist/jquery.vmap.js",
    "backend/3p/jqvmap/examples/js/jquery.vmap.sampledata.js",
    "backend/index.html",
    "backend/css/custom.css",
    "backend/js/dash.js",
    "backend/js/quadrant.js",
    "backend/js/Chart.js",
    "backend/js/custom.js",
    "backend/js/faces.js",
    "backend/img/aws_logo.jpg",
    "backend/dash.html",
    "backend/faces.html",
  ]
}

variable "mime-types" {
  default = {
    "js"    = "application/json"
    "html"  = "text/html"
    "jpg"   = "image/jpeg"
    "svg"   = "image/svg+xml"
    "png"   = "image/png"
    "css"   = "text/css"
    "woff2" = "font/woff2"
    "ttf"   = "font/tff"
    "eot"   = "font/eof"
    "woff"  = "font/woff"
  }
}

resource "aws_s3_bucket_object" "website_object" {
  count  = "${length(var.website_items)}"
  bucket = "${aws_s3_bucket.bucket.id}"
  key    = "${var.website_items[count.index]}"
  source = "demo/${var.website_items[count.index]}"
  acl    = "public-read"

  content_type = "${var.mime-types[element(
                                        split(".",
                                              "${var.website_items[count.index]}"
                                              ),
                                        length(
                                              split(".",
                                                    var.website_items[count.index]
                                                    )
                                              )-1
                                          )]}"

  etag = "${filemd5("demo/${var.website_items[count.index]}")}"
}
