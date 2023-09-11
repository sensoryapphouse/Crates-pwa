/* 4 variations
1. unlimited time.  Medium crates. Wide platform. No zoom.
2. Larger crates. Large platform. No zoom.
3. Larger crates. Medium platform. No zoom.
4. Smaller crates. Small platform. Zoom..

Options: (Same as PinBol.)
Mute.
Scan speed.
Activate on down or up.

*/
var splash;
var button;
var button1;
var button2;
var button3;
var inMenu = true;
var panel;
var panelvisible = false;
var settings;
var home;
var speed;
var s1;
var s2;
var mute;
var gameIndex;
var that;
var gm;
var menuItem = 0;

var activateOnSwitchDown = false;

var game;
var crate;
var size = 1;
var gameOptions = {
    timeLimit: 60, // 60
    gravity: 2000,
    crateSpeed: 1500, // PB Speed
    crateHorizontalRange: 960,
    fallingHeight: 700,
    localStorageName: "Sensory.Crates",
    gameWidth: 1280,
    gameHeight: 960
}

var GROUNDHEIGHT;
var CRATEHEIGHT;
var CH = 0; // PB Zero or CRATEHEIGHT

var playGame = function () {};

window.onload = function () {
    'use strict';
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js');   }
    setUpPanel();

    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var ratio = windowHeight / windowWidth;
    if (ratio >= 1) {
        if (ratio < 100.5) {
            gameOptions.gameWidth = gameOptions.gameHeight / ratio;
        } else {
            gameOptions.gameHeight = gameOptions.gameWidth * ratio;
        }
    }

    game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight, Phaser.CANVAS);
    game.state.add("PlayGame", playGame);
    game.state.start("PlayGame");
}

function Highlight() {
    button.style.opacity = .7;
    button1.style.opacity = .7;
    button2.style.opacity = .7;
    button3.style.opacity = .7;

    switch (menuItem) {
        case 0:
            button.style.opacity = 1.;
            break;
        case 1:
            button1.style.opacity = 1.;
            break;
        case 2:
            button2.style.opacity = 1.;
            break;
        case 3:
            button3.style.opacity = 1.;
            break;
    }
}

function Start(i) {
    hideMenu();
    gameIndex = i; // 0 - 3
    try {
        game.destroy(true, false);
    } catch (e) {}
    game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight, Phaser.CANVAS);
    game.state.add("PlayGame", playGame);
    game.state.start("PlayGame");
}

function hideMenu() {
    splash.hidden = true;
    button.hidden = true;
    button1.hidden = true;
    button2.hidden = true;
    button3.hidden = true;
    settings.hidden = true;
    panel.hidden = true;
    inMenu = false;
    home.hidden = false;
}

function showMenu() {
    splash.hidden = false;
    button.hidden = false;
    button1.hidden = false;
    button2.hidden = false;
    button3.hidden = false;
    settings.hidden = false;
    panel.hidden = false;
    home.hidden = true;
    inMenu = true;
}

