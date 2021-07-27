# Wagawin test - Puzzle image game
This is my test assignment for junior FE position at Wagawin

Kind of the game
- A puzzle game with external image URL (if player doesn't input image URL, the system use the default image)

Game settings (inputs)
- number of row and cols to swap the image
- image URL aka image source
- Update button to start the game

Game elements
- the swapped image following number of row and column
- the counter to couting down (maybe we need the maximize time setting for player, let's say 30 seconds)
- the 'behind the scence' monitor to check if the player finish the game OR failed after the counting down time is over.
- the alert box is used to inform the player win or loose the game

User's stories: As a user I want...
- Open the game
- Understand the game's rules in 3-5 seconds (don't make me think)
- Input the number of rows and columns
- Input the image URL
- Click the update button
-- If the image is too big (let's say 10Mb), please let me know that I need to change  the image with a recommended size
- See the image loading with nice counting down 3 - 2 - 1 (3000ms)
- The counter on the right hand side start counting
- Drag and drop the small amount of the image
- Once I finished, the system informs that I win the game
-- In constrast, once the counter go to 0, the system informs that I loose the game with the option: Replay / or Renew the game

Scoring 
- Whenever I put the image into the right order -> count me 1
- By end of the game, let me know the total score/or steps I made

Technical requirements
- The game must be responsive and working on mobile devices
- Do not use any frameworks or libararies
- Do not use canvas
- Write clean code
- Support touches
- Support mobile responsive
