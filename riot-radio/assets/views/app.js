riot.tag('body', '<input id="page-toggle-chk" type="checkbox" hidden> <div class="window"> <div class="top-bar"> <label for="page-toggle-chk" class="left-action"> <div class="line line-1"></div> <div class="line line-2"></div> <div class="line line-3"></div> </label> <div class="mid-text"> <div class="title page-front-title">Online Radio</div> <div class="title page-saved-stations-title">All stations</div> </div> <span id="playButton" class="right-action" onclick="{togglePlay}"> <div class="line line-1"></div> <div class="line line-2"></div> <div class="line line-3"></div> </span> </div> <div class="page page-front"> <div class="cover"> <div class="img" riot-style="background-image: url({stationInfo.img})" if="{stationInfo.img}"></div> <ul class="tool-buttons bitrates"> <li class="bitrate-{val}" each="{opts.rates}" onclick="{setBitrate}">{name}</li> </ul> <div class="current-station-text"></div> <div class="current-station-name-bar"> <div class="left-action icon-backward" onclick="{prevStation}"></div> <div class="mid-text stroke">{stationInfo.name}</div> <div class="right-action icon-forward" onclick="{nextStation}"></div> </div> <div class="sound-bars"> <div class="bar wave-{val}" each="{val in fakeArray}"></div> </div> </div> <div class="track-info"> <div if="{trackInfo.artist}" title="Искать в vk.com {trackInfo.artist} {trackInfo.title}"> <div class="artist">{trackInfo.artist}</div> <div class="title"><i>{trackInfo.title}</i></div> </div> </div> <div class="volume-bar"> <div class="left-icon icon-volume"></div> <input id="volumeControl" type="range" class="range" oninput="{setVolume}"> </div> </div> <div class="page page-saved-stations"> <menu class="station-list"> <ul> <li each="{opts.stations}" class="station-{code}"> <span class="link" onclick="{setStation}"> {name} <div class="bar-bouncer"> <div class="bar bar1"></div> <div class="bar bar2"></div> <div class="bar bar3"></div> </div> </span> </li> </ul> </menu> </div> </div> <audio id="audio" onerror="{audioOnError}" onabort="{audioOnAbort}"></audio>', function(opts) {

  var self = this,
    db = $.storage(opts.appName),
    checkTrackInfoTimeout

  this.currentBitrate = +db.get('bitrate') || 320
  this.currentStation = db.get('station') || 'tm'
  this.volumeControl.value = (+db.get('volume') || 0.5) * 100
  this.audio.volume = this.volumeControl.value / 100
  this.isPlaying = false
  this.audio.preload = false
  this.stationInfo = {}
  this.trackInfo = {}
  this.fakeArray = [];

  this.init = function() {
    self.setSource()
    self.setActiveBitrate()
    setInterval(self.checkAudioState, 1000)
  }.bind(this)

  this.setSource = function() {
    var stationProps = $.find(opts.stations, 'code', self.currentStation)
    var src = opts.url + stationProps.port[self.currentBitrate] + '/' + self.currentStation + '_' + self.currentBitrate
    self.audio.src = src
    $.log('Set new source:', src);
    self.stationInfo = {
      code: stationProps.code,
      name: stationProps.name,
      img: 'assets/img/' + self.currentStation + '.jpg'
    }
    self.audio.play()
    self.isPlaying = true
    $('.window').addClass('play')
    self.setActiveStation()
    db.set('station', self.currentStation)
    self.update()
    self.checkTrackInfo()
    self.updateFakeArray();
  }.bind(this)

  this.setStation = function(e) {
    if (e.item.code == self.currentStation) return
    self.currentStation = e.item.code
    self.setSource()
    self['page-toggle-chk'].checked = false
  }.bind(this)

  this.togglePlay = function() {
    if (self.isPlaying) {
      self.audio.pause()
      $('.window').removeClass('play')
      self.isPlaying = false
    } else {
      self.audio.load()
      self.audio.play()
      $('.window').addClass('play')
      self.isPlaying = true
    }
  }.bind(this)

  this.prevStation = function() {
    var i = self.currentStationIndex() - 1
    if (i < 0) i = opts.stations.length - 1
    self.currentStation = opts.stations[i].code
    self.setSource()
  }.bind(this)

  this.nextStation = function() {
    var i = self.currentStationIndex() + 1
    if (i >= opts.stations.length) i = 0
    self.currentStation = opts.stations[i].code
    self.setSource()
  }.bind(this)

  this.setBitrate = function(e) {
    if (e.item.val == self.currentBitrate) return
    self.currentBitrate = e.item.val
    self.setSource()
    self.setActiveBitrate()
    db.set('bitrate', self.currentBitrate)
  }.bind(this)

  this.setActiveBitrate = function() {
    $('.bitrates li').removeClass('active')
    $('.bitrate-' + self.currentBitrate).addClass('active')
  }.bind(this)

  this.setActiveStation = function() {
    $('.station-list li').removeClass('active')
    $('.station-list .station-' + self.currentStation).addClass('active')
  }.bind(this)

  this.setVolume = function(e) {
    self.audio.volume = e.target.value / 100;
    db.set('volume', self.audio.volume)
  }.bind(this)

  this.checkTrackInfo = function() {
    var url = opts.trackInfoUrl.replace('%s%', self.currentStation)
    $.get(url, function(response) {
      var result = {}, regex = /"(.+)":"(.+)"/
      if (response) {
        response
          .replace(/^\{|\}$/g, "")
          .split(",")
          .forEach(function(el) {
            var matches = regex.exec(el)
            if (matches && matches[1] && matches[2]) result[matches[1]] = matches[2].replace("\\", "")
          })
        if (self.trackInfo.title != result.title) {
          self.trackInfo = result
          self.update()
        }
        if (checkTrackInfoTimeout) {
          clearTimeout(checkTrackInfoTimeout)
          checkTrackInfoTimeout = null
        }
      }
      checkTrackInfoTimeout = setTimeout(self.checkTrackInfo, opts.pingInterval)
    })
  }.bind(this)

  this.audioOnError = function(e) {
    $.log('audio error')
  }.bind(this)

  this.audioOnAbort = function(e) {
    $.log('audio abort')
  }.bind(this)

  this.checkAudioState = function() {
    if (self.audio.networkState === self.audio.NETWORK_IDLE && self.isPlaying) {
      $.log('reload audio')
      self.audio.load()
      self.audio.play()
    }
  }.bind(this)

  this.currentStationIndex = function() {
    return opts.stations.indexOf($.find(opts.stations, 'code', self.currentStation))
  }.bind(this)

  this.searchTrack = function() {
    open('http://vk.com/audio?q=' + encodeURIComponent(self.trackInfo.artist + ' ' + self.trackInfo.title), '_blank')
  }.bind(this)

  this.updateFakeArray = function() {
    var i = 50;
    self.fakeArray = [];
    while (i--) {
      self.fakeArray.push(Math.floor(Math.random() * 10 + 1));
    }
  }.bind(this)

  this.on('mount', self.init);

});