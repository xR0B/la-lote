app.controller('gameController', ['$scope', '$location', '$document', '$timeout', 'gameState', 'messageService', '$rootScope', '$interval',
    function ($scope, $location, $document, $timeout, gameState, messageService, $rootScope, $interval) {
        // Return if the game isn't started yet
        if (!gameState.started) {
            $location.path('/');
            return;
        }

        var gamePlayInterval = null;

        // Selected cards
        $scope.cardsSelected = 0;
        // Set initial card
        var initialCard = gameState.getInitialCard();
        var card = document.getElementById('current-card');

        //card.classList.remove('card00');
        //card.classList.add('card' + initialCard);
        card.src = 'svg/cards/01.svg'; // TODO: Set src dynamically
        console.log(card);

        // Played cards
        var playedCards = [];

        // Get cards for player
        $scope.cards = gameState.getOwnPlayer().board;

        // Subscribe to new card event
        // if ($rootScope.playerStatus === 'player') {
        //     myChannel.bind('client-newcard',
        //         function (data) {
        //             console.log(data);
        //             var currentCard = document.getElementById('current-card');
        //             currentCard.classList.add('animated', 'flipOutY');
        //             $timeout(function () {
        //                 currentCard.classList.remove('animated', 'flipOutY');
        //                 currentCard.src = 'svg/cards/01.svg'; // TODO: Set src dynamically
        //                 currentCard.classList.add('animated', 'flipInY');
        //             }, 2000);
        //         }
        //     );
        // }

        if ($rootScope.playerStatus === 'admin') {
/*
            gamePlayInterval = $interval(function () {
                messageService.playCard(gameState.pullCard());
            }, 1000);
*/
        }

        $scope.$on('playcard', function (e, card) {
            var data = {};

            if (playedCards.length > 0) {
                data.lastCard = playedCards[playedCards.length - 1];
            } else {
                data.lastCard = 111;
            }

            data.card = card;
            playedCards.push(card);

            // Flip Current Card
            var currentCard = document.getElementById('current-card');
            currentCard.classList.add('animated', 'flipOutY');

            $timeout(function () {
                currentCard.classList.remove('animated', 'flipOutY');
                currentCard.src = 'svg/cards/' + card + '.svg'; // TODO: Set src dynamically
                currentCard.classList.add('animated', 'flipInY');
            }, 500);

            var riddle = new Audio('audio/cards/riddle/' + card + '.es.mp3');
            riddle.play();
            riddle.addEventListener('ended', function () {
                $timeout(function () {
                    var name = new Audio('audio/cards/name/' + card + '.es.mp3');
                    name.play();
                    name.addEventListener('ended', function () {
                        // $timeout(function () {
                        //     playCards();
                        // }, 1000);
                    })
                }, 1000);
            });
        });

        $scope.loteria = function () {
            messageService.loteria(gameState.getOwnPlayer());
        };

        $scope.$on('win', function (e, player) {
            $interval.cancel(gamePlayInterval);
            $scope.goTo('winner', player);
        });

        $scope.$on('lose', function (e, player) {
            console.log("player", player, " failed an attempt");

            var ownPlayer = gameState.getOwnPlayer();

            if (player.id == ownPlayer.id) {
                $rootScope.lostGame = (ownPlayer.hp--) == 0;
            }
        });

        $scope.$on('tie', function (e, player) {
            $interval.cancel(gamePlayInterval);
            console.log("It's a tie!");
        });

        // Go to (Exit or Loteria)
        $scope.goTo = function (location) {
            $timeout(function() {
                console.log('changing location');
                $location.path('/' + location);
            });
        };

        $scope.getCardSrc = function(card) {
            return 'svg/cards/' + card + '.svg';
        };
    }
]);