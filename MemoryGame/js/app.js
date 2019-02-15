let card = document.getElementsByClassName("card");
let cards = [...card];
let openedCards = [];
let matchedCard = document.getElementsByClassName("match");
let moves = 0;
const popup = document.getElementById("congrats-popup");
let refreshHTML = function (target, value) {
   return target.innerHTML = value;
};
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
const timer = document.querySelector(".timer");
let second = {
   value: 0,
   label: " segs"
};
let minute = {
   value: 0,
   label: " mins "
};
let interval;
window.onload = startGame();
for (var i = 0; i < cards.length; i++) {
   cards[i].addEventListener("click", displayCard);
   cards[i].addEventListener("click", cardOpen);
   cards[i].addEventListener("click", congratulations);
}
document.querySelector(".restart")
   .addEventListener("click", startGame);

function shuffle(array) {
   var currentIndex = array.length,
      temporaryValue, randomIndex;
   while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
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

function displayCard() {
   this.classList.toggle("open");
   this.classList.toggle("show");
   this.classList.toggle("disabled");
}

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

function matched() {
   for (var i = 0; i < openedCards.length; i++) {
      openedCards[i].classList.add("match", "disabled");
      openedCards[i].classList.remove("show", "open", "no-event");
   }
   openedCards = [];
}

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

function disable() {
   for (var i = 0; i < cards.length; i++) {
      cards[i].classList.add("disabled");
   }
}

function enable() {
   for (var i = 0; i < cards.length; i++) {
      if (!cards[i].classList.contains("match")) {
         cards[i].classList.remove("disabled");
      };
   }
}

function refreshTime() {
   timer.innerHTML = minute.value + minute.label + second.value + second.label;
}

function resetTimer() {
   second.value = 0;
   minute.value = 0;
   refreshTime();
}

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

function closePopup() {
   document.getElementById("play-again")
      .addEventListener("click", function () {
         popup.classList.remove("show");
         startGame();
      });
}

