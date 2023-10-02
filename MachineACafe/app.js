import{injectElements, renewTag} from "./functions/dom.js";

window.onload = initialize;

const container = document.querySelector('#controle');

const fillButton = document.createElement('button');
fillButton.id = 'fill';
fillButton.textContent = 'Remplir';

const takeButton = document.createElement('button');
takeButton.id = 'take';
takeButton.textContent = 'Prendre';

const buyButton = document.querySelector('#start');

function initialize() {
  const addedItems = container.querySelectorAll(':not([data-preserve])');
  addedItems.forEach(function (item) {
    item.remove();
  });

  container.appendChild(fillButton);
  container.appendChild(takeButton);

  buyButton.textContent = "Acheter";

  document.querySelector('#start').removeEventListener('click', start);
  document.querySelector('#fill').removeEventListener('click', fill);
  document.querySelector('#take').removeEventListener('click', take);

  document.querySelector('#start').addEventListener('click', start);
  document.querySelector('#fill').addEventListener('click', fill);
  document.querySelector('#take').addEventListener('click', take);
}

function start() {
  fillButton.remove();
  takeButton.remove();

  const steps = [
    { title: "Commence à préparer le café", duration: 2000 },
    { title: "Mouds les grains de café", duration: 1500 },
    { title: "Fait chauffer l'eau", duration: 2500 },
    { title: "Infuse les grains de café moulus", duration: 3000 },
    { title: "Verse le café dans une tasse", duration: 2000 },
    { title: "Ajoute un peu de lait dans la tasse", duration: 1500 },
    { title: "Le café est prêt.", duration: 1000 }
  ];

  const inputCoffeeCount = document.createElement('input');
  inputCoffeeCount.id = 'inputCoffeeCount';
  inputCoffeeCount.type = 'text';
  container.insertBefore(inputCoffeeCount, container.firstChild);

  const espressoButton = document.createElement('button');
  espressoButton.id = 'espresso';
  espressoButton.textContent = 'Expresso';

  const latteButton = document.createElement('button');
  latteButton.id = 'latte';
  latteButton.textContent = 'Latte';

  const cappuccinoButton = document.createElement('button');
  cappuccinoButton.id = 'cappuccino';
  cappuccinoButton.textContent = 'Cappuccino';

  container.appendChild(espressoButton);
  container.appendChild(latteButton);
  container.appendChild(cappuccinoButton);

  const backButton = document.createElement('button');
  backButton.id = 'back';
  backButton.textContent = 'Retour';
  container.appendChild(backButton);

  document.querySelector('#back').addEventListener('click', function backFunction() {
    initialize();
    return;
  });

  let coffeeType;
  coffeeType = "espresso";

  document.querySelector('#espresso').addEventListener('click', function () {
    coffeeType = "espresso";
  });
  document.querySelector('#latte').addEventListener('click', function () {
    coffeeType = "latte";
  });
  document.querySelector('#cappuccino').addEventListener('click', function () {
    coffeeType = "cappuccino";
  });

  document.querySelector('#start').removeEventListener('click', start);
  document.querySelector('#start').addEventListener('click', function makeCoffee() {
    let possibleCoffee;
    possibleCoffee = calculate(Number(inputCoffeeCount.value), coffeeType);
    const list = renewTag('ul');
    if (possibleCoffee) {
      container.append(list);
      injectElements(steps, list);
    }
    document.querySelector('#start').removeEventListener("click", makeCoffee);
  })
}

function calculate(coffeeCount, coffeeType) {
  let coffee;
  if (coffeeRecipes.hasOwnProperty(coffeeType)) {
    coffee = coffeeRecipes[coffeeType];
  } else {
    console.error("Type de café non trouvé :", coffeeType);
    return 0;
  }
  let cf1 = reservoir.water / coffee.water;
  let cf2 = reservoir.milk / coffee.milk;
  let cf3 = reservoir.beans / coffee.beans;
  let possibleCoffeeCount = parseInt(Math.min(cf1, cf2, cf3, reservoir.cups));

  if (possibleCoffeeCount < coffeeCount) {
    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = "Non, je ne peux faire que " + possibleCoffeeCount + " tasses de café";
    container.appendChild(messageParagraph);
    return 0;
  } else if (possibleCoffeeCount > coffeeCount) {
    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = "Oui, je peux faire cette quantité de café (et même " + (possibleCoffeeCount - coffeeCount) + " plus que cela)";
    container.appendChild(messageParagraph);

    removeFromReservoir(coffee.water * coffeeCount, coffee.milk * coffeeCount, coffee.beans * coffeeCount, coffeeCount);
    reservoir.money += coffee.price;
    return 1;
  } else {
    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = "Oui, je peux faire cette quantité de café";
    container.appendChild(messageParagraph);

    removeFromReservoir(coffee.water * coffeeCount, coffee.milk * coffeeCount, coffee.beans * coffeeCount, coffeeCount);
    reservoir.money += coffee.price;
    return 1;
  }
}

function fill() {
  buyButton.remove();
  takeButton.remove();

  const inputWater = document.createElement('input');
  inputWater.id = 'inputWater';
  inputWater.type = 'text';
  container.insertBefore(inputWater, fillButton);

  const inputMilk = document.createElement('input');
  inputMilk.id = 'inputMilk';
  inputMilk.type = 'text';
  container.insertBefore(inputMilk, fillButton);

  const inputBeans = document.createElement('input');
  inputBeans.id = 'inputBeans';
  inputBeans.type = 'text';
  container.insertBefore(inputBeans, fillButton);

  const inputCups = document.createElement('input');
  inputCups.id = 'inputCups';
  inputCups.type = 'text';
  container.insertBefore(inputCups, fillButton);

  const backButton = document.createElement('button');
  backButton.id = 'back';
  backButton.textContent = 'Retour';
  container.appendChild(backButton);

  document.querySelector('#back').addEventListener('click', function backFunction() {
    initialize();
    return;
  });

  document.querySelector('#fill').removeEventListener('click', fill);
  document.querySelector('#fill').addEventListener('click', function fillUp() {
    addToReservoir(Number(inputWater.value), Number(inputMilk.value), Number(inputBeans.value), Number(inputCups.value));
    document.querySelector('#fill').removeEventListener("click", fillUp);
  })
}

function take() {
  container.innerHTML += "<p> Vous avez pris " + reservoir.money + " €</p>";
  totalMoney += reservoir.money;
  reservoir.money = 0;
  initialize();
}

let totalMoney = 0;

const coffeeRecipes = {
  espresso: {
    water: 200,
    milk: 0,
    beans: 16,
    price: 4,
  },
  latte: {
    water: 350,
    milk: 75,
    beans: 20,
    price: 7,
  },
  cappuccino: {
    water: 200,
    milk: 100,
    beans: 12,
    price: 6,
  }
}

let reservoir = {
  water: 400,
  milk: 540,
  beans: 120,
  cups: 9,
  money: 550,
};

function removeFromReservoir(water_, milk_, beans_, cups_) {
  reservoir.water -= water_;
  reservoir.milk -= milk_;
  reservoir.beans -= beans_;
  reservoir.cups -= cups_;
}

function addToReservoir(water_, milk_, beans_, cups_) {
  reservoir.water += water_;
  reservoir.milk += milk_;
  reservoir.beans += beans_;
  reservoir.cups += cups_;
}