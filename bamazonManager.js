var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  start();
});

function start() {
	inquirer
    .prompt({
      name: "choice",
      type: "rawlist",
      message: "Which option would you like?",
	  choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
    })
    .then(function(answer) {
		switch (answer.choice){
			case "View Products for Sale":
				queryAllItems();
			break;
			case "View Low Inventory":
				queryLowInventory();
			break;
			case "Add to Inventory":
				queryAllItems('a');
			break;
			case "Add New Product":
			break;
			case "Quit":
				connection.end();
                return;
			break;
		}
    });
}

function queryAllItems(add) {
  connection.query("SELECT * FROM products", function(err, res) {
	  console.log("\n");
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    }
    console.log("-----------------------------------\n");
	if (add == 'a') {
		addStock(res.length);
	} else {start();}
  });
}

function queryLowInventory() {
	connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
	  console.log("\n");
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    }
    console.log("-----------------------------------\n");
	start();
  });
}

function addStock(length){
	var inStock = 0;
	inquirer
		.prompt([{
		  name: "item",
		  type: "input",
		  message: "What is the ID of the product you would like to stock?",
		},
		{
		  name: "quantity",
		  type: "input",
		  message: "How many units would you like to add?",
		}])
		.then(function(answer) {
			if (isNaN(parseInt(answer.item))){
				console.log("Sorry, item selected is not listed. Please choose again.");
				addStock(length);
				return;
			}
			if (parseInt(answer.item) > length) {
				console.log("Sorry, that is not a listed item. Please choose again.");
				addStock(length);
				return;
			}
			if (isNaN(parseInt(answer.quantity))){
				console.log("Sorry, that was not a valid quantity. Please choose again.");
				addStock(length);
				return;
			}
		});
}