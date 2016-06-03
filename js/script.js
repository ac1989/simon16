$( document ).ready(function() {
  var simon = {

    // Object Properties
    $buttons:   [$( ".green" ), $( ".red" ), $( ".yellow" ), $( ".blue" )],
    $control:   [$( ".start" ), $( ".retry" ), $( ".strict" )],
    $sound:     [$( "#sound01" ), $( "#sound02" ), $( "#sound03" ), $( "#sound04" ), ],
    $count:     $( ".count" ),
    sequence:   [],
    turnIndex:  0,
    strict:     false,
    stepCount:  0,
    colorMap: [
      ["green", "lawnGreen"],
      ["red", "tomato"],
      ["yellow", "lightyellow"],
      ["blue", "lightskyblue"]
    ],


    // Object Methods
    randomStep: function() {
      return Math.floor(Math.random() * 4);
    },

    addStep: function() {
      this.sequence.push(this.randomStep());
      this.updateCount();
    },

    updateCount: function() {
      this.stepCount = this.sequence.length;
      this.$count.html(this.stepCount);
    },

    playSteps: function(callback) {
      this.controlsOff();
      if (this.turnIndex < this.sequence.length) {
        this.$sound[this.sequence[this.turnIndex]][0].play();
        
        this.$buttons[this.sequence[this.turnIndex]].css( "background-color", 
        this.colorMap[this.sequence[this.turnIndex]][1] );

        var that = this;
        setTimeout((function() {
          this.$buttons[this.sequence[this.turnIndex]].css( "background-color", 
          this.colorMap[this.sequence[this.turnIndex]][0] );

          this.turnIndex++;
          this.playSteps(callback);
        }).bind(this), 1000);
      } else {
        this.turnIndex = 0;
        this.controlsOn();
        callback();
      }
    },

    // Too much repeating code, split to functions;
    checkTurn: function(userPressed) {
      //console.log('Turn INDEX :: ' + this.turnIndex);
      if (this.sequence[this.turnIndex] === userPressed) {
        console.log('Correct!');
        this.$sound[userPressed][0].play();
        this.$buttons[this.sequence[this.turnIndex]].css( "background-color", 
        this.colorMap[this.sequence[this.turnIndex]][1] );
        var index = this.turnIndex;
        setTimeout(function() {
          this.$buttons[this.sequence[index]].css( "background-color", 
          this.colorMap[this.sequence[index]][0] );
        }.bind(this), 800);
        this.turnIndex++;
        if (this.sequence.length === 5 && this.turnIndex === this.sequence.length) {
          this.victory();
        } else if (this.turnIndex === this.sequence.length) {
          setTimeout(function() {
            this.bindsOff();
            this.gameLoop();
          }.bind(this), 1000)
          
        }
      } else {
        console.log('Incorrect!');
        if (this.strict) {
          setTimeout(function() { this.gameReset(); }.bind(this), 2000);          
        } else {
          this.bindsOff();
          this.turnIndex = 0;
          this.playSteps(this.bindsOn.bind(this));
        }
      }
    },

    resetTurn: function() {
      this.turnIndex = 0;
    },

    victory: function() {
      console.log('You are a weiner!');
      this.bindsOff();
    },

    randomFlashing: function() {

    },

    toggleStrict: function() {
      // this.strict ? (this.strict = false) : (this.strict = true);
      if (this.strict) {
        this.strict = false;
        this.$control[2].css( "background-color", "grey" );
      } else {
        this.strict = true;
        this.$control[2].css( "background-color", "red" );
      }
    },

    bindsOn: function() {
      this.$buttons[0].on( "click", this.checkTurn.bind(this, 0) );
      this.$buttons[1].on( "click", this.checkTurn.bind(this, 1) );
      this.$buttons[2].on( "click", this.checkTurn.bind(this, 2) );
      this.$buttons[3].on( "click", this.checkTurn.bind(this, 3) );
    },

    bindsOff: function() {
      simon.$buttons[0].off();
      simon.$buttons[1].off();
      simon.$buttons[2].off();
      simon.$buttons[3].off();
    },

    controlsOn: function() {
      this.$control[0].on( "click", this.gameReset.bind(this) );
      this.$control[1].on( "click", this.gameReset.bind(this) );
      this.$control[2].on( "click", this.toggleStrict.bind(this) );
    },

    controlsOff: function() {
      this.$control[0].off();
      this.$control[1].off();
      this.$control[2].off();
    },

    gameReset: function() {
      this.bindsOff();
      this.resetTurn();
      this.sequence = [];
      this.gameLoop();

    },

    gameLoop: function() {
      this.resetTurn();
      this.addStep();
      console.log("Sequence: " + this.sequence);
      this.playSteps(this.bindsOn.bind(this));
    },

    init: function() {
      console.log('INIT');
      this.controlsOn();
    }
  }
  // End Of Simon Object
  simon.init();
})
// on click start
// computer generates first turn and 'plays' it
// user can then 'try'
// on clicking chceck click against sequence[turnIndex], correct tile ++ turnIndex
// if all steps match computer adds new step, --> step 3