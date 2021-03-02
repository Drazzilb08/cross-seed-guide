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
