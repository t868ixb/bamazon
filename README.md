# bamazon

# Application description
The bamazon command line application reads from a MySQL database and displays a list of products they can purchase. The application will prompt the user to choose a product and how many of the product they want.  If the product and quantity is available, the application will calculate the total cost of the order, will deduct the item from inventory (the database), and will finally display to the user information about the order.  If the number of items requested is not in inventory (not available), the application will alert the customer and ask them to come again later.  

# Required NPM Packages
npm i mysql
npm i inquirer

# Database requirements
bamazon.sql contains basic SQL commands to create the database and products table.  it also example items that were added to the table