function setUpPanel() {
    home = document.querySelector('home');
    home.hidden = true;
    splash = document.querySelector('splash');
    panel = document.querySelector('panel');
    settings = document.querySelector('settings');
    button = document.querySelector('button');
    button1 = document.querySelector('button1');
    button2 = document.querySelector('button2');
    button3 = document.querySelector('button3');

    panel.style.left = "130vw";
    slideTo(panel, 130);
    mute = document.createElement("INPUT");
    mute.style.position = "absolute";
    mute.style.height = "3vh";
    mute.style.width = "3vw";
    mute.style.left = "17.5vw";
    mute.style.top = "5vh";
    mute.checked = false;
    mute.setAttribute("type", "checkbox");
    mute.checked = false;
    speed = document.createElement("INPUT");
    speed.setAttribute("type", "range");
    speed.style.position = "absolute";
    speed.style.height = "2vh";
    speed.style.width = "15vw";
    speed.style.left = "4.3vw";
    speed.style.top = "15vh";
    speed.style.color = 'green';
    speed.value = 3;
    speed.min = 1;
    speed.max = 5;

    s1 = document.createElement("INPUT");
    s1.style.position = "absolute";
    s1.style.height = "3vh";
    s1.style.width = "3vw";
    s1.style.left = "14vw";
    s1.style.top = "23vh";
    s2 = document.createElement("INPUT");
    s2.style.position = "absolute";
    s2.style.height = "3vh";
    s2.style.width = "3vw";
    s2.style.left = "6.5vw";
    s2.style.top = "23vh";
    s1.setAttribute("type", "radio");
    s2.setAttribute("type", "radio");

    s2.checked = true;

    function switchOption(i) {
        switch (i) {
            case 1:
                s1.checked = true;
                s2.checked = false;
                localStorage.setItem("Shoot.onUp", 1);
                break;
            case 2:
                s2.checked = true;
                s1.checked = false;
                localStorage.setItem("Shoot.onUp", 0);
                break;
        }
    }

    s1.onclick = function (e) {
        switchOption(1);
    }
    s2.onclick = function (e) {
        switchOption(2);
    }

    panel.appendChild(mute);
    panel.appendChild(speed);
    panel.appendChild(s1);
    panel.appendChild(s2);

    settings.style.left = "92vw";
    // Retrieve settings
    var s = localStorage.getItem("Shoot.mute");
    mute.checked = (s == "true");
    s = parseInt(localStorage.getItem("Shoot.speed"));
    if (s < 1 || s > 5)
        s = 3;
    speed.value = s.toString();
    increment = .2 + (speed.value / 3);
    s = localStorage.getItem("Shoot.onUp");
    if (s == 1)
        switchOption(1);
    else
        switchOption(2);

    mute.onclick = function (e) {
        localStorage.setItem("Shoot.mute", mute.checked);
    }
    speed.onclick = function (e) {
        localStorage.setItem("Shoot.speed", speed.value);
        increment = .2 + (speed.value / 4);
    }

    panel.onmousedown = function (e) { // speed, paddle size, ball size
        e.stopPropagation();
    }

    home.onmousedown = function (e) {
        e.stopPropagation();
        showMenu();
    }

    button.onmouseup = function (e) {
        e.stopPropagation();
        Start(0);
    }
    button1.onmouseup = function (e) {
        e.stopPropagation();
        Start(1);
    }
    button2.onmouseup = function (e) {
        e.stopPropagation();
        Start(2);
    }
    button3.onmouseup = function (e) {
        e.stopPropagation();
        Start(3);
    }

    settings.onmousedown = function (e) { // speed, paddle size, ball size
        e.stopPropagation();
        if (panelvisible) { // save stored values
            slideTo(panel, 130);
            slideTo(settings, 92);
        } else {
            slideTo(panel, 75);
            slideTo(settings, 78);
        }
        panelvisible = !panelvisible;
    }

    function slideTo(el, left) {
        var steps = 5;
        var timer = 50;
        var elLeft = parseInt(el.style.left) || 0;
        var diff = left - elLeft;
        var stepSize = diff / steps;
        console.log(stepSize, ", ", steps);

        function step() {
            elLeft += stepSize;
            el.style.left = elLeft + "vw";
            if (--steps) {
                setTimeout(step, timer);
            }
        }
        step();
    }
}

function switchDown() {
    if (inMenu) {
        return;
    }
    if (s2.checked) {
        that.dropCrate();
    }
}

function switchUp() {
    if (inMenu) {
        return;
    }
    if (s1.checked) {
        that.dropCrate();
    }
}


