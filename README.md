# Project 2

Web Programming with Python and JavaScript

Below is the list of requirments & my implementations.

*Display Name: When a user visits your web application for the first time, they should be prompted to type in a display name that will eventually be associated with every message the user sends. If a user closes the page and returns to your app later, the display name should still be remembered.*

I implemented a screen that look visually like the slack login where I ask you to enter your name (aka Display name). Upon repeat visits, I am showing a "Welcome back" screen with your name and offer you to login under a different name. It is not very practical but allow for much better testing and also offers some type of logout.
In the process of this login (and later in creating a new channel) I also implemented some safty: you can't submit if you didn't enter anything.

*Channel Creation: Any user should be able to create a new channel, so long as its name doesn’t conflict with the name of an existing channel.*

Implemented. In the case of channel already exists, and I do a case insensitive check, I am outputing an alert.

*Channel List: Users should be able to see a list of all current channels, and selecting one should allow the user to view the channel. We leave it to you to decide how to display such a list.*

Implemented. Much like slack, I am showing the list of channel with the date each channel was created and who was the person (his/her display name) that created it. Moreover, when you move your mouse over the channel name I offer you to click and visit this channel. I also show the number of messages in that channel.

*Messages View: Once a channel is selected, the user should see any messages that have already been sent in that channel, up to a maximum of 100 messages. Your app should only store the 100 most recent messages per channel in server-side memory.*

Implemented. I also making sure that the interface scroll to the bottom so you get to see the latest message. Becuase of the limit of 100 messages, in the channel list view, when I am showing the total messages. If we get to 100+ I output 100+ (because in reality you will never get more than 100 back from the server)

*Sending Messages: Once in a channel, users should be able to send text messages to others the channel. When a user sends a message, their display name and the timestamp of the message should be associated with the message. All users in the channel should then see the new message (with display name and timestamp) appear on their channel page. Sending and receiving messages should NOT require reloading the page.*

Implemented. I also added 4 features I like in Slack: output formating. I support *bold*, _italic_, `code`, and ```block of code```. I added a send button in order to allow to type longer messages that includes multiple line.

*Remembering the Channel: If a user is on a channel page, closes the web browser window, and goes back to your web application, your application should remember what channel the user was on previously and take the user back to that channel.*

Implemented. I know what page you saw last. My design is actually all one page and I am using CSS to show or hide what page you see. In the case when you are talking in a specific channel page. a refresh will bring you back to where you left of, but if you on any other page a refresh will bring you to the 'welcome back' page where you can change your login if you want or continue to the channel list. the channel list will highlight your last channel too.

*Personal Touch: ...*

The design use no frame works, so all CSS (include mobile detection) was created to mimic the look and fill of Slack. I also added some math to create a color coded in relationship to the first letter of the person who type the message as its thumbs. Added features include the output formating ability. The Welcome back screen. The smart auto scroll to the bottom of the messages.





---------------------------------------------
# to run this project make sure that you only setup these 2 lines (no debug mode, no database, etc)
set FLASK_APP=application.py
flask run