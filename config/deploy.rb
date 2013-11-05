require "bundler/capistrano"
require "rvm/capistrano"

set :application, "pitch"
set :repository,  "git@github.com:tagSurf/pitch.git"
set :deploy_to, "/var/www/pitch"

set :user, "ubuntu" #deployment server's user

set :scm, :git
set :ssh_options, { :forward_agent => true }
set :branch, "master"

role :web, "pitch-web" # Your HTTP server, Apache/etc
role :app, "pitch-web" # This may be the same as your `Web` server

role :db,  "pitch-web", :primary => true # This is where Rails migrations will run


#RVM for capistrano settings, probably best to break these out into a separate file,
#since this is only related to the cap:setup task
set :rvm_ruby_string, :local              # use the same ruby as used locally for deployment
set :rvm_autolibs_flag, "read-only"       # more info: rvm help autolibs

#looks like this remove the path argument to bundle install
set :bundle_dir, ''
set :bundle_flags, '--system --quiet'


# if you want to clean up old releases on each deploy uncomment this:
after "deploy:restart", "deploy:cleanup"

namespace :db do
  task :db_config, :except => { :no_release => true }, :role => :app do
    run "cp -f ~/database.yml #{release_path}/config/database.yml"
  end
end

after "deploy:finalize_update", "db:db_config"

namespace :deploy do
  task :start do ; end
  task :stop do ; end

  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
  end
  task :seed do
    run "cd #{current_path}; bundle exec rake db:seed RAILS_ENV=#{rails_env}"
  end
end