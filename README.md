# cross-seed-guide

**This guide is intended for usage with the unRAID OS**

## Cross-Seed Installation
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

## Cross-Seed Configuration
1. Now we need to make a config file for Cross-Seed to work with.
2. Here is a the config that I'm using you can download it [here](/files/config.js) and place it in your appdata folder that cross-seed should have created `/mnt/user/appdata/cross-seed/`
  ```module.exports = {
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
**Note**
The outputDir and torrentDir are the same as the Output and Input container paths that we set up earlier. If this is different for you this will need to be updated

## qBit Management
