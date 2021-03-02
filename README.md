# cross-seed-guide

**This guide is intended for usage with the unRAID OS**
## Cross-Seed Installation and Setup

### Cross-Seed Installation
1. You'll need to install cross-seed onto your unRAID system
  1. Navigate to your **APPS** tab
    	* Now you'll need to download this directly from docker hub as this is not apart of the normal templates
  2. Click in the left-hand side **Settings**
  3. Where it says `Enable additional search results from dockerHub:` select **Yes** then click **Apply** then **Done**
  4. Next in the search bar that you would normally use to search an app. Type in `cross-seed` you're going to want the one that says `mmgoodnow - DockerHub Repository`
  5. Now with any container added directly from dockerhub there aren't going to be any prefilled sections like you'd normally see. We'll have to add them
    1. Let's go ahead and add our paths: Select **Add another Path, Port, Variable, Label or Device** 
      1. Your container path should be for the `/input` (where the program is going to get its torrents to compare from)
      2. The host path is where your qBitTorrent holds all of its currently running torrents for me it is
        `/mnt/user/appdata/binhex-qbittorrentvpn/qBittorrent/data/BT_backup/`
      3. For access mode `Read Only`
      
![input configuration!](/img/input.png "Input Settings")
      
   2. Now we need to define our output
      1. Let's go ahead and add another paths: Select **Add another Path, Port, Variable, Label or Device** 
        1. The container path will be `/output` (this is where you want cross-seed to deposit the torrents that it finds)
        2. Host path: This is where I put them you chose something that works for you 
      `/mnt/user/data/downloads/torrent_files/output/`
        3. Access Mode: `Read/Write`

![output configuration!](/img/output.png "Output Settings")

   3. One final thing that needs to be done for this container. We need to set some **Post Arguments**
      1. Click **Basic View** in the upper right hand corner to toggle **Advanced View**
      2. Where it states **Post Arguments:** Type
        1. `search`
        2. This step is optional: `--exclude-recent-search 7200` This will exclude any torrents that it has searched for within the last 5 days (all numbers are in minutes) You can tell it what ever time you want.
        3. Your line will look something like this
        4. `search --exclude-recent-search 7200`
 6. If your /config folder is not configured please set that up as well as the port number needs to be configured if that is not done Port:`2468` is what I used just pick something that isn't in use

Here is my finished product:

![finished configuration!](/img/finished.png "Finished Settings")