playGame.prototype = {
    preload: function () {
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.disableVisibilityChange = true;
        game.load.image("ground", "assets/sprites/ground.png");
        game.load.image("sky", "assets/sprites/sky.png");
        if (size == 1)
            game.load.image("crate", "assets/sprites/crate.png");
        else
            game.load.image("crate", "assets/sprites/crateL.png");
        game.load.image("title", "assets/sprites/title.png");
        game.load.image("tap", "assets/sprites/tap.png");
        game.load.audio("hit01", ["assets/sounds/hit01.mp3", "assets/sounds/hit01.ogg"]);
        game.load.audio("hit02", ["assets/sounds/hit02.mp3", "assets/sounds/hit02.ogg"]);
        game.load.audio("hit03", ["assets/sounds/hit03.mp3", "assets/sounds/hit03.ogg"]);
        game.load.audio("remove", ["assets/sounds/remove.mp3", "assets/sounds/remove.ogg"]);
        game.load.audio("gameover", ["assets/sounds/gameover.mp3", "assets/sounds/gameover.ogg"]);
        game.load.bitmapFont("font", "assets/fonts/font.png", "assets/fonts/font.fnt");
        game.load.bitmapFont("smallfont", "assets/fonts/smallfont.png", "assets/fonts/smallfont.fnt");
    },
    create: function () {
        gm = game;
        that = this;
//        if (!Phaser.Device.desktop) {
//            game.scale.forceOrientation(true, false);
//            game.scale.enterIncorrectOrientation.add(function () {
//                game.paused = true;
//                document.querySelector("splash").style.display = "none";
//                document.getElementById("wrongorientation").style.display = "block";
//            })
//            game.scale.leaveIncorrectOrientation.add(function () {
//                game.paused = false;
//                document.querySelector("splash").style.display = "block";
//                document.getElementById("wrongorientation").style.display = "none";
//            })
//        }
        this.lastSoundPlayed = Date.now();
        this.savedData = localStorage.getItem(gameOptions.localStorageName + gameIndex) == null ? {
            score: 0
        } : JSON.parse(localStorage.getItem(gameOptions.localStorageName + gameIndex));
        this.hitSound = [game.add.audio("hit01"), game.add.audio("hit02"), game.add.audio("hit03")];
        this.gameOverSound = game.add.audio("gameover");
        this.removeSound = game.add.audio("remove");
        this.score = 0;
        GROUNDHEIGHT = game.cache.getImage("ground").height;
        CRATEHEIGHT = game.cache.getImage("crate").height;
        if (gameIndex < 3)
            CH = 0;
        else
            CH = CRATEHEIGHT; // 0 or CRATEHEIGHT;
        this.firstCrate = true;
        var sky = game.add.image(0, 0, "sky");
        sky.width = game.width;
        sky.height = game.height;
        this.cameraGroup = game.add.group();
        this.crateGroup = game.add.group();
        this.cameraGroup.add(this.crateGroup);
        game.physics.startSystem(Phaser.Physics.BOX2D);
        game.physics.box2d.gravity.y = gameOptions.gravity;
        this.canDrop = true;
        var ground = game.add.sprite(game.width / 2, game.height, "ground");
        if (gameIndex < 2)
            ground.scale.x = 1.25;
        ground.y = game.height - ground.height / 2;
        this.movingCrate = game.add.sprite((game.width - gameOptions.crateHorizontalRange) / 2, game.height - GROUNDHEIGHT - gameOptions.fallingHeight, "crate");
        this.movingCrate.anchor.set(0.5);
        if (gameIndex < 2) {
            this.movingCrate.scale.x = 1.5;
            this.movingCrate.scale.y = 1.5;
        }
        this.cameraGroup.add(this.movingCrate);
        var crateTween = game.add.tween(this.movingCrate).to({
            x: (game.width + gameOptions.crateHorizontalRange) / 2
        }, gameOptions.crateSpeed * (6 - speed.value) / 2, Phaser.Easing.Linear.None, true, 0, -1, true);
        game.physics.box2d.enable(ground);
        ground.body.friction = 1;
        ground.body.static = true;
        ground.body.setCollisionCategory(1);
        this.cameraGroup.add(ground);
        this.menuGroup = game.add.group();
        var tap = game.add.sprite(game.width / 2, game.height - 30, "tap");
        tap.anchor.set(0.5);
        this.menuGroup.add(tap);
        var title = game.add.image(game.width / 2, game.height / 4, "title");
        title.anchor.set(0.5, 0);
        this.menuGroup.add(title);
        //        var hiScoreText = game.add.bitmapText(game.width / 2, game.height - 74, "smallfont", "HIGH SCORE", 24);
        //        hiScoreText.anchor.set(0.5);
        //        this.menuGroup.add(hiScoreText);
        var hiScore = game.add.bitmapText(game.width / 2, game.height - 75, "font", this.savedData.score.toString(), 72);
        hiScore.anchor.set(0.5);
        this.menuGroup.add(hiScore);
        if (gameIndex == 0)
            this.menuGroup.destroy();
        //        var tapTween = game.add.tween(tap).to({
        //            alpha: 0
        //        }, 150, Phaser.Easing.Cubic.InOut, true, 0, -1, true);
        //        this.menuGroup.destroy(); // lose titles


        game.input.keyboard.onDownCallback = function (e) {
            if (e.repeat)
                return;
            switchDown();
        };
        game.input.keyboard.onUpCallback = function (e) {
            switchUp();
        };
        game.input.onDown.add(function (p) {
            switchDown();
        }, this);
        game.input.onUp.add(function (p) {
            switchUp();
        }, this);

        game.input.gamepad.start();

        game.input.gamepad.onDownCallback = function (e) {
            if (inMenu) {
                switch (e) {
                    case 0: // A
                    case 1: // B
                    case 2: // X
                    case 3: // Y
                        Start(menuItem);
                        break;
                    case 12: // dup
                        if (menuItem >= 2)
                            menuItem -= 2;
                        Highlight();
                        break;
                    case 13: // ddown
                        if (menuItem < 3)
                            menuItem += 2;
                        Highlight();
                        break;
                    case 14: // dleft
                        if (menuItem > 0)
                            menuItem--;
                        Highlight();
                        break;
                    case 15: // dright
                        if (menuItem < 4)
                            menuItem++;
                        Highlight();
                        break;
                }
                console.log("Menu: ", menuItem);
            } else
                switchDown();
        };
        game.input.gamepad.onUpCallback = function (e) {
            if (inMenu) {} else
                switchUp();
        };
    },
    dropCrate: function () {
        if (this.firstCrate) {
            this.firstCrate = false;
            this.menuGroup.destroy();
            this.timer = 0;
            this.timerEvent = game.time.events.loop(Phaser.Timer.SECOND, this.tick, this);
            if (gameIndex > 0)
                this.timeText = game.add.bitmapText(game.width - 120, 15, "font", gameOptions.timeLimit.toString(), 72);
            //            this.timeText.anchor.set(0);
        }
        if (this.canDrop && this.timer <= gameOptions.timeLimit) {
            this.canDrop = false;
            this.movingCrate.alpha = 0;
            var fallingCrate = game.add.sprite(this.movingCrate.x, this.movingCrate.y, "crate");
            if (gameIndex < 2) {
                fallingCrate.scale.x = 1.5;
                fallingCrate.scale.y = 1.5;
            }
            fallingCrate.hit = false;
            game.physics.box2d.enable(fallingCrate);
            fallingCrate.body.friction = 1;
            fallingCrate.body.bullet = true;
            this.crateGroup.add(fallingCrate);
            fallingCrate.body.setCollisionCategory(1);
            fallingCrate.body.setCategoryContactCallback(1, function (b, b2, fixture1, fixture2, contact, impulseInfo) {
                var delay = Date.now() - this.lastSoundPlayed;
                if (delay > 200 && this.timer <= gameOptions.timeLimit) {
                    this.lastSoundPlayed = Date.now();
                    if (!mute.checked)
                        Phaser.ArrayUtils.getRandomItem(this.hitSound).play();
                }
                if (!b.sprite.hit) {
                    b.sprite.hit = true;
                    b.bullet = false;
                    this.getMaxHeight();
                }
            }, this);
        }
    },
    update: function () {
        this.crateGroup.forEach(function (i) {
            if (i.y > game.height + i.height) {
                if (!i.hit) {
                    this.getMaxHeight();
                }
                i.destroy();
            }
        }, this);
    },
    scaleCamera: function (cameraScale) {
        var moveTween = game.add.tween(this.cameraGroup).to({
            x: (game.width - game.width * cameraScale) / 2,
            y: game.height - game.height * cameraScale,
        }, 200, Phaser.Easing.Quadratic.IN, true);
        var scaleTween = game.add.tween(this.cameraGroup.scale).to({
            x: cameraScale,
            y: cameraScale,
        }, 200, Phaser.Easing.Quadratic.IN, true);
        scaleTween.onComplete.add(function () {
            this.canDrop = true;
            this.movingCrate.alpha = 1;
        }, this)
    },
    getMaxHeight: function () {
        var maxHeight = 0
        this.crateGroup.forEach(function (i) {
            if (i.hit) {
                var height = Math.round((game.height - GROUNDHEIGHT - i.y - CRATEHEIGHT / 2) / CRATEHEIGHT) + 1;
                maxHeight = Math.max(height, maxHeight);
            }
        }, this);
        this.movingCrate.y = game.height - GROUNDHEIGHT - maxHeight * CH - gameOptions.fallingHeight;
        var newHeight = game.height + CH * maxHeight;
        var ratio = game.height / newHeight;
        this.scaleCamera(ratio);
    },
    tick: function () {
        if (gameIndex == 0)
            return;
        this.timer++;
        this.timeText.text = (gameOptions.timeLimit - this.timer).toString()
        if ((this.timer > gameOptions.timeLimit) || inMenu) {
            game.time.events.remove(this.timerEvent);
            this.movingCrate.destroy();
            this.timeText.destroy();
            game.time.events.add(Phaser.Timer.SECOND * 2, function () {
                this.crateGroup.forEach(function (i) {
                    i.body.static = true;
                }, true)
                this.removeEvent = game.time.events.loop(Phaser.Timer.SECOND / 10, this.removeCrate, this);
            }, this);
        }
    },
    removeCrate: function () {
        if (this.crateGroup.children.length > 0) {
            var tempCrate = this.crateGroup.getChildAt(0);
            var height = Math.round((game.height - GROUNDHEIGHT - tempCrate.y - CRATEHEIGHT / 2) / CRATEHEIGHT) + 1;
            this.score += height;
            if (!mute.checked)
                this.removeSound.play();
            var crateScoreText = game.add.bitmapText(tempCrate.x, tempCrate.y, "smallfont", height.toString(), 36);
            crateScoreText.anchor.set(0.5);
            this.cameraGroup.add(crateScoreText);
            tempCrate.destroy();
        } else {
            game.time.events.remove(this.removeEvent);
            if (!mute.checked)
                this.gameOverSound.play();
            //            var scoreText = game.add.bitmapText(game.width / 2, game.height / 5, "font", "YOUR SCORE", 72);
            //            scoreText.anchor.set(0.5);
            var scoreDisplayText = game.add.bitmapText(game.width / 2, game.height / 5 + 140, "font", this.score.toString(), 144);
            scoreDisplayText.anchor.set(0.5);
            localStorage.setItem(gameOptions.localStorageName + gameIndex, JSON.stringify({
                score: Math.max(this.score, this.savedData.score)
            }));
            game.time.events.add(Phaser.Timer.SECOND * 5, function () {
                game.state.start("PlayGame");
            }, this);
        }
    }
}
