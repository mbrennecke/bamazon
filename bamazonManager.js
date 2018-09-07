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
				
			break;
			case "Add to Inventory":
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

function queryAllItems() {
  connection.query("SELECT * FROM products", function(err, res) {
	  console.log("\n");
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    }
    console.log("-----------------------------------\n");
	start();
  });
}