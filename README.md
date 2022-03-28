## A Wordle-Clone Front-End

This is my rendition of Wordle, a modern classic. The project (front-end) can be viewed and played here:

[Word Game Web](http://www.violetgoat.com)

### How to play

Guess the secret word in 6 or fewer tries. 

1.  Enter a 5- (or 4-, 6-, or 7-) letter word. Click 'Submit.'
2.  The app then provides feedback in the form of color-coded clues.  
      If a letter is colored deep purple, the secret word does not contain it. 
      If a letter is colored yellow, the word contains it, but not in the position in which it is located in your guessed word. 
      If a letter is colored green, the word contains it in the position in which it is located in your guessed word. 
3.  Repeat until you guess the word (or use up your allowed 6 guesses). 

## Development Notes

### Languages
This one is pretty simple, using plain-old-vanilla HTML, CSS and JavaScript. No fancy frameworks. 

### APIs used
    
   #### API for Selecting a Secret Word
The Secret Word is fetched from a RESTful API running on a backend server/database set up by me (separate project to be uploaded here shortly -- stay tuned!).

   #### API for Validating User-Entered Words
Entered words are validated (as "real" words) through a free dictionary API, available here: 

[Free Dictionary API](https://dictionaryapi.dev)

This validation is slower than I would prefer, and misses some words (some plurals, suffixes, etc.).

At some future date (famous last words, I know), I plan to add validation to my backend API. 
For now, Heroku's hobby/free hosting service will only allow 10,000 rows, which is far fewer than the number of words I would want to allow as "valid". 

  #### Why Separate Word Lists?
The word-selection API delivers a random word of the appropriate length.  
If this were pulled from the list of "valid" English words, the result would often (dare I say, more-often-than-not?) be obscure.  
Hence the need for a separate, shorter, list of more-commonly-used words. 
My plan would be to host both lists in a single table of words, with columns of meta-data, including usage frequency --
but -- as discussed above, Heroku's free hosting service is limited to too few rows for this, at least as I have it conceptualized in my head. 

### Thank You
Thanks for your interest!
    -S





