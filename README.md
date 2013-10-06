
# Setting up Your Dev Machine

## Download Homebrew

In the terminal run the following command:

```bash
ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"
```

## Setup GitHub SSH Keys

Follow the instructions here, to create an public and private key for accessing GitHub: https://help.github.com/articles/generating-ssh-keys

Make sure that you add the key to SSH after you have created it: `ssh-add ~/.ssh/id_rsa`

## Xcode Command Line Tools

To build ruby from source, you'll want to get the command line tools. Install Xcode for compiling from https://developer.apple.com/downloads/ , after installation is done, run `$ xcodebuild -license`

Open Xcode -> Preferences -> Install Command Line Tools

## Install RVM

Ruby Version Manager allows you to manage multiple version of Ruby.

```bash
\curl -L https://get.rvm.io | bash -s stable --rails --autolibs=enabled # Or, --ruby=1.9.3
```

Make RVM available to shell by pasting following line in your ~/.bash_profile file.

```bash
[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" #
```

This loads RVM into a shell session.

Restart your terminal, type `rvm`

See available ruby versions `rvm list known`

```bash
#Install ruby 1.9.3
rvm install 1.9.3
rvm use 1.9.3
rvm --default use 1.9.3
```

# Run the site locally

You'll also want to install and run MySQL locally:

```sql
cd /usr/local
brew versions mysql
git checkout ed829a3 Library/Formula/mysql.rb
brew install mysql
```

Make sure you all of the commands that brew tells you to get the MySql service running on your machine after your install has completed.

To run the site, you need to first clone **this repo**: `git clone git@github.com:tagpitch/pitch.git`. This will create directory called *pitch* in the current directory you are in the terminal. You can check your current directory by running `pwd` can change directories with `cd`.

Once you clone the repo, go into that directory with `cd pitch`.

Then in that directory run `bundle install`; this installs all of the gems you need.

Create the database and run migrations locally:

```bash
# run this once to create the databases
rake db:create

# seed the database after its been created
rake db:seed

# run this every time you pull or make changes to database schema
rake db:migrate
```

# Deleting Cards

Connect to the production database:

```sql
-- the name of the database
use deck;

-- do this first
DELETE FROM votes WHERE card_id in ( some list of card ids );

-- do this next
DELETE FROM card WHERE id in ( some list of card ids );
```

# Server Access

Setup access to the AWS server by adding the following config to you *~/.ssh/config* file.

```bash
Host pitch-web
    HostName tagpitch.com
    User ubuntu
    IdentityFile "/Users/jared/keys/PitchWest"
```

# Deploying Everything Through Capistrano

You need to have your ~/.ssh/config settings and as well as your local Rails environment ready to go for this.

In the project directory, deploy code changes. This will deploy the site based on what's in master on GitHub, so if you made local changes you need to `git push` them first.

```bash
cap deploy
```

If you want to deploy database changes:

```bash
cap deploy:migrate
```
