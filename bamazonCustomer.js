var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  queryAllItems();
});

function queryAllItems() {
  connection.query("SELECT * FROM products", function(err, res) {
	  console.log("\n");
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price);
    }
    console.log("-----------------------------------\n");
	start(res.length);
  });
}


// function which prompts the user for what action they should take
function start(totalItems) {
  inquirer
    .prompt({
      name: "item",
      type: "input",
      message: "What is the ID of the product you would like to buy (q to quit)?",
    })
    .then(function(answer) {
		if (answer.item.toLowerCase() == 'q') {
			connection.end();
                return;
		}
		if (isNaN(parseInt(answer.item))){
			console.log("Sorry, that is not a listed item. Please choose again.");
			start(totalItems);
			return;
		}
		if (parseInt(answer.item) > totalItems){
			console.log("Sorry, that is not a listed item. Please choose again.");
			start(totalItems);
			return;
		}
		itemQuant(answer.item)
    });
}

function itemQuant(item){
	inquirer
    .prompt({
      name: "quantity",
      type: "input",
      message: "How many units would you like to buy?",
    })
	.then(function(answer) {
		if (isNaN(parseInt(answer.quantity))){
			console.log("Sorry, that was not a valid quantity. Please choose again.");
			itemQuant(item);
			return;
		}
		itemCheck(item, answer.quantity);
    });
}

function itemCheck(item, quant) {
	
	connection.query("SELECT * FROM products WHERE ?", { item_id: item }, function(err, res) {
		var inStock = res[0].stock_quantity;
		if (inStock < quant) {
			console.log("Insufficient quantity!");
			start();
		} else {
			var newQuant = inStock - quant;
			var cost = quant * res[0].price;
			updateQuant(newQuant, item);
			console.log("\nThank you for the order, your total is " + cost + "\n");
			queryAllItems();
		}
	  });
}

function updateQuant(newQuant, item) {
	var query = connection.query("UPDATE products SET ? WHERE ?",
			[{
				stock_quantity: newQuant
			},{
				item_id: item
			}],  function(err, res) {
					return;
				});
}
