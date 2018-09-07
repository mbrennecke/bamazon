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
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price);
    }
    console.log("-----------------------------------");
	start();
  });
}


// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt([{
      name: "item",
      type: "input",
      message: "What is the ID of the product you would like to buy?",
    },
	{
      name: "quantity",
      type: "input",
      message: "How many units would you like to buy?",
    }]
	)
    .then(function(answer) {
		var quant = answer.quantity;
		itemCheck(answer.item, quant);
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
			console.log("Thank you for the order, your total is " + cost);
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
