#!/bin/bash

# Script to update config.js with new lowercase-dash filenames

set -e

echo "Updating config.js with new filenames..."

# Create a backup
cp src/config.js src/config.js.backup

# Function to convert filename to lowercase with dashes
convert_filename() {
    local filename="$1"
    echo "$filename" | tr '[:upper:]' '[:lower:]' | \
        sed 's/ /-/g' | \
        sed 's/_/-/g' | \
        sed "s/'//g" | \
        sed 's/!//g' | \
        sed 's/(//g' | \
        sed 's/)//g' | \
        sed 's/,//g' | \
        sed 's/\.\./-/g' | \
        sed 's/--/-/g' | \
        sed 's/---/-/g'
}

# Read the config file and update all audio paths
sed -i.tmp '
    # Update pregame paths
    s|/audio/pregame/Intro 01 Gabriel Zaro\.mp3|/audio/pregame/intro-01-gabriel-zaro.mp3|g
    s|/audio/pregame/Intro 02 Henry Ullrich\.mp3|/audio/pregame/intro-02-henry-ullrich.mp3|g
    s|/audio/pregame/Intro 03 Sameer Doshi\.mp3|/audio/pregame/intro-03-sameer-doshi.mp3|g
    s|/audio/pregame/Intro 04 Oliver Tang\.mp3|/audio/pregame/intro-04-oliver-tang.mp3|g
    s|/audio/pregame/Intro 05 Ilyaas Khanshab\.mp3|/audio/pregame/intro-05-ilyaas-khanshab.mp3|g
    s|/audio/pregame/Intro 06 Xavier Xia\.mp3|/audio/pregame/intro-06-xavier-xia.mp3|g
    s|/audio/pregame/Intro 07 Hunter Smith\.mp3|/audio/pregame/intro-07-hunter-smith.mp3|g
    s|/audio/pregame/Intro 08 Jasper Chew\.mp3|/audio/pregame/intro-08-jasper-chew.mp3|g
    s|/audio/pregame/Intro 09 Ryan Shin\.mp3|/audio/pregame/intro-09-ryan-shin.mp3|g
    s|/audio/pregame/Intro 10 Stan Schmidt\.mp3|/audio/pregame/intro-10-stan-schmidt.mp3|g
    s|/audio/pregame/Intro 11 Devon Bedi\.mp3|/audio/pregame/intro-11-devon-bedi.mp3|g
    s|/audio/pregame/Intro 12 Nicholas Teseo\.mp3|/audio/pregame/intro-12-nicholas-teseo.mp3|g
    s|/audio/pregame/Intro 13 Liam OConnor\.mp3|/audio/pregame/intro-13-liam-oconnor.mp3|g
    s|/audio/pregame/Intro end\.mp3|/audio/pregame/intro-end.mp3|g
    s|/audio/pregame/Intro Lake Monsters lineup\.mp3|/audio/pregame/intro-lake-monsters-lineup.mp3|g
    s|/audio/pregame/Intro Lake Monsters\.mp3|/audio/pregame/intro-lake-monsters.mp3|g
    s|/audio/pregame/National Anthem\.mp3|/audio/pregame/national-anthem.mp3|g
    
    # Update walkup paths
    s|/audio/walkups/Walk up 01 Gabriel Zaro\.mp3|/audio/walkups/walk-up-01-gabriel-zaro.mp3|g
    s|/audio/walkups/Walk up 02 Henry Ullrich\.mp3|/audio/walkups/walk-up-02-henry-ullrich.mp3|g
    s|/audio/walkups/Walk up 03 Sameer Doshi\.mp3|/audio/walkups/walk-up-03-sameer-doshi.mp3|g
    s|/audio/walkups/Walk up 04 Oliver Tang\.mp3|/audio/walkups/walk-up-04-oliver-tang.mp3|g
    s|/audio/walkups/Walk up 05 Ilyaas Khanshab\.mp3|/audio/walkups/walk-up-05-ilyaas-khanshab.mp3|g
    s|/audio/walkups/Walk up 06 Xavier Xia\.mp3|/audio/walkups/walk-up-06-xavier-xia.mp3|g
    s|/audio/walkups/Walk up 07 Hunter Smith\.mp3|/audio/walkups/walk-up-07-hunter-smith.mp3|g
    s|/audio/walkups/Walk up 08 Jasper Chew\.mp3|/audio/walkups/walk-up-08-jasper-chew.mp3|g
    s|/audio/walkups/Walk up 09 Ryan Shin\.mp3|/audio/walkups/walk-up-09-ryan-shin.mp3|g
    s|/audio/walkups/Walk up 10 Stan Schmidt\.mp3|/audio/walkups/walk-up-10-stan-schmidt.mp3|g
    s|/audio/walkups/Walk up 11 Devin Bedi\.mp3|/audio/walkups/walk-up-11-devin-bedi.mp3|g
    s|/audio/walkups/Walk up 12 Nicholas Teseo\.mp3|/audio/walkups/walk-up-12-nicholas-teseo.mp3|g
    s|/audio/walkups/Walk up 13 Liam OConnor\.mp3|/audio/walkups/walk-up-13-liam-oconnor.mp3|g
' src/config.js

# Clean up temp file
rm -f src/config.js.tmp

echo "Config file updated successfully!"
echo "Backup saved as src/config.js.backup"

# Made with Bob