For all documenation and source code for Cross-Seed please visit [Here](https://github.com/mmgoodnow/cross-seed)

### Cross-Seed Configuration
1. Now we need to make a config file for Cross-Seed to work with.
2. Here is a the config that I'm using you can download it [here](/files/config.js) and place it in your appdata folder that cross-seed should have created `/mnt/user/appdata/cross-seed/`
  ```javascript
  module.exports = {
	configVersion: 1,

	jackettServerUrl: "http://<Jackett IP Address>:9117",
	jackettApiKey: "<Jackett API>",

	// Pause at least this much in between each Jackett search. Higher is safer.
	// It is not recommended to set this to less than 2 seconds.
	delay: 30,

	// Trackers to search
	// Set to [] if you want to search all trackers.
	// Tracker ids can be found in their Torznab feed paths
	trackers: ["beyond-hd-oneurl", "broadcasthenet", "passthepopcorn", "hdtorrents", "tvvault", "animebytes", "orpheus", "blutopia"],

	// directory containing torrent files.
	// For rtorrent, this is your session directory
	// as configured in your .rtorrent.rc file.
	// For deluge, this is ~/.config/deluge/state.
	torrentDir: "/input",

	// where to put the torrent files that cross-seed finds for you.
	outputDir: "/output",

	// Whether to search for single episode torrents
	includeEpisodes: true,

	// search for all torrents, regardless of their contents
	// this option overrides includeEpisodes.
	searchAll: false,
```
### Setting up the container to run on an interval
The way this container works is it's a NODE.js script wrapped into a container. This means that as soon as the script is done running the container is no longer running. For this reason we need to set up a script to start the container and run the contatiner at an interval.
For this we'll need

[User Scripts](https://forums.unraid.net/topic/48286-plugin-ca-user-scripts/)

You can simply search this in the apps store and install it

Now that User scripts is installed you'll need to add a new script (user scripts will be found under the **Settings** tab.

Within User Scripts click **Add New Script**
A pop-up window will appear and ask you what you want to call your script
I Simply called it `start-cross-seed-container `
Within the script box you'll need to put:
```bash
#!/bin/bash
#start cross-seed container
echo "Starting Cross-Seed docker container"
docker start cross-seed
echo "Cross-Seed container started"
```
This will start the container
Click **Save Changes**
For the interval we need to set up a cron schedule. The drop down box to the right of **Run in background** will allow you to set an interval or a custom schedule. I selected **Custom** 
My cron schedule looks like this `0 */2 * * *` This will run this script every 2 hours. 
For more complex schedules or a custom one try [crontab.com](https://corntab.com/)

Click **Apply** in the lower left and you're done with Cross-Seed

**Note**
The outputDir and torrentDir are the same as the Output and Input container paths that we set up earlier. If this is different for you this will need to be updated

## qBit Management
This script is managed and maintained [Here](https://github.com/Visorask/qbit_manage)

First we are goign to need [Nerd Pack](https://forums.unraid.net/topic/35866-unraid-6-nerdpack-cli-tools-iftop-iotop-screen-kbd-etc/)
This can be also download from the **Apps** store

Nerd pack will be located in the settings tab
When you open it up you'll see a bunch of packages that you can install. We'll need

* `python-pip`

* `python3`


Now to set a schedule for this bash script to run. Select **At First Array Start Only** This will run this script every time the array starts on every boot

To get this running in unRAID go ahead and download the repo to your computer. then take all the data from the zip file and place it somewhere on your server.

I placed mines in `/mnt/user/data/scripts/qbit/`

Now we need to install the requirements for this script. 

Head back over to **User Scripts**

Create a new script: I named mines `install-requirements`

In the mew text field you'll need to place:
```bash
#!/bin/bash
echo "Installing required packages"
python3.9 -m pip install -r /mnt/user/path/to/requirements.txt 
echo "Required packages installed"
```
Replace `path/to/` with your path example mines `/data/scripts/qbit/` or `/mnt/user/data/scripts/qbit/requirements.txt`

Now click **Save Changes**

Now we need to edit the config file:

```yaml
qbt:
  host: '<qbit address>:8080'
  user: 'user'
  pass: 'password'

directory:
  # Do not remove these
  # Cross-seed var: </your/path/here/> This is where Cross-Seed outputs its torrents
  cross_seed: '/mnt/user/path/to/output'
# Category/Pathing Parameters
cat:
  # <Category Name> : <save_path> #Path of your save directory. Can be a keyword or full path
  bib-upload: 'bib-upload'
  comics: 'comics'
  completed-ebooks: 'completetd-ebooks'
  completed-movies: 'completed-movies'
  completed-music: 'completed-music'
  completed-series: 'completed-series'
  ebooks: 'ebooks'
  movies: 'movies'
  music: 'music'
  ptp-upload: 'ptp-upload'
  series: 'series'
  tmp: 'tmp'


# Tag Parameters
tags:
  # <Tracker URL Keyword>: <Tag Name>
  beyond-hd: Beyond-HD
  animebytes.tv: AnimeBytes
  blutopia: Blutopia
  hdts: HD-Torrents
  landof.tv: BroadcasTheNet
  passthepopcorn: PassThePopcorn
  stackoverflow: IPTorrents
  morethantv: MoreThanTV
  myanonamouse: MyAnonaMouse
  opsfet: Orpheus
  torrentleech: TorrentLeech
  tleechreload: TorrentLeech
  tv-vault: TV-Vault
  ```
  This is an example of mines. You'll need to ensure you put all your catagories into the `Cat` Field
  
  Now we need to go back to **User Scripts** and create our script to run this script 
  **Add a new script**
  I named mines `auto-manage-qbittorrent`
  Here is my script:
  ```bash
  #!/bin/bash
echo "Running qBitTorrent Management"
python3.9 /mnt/user/data/scripts/qbit/qbit_manage.py -c /mnt/user/data/scripts/qbit/config.yml -ms -l /mnt/user/data/scripts/qbit/activity.log
echo "qBitTorrent Management Completed"
```
However, at the core you'll want 
```
python3.9 /<path to script>/qbit_manage.py -c /<path to config>/config.yml -ms -l /<path to where you want log file>/activity.log
```
if you want to change the arguments such as the `-ms` a full list of arguments can be seen below
```
-h, --help            show this help message and exit
  -c CONFIG, --config-file CONFIG
                        This is used if you want to use a different name for your config.yml. Example: tv.yml
  -l LOGFILE, --log-file LOGFILE
                        This is used if you want to use a different name for your log file. Example: tv.log
  -m, --manage          Use this if you would like to update your tags AND categories AND remove unregistered
                        torrents.
  -s, --cross-seed      Use this after running cross-seed script to organize your torrents into specified watch
                        folders.
  -re, --recheck        Recheck paused torrents sorted by lowest size. Resume if Completed.
  -g, --cat-update      Use this if you would like to update your categories.
  -t, --tag-update      Use this if you would like to update your tags.
  -r, --rem-unregistered
                        Use this if you would like to remove unregistered torrents.
  --dry-run             If you would like to see what is gonna happen but not actually delete or tag/categorize
                        anything.
  --log LOGLEVEL        Change your log level.
 ```
  
  Once you've got the config file set up you should be all set. 
  Don't forget to set a cron schedule mines `*/30 * * * *` <-- Runs every 30 min
  
  
  Final note:
  Now these two scripts will automate probably about 95-99% of your cross-seeding operations. However, in my experiance you'll still recieve some files that don't quite add up no matter what. All I do is remove the cross-seeded file and move on to the next one. I feel there isn't much of a reason to bang my head against the table to fix one file when in the grand scheme of things it won't make much of a difference. 
  To check on your cross-seed container simply open the Logs and see what it's doing. It's quite verbose on what's going on. 
  
  This guide is written for those who use unRAID OS. I'm sure these scripts will work on other OS. That is just outside the scope of this guide.

