use Rack::Static,
  :urls => ['/javascripts', '/stylesheets', '/images'],
  :root => 'public'

run lambda { |env|
  [
    200, 
    {
      'Content-Type'  => 'text/html', 
      'Cache-Control' => 'public, max-age=86400' 
    },
    File.open('public/unicodey.html', File::RDONLY)
  ]
}