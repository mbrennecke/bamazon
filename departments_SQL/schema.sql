DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE departments (
	department_id INT NOT NULL AUTO_INCREMENT,
	department_name VARCHAR(30),
	overhead_costs DECIMAL(5,2) DEFAULT 0,
	PRIMARY KEY (department_id)
);

