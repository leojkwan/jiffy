var Botkit = require('botkit');

var controller = Botkit.slackbot();
var PORT = +process.env.PORT;
var jiffy = controller.spawn({
  token: "xoxb-280741095043-wy9pYbrZLzm1c3iJhtqnPSVM"
})

jiffy.startRTM(function (err, bot, payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

controller.setupWebserver(PORT || 5000, function (err, webserver) {
  controller.createWebhookEndpoints(controller.webserver);
});

controller.hears(['Who is our President'], 'direct_mention, ambient, mention', function (bot, message) {
  bot.startConversation(message, function (err, convo) {
    convo.say('Donald J. Trump')
  })
})

var schedule = [
  {
    time: new Date(2017, 12, 2, 17, 30, 0, 0),
    name: "5:30PM-DINNER!"
  }, {
    time: new Date(2017, 12, 2, 18, 0, 0, 0),
    name: "6:00PM-Hacking Ends"
  }, {
    time: new Date(2017, 12, 2, 18, 30, 0, 0),
    name: "6:30PM-Expo"
  }, {
    time: new Date(2017, 12, 2, 19, 30, 0, 0),
    name: "7:30PM-Top 10 Presentations"
  }, {
    time: new Date(2017, 12, 2, 20, 30, 0, 0),
    name: "8:30PM-Winners Announces// Closing"
  }, {
    time: new Date(2099, 12, 2, 20, 30, 0, 0),
    name: "Event Ended!"
  }
]
function getnextEvent() {
  var currenttime = new Date();
  return schedule.find(function (event) {
    return event.time > currenttime;
  }
  )

}

controller.hears([
  "Whats next",
  "what's next",
  "What's next",
], 'direct_mention, ambient, mention', function (bot, message) {
  bot.startConversation(message, function (err, convo) {
    convo.say(getnextEvent().name)
  })
})



controller.hears(['Who do you think won', 'Who won'], 'direct_mention, ambient, mention', function (bot, message) {
  bot.startConversation(message, function (err, convo) {
    convo.say('JIFFY!!!')
  })
})


controller.hears(['Whats Plated'], 'direct_mention, ambient, mention', function (bot, message) {
  bot.startConversation(message, function (err, convo) {
    convo.say('Funny you asked, Plated is one of the best food subscription services on the market.\n You can get Chef made meals for a cheap affordable price. https://www.plated.com')
    // convo.ask('What food do you like?\n -Burgers? (Type 1) \n-Steak ? (Type 2) \n-Vegetarian? (Type 3)?', function (response, convo) {

    // if (response.text == 1) {

    // } else if (response.text == 2) {

    // } else if (response.text == 3) {

    // }
    // convo.say('Funny you asked, Plated is one of the best food subscription services on the market.\n You can get Chef made meals for a cheap affordable price. https://www.plated.com (This is not an endoresment or a sponsorship)')

    convo.ask('What food do you like?\n -Steak? (type "1") \n-Pizza ? (type "2") \n-Seafood? (type "3")?', [
      {
        pattern: '1',
        callback: function (response, convo) {
          // since no further messages are queued after this,
          // the conversation will end naturally with status == 'completed'
          convo.say('Nice! Check this recipe out! https://www.plated.com/menus/2017-11-26/recipes/steak-with-brussels-sprouts-and-garlic-parmesan-fries')
          convo.next();
        }
      },
      {
        pattern: '2',
        callback: function (response, convo) {
          convo.say('I LOVE PIZZA TOO~. https://www.plated.com/menus/2017-11-26/recipes/white-pizza-with-crispy-brussels-sprouts-and-balsamic-glaze-8')
          convo.next();
        }
      },
      {
        pattern: '3',
        callback: function (response, convo) {
          convo.say('Salmon anyone?~. https://www.plated.com/menus/2017-11-26/recipes/salmon-and-creamy-dill-sauce-with-sauteed-kale-and-roasted-fingerling-potatoes')
          convo.next();
        }
      },
      {
        default: true,
        callback: function (response, convo) {
          convo.say('Not an option, try again!')
          convo.stop()
        }
      }
    ]);

    convo.next();


    convo.on('end', function (convo) {
      if (convo.status == 'completed') {
        bot.reply(message, "To see what`s next in the StuyHacks schedule, dm me and ask `what's next`");
      } else {
        // this happens if the conversation ended prematurely for some reason
        bot.reply(message, 'OK, nevermind!');
      }
    });
  })
})