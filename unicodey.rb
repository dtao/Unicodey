require 'haml'
require 'sinatra'

helpers do
  def stylesheet(name)
    %Q{<link rel="stylesheet" href="#{name.to_s}.css" />}
  end

  def script(name)
    if name.is_a?(Symbol)
      %Q{<script type="text/javascript" src="#{name.to_s}.js"></script>}
    elsif name.is_a?(String)
      %Q{<script type="text/javascript" src="#{name}"></script>}
    end
  end
end

get '/' do
  haml :unicodey
end