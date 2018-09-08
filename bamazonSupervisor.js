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
      type: "list",
      message: "Which option would you like?",
	  choices: ["View Product Sales By Department", "Add New Department", "Quit"]
    })
    .then(function(answer) {
		switch (answer.choice){
			case "View Product Sales By Department":
				querySales();
				break;
			case "Add New Department":
				addDept()
				break;
			case "Quit":
				connection.end();
                return;
			break;
		}
    });
}

function addDept(){
	var inStock = 0;
	inquirer
		.prompt({
		  name: "dept",
		  type: "input",
		  message: "What is the Department you would like to add?",
		})
		.then(function(answer) {
			var query = connection.query("INSERT INTO departments SET ?",
			{
				department_name: answer.dept
			},  function(err, res) {
					if (err) throw err;
					console.log(res.affectedRows + " record(s) updated");
					start();
				});
		});
}

function querySales(){
	connection.query("SELECT department_id, departments.department_name, overhead_costs, products.product_sales, products.product_sales - overhead_costs AS profit FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY department_name;", function(err, res) {
	  console.log("\n");
	  var table = new Table({
		head: ['ID','Department', 'Overhead', 'Sales', 'Profit'],
		colWidths: [6,32,8,8,10]
	});
	for (var i = 0; i < res.length; i++) {
		table.push(
			[res[i].department_id, res[i].department_name, parseFloat(res[i].overhead_costs).toFixed(2), parseFloat(res[i].product_sales).toFixed(2), parseFloat(res[i].profit).toFixed(2)]
		);
	}
	console.log(table.toString());
	start();
	});
	
}