var mongoose = require('mongoose');
var Product = require('../models/product');

mongoose.connect('mongodb+srv://shopping:mTuHCgMTeiDR48Uy@cluster0-0myio.mongodb.net/shopping-cart?retryWrites=true', {useNewUrlParser: true});

var products = [
  new Product({
    imagePath: 'http://vignette4.wikia.nocookie.net/stalker/images/3/35/250px-Stalkercover.jpg/revision/latest?cb=20111105055855',
    title: 'Stalker Video Game',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus varius rutrum urna, id pretium ipsum malesuada nec.',
    price: 10
  }),
  new Product({
    imagePath: 'http://www.hisdigital.com/UserFiles/product/stalker_03_1600.jpg',
    title: 'Stalker Clear Sky',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus varius rutrum urna, id pretium ipsum malesuada nec.',
    price: 12
  }),
  new Product({
    imagePath: 'http://media.ign.com/games/image/object/958/958271/risen-PC-US-packshot_2D_FINAL.jpg',
    title: 'Risen',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus varius rutrum urna, id pretium ipsum malesuada nec.',
    price: 17
  }),
  new Product({
    imagePath: 'http://wallsdesk.com/wp-content/uploads/2016/03/skyrim-iphone-wallpaper.jpg',
    title: 'Skyrim',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus varius rutrum urna, id pretium ipsum malesuada nec.',
    price: 9
  }),
  new Product({
    imagePath: 'http://4.bp.blogspot.com/-aKimlps18rM/TzGa6OCgz9I/AAAAAAAABQQ/H3wwnm1YDDM/s1600/12-+Counter+Strike+Source+1024x768.jpg',
    title: 'Counter Strike',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus varius rutrum urna, id pretium ipsum malesuada nec.',
    price: 13
  }),
  new Product({
    imagePath: 'http://static1.gamespot.com/uploads/scale_medium/1197/11970954/2912050-image-1.jpg',
    title: 'Need for Speed',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus varius rutrum urna, id pretium ipsum malesuada nec.',
    price: 10
  })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
  products[i].save(function(err, result) {
    done++;
    if (done === products.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
