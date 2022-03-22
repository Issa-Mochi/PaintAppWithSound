
let CanvasX = 1920;
let CanvasY = 1080;
let pickedColor, arrayColors, resetButton;
let synth = new Tone.DuoSynth({
  "vibratoAmount" : 0.5 ,
  "vibratoRate"  : 5 ,
  "harmonicity"  : 4.0 ,
  "voice0"  : {
    "volume"  : -10 ,
    "portamento"  : 0 ,
    "oscillator"  : {
      "type"  : "square"
    }  ,
    "filterEnvelope"  : {
      "attack"  : 0.01 ,
      "decay"  : 0 ,
      "sustain"  : 1 ,
      "release"  : 0.5
    }  ,
    "envelope"  : {
      "attack"  : 0.01 ,
      "decay"  : 0 ,
      "sustain"  : 1 ,
      "release"  : 0.5
    }
  }  ,
  "voice1"  : {
    "volume"  : -20 ,
    "portamento"  : 0.02 ,
    "oscillator"  : {
      "type"  : "sine"
    }  ,
    "filterEnvelope"  : {
      "attack"  : 0.01 ,
      "decay"  : 0 ,
      "sustain"  : 1 ,
      "release"  : 0.5
    }  ,
    "envelope"  : {
      "attack"  : 0.01 ,
      "decay"  : 0 ,
      "sustain"  : 1 ,
      "release"  : 0.5
    }
  }}).toDestination();

let drawNote = ["E5", "D5", "C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4"]; 
let synth2 = new Tone.FMSynth(
  {
  "harmonicity": 0.5,
  "modulationIndex": 1.2,
  "oscillator": {
    "type": "fmsawtooth",
    "modulationType" : "sine",
    "modulationIndex" : 20,
    "harmonicity" : 3
},
"envelope": {
  "attack": 0.05,
  "decay": 0.5,
  "sustain": 0.1,
  "release": 1.2
},
"modulation" : {
    "volume" : 0,
    "type": "triangle"
},
"modulationEnvelope" : {
    "attack": 0.35,
    "decay": 0.1,
    "sustain": 1,
    "release": 0.01
}
}).toDestination();
let synth3 = new Tone.Synth({
    "portamento" : 0.2,
    "oscillator": {
        "type": "sawtooth"
    },
    "envelope": {
        "attack": 0.03,
        "decay": 0.1,
        "sustain": 0.2,
        "release": 0.02
    }
}).toDestination();
let currentNote = "C4";
let part = new Tone.Sequence((time, note) => {
	synth3.triggerAttackRelease(currentNote, "8n", time);
  synth.triggerAttackRelease(note, "8n", time+.25);
}, ["C3", null, "D3", null, null, "E3", "E3", null]);

//makes a canvas and sets the color pickers
function setup() 
{
  createCanvas(CanvasX, CanvasY);
  noStroke();
  fill(255);
  rect(0, 0, CanvasX, CanvasY);
  pickedColor = (0);
  arrayColors = [];
  
  arrayColors.push(new colorPicker(0, color(255, 0, 0), "C4"));
  arrayColors.push(new colorPicker(75, color(255, 150, 0), "D4"));
  arrayColors.push(new colorPicker(150, color(255, 255, 0), "E4"));
  arrayColors.push(new colorPicker(225, color( 0, 255, 0), "F4"));
  arrayColors.push(new colorPicker(300, color(0, 255, 255), "G4"));
  arrayColors.push(new colorPicker(375, color(0, 0, 255), "A4"));
  arrayColors.push(new colorPicker(450, color(255, 0, 255), "B4"));
  arrayColors.push(new colorPicker(525, color(150, 75, 0), "C5"));
  arrayColors.push(new colorPicker(600, 255, "D5"));
  arrayColors.push(new colorPicker(675, 0, "E5"));

  Tone.start();
  Tone.Transport.bpm.value = 60;
  part.start();
  Tone.Transport.start();
}
//logic for resetting canvas
function resetCanvas()
{
  noStroke();
  fill(255);
  rect(0, 0, CanvasX, CanvasY);
  Tone.Transport.stop();
  synth2.triggerAttackRelease("A4", "8n");
}

//graphics for reset button
function setResetButton()
{
  stroke(1);
  strokeWeight(1);
  fill(255);
  rect(5, 750, 75, 75);
  
  fill(0);

  text("RESET", 23, 790);
}

//allows user to draw on the canvas
function draw() 
{
  if(mouseIsPressed)
  {
    if(mouseX > 75)
    {
      stroke(pickedColor);
      strokeWeight(10);
      fill(255, 0, 0);
      line(pmouseX, pmouseY, mouseX, mouseY);
      Tone.Transport.bpm.value = (40 + (mouseX / 10));
      
      for(let i = 0; i < drawNote.length; i++) {
        if((mouseY > (i * (CanvasY / 10)) && (mouseY > ((i + 1) * (CanvasY / 10)))))
        {
          currentNote = drawNote[i];
        }
      }
      Tone.Transport.start();
    }
    else
    {
      for(var i = 0; i < arrayColors.length; i++)
      {
        if(mouseY > i * 75 && mouseY < (i + 1) * 75)
        {
          pickedColor = arrayColors[i].getColor();
          synth.triggerAttackRelease(arrayColors[i].getNote(), "8n");
        }
        
      }
      if(mouseY > 750 && mouseY < 825)
      {
        resetCanvas();
      }
    }  
  }

  for(var i = 0; i < arrayColors.length; i++)
  {
    arrayColors[i].appear();
  }

  setResetButton();
}

//logic for the color picker
class colorPicker
{
  constructor(y, color, note)
  {
    this.x = 5;
    this.y = y;
    this.w = 75;
    this.h = 75;
    this.color = color;
    this.note = note;
  }

  getColor()
  {
    return this.color;
  }

  getNote()
  {
    return this.note;
  }

  appear()
  {
    noStroke();
    fill(this.color)
    rect(this.x, this.y, this.w, this.h);
  }

}