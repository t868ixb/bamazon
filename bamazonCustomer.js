var mysql = require("mysql");
const cTable = require('console.table');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    //your user id here
    user: "root",
    password: "your passwordg oes here",
    //your database name here
    database: "bamazon"
})
//connect to mySQL and start user interaction
connection.connect(function (err) {
    if (err) throw err;
    //call the next function to start the application
    start()
});
//show all items for sale
//Q1: ask them the ID of the product they would like to buy
//Q2: then ask how many units of the product they would like to buy
function start() {
    // query the database for all items
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res)
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].product_name)
                            
                        }
                        return choiceArray;
                    },
                    message: "Enter the number (1-10) of the product you want to buy"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many do you want to purchase?"
                }
            ]).then(function (answers) {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === answers.choice) {
                        chosenItem = res[i];
                    }
                }
                if (chosenItem.stock_quantity >= parseInt(answers.quantity)) {
                    var updatedQuantity = chosenItem.stock_quantity - parseInt(answers.quantity);
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: updatedQuantity
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                        ],
                        function (error, processed) {
                            if (error) {
                                throw err;
                            } else {
                                console.log(`You have selected ${answers.quantity} item(s)`);
                                console.log(`Each ${chosenItem.product_name} is $${chosenItem.price.toFixed(2)}`)
                                console.log(`************************************`)
                                var totalAmt = chosenItem.price * parseInt(answers.quantity);
                                console.log(`Your total purchase comes to: $${totalAmt.toFixed(2)}`);
                                console.log(`************************************`)
                                console.log(`Number remaining in inventory: ${updatedQuantity}`);
                                console.log(`Thank you for your order, please come again!`)
                            }
                        }
                    );
                }
                else {
                    // Quantity requested not availble message
                    console.log(`There's ${chosenItem.stock_quantity} ${chosenItem.product_name} available. Please try again later.`);
                }
                connection.end()
            });

    })
}//ends the body of the start function