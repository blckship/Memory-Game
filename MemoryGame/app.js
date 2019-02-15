// list that holds cards
let card = document.getElementsByClassName("card");
let cards = [...card];
// array for opened cards
let openedCards = [];
// declaring variable of matchedCards
let matchedCard = document.getElementsByClassName("match");
// declaring variable of moves
let moves = 0;
// variable congrats popup
const popup = document.getElementById("congrats-popup");
// refresh value in HTML
let refreshHTML = function (target, value) {
   return target.innerHTML = value;
};
// counter and CounterSet
let CounterSet = function (moves) {
   this.target = document.querySelector(".counter");
   refreshHTML(this.target, moves);
};
CounterSet.prototype.add = function () {
   moves++;
   refreshHTML(this.target, moves);
};
CounterSet.prototype.restart = function () {
   moves = 0;
   refreshHTML(this.target, moves);
};
let counter = new CounterSet(moves);
//  StarRating
let StarRating = function () {
   this.stars = document.querySelectorAll(".fa-star");
};
StarRating.prototype.rate = function () {
   if (moves > 12 && moves < 18) {
      this.stars[2].classList.remove("shine");
   } else if (moves > 18) {
      this.stars[1].classList.remove("shine");
   }
};
StarRating.prototype.restart = function () {
   for (var i = 0; i < this.stars.length; i++) {
      this.stars[i].classList.add("shine");
   }
};
let stars = new StarRating();
// declaring timer
const timer = document.querySelector(".timer");
// declaring second and minute
let second = {
   value: 0,
   label: " segs"
};
let minute = {
   value: 0,
   label: " mins "
};
// declaring interval
let interval;
// when page is loaded shuffle cards and display each card in the deck
window.onload = startGame();
// loop and add event listeners to each card
for (var i = 0; i < cards.length; i++) {
   cards[i].addEventListener("click", displayCard);
   cards[i].addEventListener("click", cardOpen);
   cards[i].addEventListener("click", congratulations);
}
// restart button
document.querySelector(".restart")
   .addEventListener("click", startGame);
//shuffle function from implementation of the Durstenfeld shuffle

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
    }
function startGame() {
   cards = shuffle(cards);
   for (var i = 0; i < cards.length; i++) {
      document.querySelector(".deck")
         .innerHTML = "";
      [].forEach.call(cards, function (item) {
         document.querySelector(".deck")
            .appendChild(item);
      });
      cards[i].classList.remove("show", "open", "match", "disabled");
   }
   counter.restart();
   stars.restart();
   resetTimer();
}
// toggles open, show and disabled classes
function displayCard() {
   this.classList.toggle("open");
   this.classList.toggle("show");
   this.classList.toggle("disabled");
}
// add opened cards to openedCards list,  check if cards are match or not
function cardOpen() {
   openedCards.push(this);
   if (openedCards.length === 2) {
      counter.add();
      stars.rate();
      startTimer();
      if (openedCards[0].type === openedCards[1].type) {
         matched();
      } else {
         unmatched();
      }
   }
}
// cards match
function matched() {
   for (var i = 0; i < openedCards.length; i++) {
      openedCards[i].classList.add("match", "disabled");
      openedCards[i].classList.remove("show", "open", "no-event");
   }
   openedCards = [];
}
// cards don't match
function unmatched() {
   for (var i = 0; i < openedCards.length; i++) {
      openedCards[i].classList.add("unmatched");
   }
   disable();
   setTimeout(function () {
      for (var i = 0; i < openedCards.length; i++) {
         openedCards[i].classList.remove("show", "open", "no-event", "unmatched");
      }
      enable();
      openedCards = [];
   }, 1100);
}
// disable cards
function disable() {
   for (var i = 0; i < cards.length; i++) {
      cards[i].classList.add("disabled");
   }
}
// enable all cards except matched cards
function enable() {
   for (var i = 0; i < cards.length; i++) {
      if (!cards[i].classList.contains("match")) {
         cards[i].classList.remove("disabled");
      };
   }
}
// refresh timer
function refreshTime() {
   timer.innerHTML = minute.value + minute.label + second.value + second.label;
}
// reset timer
function resetTimer() {
   second.value = 0;
   minute.value = 0;
   refreshTime();
}
// start timer
function startTimer() {
   if (moves == 1) {
      interval = setInterval(function () {
         second.value++;
         if (second.value == 60) {
            minute.value++;
            second.value = 0;
         }
         refreshTime();
      }, 1000);
   }
}
// popup when all cards match
function congratulations() {
   if (matchedCard.length == 16) {
      clearInterval(interval);
      popup.classList.add("show");
      document.getElementById("total-time")
         .innerHTML = timer.innerHTML;
      document.getElementById("star-rating")
         .innerHTML = document.querySelector(".stars")
         .innerHTML;
      document.getElementById("total-moves")
         .innerHTML = moves;
      closePopup();
   };
}
// close popup function if play again button
function closePopup() {
   document.getElementById("play-again")
      .addEventListener("click", function () {
         popup.classList.remove("show");
         startGame();
      });
}

