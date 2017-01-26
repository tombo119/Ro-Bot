var Discordie = require("discordie");
var Events = Discordie.Events;

var lame = require('lame');
var fs = require('fs');

var client = new Discordie();
var guild;

client.connect({ token: "MjczOTQ1NDA5NDgxNjA1MTIx.C2q97A.CEEH4vqCkXTe1hCBbtjev6qPh1g" });

client.Dispatcher.on(Events.GATEWAY_READY, e => {
  console.log("Connected as: " + client.User.username);

  guild = client.Guilds.getBy("name", "Rohan\\\'s a Kent");
  if (!guild) return console.log("Guild not found");

  const general = guild.voiceChannels.find(c => c.name == "General");
  if (!general) return console.log("Channel not found");

  return general.join(false, false);
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
  if (e.message.author.username == "Tbone"){
    var info = client.VoiceConnections.getForGuild(guild);
    switch(e.message.content){
        case "!Robean" :
          // e.message.reply("pong")
          e.message.channel.sendMessage("Here comes Rohan with the most mlg play of the game you ever will see, what a coon",true );
          if (info) play(info,"../rohan.mp3");
          break;
        case "!Kio" :
          // e.message.reply("pong")
          e.message.channel.sendMessage("It's Captain Kieran the saltiest dog on the seven seas, personally I think Robean deserved that play of the game",true );
          if (info) play(info,"../kieran.mp3");
          break;
        case "!Casul" :
          // e.message.reply("pong")
          e.message.channel.sendMessage("Casul Ornstein is a pussy, he only plays heroes beginning with W or J,  and will snake you on your nuel team",true );
          if (info) play(info,"../tom.mp3");
          break;
        case "!James" :
          // e.message.reply("pong")
          e.message.channel.sendMessage("Casul Ornstein is a pussy, he only plays heroes beginning with W or J,  and will snake you on your nuel team",true );
          if (info) play(info,"../james.mp3");
          break;
    }
  }



});



function play(info, file) {
  if (!client.VoiceConnections.length) {
    return console.log("Voice not connected");
  }

  if (!info) info = client.VoiceConnections[0];

  var mp3decoder = new lame.Decoder();
  var file = fs.createReadStream(file);
  file.pipe(mp3decoder);

  mp3decoder.on('format', pcmfmt => {
    // note: discordie encoder does resampling if rate != 48000
    var options = {
      frameDuration: 60,
      sampleRate: pcmfmt.sampleRate,
      channels: pcmfmt.channels,
      float: false
    };

    var encoderStream = info.voiceConnection.getEncoderStream(options);
    if (!encoderStream) {
      return console.log(
        "Unable to get encoder stream, connection is disposed"
      );
    }

    // Stream instance is persistent until voice connection is disposed;
    // you can register timestamp listener once when connection is initialized
    // or access timestamp with `encoderStream.timestamp`
    encoderStream.resetTimestamp();
    encoderStream.removeAllListeners("timestamp");
    encoderStream.on("timestamp", time => console.log("Time " + time));

    // only 1 stream at a time can be piped into AudioEncoderStream
    // previous stream will automatically unpipe
    mp3decoder.pipe(encoderStream);

    // must be registered after `pipe()`
    encoderStream.once("unpipe", () => file.destroy());
  });
}