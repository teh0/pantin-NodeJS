let socket = io.connect('http://127.0.0.1:4000');

let controller = new Leap.Controller();
let lockFwd = false;
let lockRvs = false;
let lockStop = false;

let clickBtnFwd = () => {
   $('button#btn-fwd').click(() => {
      if (!lockFwd) {
         lockFwd = true;
         lockRvs = false;
         lockStop = false;
         socket.emit('fwd');
         console.log('button forward clicked !');
      }
   });
}

let clickBtnRvs = () => {
   $('button#btn-rvs').click(() => {
      if (!lockRvs) {
         lockFwd = false;
         lockRvs = true;
         lockStop = false;
         socket.emit('rvs');
         console.log('button reverse clicked !');
      }
   });
}

let clickBtnStop = () => {
   $('button#btn-stop').click(() => {
      if (!lockStop) {
         lockFwd = false;
         lockRvs = false;
         lockStop = true;
         socket.emit('stop');
         console.log('button stop clicked !');
      }
   });
}

Leap.loop(function (frame) {
   if (frame.hands.length > 0) {
      let type = frame.hands[0].type;
      let position_hand = frame.hands[0].palmPosition;
      // console.log(position_hand);
      // let x_hand = position_hand[0];
      let y_hand = position_hand[1];
      // let z_hand = position_hand[2];
      let min_height = 180;

      if (type == 'right' && y_hand > min_height) {
         // console.log(y_hand);
         $('button#btn-fwd').trigger("click");
      }
      if (type == 'left' && y_hand > min_height) {
         // console.log(y_hand);
         $('button#btn-rvs').trigger("click");
      }
   } else {
      $('button#btn-stop').trigger("click");
   }
});

clickBtnFwd();
clickBtnRvs();
clickBtnStop();