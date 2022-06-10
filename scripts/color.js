let color;

$(function() {
  generatePopup({
      id: 'color-info',
      title: 'Color Guesser',
      content: `
        You are presented with a color.
        Estimate the hex code of the color.
        Six characters, ranging from 00-FF for 3 channels.
        Values are in <a href="https://learn.sparkfun.com/tutorials/hexadecimal/hex-basics" target="_blank">Base-16</a>.
        big-margin§{bold}[#{red}[E4]{green}[F2]{blue}[DB]]
        big-margin§{black bold}[#000000] is black.                {white bold shadow}[#FFFFFF] is white.
        big-margin§Good luck.`,
      titleColor: 'rgb(92, 0, 95)',
      backgroundColor: '#ffebfe',
      showImmediately: true,
      showOnce: true,
  });

  // color thingies
  generateColor();

  // register event listener for enter in input https://stackoverflow.com/a/7060762
  $('input').keydown(function(e) {
    if (e.key === 'Enter') {
      check();
    }
  });

  // register event listener for buttons
  $('#button').click(check);
  $('.help').click(showHelp);
});

let showHelp = () => showPopup('color-info');

async function check() {
  let disabled;
  if (disabled) return; // if animation is happening

  const box = $('#box');
  const colorBox = $('#color');
  const textBox = $('#input');
  const colorcode = $('#colorcode');
  const button = $('#button');
  const preview = $('#preview');
  const feedback = $('#feedback');

  // assess value
  let input = textBox.val();
  let re = new RegExp('^[a-fA-F0-9]{6}$'); // hex code regex (hopefully)
  if (!re.test(input)) {
    // invalid input
    box.css('animation', 'shake 0.2s');
    await new Promise(r => setTimeout(r, 200));
    box.css('animation', 'none');
    return;
  }
  let decInput = parseInt(input, 16);

  // animation
  let accuracy = getAccuracyOfColor(decInput);
  textBox.css('width', '80%');
  textBox.css('margin-right', '20px');
  button.css('opacity', '0');
  colorcode.css('opacity', '1');
  colorcode.css('color', ((((color >> 16) & 0xff) + ((color >> 8) & 0xff) + ((color >> 0) & 0xff)) / 765 > 0.7 ? 'black' : 'white')); // determine luminosity of color and display based on that
  colorcode.text('#' + color.toString(16).toUpperCase());
  preview.css('background-color', '#' + input);
  preview.css('width', '42px');
  disabled = true;
  await new Promise(r => setTimeout(r, 300)); //https://stackoverflow.com/a/39914235
  feedback.text(`Accuracy: ${accuracy}%`);
  feedback.css('opacity', '1');
  await new Promise(r => setTimeout(r, 5000));
  textBox.css('margin-right', '0');
  textBox.css('width', '100%');
  feedback.css('opacity', '0');
  preview.css('width', '0');
  await new Promise(r => setTimeout(r, 300));
  button.css('opacity', '1');
  colorcode.css('opacity', '0');
  await new Promise(r => setTimeout(r, 100));
  textBox.val('');
  feedback.text('');
  colorBox.css('transition-duration', '0.5s');
  generateColor();
  await new Promise(r => setTimeout(r, 400));
  colorcode.text('');
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

  console.log(`Post-adjustment: ${Math.round(totalDiff*10)/10}`);

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
  $('#color').css('background-color', '#' + color.toString(16));
}

// unlisted function, gets color (you can use it in console to cheat ig)
function getColor() {
  return color.toString(16);
}
