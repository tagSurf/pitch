
# Setting up Your Dev Machine

## Download Homebrew

In the terminal run the following command:

```bash
ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"
```

## Xcode Command Line Tools

To build ruby from source, you'll want to get the command line tools. Install Xcode for compiling from https://developer.apple.com/downloads/ , after installation is done, run `$ xcodebuild -license`

Open Xcode -> Preferences -> Install Command Line Tools

## Install RVM

Ruby Version Manager allows you to manage multiple version of Ruby.

```bash
$ \curl -L https://get.rvm.io | bash -s stable --rails --autolibs=enabled # Or, --ruby=1.9.3
```

Make RVM available to shell by pasting following line in your ~/.bash_profile file

```bash
~/.bash_profile [[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" #
```

This loads RVM into a shell session.

Restart your terminal, type `$ rvm`

See available ruby versions `$ rvm list known`

```bash
Install ruby 1.9.3
$ rvm install 1.9.3
$ rvm use 1.9.3
$ rvm --default use 1.9.3
```

# Run the site locally

To run the site, you need to first clone this repo. Then in that directory run `bundle install`; this installs all of the gems you need. You'll also want to install and run MySQL locally:

```sql
cd /user/local
brew versions mysql
git checkout ed829a3 Library/Formula/mysql.rb
brew install mysql
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

You need to have your .ssh/config settings setup, as well as your local Rails environment.

```bash
cap deploy
```