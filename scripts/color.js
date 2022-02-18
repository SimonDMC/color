let color;

function load() {
  // color thingies
  generateColor();

  // register event listener for enter in input https://stackoverflow.com/a/7060762
  document.getElementById('input').addEventListener('keyup', function(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      check();
    }
  });
}

async function check() {
  let disabled;
  if (disabled) return; // if animation is happening

  const box = document.getElementById('box');
  const colorBox = document.getElementById('color');
  const textBox = document.getElementById('input');
  const colorcode = document.getElementById('colorcode');
  const button = document.getElementById('button');
  const preview = document.getElementById('preview');
  const feedback = document.getElementById('feedback');

  // assess value
  let input = textBox.value;
  input = input.replace('#','');
  let re = new RegExp('^[a-fA-F0-9]{6}$'); // hex code regex (hopefully)
  if (!re.test(input)) {
    // invalid input
    box.style.animation = 'shake 0.2s';
    await new Promise(r => setTimeout(r, 200));
    box.style.animation = 'none';
    return;
  }
  let decInput = parseInt(input, 16);

  // animation
  let accuracy = getAccuracyOfColor(decInput);
  textBox.style.width = '535px';
  button.style.opacity = '0';
  colorcode.style.opacity = '1';
  colorcode.style.color = ((((color >> 16) & 0xff) + ((color >> 8) & 0xff) + ((color >> 0) & 0xff)) / 765 > 0.7 ? 'black' : 'white'); // determine luminosity of color and display based on that
  colorcode.innerHTML = '#' + color.toString(16).toUpperCase();
  preview.style.backgroundColor = '#' + input;
  preview.style.width = '42px';
  disabled = true;
  await new Promise(r => setTimeout(r, 300)); //https://stackoverflow.com/a/39914235
  feedback.innerHTML = `Accuracy: ${accuracy}%`;
  feedback.style.opacity = '1';
  await new Promise(r => setTimeout(r, 5000));
  textBox.style.width = '592px';
  feedback.style.opacity = '0';
  preview.style.width = '0';
  await new Promise(r => setTimeout(r, 300));
  button.style.opacity = '1';
  colorcode.style.opacity = '0';
  await new Promise(r => setTimeout(r, 100));
  textBox.value = '';
  feedback.innerHTML = '';
  colorBox.style.transitionDuration = '0.5s';
  generateColor();
  await new Promise(r => setTimeout(r, 400));
  colorcode.innerHTML = '';
  disabled = false;
}

// returns accuracy value of guessed color in comparison to generated color
function getAccuracyOfColor(guess) {

  // https://stackoverflow.com/a/12043228
  let realR = (color >> 16) & 0xff;
  let realG = (color >> 8) & 0xff;
  let realB = (color >> 0) & 0xff;
  let guessR = (guess >> 16) & 0xff;
  let guessG = (guess >> 8) & 0xff;
  let guessB = (guess >> 0) & 0xff;

  console.log(`Actual color: R${realR} G${realG} B${realB}`);
  console.log(`Guessed color: R${guessR} G${guessG} B${guessB}`);

  let diffR = Math.abs(realR - guessR);
  let diffG = Math.abs(realG - guessG);
  let diffB = Math.abs(realB - guessB);
  let totalDiff = diffR + diffG + diffB;

  console.log(`Total difference: ${totalDiff}`);

  totalDiff /= 6; // error threshold

  console.log(`Post-adjustment: ${totalDiff}`);

  let accuracy = 100 - totalDiff;
  accuracy = Math.round(accuracy); // prettify
  if (accuracy < 0) accuracy = 0; // wow you're really bad at this huh
  return accuracy;
}

// generates random color and sets the canvas to it
function generateColor() {
  do {
    color = Math.floor(Math.random()*16777215);
  } while (color.toString(16).length == 5); // 0 at the end has the tendency to break it
  document.getElementById('color').style.backgroundColor = '#' + color.toString(16);
}

// unlisted function, gets color (you can use it in console to cheat ig)
function getColor() {
  return color.toString(16);
}
