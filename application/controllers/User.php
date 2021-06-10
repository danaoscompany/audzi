<?php

class User extends CI_Controller {
	const LASTFM_API_KEY = "28f8cfda6f4c9a5c8e7f959d6d941ad5";
	
	public function get_top_artists() {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, "http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=" . self::LASTFM_API_KEY . "&format=json&page=1&limit=10");
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($ch);
		$result = json_decode($response, true);
		$artists = $result['artists']['artist'];
		for ($i=0; $i<sizeof($artists); $i++) {
			$artist = $artists[$i];
			curl_setopt($ch, CURLOPT_URL, "https://api.deezer.com/search/artist?q=" . urlencode($artist['name']));
			curl_setopt($ch, CURLOPT_HEADER, 0);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			$response = curl_exec($ch);
			$artistInfo = json_decode($response, true);
			$artistInfos = $artistInfo['data'];
			if (sizeof($artistInfos) > 0) {
				$artists[$i]['image'] = $artistInfos[0]['picture_big'];
			}
		}
		echo json_encode($artists);
	}
	
	public function get_top_tracks() {
		$page = $this->input->post('page');
		$limit = $this->input->post('limit');
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, "http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=" . self::LASTFM_API_KEY . "&format=json&page=" . $page . "&limit=" . $limit);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($ch);
		$result = json_decode($response, true);
		$tracks = $result['tracks']['track'];
		for ($i=0; $i<sizeof($tracks); $i++) {
			$track = $tracks[$i];
			curl_setopt($ch, CURLOPT_URL, "https://api.deezer.com/search/track?q=" . urlencode($track['name']));
			curl_setopt($ch, CURLOPT_HEADER, 0);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			$response = curl_exec($ch);
			$trackInfo = json_decode($response, true);
			$trackInfos = $trackInfo['data'];
			if (sizeof($trackInfos) > 0) {
				$tracks[$i]['album'] = $trackInfos[0]['album']['title'];
				$tracks[$i]['image'] = $trackInfos[0]['album']['cover_big'];
				$tracks[$i]['duration'] = $trackInfos[0]['duration'];
			} else {
				$tracks[$i]['album'] = "";
				$tracks[$i]['image'] = "";
				$tracks[$i]['duration'] = "";
			}
		}
		echo json_encode($tracks);
	}
}
