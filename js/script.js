$( document ).ready(function() {
  var simon = {

    // Object Properties
    $buttons:   [$( ".green" ), $( ".red" ), $( ".yellow" ), $( ".blue" )],
    $control:   [$( ".start" ), $( ".retry" )],
    sequence:   [],
    turnIndex:  0,
    strict:     true,

    // Object Methods
    seqLength:  function() {
      return this.sequence.length;
    },

    randomStep: function() {
      return Math.floor(Math.random() * 4);
    },

    addStep: function() {
      this.sequence.push(this.randomStep());
    },

    // clear timeouts?
    playSteps: function(callback) {
      if (this.turnIndex < this.sequence.length) {
        this.$buttons[this.sequence[this.turnIndex]].css( "width", "200px" );
        var that = this;
        setTimeout(function() {
          that.$buttons[that.sequence[that.turnIndex]].css( "width", "100px" );
          that.turnIndex++;
          that.playSteps(callback);
        }, 1000);
      } else {
        this.turnIndex = 0;
        callback();
      }
    },

    checkTurn: function(value) {
      //console.log('Turn INDEX :: ' + this.turnIndex);
      if (this.sequence[this.turnIndex] === value) {
        this.turnIndex++;
        if (this.turnIndex === this.sequence.length) {
          this.bindsOff();
          this.gameLoop();
        }
      } else {
        this.gameReset();
      }
    },

    resetTurn: function() {
      this.turnIndex = 0;
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

    bindControls: function() {
      this.$control[1].on( "click", this.gameReset.bind(this) );
      this.$control[0].on( "click", this.gameReset.bind(this) );
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
      this.bindControls();
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