var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table3');

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
				addItem()
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
	  var table = new Table({
		head: ['ID','Product', 'Department', 'Price', 'Stock'],
		colWidths: [6,32,15,12,8]
	});
    for (var i = 0; i < res.length; i++) {
		table.push(
			[res[i].item_id, res[i].product_name, res[i].department_name,res[i].price, res[i].stock_quantity]
		);
    }
	console.log(table.toString());
	if (add == 'a') {
		addStock(res.length);
	} else {start();}
  });
}

function queryLowInventory() {
	connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
	  console.log("\n");
	  var table = new Table({
		head: ['ID','Product', 'Department', 'Price', 'Stock'],
		colWidths: [6,32,15,12,8]
	});
    for (var i = 0; i < res.length; i++) {
		table.push(
			[res[i].item_id, res[i].product_name, res[i].department_name,res[i].price, res[i].stock_quantity]
		);
    }
	console.log(table.toString());
	start();
  });
}

function addStock(length){
	var inStock = 0;
	inquirer
		.prompt([{
		  name: "item",
		  type: "input",
		  message: "What is the ID of the product you would like to update?",
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
			checkStock(answer.quantity, answer.item)
		});
}

function checkStock(newQuant, item) {
	connection.query("SELECT stock_quantity FROM products WHERE ?", { item_id: item }, function(err, res) {
		var newNum = parseInt(res[0].stock_quantity) + parseInt(newQuant);
		updateQuant(newNum, item)
	});
}

function updateQuant(newQuant, item) {
	var query = connection.query("UPDATE products SET ? WHERE ?",
			[{
				stock_quantity: newQuant
			},{
				item_id: item
			}],  function(err, res) {
					if (err) throw err;
					console.log(res.affectedRows + " record(s) updated");
					queryAllItems();
				});
}

function addItem() {
	inquirer
		.prompt([{
		  name: "product",
		  type: "input",
		  message: "What is the product you would like to stock?",
		},
		{
		  name: "dept",
		  type: "input",
		  message: "What department is it added to?",
		},
		{
		  name: "price",
		  type: "input",
		  message: "What is the price per item for the product?",
		},
		{
		  name: "stock",
		  type: "input",
		  message: "What is the beginning quantity of stock?",
		}])
		.then(function(answer) {
			if (isNaN(parseInt(answer.price))){
				console.log("Sorry, price is not valid. Please re-enter");
				addItem();
				return;
			}
			if (isNaN(parseInt(answer.stock))){
				console.log("Sorry, that was not a valid quantity. Please re-enter.");
				addItem();
				return;
			}
		
	connection.query("INSERT INTO products SET ?",
	{
		product_name: answer.product,
		department_name: answer.dept,
		price: parseFloat(answer.price),
		stock_quantity: parseInt(answer.stock)
	},  function(err, res) {
					if (err) throw err;
					console.log(res.affectedRows + " record(s) updated");
					queryAllItems();
				});
		});
}